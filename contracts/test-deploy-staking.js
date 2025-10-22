const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 Deploying StakingPool contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "CELO");

  const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS || deployer.address;
  
  // Alfajores testnet addresses
  const CELO_TOKEN_ADDRESS = process.env.CELO_TOKEN_ADDRESS || "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9";
  const CUSD_TOKEN_ADDRESS = process.env.CUSD_TOKEN_ADDRESS || "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

  console.log("\nConfiguration:");
  console.log("CELO Token:", CELO_TOKEN_ADDRESS);
  console.log("cUSD Token:", CUSD_TOKEN_ADDRESS);
  console.log("Treasury:", TREASURY_ADDRESS);

  // Deploy StakingPool
  const StakingPool = await ethers.getContractFactory("StakingPool");
  const stakingPool = await StakingPool.deploy(
    CELO_TOKEN_ADDRESS,
    CUSD_TOKEN_ADDRESS,
    TREASURY_ADDRESS
  );
  await stakingPool.deployed();

  console.log("\n✅ StakingPool deployed to:", stakingPool.address);

  // Get initial stats
  const stats = await stakingPool.getPoolStats();
  console.log("\nPool Stats:");
  console.log("Total Staked:", ethers.utils.formatEther(stats._totalStaked), "CELO");
  console.log("Total Stakers:", stats._totalStakers.toString());
  console.log("Reward Rate:", stats._rewardRate.toString(), "basis points (", stats._rewardRate / 100, "%)");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    StakingPool: stakingPool.address,
    CELO_TOKEN: CELO_TOKEN_ADDRESS,
    CUSD_TOKEN: CUSD_TOKEN_ADDRESS,
    TREASURY: TREASURY_ADDRESS
  };

  const fs = require("fs");
  fs.writeFileSync(
    `staking-deployment-${Date.now()}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n✅ Deployment complete!");
  console.log("\nUpdate your .env with:");
  console.log(`VITE_CONTRACT_ADDRESS_STAKING_POOL="${stakingPool.address}"`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

