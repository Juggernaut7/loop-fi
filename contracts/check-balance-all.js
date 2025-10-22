const hre = require("hardhat");
require("dotenv").config();

async function checkBalance() {
  console.log("🔍 Checking wallet balance on different networks...\n");
  
  const address = "0xF39cE20c6A905157cF532890ed87b86f422774b7";
  console.log("Wallet Address:", address);
  
  // Check Alfajores
  try {
    console.log("\n📡 Checking Alfajores testnet...");
    const alfajoresProvider = new hre.ethers.providers.JsonRpcProvider("https://alfajores-forno.celo-testnet.org");
    const alfajoresBalance = await alfajoresProvider.getBalance(address);
    console.log("Alfajores Balance:", hre.ethers.utils.formatEther(alfajoresBalance), "CELO");
  } catch (error) {
    console.log("Alfajores Error:", error.message);
  }
  
  // Check Sepolia
  try {
    console.log("\n📡 Checking Sepolia testnet...");
    const sepoliaProvider = new hre.ethers.providers.JsonRpcProvider("https://sepolia-forno.celo-testnet.org");
    const sepoliaBalance = await sepoliaProvider.getBalance(address);
    console.log("Sepolia Balance:", hre.ethers.utils.formatEther(sepoliaBalance), "CELO");
  } catch (error) {
    console.log("Sepolia Error:", error.message);
  }
  
  // Check Mainnet (just for comparison)
  try {
    console.log("\n📡 Checking Celo mainnet...");
    const mainnetProvider = new hre.ethers.providers.JsonRpcProvider("https://forno.celo.org");
    const mainnetBalance = await mainnetProvider.getBalance(address);
    console.log("Mainnet Balance:", hre.ethers.utils.formatEther(mainnetBalance), "CELO");
  } catch (error) {
    console.log("Mainnet Error:", error.message);
  }
}

checkBalance();
