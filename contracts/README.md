# LoopFi Smart Contracts

DeFi Social Saving Platform on Celo - Smart Contracts Implementation

## 🏗️ Contract Architecture

### Core Contracts

1. **LoopFi.sol** - Main contract integrating all components
2. **SavingsGoal.sol** - Individual savings goals with lock duration
3. **GroupPool.sol** - Collaborative savings pools
4. **SavingsBadgeNFT.sol** - NFT badges for achievements

### Mock Contracts (for testing)

5. **MockERC20.sol** - Mock CELO/cUSD tokens for testing
6. **MockYieldStrategy.sol** - Mock yield strategy for testing

## 🚀 Features Implemented

### ✅ Individual Savings Goals
- Create personal savings goals with target amount and lock duration
- Deposit CELO/cUSD to goals
- Automatic yield calculation based on APY and time locked
- Withdraw funds after lock period ends
- Emergency withdraw with penalty (before lock period ends)
- Minimum/maximum amount and duration limits

### ✅ Group Savings Pools
- Create collaborative savings pools (2-50 members)
- Join pools with initial contribution
- Make additional contributions
- Referral bonus system (1% bonus for referrers)
- Creator bonus (2% bonus for pool creators)
- Proportional yield distribution
- Democratic pool management

### ✅ NFT Achievement System
- 9 different badge types for various milestones
- Automatic badge minting for achievements
- Badge upgrade system
- Metadata URI support for badge images
- Transferable and burnable badges

### ✅ Yield Distribution
- Configurable APY (Annual Percentage Yield)
- Time-based yield calculation
- Fee system (2% fee on yield)
- Treasury for fee collection
- Multiple yield strategies support

### ✅ Referral System
- 1% referral bonus for bringing new members
- Creator bonuses for pool creators
- Transparent bonus distribution

## 📋 Contract Specifications

### SavingsGoal Contract

```solidity
// Key Functions
function createGoal(uint256 targetAmount, uint256 lockDuration, bool useCUSD)
function deposit(uint256 amount, bool useCUSD)
function withdraw(bool useCUSD)
function emergencyWithdraw(bool useCUSD)

// Limits
MIN_TARGET_AMOUNT: 0.01 CELO
MAX_TARGET_AMOUNT: 1000 CELO
MIN_LOCK_DURATION: 7 days
MAX_LOCK_DURATION: 365 days
DEFAULT_APY: 8.5%
```

### GroupPool Contract

```solidity
// Key Functions
function createPool(string name, string description, uint256 targetAmount, uint256 maxMembers, uint256 lockDuration, bool useCUSD)
function joinPool(uint256 poolId, uint256 amount, bool useCUSD, address referrer)
function contributeToPool(uint256 poolId, uint256 amount, bool useCUSD)
function withdrawFromPool(uint256 poolId, bool useCUSD)

// Limits
MIN_TARGET_AMOUNT: 0.1 CELO
MAX_TARGET_AMOUNT: 10,000 CELO
MIN_MEMBERS: 2
MAX_MEMBERS: 50
DEFAULT_APY: 10% (higher for groups)
REFERRAL_BONUS: 1%
CREATOR_BONUS: 2%
```

### SavingsBadgeNFT Contract

```solidity
// Badge Types
enum BadgeType {
    STARTER,      // First savings goal completed
    CONSISTENT,   // 5 goals completed
    DEDICATED,    // 10 goals completed
    MASTER,       // 25 goals completed
    LEGEND,       // 50 goals completed
    GROUP_LEADER, // Created 5 group pools
    SOCIAL_SAVER, // Joined 10 group pools
    YIELD_HUNTER, // Earned 100 CELO in yield
    MILLIONAIRE   // Saved 1000 CELO total
}

// Key Functions
function mintBadge(address to, BadgeType badgeType, uint256 milestone, string metadataURI)
function upgradeBadge(address to, BadgeType oldBadgeType, BadgeType newBadgeType, uint256 milestone, string metadataURI)
function getUserBadges(address user) returns (BadgeType[])
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Hardhat
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/loopfi.git
cd loopfi/contracts

# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy to Alfajores testnet
npm run deploy:alfajores

# Deploy to Celo mainnet
npm run deploy:celo
```

### Environment Setup

1. Copy `env.example` to `.env`
2. Add your private key and CeloScan API key
3. Configure treasury address

```env
PRIVATE_KEY=your_private_key_here
CELOSCAN_API_KEY=your_celoscan_api_key_here
TREASURY_ADDRESS=your_treasury_address_here
```

## 🧪 Testing

The contracts include comprehensive tests covering:

- User registration and authentication
- Savings goal creation and management
- Group pool creation and participation
- NFT badge minting and upgrades
- Yield calculation and distribution
- Referral bonus system
- Emergency scenarios
- Access control and security

Run tests with:
```bash
npm run test
```

## 🚀 Deployment

### Testnet (Alfajores)

```bash
# Deploy to Alfajores testnet
npm run deploy:alfajores

# Verify contracts
npm run verify:alfajores
```

### Mainnet (Celo)

```bash
# Deploy to Celo mainnet
npm run deploy:celo

# Verify contracts
npm run verify:celo
```

### Contract Addresses

After deployment, you'll get:
- SavingsGoal contract address
- GroupPool contract address
- SavingsBadgeNFT contract address
- LoopFi main contract address

## 🔒 Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **Ownable**: Access control for admin functions
- **Input Validation**: Comprehensive parameter validation
- **Emergency Functions**: Emergency withdraw with penalties
- **Fee System**: Transparent fee collection
- **Time Locks**: Prevents premature withdrawals

## 📊 Gas Optimization

- **Optimizer Enabled**: 200 runs optimization
- **viaIR**: Intermediate Representation compilation
- **Efficient Storage**: Optimized data structures
- **Batch Operations**: Reduced transaction costs

## 🔄 Integration with Frontend

The contracts are designed to work seamlessly with the React frontend:

1. **Wallet Integration**: MetaMask/Celo wallet support
2. **Real-time Updates**: Event-driven UI updates
3. **Transaction Management**: Comprehensive transaction handling
4. **Error Handling**: User-friendly error messages
5. **Progress Tracking**: Real-time goal and pool progress

## 📈 Yield Strategies

The platform supports multiple yield strategies:

- **Mock Strategy**: For testing and development
- **Celo DeFi Integration**: Real yield from DeFi protocols
- **Staking Rewards**: CELO staking rewards
- **Liquidity Mining**: LP token rewards

## 🎯 Roadmap

### Phase 1: Core MVP ✅
- [x] Individual savings goals
- [x] Group savings pools
- [x] NFT achievement system
- [x] Referral bonus system
- [x] Yield distribution

### Phase 2: Advanced Features 🚧
- [ ] Real DeFi yield integration
- [ ] Advanced yield strategies
- [ ] Cross-chain support
- [ ] Mobile optimization

### Phase 3: Ecosystem Integration 🔮
- [ ] DAO governance
- [ ] Token launch
- [ ] Institutional features
- [ ] Advanced analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [LoopFi Docs](https://docs.loopfi.app)
- **Discord**: [LoopFi Community](https://discord.gg/loopfi)
- **Twitter**: [@LoopFiApp](https://twitter.com/LoopFiApp)
- **Email**: dev@loopfi.app

---

**Built with ❤️ for the Celo DeFi community**
