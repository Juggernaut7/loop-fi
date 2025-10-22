#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 LoopFi Environment Setup Helper\n');

// Check if .env files exist
const envFiles = [
  { path: 'contracts/.env', example: 'contracts/env.example' },
  { path: 'frontend/.env.local', example: 'frontend/env.example' },
  { path: 'backend/.env', example: 'backend/env.example' }
];

console.log('📋 Checking environment files...\n');

envFiles.forEach(({ path: envPath, example }) => {
  if (fs.existsSync(envPath)) {
    console.log(`✅ ${envPath} exists`);
  } else {
    console.log(`❌ ${envPath} missing`);
    if (fs.existsSync(example)) {
      console.log(`   💡 Copy ${example} to ${envPath} and fill in your values`);
    }
  }
});

console.log('\n🔑 Required Environment Variables:\n');

console.log('1. PRIVATE_KEY (contracts/.env)');
console.log('   - Get from MetaMask: Account Details > Export Private Key');
console.log('   - Remove the 0x prefix');
console.log('   - Example: abc123def456...\n');

console.log('2. TREASURY_ADDRESS (contracts/.env)');
console.log('   - Use your wallet address or create a dedicated treasury wallet');
console.log('   - Example: 0x1234567890123456789012345678901234567890\n');

console.log('3. CELOSCAN_API_KEY (contracts/.env) - Optional');
console.log('   - Get from https://celoscan.io/apis');
console.log('   - Used for contract verification\n');

console.log('4. MONGODB_URI (backend/.env)');
console.log('   - MongoDB connection string');
console.log('   - Example: mongodb://localhost:27017/loopfi\n');

console.log('5. JWT_SECRET (backend/.env)');
console.log('   - Random string for JWT authentication');
console.log('   - Example: your-super-secret-jwt-key\n');

console.log('🌐 Network Configuration:\n');
console.log('For Alfajores Testnet (recommended for testing):');
console.log('- Network: alfajores');
console.log('- RPC: https://alfajores-forno.celo-testnet.org');
console.log('- Chain ID: 44787');
console.log('- Explorer: https://alfajores.celoscan.io\n');

console.log('For Celo Mainnet (production):');
console.log('- Network: celo');
console.log('- RPC: https://forno.celo.org');
console.log('- Chain ID: 42220');
console.log('- Explorer: https://celoscan.io\n');

console.log('💰 Getting Testnet Tokens:\n');
console.log('1. Go to https://faucet.celo.org');
console.log('2. Connect your wallet');
console.log('3. Request testnet CELO and cUSD');
console.log('4. Wait for tokens to arrive\n');

console.log('🚀 Next Steps:\n');
console.log('1. Set up your environment files');
console.log('2. Get testnet tokens from faucet');
console.log('3. Run: npm run deploy:alfajores');
console.log('4. Update frontend with contract addresses');
console.log('5. Test the application\n');

console.log('📚 For detailed instructions, see:');
console.log('- contracts/SETUP_GUIDE.md');
console.log('- contracts/README.md\n');

console.log('🆘 Need help?');
console.log('- Discord: https://discord.gg/loopfi');
console.log('- Docs: https://docs.loopfi.app');
console.log('- GitHub: https://github.com/yourusername/loopfi\n');
