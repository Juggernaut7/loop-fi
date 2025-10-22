// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title StakingPool
 * @dev CELO staking pool with rewards
 * @author LoopFi Team
 */
contract StakingPool is ReentrancyGuard, Ownable {
    // Events
    event Staked(address indexed user, uint256 amount, uint256 timestamp);
    event Unstaked(address indexed user, uint256 amount, uint256 reward, uint256 timestamp);
    event RewardsClaimed(address indexed user, uint256 reward, uint256 timestamp);
    event EmergencyWithdraw(address indexed user, uint256 amount);

    // Structs
    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 lastRewardClaim;
        uint256 totalRewardsClaimed;
        bool isActive;
    }

    // State variables
    mapping(address => StakeInfo) public stakes;
    mapping(address => bool) public hasStaked;
    
    IERC20 public celoToken;
    IERC20 public cusdToken;
    
    uint256 public totalStaked;
    uint256 public totalStakers;
    uint256 public rewardRate = 850; // 8.5% APY in basis points (850 / 10000 = 0.085)
    uint256 public constant SECONDS_PER_YEAR = 365 days;
    uint256 public constant MIN_STAKE = 0.1 ether; // Minimum 0.1 CELO
    uint256 public constant MAX_STAKE = 10000 ether; // Maximum 10,000 CELO
    uint256 public constant MIN_LOCK_PERIOD = 7 days; // Minimum 7 days
    
    address public treasury;
    uint256 public totalRewardsPaid;
    
    // Modifiers
    modifier hasActiveStake() {
        require(stakes[msg.sender].isActive, "StakingPool: No active stake");
        _;
    }

    /**
     * @dev Constructor
     * @param _celoToken CELO token address
     * @param _cusdToken cUSD token address
     * @param _treasury Treasury address for fees
     */
    constructor(
        address _celoToken,
        address _cusdToken,
        address _treasury
    ) Ownable(msg.sender) {
        require(_celoToken != address(0), "StakingPool: Invalid CELO address");
        require(_cusdToken != address(0), "StakingPool: Invalid cUSD address");
        require(_treasury != address(0), "StakingPool: Invalid treasury address");
        
        celoToken = IERC20(_celoToken);
        cusdToken = IERC20(_cusdToken);
        treasury = _treasury;
    }

    /**
     * @dev Stake CELO tokens
     * @param amount Amount to stake
     * @param useCUSD Whether to use cUSD instead of CELO
     */
    function stake(uint256 amount, bool useCUSD) external nonReentrant {
        require(amount >= MIN_STAKE, "StakingPool: Amount below minimum");
        require(amount <= MAX_STAKE, "StakingPool: Amount above maximum");
        
        IERC20 token = useCUSD ? cusdToken : celoToken;
        
        // If user has existing stake, claim pending rewards first
        if (stakes[msg.sender].isActive) {
            _claimRewards();
        }
        
        // Transfer tokens from user to contract
        require(token.transferFrom(msg.sender, address(this), amount), "StakingPool: Transfer failed");
        
        // Update stake info
        if (!hasStaked[msg.sender]) {
            totalStakers++;
            hasStaked[msg.sender] = true;
        }
        
        stakes[msg.sender].amount += amount;
        stakes[msg.sender].startTime = block.timestamp;
        stakes[msg.sender].lastRewardClaim = block.timestamp;
        stakes[msg.sender].isActive = true;
        
        totalStaked += amount;
        
        emit Staked(msg.sender, amount, block.timestamp);
    }

    /**
     * @dev Unstake tokens and claim rewards
     * @param useCUSD Whether to receive cUSD instead of CELO
     */
    function unstake(bool useCUSD) external nonReentrant hasActiveStake {
        StakeInfo storage userStake = stakes[msg.sender];
        
        require(
            block.timestamp >= userStake.startTime + MIN_LOCK_PERIOD,
            "StakingPool: Lock period not ended"
        );
        
        uint256 amount = userStake.amount;
        uint256 reward = _calculateReward(msg.sender);
        
        IERC20 token = useCUSD ? cusdToken : celoToken;
        
        // Update state
        userStake.amount = 0;
        userStake.isActive = false;
        userStake.totalRewardsClaimed += reward;
        
        totalStaked -= amount;
        totalRewardsPaid += reward;
        
        // Transfer principal + rewards
        uint256 totalAmount = amount + reward;
        require(token.transfer(msg.sender, totalAmount), "StakingPool: Transfer failed");
        
        emit Unstaked(msg.sender, amount, reward, block.timestamp);
    }

    /**
     * @dev Claim accumulated rewards without unstaking
     */
    function claimRewards() external nonReentrant hasActiveStake {
        _claimRewards();
    }

    /**
     * @dev Internal function to claim rewards
     */
    function _claimRewards() internal {
        uint256 reward = _calculateReward(msg.sender);
        
        if (reward > 0) {
            stakes[msg.sender].lastRewardClaim = block.timestamp;
            stakes[msg.sender].totalRewardsClaimed += reward;
            totalRewardsPaid += reward;
            
            require(celoToken.transfer(msg.sender, reward), "StakingPool: Reward transfer failed");
            
            emit RewardsClaimed(msg.sender, reward, block.timestamp);
        }
    }

    /**
     * @dev Calculate pending rewards for a user
     * @param user User address
     * @return Pending reward amount
     */
    function _calculateReward(address user) internal view returns (uint256) {
        StakeInfo storage userStake = stakes[user];
        
        if (!userStake.isActive || userStake.amount == 0) {
            return 0;
        }
        
        uint256 timeStaked = block.timestamp - userStake.lastRewardClaim;
        
        // Calculate reward: (amount * rewardRate * timeStaked) / (10000 * SECONDS_PER_YEAR)
        uint256 reward = (userStake.amount * rewardRate * timeStaked) / (10000 * SECONDS_PER_YEAR);
        
        return reward;
    }

    /**
     * @dev Get pending rewards for a user
     * @param user User address
     * @return Pending reward amount
     */
    function getPendingRewards(address user) external view returns (uint256) {
        return _calculateReward(user);
    }

    /**
     * @dev Get stake info for a user
     * @param user User address
     * @return amount Staked amount
     * @return startTime Stake start time
     * @return lastRewardClaim Last reward claim time
     * @return totalRewardsClaimed Total rewards claimed
     * @return isActive Whether stake is active
     */
    function getStakeInfo(address user) external view returns (
        uint256 amount,
        uint256 startTime,
        uint256 lastRewardClaim,
        uint256 totalRewardsClaimed,
        bool isActive
    ) {
        StakeInfo storage userStake = stakes[user];
        return (
            userStake.amount,
            userStake.startTime,
            userStake.lastRewardClaim,
            userStake.totalRewardsClaimed,
            userStake.isActive
        );
    }

    /**
     * @dev Check if user can unstake
     * @param user User address
     * @return Whether user can unstake
     */
    function canUnstake(address user) external view returns (bool) {
        StakeInfo storage userStake = stakes[user];
        return userStake.isActive && block.timestamp >= userStake.startTime + MIN_LOCK_PERIOD;
    }

    /**
     * @dev Get time remaining until user can unstake
     * @param user User address
     * @return Seconds remaining (0 if can unstake)
     */
    function getTimeUntilUnstake(address user) external view returns (uint256) {
        StakeInfo storage userStake = stakes[user];
        
        if (!userStake.isActive) {
            return 0;
        }
        
        uint256 unlockTime = userStake.startTime + MIN_LOCK_PERIOD;
        
        if (block.timestamp >= unlockTime) {
            return 0;
        }
        
        return unlockTime - block.timestamp;
    }

    /**
     * @dev Emergency withdraw (forfeits rewards)
     */
    function emergencyWithdraw() external nonReentrant hasActiveStake {
        StakeInfo storage userStake = stakes[msg.sender];
        
        uint256 amount = userStake.amount;
        
        // Update state
        userStake.amount = 0;
        userStake.isActive = false;
        
        totalStaked -= amount;
        
        // Transfer only principal, no rewards
        require(celoToken.transfer(msg.sender, amount), "StakingPool: Transfer failed");
        
        emit EmergencyWithdraw(msg.sender, amount);
    }

    /**
     * @dev Update reward rate (only owner)
     * @param newRate New reward rate in basis points
     */
    function updateRewardRate(uint256 newRate) external onlyOwner {
        require(newRate <= 2000, "StakingPool: Rate too high"); // Max 20% APY
        rewardRate = newRate;
    }

    /**
     * @dev Update treasury address (only owner)
     * @param newTreasury New treasury address
     */
    function updateTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "StakingPool: Invalid address");
        treasury = newTreasury;
    }

    /**
     * @dev Deposit rewards into the contract (only owner or treasury)
     * @param amount Amount to deposit
     */
    function depositRewards(uint256 amount) external {
        require(msg.sender == owner() || msg.sender == treasury, "StakingPool: Not authorized");
        require(celoToken.transferFrom(msg.sender, address(this), amount), "StakingPool: Transfer failed");
    }

    /**
     * @dev Get contract stats
     */
    function getPoolStats() external view returns (
        uint256 _totalStaked,
        uint256 _totalStakers,
        uint256 _rewardRate,
        uint256 _totalRewardsPaid
    ) {
        return (totalStaked, totalStakers, rewardRate, totalRewardsPaid);
    }
}

