const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 Starting LoopFi deployment...");
  
  // Debug: Check if private key is loaded
  console.log("Private key loaded:", process.env.PRIVATE_KEY ? "Yes" : "No");
  console.log("Private key length:", process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.length : 0);
  console.log("Network:", hre.network.name);
  
  // Try to get provider info
  const provider = hre.ethers.provider;
  console.log("Provider URL:", provider.connection?.url || "Local");
  
  // Get the deployer account
  const signers = await hre.ethers.getSigners();
  console.log("Number of signers found:", signers.length);
  
  const [deployer] = signers;
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.utils.formatEther(balance), "CELO");

  // Get configuration from environment variables
  const network = hre.network.name;
  const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS || deployer.address;

  // Token addresses based on network
  let CELO_TOKEN_ADDRESS, CUSD_TOKEN_ADDRESS;
  
  if (network === "alfajores") {
    // Alfajores Testnet addresses
    CELO_TOKEN_ADDRESS = process.env.CELO_TOKEN_ADDRESS || "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9";
    CUSD_TOKEN_ADDRESS = process.env.CUSD_TOKEN_ADDRESS || "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
  } else if (network === "sepolia") {
    // Sepolia Testnet addresses (placeholder - need to find correct addresses)
    CELO_TOKEN_ADDRESS = process.env.CELO_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000"; // Placeholder
    CUSD_TOKEN_ADDRESS = process.env.CUSD_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000"; // Placeholder
  } else {
    // Celo Mainnet addresses
    CELO_TOKEN_ADDRESS = process.env.CELO_TOKEN_ADDRESS || "0x471EcE3750Da237f93B8E339c536989b8978a438";
    CUSD_TOKEN_ADDRESS = process.env.CUSD_TOKEN_ADDRESS || "0x765DE816845861e75A25fCA122bb6898B8B1282a";
  }

  console.log("\n📋 Deployment Configuration:");
  console.log("Network:", network);
  console.log("CELO Token:", CELO_TOKEN_ADDRESS);
  console.log("cUSD Token:", CUSD_TOKEN_ADDRESS);
  console.log("Treasury:", TREASURY_ADDRESS);

  try {
    // Deploy SavingsGoal contract
    console.log("\n🔨 Deploying SavingsGoal contract...");
    const SavingsGoal = await hre.ethers.getContractFactory("SavingsGoal");
    const savingsGoal = await SavingsGoal.deploy(
      CELO_TOKEN_ADDRESS,
      CUSD_TOKEN_ADDRESS,
      TREASURY_ADDRESS
    );
    await savingsGoal.deployed();
    console.log("✅ SavingsGoal deployed to:", savingsGoal.address);

    // Deploy GroupPool contract
    console.log("\n🔨 Deploying GroupPool contract...");
    const GroupPool = await hre.ethers.getContractFactory("GroupPool");
    const groupPool = await GroupPool.deploy(
      CELO_TOKEN_ADDRESS,
      CUSD_TOKEN_ADDRESS,
      TREASURY_ADDRESS
    );
    await groupPool.deployed();
    console.log("✅ GroupPool deployed to:", groupPool.address);

    // Deploy SavingsBadgeNFT contract
    console.log("\n🔨 Deploying SavingsBadgeNFT contract...");
    const SavingsBadgeNFT = await hre.ethers.getContractFactory("SavingsBadgeNFT");
    const badgeNFT = await SavingsBadgeNFT.deploy();
    await badgeNFT.deployed();
    console.log("✅ SavingsBadgeNFT deployed to:", badgeNFT.address);

    // Deploy main LoopFi contract
    console.log("\n🔨 Deploying main LoopFi contract...");
    const LoopFi = await hre.ethers.getContractFactory("LoopFi");
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

    // Save deployment info to file
    const deploymentInfo = {
      network: hre.network.name,
      timestamp: new Date().toISOString(),
      deployer: deployer.address,
      contracts: {
        SavingsGoal: savingsGoal.address,
        GroupPool: groupPool.address,
        SavingsBadgeNFT: badgeNFT.address,
        LoopFi: loopFi.address,
      },
      tokens: {
        CELO: CELO_TOKEN_ADDRESS,
        cUSD: CUSD_TOKEN_ADDRESS,
      },
      treasury: TREASURY_ADDRESS,
    };

    const fs = require("fs");
    const filename = `deployment-${hre.network.name}-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n📄 Deployment info saved to: ${filename}`);

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

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
