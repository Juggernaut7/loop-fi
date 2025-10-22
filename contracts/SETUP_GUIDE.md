# 🔑 LoopFi Environment Setup Guide

## Quick Setup Checklist

### ✅ Step 1: Get Your Private Key
1. **Open MetaMask**
2. **Click the three dots menu** (top right)
3. **Go to "Account Details"**
4. **Click "Export Private Key"**
5. **Enter your password**
6. **Copy the private key** (starts with 0x)

### ✅ Step 2: Get CeloScan API Key (Optional)
1. **Go to [celoscan.io](https://celoscan.io)**
2. **Sign in or register**
3. **Go to "API Keys" section**
4. **Create a new API key**
5. **Copy the API key**

### ✅ Step 3: Set Up Environment Files

#### For Contracts (contracts/.env):
```bash
# Copy the example file
cp contracts/env.example contracts/.env

# Edit the .env file with your values
PRIVATE_KEY=your_private_key_without_0x_prefix
TREASURY_ADDRESS=your_wallet_address
CELOSCAN_API_KEY=your_celoscan_api_key
```

#### For Frontend (frontend/.env.local):
```bash
# Copy the example file
cp frontend/env.example frontend/.env.local

# Edit the .env.local file
VITE_API_URL=http://localhost:4000
VITE_CELO_NETWORK=alfajores
```

#### For Backend (backend/.env):
```bash
# Copy the example file
cp backend/env.example backend/.env

# Edit the .env file
MONGODB_URI=mongodb://localhost:27017/loopfi
JWT_SECRET=your_random_jwt_secret
```

## 🔐 Security Best Practices

### ⚠️ Important Security Notes:

1. **Never commit .env files to git**
2. **Use a dedicated wallet for deployment**
3. **Keep your private key secure**
4. **Use different keys for testnet and mainnet**

### 🛡️ Safe Private Key Handling:

```bash
# Option 1: Use environment variables
export PRIVATE_KEY=your_private_key

# Option 2: Use a .env file (recommended)
echo "PRIVATE_KEY=your_private_key" > contracts/.env

# Option 3: Use a hardware wallet (most secure)
# Connect your Ledger/Trezor for deployment
```

## 🌐 Network Configuration

### Alfajores Testnet (Recommended for testing):
- **Network Name:** Alfajores
- **RPC URL:** https://alfajores-forno.celo-testnet.org
- **Chain ID:** 44787
- **Currency Symbol:** CELO
- **Block Explorer:** https://alfajores.celoscan.io

### Celo Mainnet (For production):
- **Network Name:** Celo
- **RPC URL:** https://forno.celo.org
- **Chain ID:** 42220
- **Currency Symbol:** CELO
- **Block Explorer:** https://celoscan.io

## 💰 Getting Testnet Tokens

### For Alfajores Testnet:
1. **Go to [Celo Faucet](https://faucet.celo.org)**
2. **Connect your wallet**
3. **Request testnet CELO and cUSD**
4. **Wait for tokens to arrive**

### Alternative Faucets:
- [Celo Testnet Faucet](https://testnet.celo.org/faucet)
- [Discord Faucet](https://discord.gg/celo)

## 🚀 Deployment Commands

### Deploy to Testnet:
```bash
cd contracts
npm run deploy:alfajores
```

### Deploy to Mainnet:
```bash
cd contracts
npm run deploy:celo
```

### Verify Contracts:
```bash
cd contracts
npm run verify:alfajores
```

## 🔧 Troubleshooting

### Common Issues:

1. **"Invalid private key"**
   - Make sure you removed the 0x prefix
   - Check for extra spaces or characters

2. **"Insufficient funds"**
   - Get testnet tokens from faucet
   - Check your wallet balance

3. **"Network error"**
   - Check your RPC URL
   - Verify network configuration

4. **"Contract verification failed"**
   - Check your CeloScan API key
   - Verify contract addresses

## 📋 Pre-Deployment Checklist

- [ ] Private key configured
- [ ] Treasury address set
- [ ] Testnet tokens available
- [ ] CeloScan API key (optional)
- [ ] Environment files created
- [ ] Contracts compiled successfully
- [ ] Tests passing

## 🎯 Next Steps After Setup

1. **Deploy contracts to testnet**
2. **Update frontend with contract addresses**
3. **Test all functionality**
4. **Deploy to mainnet (when ready)**

---

**Need help?** Check the [LoopFi Documentation](https://docs.loopfi.app) or join our [Discord](https://discord.gg/loopfi)!
