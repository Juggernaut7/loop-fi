// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title SavingsGoal
 * @dev Individual savings goal contract with lock duration and target amount
 * @author LoopFi Team
 */
contract SavingsGoal is ReentrancyGuard, Ownable {
    // Events
    event GoalCreated(address indexed creator, uint256 targetAmount, uint256 lockDuration);
    event DepositMade(address indexed depositor, uint256 amount, uint256 totalDeposited);
    event GoalCompleted(address indexed creator, uint256 totalAmount, uint256 yieldEarned);
    event FundsWithdrawn(address indexed withdrawer, uint256 amount);
    event EmergencyWithdraw(address indexed withdrawer, uint256 amount);

    // Structs
    struct Goal {
        address creator;
        uint256 targetAmount;
        uint256 currentAmount;
        uint256 lockDuration;
        uint256 startTime;
        uint256 endTime;
        bool isCompleted;
        bool isActive;
        uint256 yieldEarned;
        uint256 apy; // Annual Percentage Yield in basis points (100 = 1%)
    }

    // State variables
    mapping(address => Goal) public goals;
    mapping(address => bool) public hasGoal;
    
    IERC20 public celoToken;
    IERC20 public cusdToken;
    
    uint256 public constant MIN_TARGET_AMOUNT = 0.01 ether; // Minimum 0.01 CELO
    uint256 public constant MAX_TARGET_AMOUNT = 1000 ether; // Maximum 1000 CELO
    uint256 public constant MIN_LOCK_DURATION = 7 days; // Minimum 7 days
    uint256 public constant MAX_LOCK_DURATION = 365 days; // Maximum 1 year
    
    uint256 public DEFAULT_APY = 850; // 8.5% APY in basis points
    uint256 public constant YIELD_FEE_PERCENTAGE = 200; // 2% fee on yield
    
    address public treasury;
    uint256 public totalGoalsCreated;
    uint256 public totalVolumeLocked;

    // Modifiers
    modifier onlyGoalOwner() {
        require(hasGoal[msg.sender], "SavingsGoal: No active goal");
        _;
    }

    modifier goalNotCompleted() {
        require(!goals[msg.sender].isCompleted, "SavingsGoal: Goal already completed");
        _;
    }

    modifier goalActive() {
        require(goals[msg.sender].isActive, "SavingsGoal: Goal not active");
        _;
    }

    modifier lockPeriodEnded() {
        require(block.timestamp >= goals[msg.sender].endTime, "SavingsGoal: Lock period not ended");
        _;
    }

    constructor(address _celoToken, address _cusdToken, address _treasury) Ownable(msg.sender) {
        celoToken = IERC20(_celoToken);
        cusdToken = IERC20(_cusdToken);
        treasury = _treasury;
    }

    /**
     * @dev Create a new savings goal
     * @param targetAmount Target amount to save (in wei)
     * @param lockDuration Duration to lock funds (in seconds)
     * @param useCUSD Whether to use cUSD instead of CELO
     */
    function createGoal(
        uint256 targetAmount,
        uint256 lockDuration,
        bool useCUSD
    ) external {
        require(!hasGoal[msg.sender], "SavingsGoal: Goal already exists");
        require(targetAmount >= MIN_TARGET_AMOUNT, "SavingsGoal: Target amount too low");
        require(targetAmount <= MAX_TARGET_AMOUNT, "SavingsGoal: Target amount too high");
        require(lockDuration >= MIN_LOCK_DURATION, "SavingsGoal: Lock duration too short");
        require(lockDuration <= MAX_LOCK_DURATION, "SavingsGoal: Lock duration too long");

        Goal storage goal = goals[msg.sender];
        goal.creator = msg.sender;
        goal.targetAmount = targetAmount;
        goal.currentAmount = 0;
        goal.lockDuration = lockDuration;
        goal.startTime = block.timestamp;
        goal.endTime = block.timestamp + lockDuration;
        goal.isCompleted = false;
        goal.isActive = true;
        goal.yieldEarned = 0;
        goal.apy = DEFAULT_APY;

        hasGoal[msg.sender] = true;
        totalGoalsCreated++;

        emit GoalCreated(msg.sender, targetAmount, lockDuration);
    }

    /**
     * @dev Deposit funds to the savings goal
     * @param amount Amount to deposit (in wei)
     * @param useCUSD Whether to use cUSD instead of CELO
     */
    function deposit(uint256 amount, bool useCUSD) external onlyGoalOwner goalNotCompleted goalActive nonReentrant {
        require(amount > 0, "SavingsGoal: Amount must be greater than 0");
        
        Goal storage goal = goals[msg.sender];
        require(goal.currentAmount + amount <= goal.targetAmount, "SavingsGoal: Exceeds target amount");

        IERC20 token = useCUSD ? cusdToken : celoToken;
        
        // Transfer tokens from user to contract
        require(token.transferFrom(msg.sender, address(this), amount), "SavingsGoal: Transfer failed");
        
        goal.currentAmount += amount;
        totalVolumeLocked += amount;

        emit DepositMade(msg.sender, amount, goal.currentAmount);

        // Check if goal is completed
        if (goal.currentAmount >= goal.targetAmount) {
            _completeGoal();
        }
    }

    /**
     * @dev Complete the goal and calculate yield
     */
    function _completeGoal() internal {
        Goal storage goal = goals[msg.sender];
        goal.isCompleted = true;
        
        // Calculate yield based on APY and time locked
        uint256 timeLocked = block.timestamp - goal.startTime;
        // yield = principal * apy * timeLocked / (10000 * 365 days)
        // apy is in basis points (100 basis points = 1%)
        uint256 yield = (goal.currentAmount * goal.apy * timeLocked) / (10000 * 365 days);
        goal.yieldEarned = yield;

        emit GoalCompleted(msg.sender, goal.currentAmount, goal.yieldEarned);
    }

    /**
     * @dev Withdraw funds after lock period ends
     * @param useCUSD Whether to withdraw cUSD instead of CELO
     */
    function withdraw(bool useCUSD) external onlyGoalOwner lockPeriodEnded nonReentrant {
        Goal storage goal = goals[msg.sender];
        require(goal.isCompleted, "SavingsGoal: Goal not completed");
        
        uint256 totalAmount = goal.currentAmount + goal.yieldEarned;
        uint256 feeAmount = (goal.yieldEarned * YIELD_FEE_PERCENTAGE) / 10000;
        uint256 withdrawAmount = totalAmount - feeAmount;

        IERC20 token = useCUSD ? cusdToken : celoToken;
        
        // Transfer tokens to user
        require(token.transfer(msg.sender, withdrawAmount), "SavingsGoal: Withdrawal failed");
        
        // Transfer fee to treasury
        if (feeAmount > 0) {
            require(token.transfer(treasury, feeAmount), "SavingsGoal: Fee transfer failed");
        }

        totalVolumeLocked -= goal.currentAmount;
        goal.isActive = false;

        emit FundsWithdrawn(msg.sender, withdrawAmount);
    }

    /**
     * @dev Emergency withdraw with penalty (only before lock period ends)
     * @param useCUSD Whether to withdraw cUSD instead of CELO
     */
    function emergencyWithdraw(bool useCUSD) external onlyGoalOwner goalActive nonReentrant {
        Goal storage goal = goals[msg.sender];
        require(block.timestamp < goal.endTime, "SavingsGoal: Lock period ended, use withdraw()");
        
        uint256 penaltyAmount = (goal.currentAmount * 500) / 10000; // 5% penalty
        uint256 withdrawAmount = goal.currentAmount - penaltyAmount;

        IERC20 token = useCUSD ? cusdToken : celoToken;
        
        // Transfer tokens to user (with penalty)
        require(token.transfer(msg.sender, withdrawAmount), "SavingsGoal: Emergency withdrawal failed");
        
        // Transfer penalty to treasury
        if (penaltyAmount > 0) {
            require(token.transfer(treasury, penaltyAmount), "SavingsGoal: Penalty transfer failed");
        }

        totalVolumeLocked -= goal.currentAmount;
        goal.isActive = false;
        hasGoal[msg.sender] = false;

        emit EmergencyWithdraw(msg.sender, withdrawAmount);
    }

    /**
     * @dev Get goal details for a user
     * @param user User address
     * @return Goal struct
     */
    function getGoal(address user) external view returns (Goal memory) {
        return goals[user];
    }

    /**
     * @dev Check if user has an active goal
     * @param user User address
     * @return bool
     */
    function hasActiveGoal(address user) external view returns (bool) {
        return hasGoal[user] && goals[user].isActive;
    }

    /**
     * @dev Get contract statistics
     * @return totalGoals Total goals created
     * @return totalVolume Total volume locked
     * @return contractBalance CELO balance
     * @return cusdBalance cUSD balance
     */
    function getStats() external view returns (
        uint256 totalGoals,
        uint256 totalVolume,
        uint256 contractBalance,
        uint256 cusdBalance
    ) {
        totalGoals = totalGoalsCreated;
        totalVolume = totalVolumeLocked;
        contractBalance = celoToken.balanceOf(address(this));
        cusdBalance = cusdToken.balanceOf(address(this));
    }

    /**
     * @dev Update APY (only owner)
     * @param newAPY New APY in basis points
     */
    function updateAPY(uint256 newAPY) external onlyOwner {
        require(newAPY <= 2000, "SavingsGoal: APY too high"); // Max 20%
        DEFAULT_APY = newAPY;
    }

    /**
     * @dev Update treasury address (only owner)
     * @param newTreasury New treasury address
     */
    function updateTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "SavingsGoal: Invalid treasury address");
        treasury = newTreasury;
    }
}
