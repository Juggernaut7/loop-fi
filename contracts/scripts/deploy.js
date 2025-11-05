const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 Starting LoopFi deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Get configuration from environment variables
  const network = hre.network.name;
  const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS || deployer.address;

  // Token addresses based on network
  let CELO_TOKEN_ADDRESS, CUSD_TOKEN_ADDRESS;
  
  if (network === "celo_alfajores" || network === "alfajores") {
    // Alfajores Testnet addresses
    CELO_TOKEN_ADDRESS = process.env.CELO_TOKEN_ADDRESS || "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9";
    CUSD_TOKEN_ADDRESS = process.env.CUSD_TOKEN_ADDRESS || "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
  } else if (network === "sepolia") {
    // Sepolia: If token addresses are provided via env, use them; otherwise deploy mock ERC20 tokens for CELO and cUSD
    CELO_TOKEN_ADDRESS = process.env.CELO_TOKEN_ADDRESS || null;
    CUSD_TOKEN_ADDRESS = process.env.CUSD_TOKEN_ADDRESS || null;
    if (!CELO_TOKEN_ADDRESS || !CUSD_TOKEN_ADDRESS) {
      console.log('🔧 No token addresses provided for Sepolia; will deploy mock ERC20 tokens.');
      const MockERC20 = await ethers.getContractFactory('MockERC20');
      const mockCelo = await MockERC20.deploy('Mock CELO', 'mCELO');
      await mockCelo.deployed();
      console.log('✅ Mock CELO deployed at:', mockCelo.address);

      const mockCUSD = await MockERC20.deploy('Mock cUSD', 'mcUSD');
      await mockCUSD.deployed();
      console.log('✅ Mock cUSD deployed at:', mockCUSD.address);

      // Mint some tokens to the deployer for testing
      const mintAmount = ethers.utils.parseEther('1000000'); // 1,000,000 tokens
      await mockCelo.mint(deployer.address, mintAmount);
      await mockCUSD.mint(deployer.address, mintAmount);

      CELO_TOKEN_ADDRESS = mockCelo.address;
      CUSD_TOKEN_ADDRESS = mockCUSD.address;
    }
  } else {
    // Celo Mainnet addresses
    CELO_TOKEN_ADDRESS = process.env.CELO_TOKEN_ADDRESS || "0x471EcE3750Da237f93B8E339c536989b8978a438";
    CUSD_TOKEN_ADDRESS = process.env.CUSD_TOKEN_ADDRESS || "0x765DE816845861e75A25fCA122bb6898B8B1282a";
  }

  console.log("\n📋 Deployment Configuration:");
  console.log("CELO Token:", CELO_TOKEN_ADDRESS);
  console.log("cUSD Token:", CUSD_TOKEN_ADDRESS);
  console.log("Treasury:", TREASURY_ADDRESS);

  try {
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

    // Deploy StakingPool contract
    console.log("\n🔨 Deploying StakingPool contract...");
    const StakingPool = await ethers.getContractFactory("StakingPool");
    const stakingPool = await StakingPool.deploy(
      CELO_TOKEN_ADDRESS,
      CUSD_TOKEN_ADDRESS,
      TREASURY_ADDRESS
    );
    await stakingPool.deployed();
    console.log("✅ StakingPool deployed to:", stakingPool.address);

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

    // Verify contracts (optional - requires API keys)
    console.log("\n🔍 Verifying contracts...");
    try {
      await hre.run("verify:verify", {
        address: savingsGoal.address,
        constructorArguments: [CELO_TOKEN_ADDRESS, CUSD_TOKEN_ADDRESS, TREASURY_ADDRESS],
      });
      console.log("✅ SavingsGoal verified");
    } catch (error) {
      console.log("⚠️ SavingsGoal verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: groupPool.address,
        constructorArguments: [CELO_TOKEN_ADDRESS, CUSD_TOKEN_ADDRESS, TREASURY_ADDRESS],
      });
      console.log("✅ GroupPool verified");
    } catch (error) {
      console.log("⚠️ GroupPool verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: badgeNFT.address,
        constructorArguments: [],
      });
      console.log("✅ SavingsBadgeNFT verified");
    } catch (error) {
      console.log("⚠️ SavingsBadgeNFT verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: loopFi.address,
        constructorArguments: [CELO_TOKEN_ADDRESS, CUSD_TOKEN_ADDRESS, TREASURY_ADDRESS],
      });
      console.log("✅ LoopFi verified");
    } catch (error) {
      console.log("⚠️ LoopFi verification failed:", error.message);
    }

    // Print deployment summary
    console.log("\n🎉 Deployment Summary:");
    console.log("=====================================");
    console.log("SavingsGoal:", savingsGoal.address);
    console.log("GroupPool:", groupPool.address);
    console.log("StakingPool:", stakingPool.address);
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
        StakingPool: stakingPool.address,
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

    // Test basic functionality
    console.log("\n🧪 Testing basic functionality...");
    
    // Test user registration
    const registrationFee = await loopFi.REGISTRATION_FEE();
    console.log("Registration fee:", ethers.utils.formatEther(registrationFee), "CELO");
    
    // Test getting stats
    const stats = await loopFi.getStats();
    console.log("Total users:", stats.totalUsers.toString());
    console.log("Total volume:", ethers.utils.formatEther(stats.totalVolume), "CELO");

    console.log("\n✅ Deployment completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("1. Update frontend with contract addresses");
    console.log("2. Test contract interactions");
    console.log("3. Deploy to mainnet when ready");

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
