<div align="center">

# 💚 LoopFi - Your Money, Growing 24/7

<img src="https://img.shields.io/badge/Blockchain-Celo-35D07F?style=for-the-badge&logo=celo&logoColor=white" alt="Celo" />
<img src="https://img.shields.io/badge/Smart_Contracts-Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white" alt="Solidity" />
<img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
<img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />

**A mobile-first DeFi savings platform on Celo blockchain that makes saving money simple, rewarding, and fun. Create goals, join pools, stake CELO, and earn up to 10% APY—all secured by smart contracts.**

[🚀 Live Demo](https://loo-pfi.vercel.app) • [📡 Backend API](https://loop-fi.onrender.com) • [🔗 GitHub](https://github.com/Juggernaut7/loop-fi)

</div>

---

## 🌟 What is LoopFi?

LoopFi transforms traditional savings into a **modern, blockchain-powered experience**. Whether you're saving for a vacation, emergency fund, or just growing your wealth, LoopFi makes it effortless with:

- 💰 **Personal Savings Goals** - Solo savings with 8.5% APY
- 👥 **Group Savings Pools** - Save together, earn 10% APY
- 🔒 **CELO Staking** - Stake and earn 8.5% APY
- 🎁 **Achievement NFTs** - Earn badges for milestones
- 🤖 **AI Financial Advisor** - Get personalized savings tips

> **"Your money works while you sleep"** 💤💰

---

## 🎯 Key Features

<table>
<tr>
<td width="50%">

### 🎨 **Beautiful UX/UI**
- Clean, modern interface
- Mobile-first design
- Dark mode support
- Smooth animations

</td>
<td width="50%">

### 🔐 **Blockchain Secured**
- Audited smart contracts
- Non-custodial (you control your keys)
- Transparent on-chain data
- Real-time verification

</td>
</tr>
<tr>
<td width="50%">

### 💎 **High Returns**
- Up to **10% APY** on group pools
- **8.5% APY** on personal goals
- **8.5% APY** on staking
- Daily compound interest

</td>
<td width="50%">

### 🌍 **Celo Powered**
- Fast transactions (<5 sec)
- Low fees (~$0.01)
- Mobile-friendly
- Carbon negative blockchain

</td>
</tr>
</table>

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          LOOPFI ECOSYSTEM                            │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│   WEB FRONTEND   │◄───────►│   BACKEND API    │◄───────►│     DATABASE     │
│   (React/Vite)   │         │   (Node.js)      │         │   (MongoDB)      │
│                  │         │                  │         │                  │
│  • Dashboard     │         │  • User Mgmt     │         │  • User Profiles │
│  • Goals         │         │  • Analytics     │         │  • Goals         │
│  • Earn          │         │  • AI Service    │         │  • Groups        │
│  • Wallet        │         │  • Notifications │         │  • Transactions  │
└────────┬─────────┘         └──────────────────┘         └──────────────────┘
         │                                                                     
         │ ethers.js                                                          
         ▼                                                                     
┌─────────────────────────────────────────────────────────────────────┐
│                      CELO BLOCKCHAIN (Alfajores)                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  SavingsGoal │  │  GroupPool   │  │ StakingPool  │              │
│  │   Contract   │  │   Contract   │  │   Contract   │              │
│  │              │  │              │  │              │              │
│  │ • 8.5% APY   │  │ • 10% APY    │  │ • 8.5% APY   │              │
│  │ • Solo       │  │ • 2-50 users │  │ • Flexible   │              │
│  │ • 7-365 days │  │ • Bonuses    │  │ • 7+ days    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐                                │
│  │  BadgeNFT    │  │   LoopFi     │                                │
│  │   Contract   │  │   (Main)     │                                │
│  │              │  │              │                                │
│  │ • Milestones │  │ • Integrator │                                │
│  │ • Rewards    │  │ • Registry   │                                │
│  └──────────────┘  └──────────────┘                                │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
         │                                                                     
         ▼                                                                     
┌─────────────────────────────────────────────────────────────────────┐
│                          USER'S WALLET                                │
│                      (MetaMask/Valora/etc)                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Deployed Smart Contracts

### 🌐 **Celo Alfajores Testnet**

| Contract | Address | Purpose |
|----------|---------|---------|
| **SavingsGoal** | `0xdAdc4B753D0B76147fe3b77623AC7f83783E3b62` | Personal savings goals with 8.5% APY |
| **GroupPool** | `0x74864Cb942cf73aFABc9633438c1Bb060d7FEa94` | Group savings pools with 10% APY |
| **StakingPool** | `0xEb74C4f01EE73c8151509a7F89e201Acfcd7E2E6` | CELO staking with 8.5% APY |
| **SavingsBadgeNFT** | `0x3061d039c044321AA6615ce6C087adBf18ACEf49` | Achievement NFT rewards |
| **LoopFi (Main)** | `0x986BB77aF6e06C8f96Ae5EaA1DBb394df83AF425` | Main contract integrator |

### 🪙 **Token Addresses (Alfajores)**

| Token | Address | Description |
|-------|---------|-------------|
| **CELO** | `0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9` | Native Celo token (wrapped) |
| **cUSD** | `0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1` | Celo Dollar stablecoin |

> 🔗 **Verify on Celoscan:** [alfajores.celoscan.io](https://alfajores.celoscan.io/)

---

## 🚀 User Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                                 │
└─────────────────────────────────────────────────────────────────────┘

1️⃣ CONNECT WALLET
   │
   ├─► MetaMask / Valora / Other Web3 Wallet
   └─► Auto-reconnect on return
   
2️⃣ CHOOSE YOUR PATH
   │
   ├─► Personal Goal (Solo)
   │   ├─ Set target amount
   │   ├─ Choose duration (7-365 days)
   │   ├─ Approve CELO/cUSD
   │   └─► Smart contract locks funds
   │
   ├─► Group Pool (Social)
   │   ├─ Create or join pool
   │   ├─ Share invite code
   │   ├─ Contribute together
   │   └─► Earn higher APY (10%)
   │
   └─► Staking (Passive)
       ├─ Stake CELO tokens
       ├─ Set lock period
       └─► Earn rewards automatically
   
3️⃣ EARN REWARDS
   │
   ├─► Daily compound interest
   ├─► Track progress in dashboard
   └─► Get AI-powered tips
   
4️⃣ WITHDRAW
   │
   ├─► After lock period ends
   ├─► Original + Rewards
   └─► Direct to your wallet
   
5️⃣ COLLECT NFTS
   │
   └─► Earn achievement badges for milestones
```

---

## 💰 Earning Options Comparison

| Feature | Personal Goals | Group Pools | Staking |
|---------|---------------|-------------|---------|
| **APY** | 8.5% | 10% 🔥 | 8.5% |
| **Min Amount** | 0.01 CELO | 0.1 CELO | 0.1 CELO |
| **Max Amount** | 1,000 CELO | 10,000 CELO | 10,000 CELO |
| **Duration** | 7-365 days | 7-365 days | 7+ days |
| **Members** | 1 (Solo) | 2-50 | 1 |
| **Risk** | ⭐ Low | ⭐ Low | ⭐ Low |
| **Bonuses** | - | Creator 2%<br/>Referral 1% | - |
| **Best For** | Personal savings | Saving with friends | Passive income |

---

## 🛠️ Tech Stack

<table>
<tr>
<td width="33%">

### **Frontend**
- ⚛️ React 18
- ⚡ Vite
- 🎨 TailwindCSS
- 🎭 Framer Motion
- 🔗 ethers.js v5

</td>
<td width="33%">

### **Backend**
- 🟢 Node.js
- 🚂 Express.js
- 🍃 MongoDB
- 🤖 Hugging Face AI
- 🔐 JWT Auth

</td>
<td width="33%">

### **Blockchain**
- 🔗 Solidity ^0.8.19
- ⛑️ Hardhat
- 🧪 OpenZeppelin
- 🌐 Celo (Alfajores)
- 📊 ethers.js

</td>
</tr>
</table>

---

## 📁 Project Structure

```
LoopFi/
├── 📱 frontend/                 # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── dashboard/     # Dashboard widgets
│   │   │   ├── layout/        # Navigation, sidebar
│   │   │   ├── ui/            # Buttons, cards, inputs
│   │   │   └── wallet/        # Wallet integration
│   │   ├── pages/             # Page components
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── GoalsPage.jsx
│   │   │   ├── EarnPage.jsx
│   │   │   └── ...
│   │   ├── services/          # API & blockchain services
│   │   │   ├── api.js
│   │   │   ├── celoWalletService.js
│   │   │   └── contractInteraction.service.js
│   │   ├── hooks/             # Custom React hooks
│   │   ├── context/           # React context providers
│   │   └── utils/             # Helper functions
│   └── package.json
│
├── 🔧 backend/                  # Node.js backend
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   │   ├── defi-ai.service.js
│   │   │   ├── goal.service.js
│   │   │   ├── group.service.js
│   │   │   └── celo.service.js
│   │   └── middleware/        # Express middleware
│   └── package.json
│
├── 📜 contracts/                # Smart contracts
│   ├── contracts/
│   │   ├── SavingsGoal.sol    # Personal savings
│   │   ├── GroupPool.sol      # Group savings
│   │   ├── StakingPool.sol    # CELO staking
│   │   ├── SavingsBadgeNFT.sol # NFT rewards
│   │   └── LoopFi.sol         # Main contract
│   ├── scripts/
│   │   └── deploy.js          # Deployment script
│   ├── test/                  # Contract tests
│   └── hardhat.config.js
│
└── 📚 docs/                     # Documentation
```

---

## 🚀 Quick Start

### Prerequisites

```bash
# Required
- Node.js v18+ 
- MongoDB
- MetaMask or Valora wallet
- CELO testnet tokens (get from faucet)
```

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/loopfi.git
cd loopfi
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
cp env.example .env

# Configure .env
MONGODB_URI=mongodb://localhost:27017/loopfi
PORT=4000
JWT_SECRET=your-secret-key

# Start backend
npm run dev
```

### 3️⃣ Setup Frontend

```bash
cd ../frontend
npm install
cp env.example .env.local

# Configure .env.local (use deployed addresses)
VITE_API_URL=http://localhost:4000/api
VITE_CELO_NETWORK=alfajores
VITE_SAVINGS_GOAL_CONTRACT=0xdAdc4B753D0B76147fe3b77623AC7f83783E3b62
VITE_GROUP_POOL_CONTRACT=0x74864Cb942cf73aFABc9633438c1Bb060d7FEa94
VITE_STAKING_POOL_CONTRACT=0xEb74C4f01EE73c8151509a7F89e201Acfcd7E2E6

# Start frontend
npm run dev
```

### 4️⃣ Get Testnet Tokens

```bash
# Visit Celo Faucet
https://faucet.celo.org/alfajores

# Enter your wallet address
# Receive testnet CELO & cUSD
```

### 5️⃣ Start Using!

**Option A: Use Live Deployment**
1. Visit [https://loo-pfi.vercel.app](https://loo-pfi.vercel.app)
2. Connect your wallet
3. Create your first savings goal
4. Watch your money grow! 💰

**Option B: Run Locally**
1. Open http://localhost:5173
2. Connect your wallet
3. Start saving!

---

## 🔐 Smart Contract Functions

### **SavingsGoal.sol**

```solidity
// Create a personal savings goal
function createGoal(
    uint256 targetAmount,
    uint256 lockDuration,
    bool useCUSD
) external

// Deposit to your goal
function deposit(uint256 amount, bool useCUSD) external

// Complete goal and withdraw
function completeGoal() external
```

### **GroupPool.sol**

```solidity
// Create a group pool
function createPool(
    string memory name,
    string memory description,
    uint256 targetAmount,
    uint256 maxMembers,
    uint256 lockDuration,
    bool useCUSD
) external

// Join a pool
function joinPool(
    uint256 poolId,
    uint256 amount,
    bool useCUSD,
    address referrer
) external

// Contribute to pool
function contributeToPool(
    uint256 poolId,
    uint256 amount,
    bool useCUSD
) external
```

### **StakingPool.sol**

```solidity
// Stake CELO
function stake(uint256 amount, bool useCUSD) external

// Unstake and claim rewards
function unstake(bool useCUSD) external

// Claim rewards without unstaking
function claimRewards() external

// Get pending rewards
function getPendingRewards(address user) external view returns (uint256)
```

---

## 🧪 Testing

### Run Smart Contract Tests

```bash
cd contracts
npx hardhat test

# With coverage
npx hardhat coverage
```

### Run Backend Tests

```bash
cd backend
npm test

# Watch mode
npm run test:watch
```

### Run Frontend Tests

```bash
cd frontend
npm test

# E2E tests
npm run test:e2e
```

---

## 📊 Key Metrics

<div align="center">

| Metric | Value |
|--------|-------|
| **Total Value Locked** | $0 (Launch Phase) |
| **Total Users** | 0 (Launch Phase) |
| **Goals Created** | 0 (Launch Phase) |
| **Pools Active** | 0 (Launch Phase) |
| **Rewards Paid** | 0 CELO (Launch Phase) |
| **Average APY** | 9.0% |

</div>

---

## 🎯 Roadmap

### ✅ **Phase 1: Foundation (Q4 2025) - COMPLETE**
- [x] Smart contract development
- [x] Frontend & backend development
- [x] Testnet deployment
- [x] Basic features (Goals, Pools, Staking)

### 🚧 **Phase 2: Enhancement (Q1 2026) - NEXT**
- [ ] Mainnet deployment
- [ ] Mobile app (React Native)
- [ ] Advanced AI advisor
- [ ] Multi-language support

### 📅 **Phase 3: Expansion (Q2 2026)**
- [ ] More DeFi integrations
- [ ] Yield farming strategies
- [ ] DAO governance
- [ ] Cross-chain support

### 🔮 **Phase 4: Scale (Q3 2026)**
- [ ] Institutional features
- [ ] White-label solution
- [ ] API for partners
- [ ] Global expansion

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. 🍴 Fork the repository
2. 🔧 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to branch (`git push origin feature/amazing-feature`)
5. 🎉 Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

<table>
<tr>
<td align="center">
<img src="https://github.com/Juggernaut7.png" width="100px;" alt=""/><br />
<sub><b>Juggernaut7</b></sub><br />
<sub>Founder & Lead Developer</sub><br />
<a href="https://github.com/Juggernaut7">@Juggernaut7</a>
</td>
</tr>
</table>

**Built with passion for the future of DeFi on Celo** 💚

---

## 🔗 Links

<div align="center">

[![Website](https://img.shields.io/badge/Website-loo--pfi.vercel.app-35D07F?style=for-the-badge)](https://loo-pfi.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend-loop--fi.onrender.com-339933?style=for-the-badge)](https://loop-fi.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-loop--fi-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Juggernaut7/loop-fi)
[![Celoscan](https://img.shields.io/badge/Celoscan-Contracts-35D07F?style=for-the-badge&logo=celo&logoColor=white)](https://alfajores.celoscan.io/)

</div>

---

## 💬 Support

Need help? We're here!

- 📧 **Email:** abdulkabir06000@gmail.com
- 🌐 **Website:** [loo-pfi.vercel.app](https://loo-pfi.vercel.app)
- 🔗 **GitHub:** [github.com/Juggernaut7/loop-fi](https://github.com/Juggernaut7/loop-fi)
- 📊 **Contracts:** [alfajores.celoscan.io](https://alfajores.celoscan.io/)

---

## ⚠️ Disclaimer

**Important:** LoopFi is currently in **TESTNET** phase. Do not use real funds. Always:
- ✅ Use Alfajores testnet
- ✅ Test with small amounts first
- ✅ Understand smart contract risks
- ✅ Do your own research (DYOR)

**Audits:** Smart contracts are currently **unaudited**. Mainnet launch will include professional audits.

---

## 🙏 Acknowledgments

- [Celo Foundation](https://celo.org/) - For the amazing blockchain
- [OpenZeppelin](https://openzeppelin.com/) - For secure contract libraries
- [Hardhat](https://hardhat.org/) - For development tools
- [React](https://react.dev/) - For the UI framework
- All our amazing contributors! 💚

---

<div align="center">

### 💚 Built with love on Celo 💚

**Made possible by the Celo community**

[⬆ Back to Top](#-loopfi---your-money-growing-247)

---

**Star ⭐ this repo if you find it helpful!**

</div>
