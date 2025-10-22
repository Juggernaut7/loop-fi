// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title GroupPool
 * @dev Collaborative savings pool contract for group goals
 * @author LoopFi Team
 */
contract GroupPool is ReentrancyGuard, Ownable {
    // Events
    event PoolCreated(
        uint256 indexed poolId,
        address indexed creator,
        string name,
        uint256 targetAmount,
        uint256 maxMembers,
        uint256 lockDuration
    );
    event MemberJoined(uint256 indexed poolId, address indexed member, uint256 contribution);
    event ContributionMade(uint256 indexed poolId, address indexed member, uint256 amount);
    event PoolCompleted(uint256 indexed poolId, uint256 totalAmount, uint256 yieldEarned);
    event FundsDistributed(uint256 indexed poolId, address indexed member, uint256 amount);
    event ReferralBonusPaid(uint256 indexed poolId, address indexed referrer, uint256 bonus);

    // Structs
    struct Pool {
        uint256 poolId;
        address creator;
        string name;
        string description;
        uint256 targetAmount;
        uint256 currentAmount;
        uint256 maxMembers;
        uint256 currentMembers;
        uint256 lockDuration;
        uint256 startTime;
        uint256 endTime;
        bool isCompleted;
        bool isActive;
        uint256 yieldEarned;
        uint256 apy; // Annual Percentage Yield in basis points
        address[] members;
        mapping(address => uint256) memberContributions;
        mapping(address => bool) isMember;
        mapping(address => bool) hasWithdrawn;
    }

    struct MemberInfo {
        address member;
        uint256 contribution;
        uint256 share;
        bool hasWithdrawn;
    }

    // State variables
    mapping(uint256 => Pool) public pools;
    mapping(address => uint256[]) public userPools;
    mapping(address => uint256[]) public userCreatedPools;
    
    IERC20 public celoToken;
    IERC20 public cusdToken;
    
    uint256 public nextPoolId = 1;
    uint256 public constant MIN_TARGET_AMOUNT = 0.1 ether; // Minimum 0.1 CELO
    uint256 public constant MAX_TARGET_AMOUNT = 10000 ether; // Maximum 10,000 CELO
    uint256 public constant MIN_LOCK_DURATION = 7 days; // Minimum 7 days
    uint256 public constant MAX_LOCK_DURATION = 365 days; // Maximum 1 year
    uint256 public constant MIN_MEMBERS = 2; // Minimum 2 members
    uint256 public constant MAX_MEMBERS = 50; // Maximum 50 members
    
    uint256 public DEFAULT_APY = 1000; // 10% APY in basis points (higher for groups)
    uint256 public constant YIELD_FEE_PERCENTAGE = 200; // 2% fee on yield
    uint256 public constant REFERRAL_BONUS_PERCENTAGE = 100; // 1% referral bonus
    uint256 public constant CREATOR_BONUS_PERCENTAGE = 200; // 2% creator bonus
    
    address public treasury;
    uint256 public totalPoolsCreated;
    uint256 public totalVolumeLocked;

    // Modifiers
    modifier poolExists(uint256 poolId) {
        require(poolId > 0 && poolId < nextPoolId, "GroupPool: Pool does not exist");
        _;
    }

    modifier poolActive(uint256 poolId) {
        require(pools[poolId].isActive, "GroupPool: Pool not active");
        _;
    }

    modifier poolNotCompleted(uint256 poolId) {
        require(!pools[poolId].isCompleted, "GroupPool: Pool already completed");
        _;
    }

    modifier lockPeriodEnded(uint256 poolId) {
        require(block.timestamp >= pools[poolId].endTime, "GroupPool: Lock period not ended");
        _;
    }

    constructor(address _celoToken, address _cusdToken, address _treasury) Ownable(msg.sender) {
        celoToken = IERC20(_celoToken);
        cusdToken = IERC20(_cusdToken);
        treasury = _treasury;
    }

    /**
     * @dev Create a new group pool
     * @param name Pool name
     * @param description Pool description
     * @param targetAmount Target amount to save (in wei)
     * @param maxMembers Maximum number of members
     * @param lockDuration Duration to lock funds (in seconds)
     * @param useCUSD Whether to use cUSD instead of CELO
     */
    function createPool(
        string memory name,
        string memory description,
        uint256 targetAmount,
        uint256 maxMembers,
        uint256 lockDuration,
        bool useCUSD
    ) external {
        require(bytes(name).length > 0, "GroupPool: Name required");
        require(targetAmount >= MIN_TARGET_AMOUNT, "GroupPool: Target amount too low");
        require(targetAmount <= MAX_TARGET_AMOUNT, "GroupPool: Target amount too high");
        require(maxMembers >= MIN_MEMBERS, "GroupPool: Too few members");
        require(maxMembers <= MAX_MEMBERS, "GroupPool: Too many members");
        require(lockDuration >= MIN_LOCK_DURATION, "GroupPool: Lock duration too short");
        require(lockDuration <= MAX_LOCK_DURATION, "GroupPool: Lock duration too long");

        uint256 poolId = nextPoolId++;
        Pool storage pool = pools[poolId];
        
        pool.poolId = poolId;
        pool.creator = msg.sender;
        pool.name = name;
        pool.description = description;
        pool.targetAmount = targetAmount;
        pool.currentAmount = 0;
        pool.maxMembers = maxMembers;
        pool.currentMembers = 0;
        pool.lockDuration = lockDuration;
        pool.startTime = block.timestamp;
        pool.endTime = block.timestamp + lockDuration;
        pool.isCompleted = false;
        pool.isActive = true;
        pool.yieldEarned = 0;
        pool.apy = DEFAULT_APY;

        totalPoolsCreated++;
        userCreatedPools[msg.sender].push(poolId);

        emit PoolCreated(poolId, msg.sender, name, targetAmount, maxMembers, lockDuration);
    }

    /**
     * @dev Join a pool and make initial contribution
     * @param poolId Pool ID to join
     * @param amount Initial contribution amount (in wei)
     * @param useCUSD Whether to use cUSD instead of CELO
     * @param referrer Address of the person who referred this user (optional)
     */
    function joinPool(
        uint256 poolId,
        uint256 amount,
        bool useCUSD,
        address referrer
    ) external poolExists(poolId) poolActive(poolId) poolNotCompleted(poolId) nonReentrant {
        Pool storage pool = pools[poolId];
        
        require(!pool.isMember[msg.sender], "GroupPool: Already a member");
        require(pool.currentMembers < pool.maxMembers, "GroupPool: Pool is full");
        require(amount > 0, "GroupPool: Amount must be greater than 0");
        require(pool.currentAmount + amount <= pool.targetAmount, "GroupPool: Exceeds target amount");

        IERC20 token = useCUSD ? cusdToken : celoToken;
        
        // Transfer tokens from user to contract
        require(token.transferFrom(msg.sender, address(this), amount), "GroupPool: Transfer failed");
        
        // Add member to pool
        pool.members.push(msg.sender);
        pool.isMember[msg.sender] = true;
        pool.memberContributions[msg.sender] = amount;
        pool.currentMembers++;
        pool.currentAmount += amount;
        totalVolumeLocked += amount;

        userPools[msg.sender].push(poolId);

        emit MemberJoined(poolId, msg.sender, amount);

        // Pay referral bonus if referrer is valid
        if (referrer != address(0) && pool.isMember[referrer] && referrer != msg.sender) {
            uint256 bonusAmount = (amount * REFERRAL_BONUS_PERCENTAGE) / 10000;
            if (bonusAmount > 0) {
                require(token.transfer(referrer, bonusAmount), "GroupPool: Referral bonus failed");
                emit ReferralBonusPaid(poolId, referrer, bonusAmount);
            }
        }

        // Check if pool is completed
        if (pool.currentAmount >= pool.targetAmount) {
            _completePool(poolId);
        }
    }

    /**
     * @dev Make additional contribution to pool
     * @param poolId Pool ID
     * @param amount Amount to contribute (in wei)
     * @param useCUSD Whether to use cUSD instead of CELO
     */
    function contributeToPool(
        uint256 poolId,
        uint256 amount,
        bool useCUSD
    ) external poolExists(poolId) poolActive(poolId) poolNotCompleted(poolId) nonReentrant {
        Pool storage pool = pools[poolId];
        
        require(pool.isMember[msg.sender], "GroupPool: Not a member");
        require(amount > 0, "GroupPool: Amount must be greater than 0");
        require(pool.currentAmount + amount <= pool.targetAmount, "GroupPool: Exceeds target amount");

        IERC20 token = useCUSD ? cusdToken : celoToken;
        
        // Transfer tokens from user to contract
        require(token.transferFrom(msg.sender, address(this), amount), "GroupPool: Transfer failed");
        
        pool.memberContributions[msg.sender] += amount;
        pool.currentAmount += amount;
        totalVolumeLocked += amount;

        emit ContributionMade(poolId, msg.sender, amount);

        // Check if pool is completed
        if (pool.currentAmount >= pool.targetAmount) {
            _completePool(poolId);
        }
    }

    /**
     * @dev Complete the pool and calculate yield
     * @param poolId Pool ID
     */
    function _completePool(uint256 poolId) internal {
        Pool storage pool = pools[poolId];
        pool.isCompleted = true;
        
        // Calculate yield based on APY and time locked
        uint256 timeLocked = block.timestamp - pool.startTime;
        uint256 yieldRate = (pool.apy * timeLocked) / (365 days * 10000); // Convert basis points to rate
        pool.yieldEarned = (pool.currentAmount * yieldRate) / 1e18;

        emit PoolCompleted(poolId, pool.currentAmount, pool.yieldEarned);
    }

    /**
     * @dev Withdraw funds after lock period ends
     * @param poolId Pool ID
     * @param useCUSD Whether to withdraw cUSD instead of CELO
     */
    function withdrawFromPool(uint256 poolId, bool useCUSD) 
        external 
        poolExists(poolId) 
        lockPeriodEnded(poolId) 
        nonReentrant 
    {
        Pool storage pool = pools[poolId];
        require(pool.isMember[msg.sender], "GroupPool: Not a member");
        require(!pool.hasWithdrawn[msg.sender], "GroupPool: Already withdrawn");
        require(pool.isCompleted, "GroupPool: Pool not completed");

        uint256 userContribution = pool.memberContributions[msg.sender];
        uint256 userShare = (userContribution * 1e18) / pool.currentAmount;
        uint256 userYield = (pool.yieldEarned * userShare) / 1e18;
        
        // Calculate fees
        uint256 yieldFee = (userYield * YIELD_FEE_PERCENTAGE) / 10000;
        uint256 creatorBonus = 0;
        
        // Creator gets bonus
        if (msg.sender == pool.creator) {
            creatorBonus = (userYield * CREATOR_BONUS_PERCENTAGE) / 10000;
        }
        
        uint256 totalWithdraw = userContribution + userYield - yieldFee + creatorBonus;

        IERC20 token = useCUSD ? cusdToken : celoToken;
        
        // Transfer tokens to user
        require(token.transfer(msg.sender, totalWithdraw), "GroupPool: Withdrawal failed");
        
        // Transfer fee to treasury
        if (yieldFee > 0) {
            require(token.transfer(treasury, yieldFee), "GroupPool: Fee transfer failed");
        }

        pool.hasWithdrawn[msg.sender] = true;
        totalVolumeLocked -= userContribution;

        emit FundsDistributed(poolId, msg.sender, totalWithdraw);
    }

    /**
     * @dev Get pool details
     * @param poolId Pool ID
     * @return poolId_ Pool ID
     * @return creator Creator address
     * @return name Pool name
     * @return description Pool description
     * @return targetAmount Target amount
     * @return currentAmount Current amount
     * @return maxMembers Maximum members
     * @return currentMembers Current members
     * @return lockDuration Lock duration
     * @return startTime Start time
     * @return endTime End time
     * @return isCompleted Is completed
     * @return isActive Is active
     * @return yieldEarned Yield earned
     * @return apy APY
     */
    function getPool(uint256 poolId) external view poolExists(poolId) returns (
        uint256 poolId_,
        address creator,
        string memory name,
        string memory description,
        uint256 targetAmount,
        uint256 currentAmount,
        uint256 maxMembers,
        uint256 currentMembers,
        uint256 lockDuration,
        uint256 startTime,
        uint256 endTime,
        bool isCompleted,
        bool isActive,
        uint256 yieldEarned,
        uint256 apy
    ) {
        Pool storage pool = pools[poolId];
        return (
            pool.poolId,
            pool.creator,
            pool.name,
            pool.description,
            pool.targetAmount,
            pool.currentAmount,
            pool.maxMembers,
            pool.currentMembers,
            pool.lockDuration,
            pool.startTime,
            pool.endTime,
            pool.isCompleted,
            pool.isActive,
            pool.yieldEarned,
            pool.apy
        );
    }

    /**
     * @dev Get member information for a pool
     * @param poolId Pool ID
     * @param member Member address
     * @return contribution Member contribution
     * @return share Member share
     * @return hasWithdrawn Has withdrawn
     */
    function getMemberInfo(uint256 poolId, address member) external view poolExists(poolId) returns (
        uint256 contribution,
        uint256 share,
        bool hasWithdrawn
    ) {
        Pool storage pool = pools[poolId];
        contribution = pool.memberContributions[member];
        share = pool.currentAmount > 0 ? (contribution * 1e18) / pool.currentAmount : 0;
        hasWithdrawn = pool.hasWithdrawn[member];
    }

    /**
     * @dev Get all members of a pool
     * @param poolId Pool ID
     * @return Array of member addresses
     */
    function getPoolMembers(uint256 poolId) external view poolExists(poolId) returns (address[] memory) {
        return pools[poolId].members;
    }

    /**
     * @dev Get user's pools
     * @param user User address
     * @return Array of pool IDs
     */
    function getUserPools(address user) external view returns (uint256[] memory) {
        return userPools[user];
    }

    /**
     * @dev Get user's created pools
     * @param user User address
     * @return Array of pool IDs
     */
    function getUserCreatedPools(address user) external view returns (uint256[] memory) {
        return userCreatedPools[user];
    }

    /**
     * @dev Get contract statistics
     * @return totalPools Total pools created
     * @return totalVolume Total volume locked
     * @return contractBalance CELO balance
     * @return cusdBalance cUSD balance
     */
    function getStats() external view returns (
        uint256 totalPools,
        uint256 totalVolume,
        uint256 contractBalance,
        uint256 cusdBalance
    ) {
        totalPools = totalPoolsCreated;
        totalVolume = totalVolumeLocked;
        contractBalance = celoToken.balanceOf(address(this));
        cusdBalance = cusdToken.balanceOf(address(this));
    }

    /**
     * @dev Update APY (only owner)
     * @param newAPY New APY in basis points
     */
    function updateAPY(uint256 newAPY) external onlyOwner {
        require(newAPY <= 2000, "GroupPool: APY too high"); // Max 20%
        DEFAULT_APY = newAPY;
    }

    /**
     * @dev Update treasury address (only owner)
     * @param newTreasury New treasury address
     */
    function updateTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "GroupPool: Invalid treasury address");
        treasury = newTreasury;
    }
}
