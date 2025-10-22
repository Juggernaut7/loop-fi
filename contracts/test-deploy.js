const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Testing deployment to Alfajores testnet...\n");
  
  try {
    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    
    // Check balance
    const balance = await deployer.getBalance();
    const balanceInCELO = ethers.utils.formatEther(balance);
    console.log("Account balance:", balanceInCELO, "CELO");
    
    if (balance.eq(0)) {
      console.log("\n⚠️  Your wallet has no CELO tokens!");
      console.log("📝 To get testnet tokens:");
      console.log("1. Go to https://faucet.celo.org");
      console.log("2. Connect your wallet");
      console.log("3. Request testnet CELO and cUSD");
      console.log("4. Wait for tokens to arrive");
      console.log("\n🔄 After getting tokens, run: npm run deploy:alfajores");
      return;
    }
    
    console.log("\n✅ You have CELO tokens! Proceeding with deployment...\n");
    
    // Get configuration from environment variables
    const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS || deployer.address;
    
    // Token addresses for Alfajores testnet
    const CELO_TOKEN_ADDRESS = "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9";
    const CUSD_TOKEN_ADDRESS = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
    
    console.log("📋 Deployment Configuration:");
    console.log("CELO Token:", CELO_TOKEN_ADDRESS);
    console.log("cUSD Token:", CUSD_TOKEN_ADDRESS);
    console.log("Treasury:", TREASURY_ADDRESS);
    
    // Deploy SavingsGoal contract
    console.log("\n🔨 Deploying SavingsGoal contract...");
    const SavingsGoal = await ethers.getContractFactory("SavingsGoal");
    const savingsGoal = await SavingsGoal.deploy(
      CELO_TOKEN_ADDRESS,
      CUSD_TOKEN_ADDRESS,
      TREASURY_ADDRESS
    );
    await savingsGoal.deployed();
    console.log("✅ SavingsGoal deployed to:", savingsGoal.address);
    
    // Deploy GroupPool contract
    console.log("\n🔨 Deploying GroupPool contract...");
    const GroupPool = await ethers.getContractFactory("GroupPool");
    const groupPool = await GroupPool.deploy(
      CELO_TOKEN_ADDRESS,
      CUSD_TOKEN_ADDRESS,
      TREASURY_ADDRESS
    );
    await groupPool.deployed();
    console.log("✅ GroupPool deployed to:", groupPool.address);
    
    // Deploy SavingsBadgeNFT contract
    console.log("\n🔨 Deploying SavingsBadgeNFT contract...");
    const SavingsBadgeNFT = await ethers.getContractFactory("SavingsBadgeNFT");
    const badgeNFT = await SavingsBadgeNFT.deploy();
    await badgeNFT.deployed();
    console.log("✅ SavingsBadgeNFT deployed to:", badgeNFT.address);
    
    // Deploy main LoopFi contract
    console.log("\n🔨 Deploying main LoopFi contract...");
    const LoopFi = await ethers.getContractFactory("LoopFi");
    const loopFi = await LoopFi.deploy(
      CELO_TOKEN_ADDRESS,
      CUSD_TOKEN_ADDRESS,
      TREASURY_ADDRESS
    );
    await loopFi.deployed();
    console.log("✅ LoopFi deployed to:", loopFi.address);
    
    // Print deployment summary
    console.log("\n🎉 Deployment Summary:");
    console.log("=====================================");
    console.log("SavingsGoal:", savingsGoal.address);
    console.log("GroupPool:", groupPool.address);
    console.log("SavingsBadgeNFT:", badgeNFT.address);
    console.log("LoopFi (Main):", loopFi.address);
    console.log("=====================================");
    
    console.log("\n✅ Deployment completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("1. Update frontend with contract addresses");
    console.log("2. Test contract interactions");
    console.log("3. Deploy to mainnet when ready");
    
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.log("\n💰 You need testnet tokens!");
      console.log("📝 To get testnet tokens:");
      console.log("1. Go to https://faucet.celo.org");
      console.log("2. Connect your wallet");
      console.log("3. Request testnet CELO and cUSD");
      console.log("4. Wait for tokens to arrive");
    }
  }
}

main();
