// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./SavingsGoal.sol";
import "./GroupPool.sol";
import "./SavingsBadgeNFT.sol";

/**
 * @title LoopFi
 * @dev Main contract integrating all LoopFi components
 * @author LoopFi Team
 */
contract LoopFi is ReentrancyGuard, Ownable {
    // Events
    event UserRegistered(address indexed user, string username);
    event YieldStrategyUpdated(address indexed strategy, uint256 apy);
    event BadgeAwarded(address indexed user, SavingsBadgeNFT.BadgeType badgeType, uint256 milestone);

    // Structs
    struct UserProfile {
        string username;
        uint256 totalSaved;
        uint256 totalYieldEarned;
        uint256 goalsCompleted;
        uint256 poolsJoined;
        uint256 poolsCreated;
        uint256 joinDate;
        bool isRegistered;
    }

    struct YieldStrategy {
        address strategyAddress;
        string name;
        uint256 apy; // Annual Percentage Yield in basis points
        bool isActive;
        uint256 totalDeposited;
    }

    // State variables
    mapping(address => UserProfile) public userProfiles;
    mapping(address => bool) public registeredUsers;
    
    SavingsGoal public savingsGoalContract;
    GroupPool public groupPoolContract;
    SavingsBadgeNFT public badgeNFTContract;
    
    IERC20 public celoToken;
    IERC20 public cusdToken;
    
    YieldStrategy[] public yieldStrategies;
    mapping(address => uint256) public strategyIndex;
    
    address public treasury;
    uint256 public totalUsers;
    uint256 public totalVolumeLocked;
    uint256 public totalYieldDistributed;
    
    // Constants
    uint256 public constant REGISTRATION_FEE = 0.001 ether; // 0.001 CELO registration fee
    uint256 public constant MAX_YIELD_STRATEGIES = 10;

    // Modifiers
    modifier onlyRegistered() {
        require(registeredUsers[msg.sender], "LoopFi: User not registered");
        _;
    }

    modifier validStrategy(address strategy) {
        require(strategyIndex[strategy] > 0, "LoopFi: Invalid yield strategy");
        _;
    }

    constructor(
        address _celoToken,
        address _cusdToken,
        address _treasury
    ) Ownable(msg.sender) {
        celoToken = IERC20(_celoToken);
        cusdToken = IERC20(_cusdToken);
        treasury = _treasury;
        
        // Deploy child contracts
        savingsGoalContract = new SavingsGoal(_celoToken, _cusdToken, _treasury);
        groupPoolContract = new GroupPool(_celoToken, _cusdToken, _treasury);
        badgeNFTContract = new SavingsBadgeNFT();
        
        // Transfer ownership of child contracts
        savingsGoalContract.transferOwnership(address(this));
        groupPoolContract.transferOwnership(address(this));
        badgeNFTContract.transferOwnership(address(this));
    }

    /**
     * @dev Register a new user
     * @param username Username for the user
     */
    function registerUser(string memory username) external payable nonReentrant {
        require(!registeredUsers[msg.sender], "LoopFi: User already registered");
        require(bytes(username).length > 0, "LoopFi: Username required");
        require(msg.value >= REGISTRATION_FEE, "LoopFi: Insufficient registration fee");

        UserProfile storage profile = userProfiles[msg.sender];
        profile.username = username;
        profile.totalSaved = 0;
        profile.totalYieldEarned = 0;
        profile.goalsCompleted = 0;
        profile.poolsJoined = 0;
        profile.poolsCreated = 0;
        profile.joinDate = block.timestamp;
        profile.isRegistered = true;

        registeredUsers[msg.sender] = true;
        totalUsers++;

        // Transfer registration fee to treasury
        if (msg.value > 0) {
            payable(treasury).transfer(msg.value);
        }

        emit UserRegistered(msg.sender, username);
    }

    /**
     * @dev Create a personal savings goal
     * @param targetAmount Target amount to save (in wei)
     * @param lockDuration Duration to lock funds (in seconds)
     * @param useCUSD Whether to use cUSD instead of CELO
     */
    function createSavingsGoal(
        uint256 targetAmount,
        uint256 lockDuration,
        bool useCUSD
    ) external onlyRegistered {
        savingsGoalContract.createGoal(targetAmount, lockDuration, useCUSD);
    }

    /**
     * @dev Deposit to personal savings goal
     * @param amount Amount to deposit (in wei)
     * @param useCUSD Whether to use cUSD instead of CELO
     */
    function depositToGoal(uint256 amount, bool useCUSD) external onlyRegistered {
        savingsGoalContract.deposit(amount, useCUSD);
        
        // Update user profile
        UserProfile storage profile = userProfiles[msg.sender];
        profile.totalSaved += amount;
    }

    /**
     * @dev Withdraw from personal savings goal
     * @param useCUSD Whether to withdraw cUSD instead of CELO
     */
    function withdrawFromGoal(bool useCUSD) external onlyRegistered {
        savingsGoalContract.withdraw(useCUSD);
        
        // Update user profile
        UserProfile storage profile = userProfiles[msg.sender];
        profile.goalsCompleted++;
    }

    /**
     * @dev Create a group pool
     * @param name Pool name
     * @param description Pool description
     * @param targetAmount Target amount to save (in wei)
     * @param maxMembers Maximum number of members
     * @param lockDuration Duration to lock funds (in seconds)
     * @param useCUSD Whether to use cUSD instead of CELO
     */
    function createGroupPool(
        string memory name,
        string memory description,
        uint256 targetAmount,
        uint256 maxMembers,
        uint256 lockDuration,
        bool useCUSD
    ) external onlyRegistered {
        groupPoolContract.createPool(name, description, targetAmount, maxMembers, lockDuration, useCUSD);
        
        // Update user profile
        UserProfile storage profile = userProfiles[msg.sender];
        profile.poolsCreated++;
    }

    /**
     * @dev Join a group pool
     * @param poolId Pool ID to join
     * @param amount Initial contribution amount (in wei)
     * @param useCUSD Whether to use cUSD instead of CELO
     * @param referrer Address of the person who referred this user (optional)
     */
    function joinGroupPool(
        uint256 poolId,
        uint256 amount,
        bool useCUSD,
        address referrer
    ) external onlyRegistered {
        groupPoolContract.joinPool(poolId, amount, useCUSD, referrer);
        
        // Update user profile
        UserProfile storage profile = userProfiles[msg.sender];
        profile.totalSaved += amount;
        profile.poolsJoined++;
    }

    /**
     * @dev Contribute to group pool
     * @param poolId Pool ID
     * @param amount Amount to contribute (in wei)
     * @param useCUSD Whether to use cUSD instead of CELO
     */
    function contributeToGroupPool(
        uint256 poolId,
        uint256 amount,
        bool useCUSD
    ) external onlyRegistered {
        groupPoolContract.contributeToPool(poolId, amount, useCUSD);
        
        // Update user profile
        UserProfile storage profile = userProfiles[msg.sender];
        profile.totalSaved += amount;
    }

    /**
     * @dev Withdraw from group pool
     * @param poolId Pool ID
     * @param useCUSD Whether to withdraw cUSD instead of CELO
     */
    function withdrawFromGroupPool(uint256 poolId, bool useCUSD) external onlyRegistered {
        groupPoolContract.withdrawFromPool(poolId, useCUSD);
    }

    /**
     * @dev Add a yield strategy
     * @param strategyAddress Address of the yield strategy contract
     * @param name Name of the strategy
     * @param apy Annual Percentage Yield in basis points
     */
    function addYieldStrategy(
        address strategyAddress,
        string memory name,
        uint256 apy
    ) external onlyOwner {
        require(yieldStrategies.length < MAX_YIELD_STRATEGIES, "LoopFi: Max strategies reached");
        require(strategyIndex[strategyAddress] == 0, "LoopFi: Strategy already exists");
        require(apy <= 2000, "LoopFi: APY too high"); // Max 20%

        YieldStrategy memory strategy = YieldStrategy({
            strategyAddress: strategyAddress,
            name: name,
            apy: apy,
            isActive: true,
            totalDeposited: 0
        });

        yieldStrategies.push(strategy);
        strategyIndex[strategyAddress] = yieldStrategies.length;

        emit YieldStrategyUpdated(strategyAddress, apy);
    }

    /**
     * @dev Update yield strategy APY
     * @param strategyAddress Address of the strategy
     * @param newAPY New APY in basis points
     */
    function updateYieldStrategyAPY(address strategyAddress, uint256 newAPY) external onlyOwner validStrategy(strategyAddress) {
        require(newAPY <= 2000, "LoopFi: APY too high"); // Max 20%
        
        uint256 index = strategyIndex[strategyAddress] - 1;
        yieldStrategies[index].apy = newAPY;

        emit YieldStrategyUpdated(strategyAddress, newAPY);
    }

    /**
     * @dev Toggle strategy active status
     * @param strategyAddress Address of the strategy
     */
    function toggleStrategy(address strategyAddress) external onlyOwner validStrategy(strategyAddress) {
        uint256 index = strategyIndex[strategyAddress] - 1;
        yieldStrategies[index].isActive = !yieldStrategies[index].isActive;
    }

    /**
     * @dev Award badge to user
     * @param user User address
     * @param badgeType Type of badge
     * @param milestone Milestone achieved
     * @param metadataURI Metadata URI for the badge
     */
    function awardBadge(
        address user,
        SavingsBadgeNFT.BadgeType badgeType,
        uint256 milestone,
        string memory metadataURI
    ) external onlyOwner {
        badgeNFTContract.mintBadge(user, badgeType, milestone, metadataURI);
        emit BadgeAwarded(user, badgeType, milestone);
    }

    /**
     * @dev Get user profile
     * @param user User address
     * @return User profile
     */
    function getUserProfile(address user) external view returns (UserProfile memory) {
        return userProfiles[user];
    }

    /**
     * @dev Get user's badges
     * @param user User address
     * @return Array of badge types owned
     */
    function getUserBadges(address user) external view returns (SavingsBadgeNFT.BadgeType[] memory) {
        return badgeNFTContract.getUserBadges(user);
    }

    /**
     * @dev Get all yield strategies
     * @return Array of yield strategies
     */
    function getYieldStrategies() external view returns (YieldStrategy[] memory) {
        return yieldStrategies;
    }

    /**
     * @dev Get active yield strategies
     * @return Array of active yield strategies
     */
    function getActiveYieldStrategies() external view returns (YieldStrategy[] memory) {
        YieldStrategy[] memory activeStrategies = new YieldStrategy[](yieldStrategies.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < yieldStrategies.length; i++) {
            if (yieldStrategies[i].isActive) {
                activeStrategies[count] = yieldStrategies[i];
                count++;
            }
        }
        
        // Resize array
        YieldStrategy[] memory result = new YieldStrategy[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = activeStrategies[i];
        }
        
        return result;
    }

    /**
     * @dev Get contract statistics
     * @return totalUsers_ Total registered users
     * @return totalVolume Total volume locked
     * @return totalYield Total yield distributed
     * @return contractBalance CELO balance
     * @return cusdBalance cUSD balance
     */
    function getStats() external view returns (
        uint256 totalUsers_,
        uint256 totalVolume,
        uint256 totalYield,
        uint256 contractBalance,
        uint256 cusdBalance
    ) {
        totalUsers_ = totalUsers;
        totalVolume = totalVolumeLocked;
        totalYield = totalYieldDistributed;
        contractBalance = address(this).balance;
        cusdBalance = cusdToken.balanceOf(address(this));
    }

    /**
     * @dev Update treasury address (only owner)
     * @param newTreasury New treasury address
     */
    function updateTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "LoopFi: Invalid treasury address");
        treasury = newTreasury;
        
        // Update child contracts
        savingsGoalContract.updateTreasury(newTreasury);
        groupPoolContract.updateTreasury(newTreasury);
    }

    /**
     * @dev Emergency withdraw (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            payable(owner()).transfer(balance);
        }
    }

    /**
     * @dev Receive function to accept CELO
     */
    receive() external payable {}
}
