const hre = require("hardhat");
require("dotenv").config();

async function testConnection() {
  console.log("🔍 Testing network connection...");
  
  console.log("Private key loaded:", process.env.PRIVATE_KEY ? "Yes" : "No");
  console.log("Private key length:", process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.length : 0);
  
  // Check network config
  const networkConfig = hre.config.networks.alfajores;
  console.log("Network config:", {
    url: networkConfig.url,
    chainId: networkConfig.chainId,
    accountsCount: networkConfig.accounts ? networkConfig.accounts.length : 0
  });
  
  // Try to get provider
  const provider = hre.ethers.provider;
  console.log("Provider URL:", provider.connection?.url || "Unknown");
  
  // Try to get network info
  try {
    const network = await provider.getNetwork();
    console.log("Connected network:", {
      name: network.name,
      chainId: network.chainId.toString()
    });
  } catch (error) {
    console.log("Error getting network info:", error.message);
  }
  
  // Try to get signers
  try {
    const signers = await hre.ethers.getSigners();
    console.log("Number of signers:", signers.length);
    
    if (signers.length > 0) {
      const [deployer] = signers;
      console.log("Deployer address:", deployer.address);
      
      const balance = await deployer.getBalance();
      console.log("Balance:", hre.ethers.utils.formatEther(balance), "CELO");
    }
  } catch (error) {
    console.log("Error getting signers:", error.message);
  }
}

testConnection();
