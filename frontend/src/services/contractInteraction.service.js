// Contract Interaction Service - Real Smart Contract Integration
import { ethers } from 'ethers';
import celoWalletService from './celoWalletService';

// Contract addresses from Alfajores deployment
const CONTRACT_ADDRESSES = {
  SavingsGoal: import.meta.env.VITE_SAVINGS_GOAL_CONTRACT || '0xdAdc4B753D0B76147fe3b77623AC7f83783E3b62',
  GroupPool: import.meta.env.VITE_GROUP_POOL_CONTRACT || '0x74864Cb942cf73aFABc9633438c1Bb060d7FEa94',
  SavingsBadgeNFT: import.meta.env.VITE_BADGE_NFT_CONTRACT || '0x3061d039c044321AA6615ce6C087adBf18ACEf49',
  LoopFi: import.meta.env.VITE_LOOPFI_CONTRACT || '0x986BB77aF6e06C8f96Ae5EaA1DBb394df83AF425',
};

// ERC20 ABI for token approvals
const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
];

// Minimal ABIs (only the functions we need)
const SAVINGS_GOAL_ABI = [
  'function createGoal(uint256 targetAmount, uint256 lockDuration, bool useCUSD) external',
  'function deposit(uint256 amount, bool useCUSD) external',
  'function goals(address user) external view returns (address creator, uint256 targetAmount, uint256 currentAmount, uint256 lockDuration, uint256 startTime, uint256 endTime, bool isCompleted, bool isActive, uint256 yieldEarned, uint256 apy)',
  'function hasGoal(address user) external view returns (bool)',
  'function withdraw(bool useCUSD) external',
  'function completeGoal() external',
  'event GoalCreated(address indexed creator, uint256 targetAmount, uint256 lockDuration)',
  'event DepositMade(address indexed depositor, uint256 amount, uint256 totalDeposited)',
];

const GROUP_POOL_ABI = [
  'function createPool(string memory name, string memory description, uint256 targetAmount, uint256 maxMembers, uint256 lockDuration, bool useCUSD) external',
  'function joinPool(uint256 poolId, uint256 amount, bool useCUSD, address referrer) external',
  'function contributeToPool(uint256 poolId, uint256 amount, bool useCUSD) external',
  'function getPoolMembers(uint256 poolId) external view returns (address[] memory)',
  'function pools(uint256 poolId) external view returns (uint256 poolId, address creator, string memory name, string memory description, uint256 targetAmount, uint256 currentAmount, uint256 maxMembers, uint256 currentMembers, uint256 lockDuration, uint256 startTime, uint256 endTime, bool isCompleted, bool isActive, uint256 yieldEarned, uint256 apy)',
  'function userPools(address user, uint256 index) external view returns (uint256)',
  'function nextPoolId() external view returns (uint256)',
  'event PoolCreated(uint256 indexed poolId, address indexed creator, string name, uint256 targetAmount, uint256 maxMembers, uint256 lockDuration)',
  'event MemberJoined(uint256 indexed poolId, address indexed member, uint256 contribution)',
  'event ContributionMade(uint256 indexed poolId, address indexed member, uint256 amount)',
];

class ContractInteractionService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.savingsGoalContract = null;
    this.groupPoolContract = null;
    this.celoTokenContract = null;
    this.cusdTokenContract = null;
  }

  /**
   * Initialize contracts with provider and signer
   */
  async initialize() {
    try {
      console.log('🔧 Initializing contract service...');
      
      // Get provider and signer from wallet service
      const status = celoWalletService.getConnectionStatus();
      if (!status.isConnected) {
        throw new Error('Wallet not connected');
      }

      this.provider = celoWalletService.provider;
      this.signer = celoWalletService.signer;

      if (!this.signer) {
        throw new Error('No signer available');
      }

      // Initialize contract instances
      this.savingsGoalContract = new ethers.Contract(
        CONTRACT_ADDRESSES.SavingsGoal,
        SAVINGS_GOAL_ABI,
        this.signer
      );

      this.groupPoolContract = new ethers.Contract(
        CONTRACT_ADDRESSES.GroupPool,
        GROUP_POOL_ABI,
        this.signer
      );

      // Initialize token contracts for approvals
      const CELO_TOKEN = '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9'; // Alfajores CELO
      const CUSD_TOKEN = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1'; // Alfajores cUSD

      this.celoTokenContract = new ethers.Contract(
        CELO_TOKEN,
        ERC20_ABI,
        this.signer
      );

      this.cusdTokenContract = new ethers.Contract(
        CUSD_TOKEN,
        ERC20_ABI,
        this.signer
      );

      console.log('✅ Contracts initialized:', {
        savingsGoal: CONTRACT_ADDRESSES.SavingsGoal,
        groupPool: CONTRACT_ADDRESSES.GroupPool,
        celoToken: CELO_TOKEN,
        cusdToken: CUSD_TOKEN
      });

      return true;
    } catch (error) {
      console.error('❌ Error initializing contracts:', error);
      throw error;
    }
  }

  /**
   * Create a new savings goal on the blockchain
   * @param targetAmount - Target amount in CELO
   * @param deadline - Deadline as Date or timestamp
   */
  async createSavingsGoal(targetAmount, deadline) {
    try {
      await this.initialize();

      const deadlineDate = new Date(deadline);
      const now = new Date();
      const lockDurationSeconds = Math.floor((deadlineDate - now) / 1000);

      console.log('📝 Creating savings goal on blockchain:', {
        targetAmount,
        deadline: deadlineDate.toISOString(),
        lockDurationSeconds,
        lockDurationDays: Math.floor(lockDurationSeconds / 86400)
      });

      // Validate lock duration (7 days minimum)
      if (lockDurationSeconds < 7 * 86400) {
        throw new Error('Lock duration must be at least 7 days');
      }
      if (lockDurationSeconds > 365 * 86400) {
        throw new Error('Lock duration cannot exceed 1 year');
      }

      // Validate target amount
      if (targetAmount < 0.01) {
        throw new Error('Target amount must be at least 0.01 CELO');
      }
      if (targetAmount > 1000) {
        throw new Error('Target amount cannot exceed 1000 CELO');
      }
      
      // Convert amount to Wei (CELO has 18 decimals) - ethers v5
      const targetAmountWei = ethers.utils.parseEther(targetAmount.toString());

      // Call the smart contract (useCUSD = false for CELO)
      const tx = await this.savingsGoalContract.createGoal(
        targetAmountWei,
        lockDurationSeconds,
        false // useCUSD
      );

      console.log('⏳ Transaction sent:', tx.hash);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed:', receipt.hash);

      // In this contract, goals are mapped by address, not ID
      // Return the user's address as the "goalId" for consistency
      const userAddress = await this.signer.getAddress();

      return {
        success: true,
        txHash: receipt.hash,
        goalId: userAddress, // Use address as identifier
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('❌ Error creating savings goal:', error);
      return {
        success: false,
        error: error.message || 'Failed to create goal'
      };
    }
  }

  /**
   * Contribute to YOUR savings goal (address-based, not ID-based)
   * Requires ERC20 approval first!
   * @param goalId - Not used, kept for API compatibility
   * @param amount - Amount in CELO to deposit
   */
  async contributeToGoal(goalId, amount) {
    try {
      await this.initialize();

      console.log('💰 Contributing to goal:', { amount });

      // Convert amount to Wei - ethers v5
      const amountWei = ethers.utils.parseEther(amount.toString());
      const useCUSD = false; // Using CELO for now
      const userAddress = await this.signer.getAddress();

      // Step 0: Check if user has a goal
      const hasGoal = await this.savingsGoalContract.hasGoal(userAddress);
      if (!hasGoal) {
        throw new Error('You must create a goal first before depositing');
      }

      // Check CELO token balance
      const tokenBalance = await this.celoTokenContract.balanceOf(userAddress);
      console.log('📊 CELO token balance:', ethers.utils.formatEther(tokenBalance), 'CELO');
      
      if (tokenBalance.lt(amountWei)) {
        throw new Error(`Insufficient CELO token balance. You need ${ethers.utils.formatEther(amountWei)} but have ${ethers.utils.formatEther(tokenBalance)}`);
      }

      // Step 1: Check current allowance
      const currentAllowance = await this.celoTokenContract.allowance(
        userAddress,
        CONTRACT_ADDRESSES.SavingsGoal
      );

      console.log('📝 Current allowance:', ethers.utils.formatEther(currentAllowance), 'CELO');

      // Step 2: Approve if needed
      if (currentAllowance.lt(amountWei)) {
        console.log('🔑 Approving CELO spending...');
        const approveTx = await this.celoTokenContract.approve(
          CONTRACT_ADDRESSES.SavingsGoal,
          amountWei
        );
        
        console.log('⏳ Approval transaction sent:', approveTx.hash);
        const approvalReceipt = await approveTx.wait();
        
        if (approvalReceipt.status === 0) {
          throw new Error('Approval transaction failed');
        }
        
        console.log('✅ Approval confirmed');
      } else {
        console.log('✅ Already approved');
      }

      // Step 3: Deposit
      console.log('💰 Depositing to goal...');
      const tx = await this.savingsGoalContract.deposit(amountWei, useCUSD);

      console.log('⏳ Deposit transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('✅ Deposit confirmed:', receipt.transactionHash);

      // Check if transaction succeeded
      if (receipt.status === 0) {
        throw new Error('Deposit transaction failed on blockchain. Please check the contract requirements.');
      }

      return {
        success: true,
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('❌ Error contributing to goal:', error);
      
      // Provide more helpful error messages
      let errorMessage = error.message || 'Failed to contribute';
      
      if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient CELO tokens. Make sure you have enough wrapped CELO.';
      } else if (error.message?.includes('user rejected')) {
        errorMessage = 'Transaction cancelled by user';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Get goal details for a specific address
   * @param userAddress - Address of the user whose goal to fetch
   */
  async getGoalDetails(userAddress) {
    try {
      await this.initialize();

      // Check if user has a goal
      const hasGoal = await this.savingsGoalContract.hasGoal(userAddress);
      
      if (!hasGoal) {
        return {
          success: false,
          error: 'No goal found for this address'
        };
      }

      const goal = await this.savingsGoalContract.goals(userAddress);

      return {
        success: true,
        goal: {
          creator: goal.creator,
          targetAmount: ethers.utils.formatEther(goal.targetAmount),
          currentAmount: ethers.utils.formatEther(goal.currentAmount),
          lockDuration: Number(goal.lockDuration),
          startTime: new Date(Number(goal.startTime) * 1000),
          endTime: new Date(Number(goal.endTime) * 1000),
          isCompleted: goal.isCompleted,
          isActive: goal.isActive,
          yieldEarned: ethers.utils.formatEther(goal.yieldEarned),
          apy: Number(goal.apy)
        }
      };
    } catch (error) {
      console.error('❌ Error getting goal details:', error);
      return {
        success: false,
        error: error.message || 'Failed to get goal details'
      };
    }
  }

  /**
   * Check if user has an active goal
   * @param userAddress - Address to check
   */
  async hasGoal(userAddress) {
    try {
      await this.initialize();
      const hasGoal = await this.savingsGoalContract.hasGoal(userAddress);
      return {
        success: true,
        hasGoal: hasGoal
      };
    } catch (error) {
      console.error('❌ Error checking goal status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create a new group pool on the blockchain
   * @param name - Pool name
   * @param description - Pool description
   * @param targetAmount - Target amount in CELO
   * @param maxMembers - Maximum number of members
   * @param deadline - Deadline as Date or timestamp
   */
  async createGroupPool(name, description, targetAmount, maxMembers, deadline) {
    try {
      await this.initialize();

      const deadlineDate = new Date(deadline);
      const now = new Date();
      const lockDurationSeconds = Math.floor((deadlineDate - now) / 1000);

      console.log('👥 Creating group pool on blockchain:', {
        name,
        description,
        targetAmount,
        maxMembers,
        deadline: deadlineDate.toISOString(),
        lockDurationDays: Math.floor(lockDurationSeconds / 86400)
      });

      // Validate lock duration (7 days minimum)
      if (lockDurationSeconds < 7 * 86400) {
        throw new Error('Lock duration must be at least 7 days');
      }
      if (lockDurationSeconds > 365 * 86400) {
        throw new Error('Lock duration cannot exceed 1 year');
      }

      // Validate target amount
      if (targetAmount < 0.1) {
        throw new Error('Target amount must be at least 0.1 CELO');
      }
      if (targetAmount > 10000) {
        throw new Error('Target amount cannot exceed 10,000 CELO');
      }

      // Validate members
      if (maxMembers < 2) {
        throw new Error('Pool must have at least 2 members');
      }
      if (maxMembers > 50) {
        throw new Error('Pool cannot have more than 50 members');
      }

      const targetAmountWei = ethers.utils.parseEther(targetAmount.toString());
      const useCUSD = false; // Using CELO for now

      const tx = await this.groupPoolContract.createPool(
        name,
        description || '',
        targetAmountWei,
        maxMembers,
        lockDurationSeconds,
        useCUSD
      );

      console.log('⏳ Transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed:', receipt.transactionHash);

      if (receipt.status === 0) {
        throw new Error('Transaction failed on blockchain');
      }

      // Extract poolId from event logs
      const poolCreatedEvent = receipt.logs.find(
        log => {
          try {
            const parsed = this.groupPoolContract.interface.parseLog(log);
            return parsed.name === 'PoolCreated';
          } catch {
            return false;
          }
        }
      );

      let poolId = null;
      if (poolCreatedEvent) {
        const parsed = this.groupPoolContract.interface.parseLog(poolCreatedEvent);
        poolId = parsed.args.poolId.toString();
      }

      return {
        success: true,
        txHash: receipt.transactionHash,
        poolId: poolId,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('❌ Error creating group pool:', error);
      return {
        success: false,
        error: error.message || 'Failed to create pool'
      };
    }
  }

  /**
   * Contribute to a group pool
   * Requires ERC20 approval first!
   * @param poolId - Pool ID
   * @param amount - Amount in CELO to contribute
   */
  async contributeToGroup(poolId, amount) {
    try {
      await this.initialize();

      // Validate poolId
      if (!poolId || poolId === 'undefined' || poolId === 'null') {
        throw new Error('Invalid pool ID. Pool may not be properly linked to blockchain.');
      }

      // Convert poolId to number if it's a string
      const poolIdNumber = typeof poolId === 'string' ? parseInt(poolId, 10) : poolId;
      
      if (isNaN(poolIdNumber)) {
        throw new Error(`Invalid pool ID format: ${poolId}. Expected a number.`);
      }

      console.log('💰 Contributing to group pool:', { poolId: poolIdNumber, amount });

      const amountWei = ethers.utils.parseEther(amount.toString());
      const useCUSD = false; // Using CELO for now
      const userAddress = await this.signer.getAddress();

      // Check CELO token balance
      const tokenBalance = await this.celoTokenContract.balanceOf(userAddress);
      console.log('📊 CELO token balance:', ethers.utils.formatEther(tokenBalance), 'CELO');
      
      if (tokenBalance.lt(amountWei)) {
        throw new Error(`Insufficient CELO token balance. You need ${ethers.utils.formatEther(amountWei)} but have ${ethers.utils.formatEther(tokenBalance)}`);
      }

      // Step 1: Check current allowance
      const currentAllowance = await this.celoTokenContract.allowance(
        userAddress,
        CONTRACT_ADDRESSES.GroupPool
      );

      console.log('📝 Current allowance:', ethers.utils.formatEther(currentAllowance), 'CELO');

      // Step 2: Approve if needed
      if (currentAllowance.lt(amountWei)) {
        console.log('🔑 Approving CELO spending...');
        const approveTx = await this.celoTokenContract.approve(
          CONTRACT_ADDRESSES.GroupPool,
          amountWei
        );
        
        console.log('⏳ Approval transaction sent:', approveTx.hash);
        const approvalReceipt = await approveTx.wait();
        
        if (approvalReceipt.status === 0) {
          throw new Error('Approval transaction failed');
        }
        
        console.log('✅ Approval confirmed');
      } else {
        console.log('✅ Already approved');
      }

      // Step 3: Contribute to pool
      console.log('💰 Contributing to pool...');
      const tx = await this.groupPoolContract.contributeToPool(poolIdNumber, amountWei, useCUSD);

      console.log('⏳ Contribution transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('✅ Contribution confirmed:', receipt.transactionHash);

      if (receipt.status === 0) {
        throw new Error('Contribution transaction failed on blockchain');
      }

      return {
        success: true,
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('❌ Error contributing to group:', error);
      
      let errorMessage = error.message || 'Failed to contribute';
      
      if (error.message?.includes('Not a member')) {
        errorMessage = 'You must join this pool first before contributing';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient CELO tokens';
      } else if (error.message?.includes('user rejected')) {
        errorMessage = 'Transaction cancelled by user';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Check if user is a member of a pool
   * @param poolId - Pool ID to check
   * @param userAddress - User address (optional, uses current signer if not provided)
   */
  async isPoolMember(poolId, userAddress = null) {
    try {
      await this.initialize();

      const address = userAddress || await this.signer.getAddress();
      const poolIdNumber = typeof poolId === 'string' ? parseInt(poolId, 10) : poolId;

      // Get pool members
      const members = await this.groupPoolContract.getPoolMembers(poolIdNumber);
      
      // Check if user is in the members array
      const isMember = members.some(member => 
        member.toLowerCase() === address.toLowerCase()
      );

      console.log('👥 Membership check:', { poolId: poolIdNumber, address, isMember });

      return {
        success: true,
        isMember: isMember
      };
    } catch (error) {
      console.error('❌ Error checking membership:', error);
      return {
        success: false,
        isMember: false,
        error: error.message
      };
    }
  }

  /**
   * Join a group pool with initial contribution
   * @param poolId - Pool ID to join
   * @param amount - Initial contribution amount in CELO
   * @param referrer - Optional referrer address
   */
  async joinGroupPool(poolId, amount, referrer = '0x0000000000000000000000000000000000000000') {
    try {
      await this.initialize();

      // Validate poolId
      if (!poolId || poolId === 'undefined' || poolId === 'null') {
        throw new Error('Invalid pool ID. Pool may not be properly linked to blockchain.');
      }

      // Convert poolId to number if it's a string
      const poolIdNumber = typeof poolId === 'string' ? parseInt(poolId, 10) : poolId;
      
      if (isNaN(poolIdNumber)) {
        throw new Error(`Invalid pool ID format: ${poolId}. Expected a number.`);
      }

      console.log('🤝 Joining group pool:', { poolId: poolIdNumber, amount, referrer });

      const amountWei = ethers.utils.parseEther(amount.toString());
      const useCUSD = false; // Using CELO for now
      const userAddress = await this.signer.getAddress();

      // Check CELO token balance
      const tokenBalance = await this.celoTokenContract.balanceOf(userAddress);
      console.log('📊 CELO token balance:', ethers.utils.formatEther(tokenBalance), 'CELO');
      
      if (tokenBalance.lt(amountWei)) {
        throw new Error(`Insufficient CELO token balance`);
      }

      // Step 1: Approve tokens
      const currentAllowance = await this.celoTokenContract.allowance(
        userAddress,
        CONTRACT_ADDRESSES.GroupPool
      );

      if (currentAllowance.lt(amountWei)) {
        console.log('🔑 Approving CELO spending...');
        const approveTx = await this.celoTokenContract.approve(
          CONTRACT_ADDRESSES.GroupPool,
          amountWei
        );
        
        console.log('⏳ Approval transaction sent:', approveTx.hash);
        const approvalReceipt = await approveTx.wait();
        
        if (approvalReceipt.status === 0) {
          throw new Error('Approval transaction failed');
        }
        
        console.log('✅ Approval confirmed');
      }

      // Step 2: Join pool
      console.log('👥 Joining pool...');
      const tx = await this.groupPoolContract.joinPool(poolIdNumber, amountWei, useCUSD, referrer);

      console.log('⏳ Join transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('✅ Joined pool:', receipt.transactionHash);

      if (receipt.status === 0) {
        throw new Error('Join transaction failed on blockchain');
      }

      return {
        success: true,
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('❌ Error joining pool:', error);
      
      let errorMessage = error.message || 'Failed to join pool';
      
      if (error.message?.includes('Already a member')) {
        errorMessage = 'You are already a member of this pool';
      } else if (error.message?.includes('Pool is full')) {
        errorMessage = 'This pool is already full';
      } else if (error.message?.includes('user rejected')) {
        errorMessage = 'Transaction cancelled by user';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Get group details from blockchain
   */
  async getGroupDetails(groupId) {
    try {
      await this.initialize();

      const group = await this.groupPoolContract.getGroup(groupId);

      return {
        success: true,
        group: {
          name: group.name,
          creator: group.creator,
          targetAmount: ethers.utils.formatEther(group.targetAmount),
          currentAmount: ethers.utils.formatEther(group.currentAmount),
          deadline: new Date(Number(group.deadline) * 1000),
          maxMembers: Number(group.maxMembers),
          memberCount: Number(group.memberCount),
          isActive: group.isActive
        }
      };
    } catch (error) {
      console.error('❌ Error getting group details:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Join a group pool
   */
  async joinGroup(groupId) {
    try {
      await this.initialize();

      console.log('🤝 Joining group:', groupId);

      const tx = await this.groupPoolContract.joinGroup(groupId);
      console.log('⏳ Transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('✅ Joined group:', receipt.hash);

      return {
        success: true,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('❌ Error joining group:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get contract addresses (for reference)
   */
  getContractAddresses() {
    return CONTRACT_ADDRESSES;
  }
}

const contractInteractionService = new ContractInteractionService();
export default contractInteractionService;

