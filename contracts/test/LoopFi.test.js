const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LoopFi Contracts", function () {
  let loopFi, savingsGoal, groupPool, badgeNFT;
  let owner, user1, user2, user3, treasury;
  let celoToken, cusdToken;

  beforeEach(async function () {
    [owner, user1, user2, user3, treasury] = await ethers.getSigners();

    // Deploy mock ERC20 tokens for testing
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    celoToken = await MockERC20.deploy("CELO", "CELO");
    cusdToken = await MockERC20.deploy("cUSD", "cUSD");

    // Deploy LoopFi contracts
    const LoopFi = await ethers.getContractFactory("LoopFi");
    loopFi = await LoopFi.deploy(celoToken.address, cusdToken.address, treasury.address);
    await loopFi.deployed();

    // Get child contract addresses
    savingsGoal = await ethers.getContractAt("SavingsGoal", await loopFi.savingsGoalContract());
    groupPool = await ethers.getContractAt("GroupPool", await loopFi.groupPoolContract());
    badgeNFT = await ethers.getContractAt("SavingsBadgeNFT", await loopFi.badgeNFTContract());

    // Mint tokens to users for testing
    await celoToken.mint(user1.address, ethers.utils.parseEther("100"));
    await celoToken.mint(user2.address, ethers.utils.parseEther("100"));
    await celoToken.mint(user3.address, ethers.utils.parseEther("100"));
    
    await cusdToken.mint(user1.address, ethers.utils.parseEther("100"));
    await cusdToken.mint(user2.address, ethers.utils.parseEther("100"));
    await cusdToken.mint(user3.address, ethers.utils.parseEther("100"));

    // Approve tokens for contracts
    await celoToken.connect(user1).approve(savingsGoal.address, ethers.utils.parseEther("100"));
    await celoToken.connect(user2).approve(savingsGoal.address, ethers.utils.parseEther("100"));
    await celoToken.connect(user3).approve(savingsGoal.address, ethers.utils.parseEther("100"));
    
    await celoToken.connect(user1).approve(groupPool.address, ethers.utils.parseEther("100"));
    await celoToken.connect(user2).approve(groupPool.address, ethers.utils.parseEther("100"));
    await celoToken.connect(user3).approve(groupPool.address, ethers.utils.parseEther("100"));
  });

  describe("User Registration", function () {
    it("Should allow users to register", async function () {
      const registrationFee = await loopFi.REGISTRATION_FEE();
      
      await expect(loopFi.connect(user1).registerUser("alice", { value: registrationFee }))
        .to.emit(loopFi, "UserRegistered")
        .withArgs(user1.address, "alice");

      const profile = await loopFi.getUserProfile(user1.address);
      expect(profile.username).to.equal("alice");
      expect(profile.isRegistered).to.be.true;
    });

    it("Should reject registration without fee", async function () {
      await expect(loopFi.connect(user1).registerUser("alice"))
        .to.be.revertedWith("LoopFi: Insufficient registration fee");
    });

    it("Should reject duplicate registration", async function () {
      const registrationFee = await loopFi.REGISTRATION_FEE();
      
      await loopFi.connect(user1).registerUser("alice", { value: registrationFee });
      
      await expect(loopFi.connect(user1).registerUser("alice2", { value: registrationFee }))
        .to.be.revertedWith("LoopFi: User already registered");
    });
  });

  describe("Savings Goals", function () {
    beforeEach(async function () {
      const registrationFee = await loopFi.REGISTRATION_FEE();
      await loopFi.connect(user1).registerUser("alice", { value: registrationFee });
    });

    it("Should create savings goal", async function () {
      const targetAmount = ethers.utils.parseEther("10");
      const lockDuration = 30 * 24 * 60 * 60; // 30 days

      await expect(loopFi.connect(user1).createSavingsGoal(targetAmount, lockDuration, false))
        .to.emit(savingsGoal, "GoalCreated")
        .withArgs(user1.address, targetAmount, lockDuration);

      const goal = await savingsGoal.getGoal(user1.address);
      expect(goal.targetAmount).to.equal(targetAmount);
      expect(goal.lockDuration).to.equal(lockDuration);
      expect(goal.isActive).to.be.true;
    });

    it("Should allow deposits to savings goal", async function () {
      const targetAmount = ethers.utils.parseEther("10");
      const lockDuration = 30 * 24 * 60 * 60; // 30 days
      const depositAmount = ethers.utils.parseEther("5");

      await loopFi.connect(user1).createSavingsGoal(targetAmount, lockDuration, false);
      
      await expect(loopFi.connect(user1).depositToGoal(depositAmount, false))
        .to.emit(savingsGoal, "DepositMade")
        .withArgs(user1.address, depositAmount, depositAmount);

      const goal = await savingsGoal.getGoal(user1.address);
      expect(goal.currentAmount).to.equal(depositAmount);
    });

    it("Should reject deposits exceeding target", async function () {
      const targetAmount = ethers.utils.parseEther("10");
      const lockDuration = 30 * 24 * 60 * 60; // 30 days
      const depositAmount = ethers.utils.parseEther("15");

      await loopFi.connect(user1).createSavingsGoal(targetAmount, lockDuration, false);
      
      await expect(loopFi.connect(user1).depositToGoal(depositAmount, false))
        .to.be.revertedWith("SavingsGoal: Exceeds target amount");
    });
  });

  describe("Group Pools", function () {
    beforeEach(async function () {
      const registrationFee = await loopFi.REGISTRATION_FEE();
      await loopFi.connect(user1).registerUser("alice", { value: registrationFee });
      await loopFi.connect(user2).registerUser("bob", { value: registrationFee });
      await loopFi.connect(user3).registerUser("charlie", { value: registrationFee });
    });

    it("Should create group pool", async function () {
      const targetAmount = ethers.utils.parseEther("100");
      const maxMembers = 5;
      const lockDuration = 60 * 24 * 60 * 60; // 60 days

      await expect(loopFi.connect(user1).createGroupPool(
        "Vacation Fund",
        "Saving for summer vacation",
        targetAmount,
        maxMembers,
        lockDuration,
        false
      )).to.emit(groupPool, "PoolCreated")
        .withArgs(1, user1.address, "Vacation Fund", targetAmount, maxMembers, lockDuration);

      const pool = await groupPool.getPool(1);
      expect(pool.name).to.equal("Vacation Fund");
      expect(pool.targetAmount).to.equal(targetAmount);
      expect(pool.maxMembers).to.equal(maxMembers);
    });

    it("Should allow users to join group pool", async function () {
      const targetAmount = ethers.utils.parseEther("100");
      const maxMembers = 5;
      const lockDuration = 60 * 24 * 60 * 60; // 60 days
      const contributionAmount = ethers.utils.parseEther("20");

      await loopFi.connect(user1).createGroupPool(
        "Vacation Fund",
        "Saving for summer vacation",
        targetAmount,
        maxMembers,
        lockDuration,
        false
      );

      await expect(loopFi.connect(user2).joinGroupPool(1, contributionAmount, false, ethers.constants.AddressZero))
        .to.emit(groupPool, "MemberJoined")
        .withArgs(1, user2.address, contributionAmount);

      const pool = await groupPool.getPool(1);
      expect(pool.currentMembers).to.equal(1);
      expect(pool.currentAmount).to.equal(contributionAmount);
    });

    it("Should handle referral bonuses", async function () {
      const targetAmount = ethers.utils.parseEther("100");
      const maxMembers = 5;
      const lockDuration = 60 * 24 * 60 * 60; // 60 days
      const contributionAmount = ethers.utils.parseEther("20");

      await loopFi.connect(user1).createGroupPool(
        "Vacation Fund",
        "Saving for summer vacation",
        targetAmount,
        maxMembers,
        lockDuration,
        false
      );

      // User1 joins first
      await loopFi.connect(user1).joinGroupPool(1, contributionAmount, false, ethers.constants.AddressZero);

      // User2 joins with user1 as referrer
      const balanceBefore = await celoToken.balanceOf(user1.address);
      
      await expect(loopFi.connect(user2).joinGroupPool(1, contributionAmount, false, user1.address))
        .to.emit(groupPool, "ReferralBonusPaid")
        .withArgs(1, user1.address, contributionAmount.div(100)); // 1% bonus

      const balanceAfter = await celoToken.balanceOf(user1.address);
      expect(balanceAfter).to.be.gt(balanceBefore);
    });
  });

  describe("NFT Badges", function () {
    beforeEach(async function () {
      const registrationFee = await loopFi.REGISTRATION_FEE();
      await loopFi.connect(user1).registerUser("alice", { value: registrationFee });
    });

    it("Should award badges", async function () {
      await expect(loopFi.awardBadge(
        user1.address,
        1, // STARTER badge
        1, // milestone
        "https://api.loopfi.app/badges/starter.json"
      )).to.emit(loopFi, "BadgeAwarded")
        .withArgs(user1.address, 1, 1);

      const badges = await loopFi.getUserBadges(user1.address);
      expect(badges.length).to.equal(1);
      expect(badges[0]).to.equal(1); // STARTER badge
    });

    it("Should track user achievements", async function () {
      const profile = await loopFi.getUserProfile(user1.address);
      expect(profile.goalsCompleted).to.equal(0);
      expect(profile.poolsJoined).to.equal(0);
      expect(profile.poolsCreated).to.equal(0);
    });
  });

  describe("Yield Strategies", function () {
    it("Should add yield strategies", async function () {
      const mockStrategy = await ethers.getContractFactory("MockYieldStrategy");
      const strategy = await mockStrategy.deploy();
      await strategy.deployed();

      await expect(loopFi.addYieldStrategy(
        strategy.address,
        "Mock Strategy",
        1000 // 10% APY
      )).to.emit(loopFi, "YieldStrategyUpdated")
        .withArgs(strategy.address, 1000);

      const strategies = await loopFi.getYieldStrategies();
      expect(strategies.length).to.equal(1);
      expect(strategies[0].name).to.equal("Mock Strategy");
      expect(strategies[0].apy).to.equal(1000);
    });

    it("Should update strategy APY", async function () {
      const mockStrategy = await ethers.getContractFactory("MockYieldStrategy");
      const strategy = await mockStrategy.deploy();
      await strategy.deployed();

      await loopFi.addYieldStrategy(strategy.address, "Mock Strategy", 1000);
      
      await expect(loopFi.updateYieldStrategyAPY(strategy.address, 1200))
        .to.emit(loopFi, "YieldStrategyUpdated")
        .withArgs(strategy.address, 1200);

      const strategies = await loopFi.getYieldStrategies();
      expect(strategies[0].apy).to.equal(1200);
    });
  });

  describe("Contract Statistics", function () {
    it("Should track total statistics", async function () {
      const stats = await loopFi.getStats();
      expect(stats.totalUsers).to.equal(0);
      expect(stats.totalVolume).to.equal(0);
      expect(stats.totalYield).to.equal(0);
    });

    it("Should update statistics after user activity", async function () {
      const registrationFee = await loopFi.REGISTRATION_FEE();
      await loopFi.connect(user1).registerUser("alice", { value: registrationFee });

      const stats = await loopFi.getStats();
      expect(stats.totalUsers).to.equal(1);
    });
  });
});

// Mock contracts for testing
contract("MockERC20", function () {
  // This would be implemented as a separate contract file
});

contract("MockYieldStrategy", function () {
  // This would be implemented as a separate contract file
});
