const { ethers } = require("hardhat");

async function checkBalance() {
  console.log("🔍 Checking wallet balance on Alfajores testnet...\n");
  
  try {
    const [deployer] = await ethers.getSigners();
    console.log("Wallet Address:", deployer.address);
    
    const balance = await deployer.getBalance();
    const balanceInCELO = ethers.utils.formatEther(balance);
    
    console.log("Balance:", balanceInCELO, "CELO");
    console.log("Balance (Wei):", balance.toString());
    
    if (balance.eq(0)) {
      console.log("\n⚠️  Your wallet has no CELO tokens!");
      console.log("📝 To get testnet tokens:");
      console.log("1. Go to https://faucet.celo.org");
      console.log("2. Connect your wallet");
      console.log("3. Request testnet CELO and cUSD");
      console.log("4. Wait for tokens to arrive");
    } else {
      console.log("\n✅ You have CELO tokens! Ready to deploy.");
    }
    
  } catch (error) {
    console.error("❌ Error checking balance:", error.message);
  }
}

checkBalance();
