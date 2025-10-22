// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MockYieldStrategy
 * @dev Mock yield strategy for testing
 */
contract MockYieldStrategy {
    uint256 public apy;
    uint256 public totalDeposited;
    bool public isActive;

    constructor() {
        apy = 1000; // 10% APY
        totalDeposited = 0;
        isActive = true;
    }

    function deposit() external payable {
        require(isActive, "Strategy not active");
        totalDeposited += msg.value;
    }

    function withdraw(uint256 amount) external {
        require(amount <= totalDeposited, "Insufficient funds");
        totalDeposited -= amount;
        payable(msg.sender).transfer(amount);
    }

    function setAPY(uint256 newAPY) external {
        apy = newAPY;
    }

    function setActive(bool active) external {
        isActive = active;
    }

    receive() external payable {
        require(isActive, "Strategy not active");
        totalDeposited += msg.value;
    }
}
