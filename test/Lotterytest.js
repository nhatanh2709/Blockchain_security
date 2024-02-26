const { expect } = require("chai");
const { ethers } = require("hardhat");
const { int } = require("hardhat/internal/core/params/argumentTypes");

describe("Weak Randomness", function () {
  let deployer, attacker;

  beforeEach(async function () {
    [deployer, attacker, user] = await ethers.getSigners();
    const Lottery = await ethers.getContractFactory("Lottery", deployer);
    this.lottery = await Lottery.deploy();
    const LotteryAttacker = await ethers.getContractFactory("LotteryAttacker", deployer);
    this.lottery = await LotteryAttacker.deploy(this.lottery.getAddress());

  });

  describe("Lottery", function () {
    describe.skip("With bets open", function () {
      it("Should allow a user to place a bet", async function () {
        await this.lottery.placeBet(5, { value: ethers.parseEther("10") });
        expect(await this.lottery.bets(deployer.address)).to.eq(5);
      });
      it("Shoule revert if bet is not 10 eth", async function () {
        await expect(this.lottery.placeBet(150, { value: ethers.parseEther("5") })).to.be.revertedWith("Bet cost: 10 ether");
      })
      it("Should revert if a user place more than 1 bet", async function () {
        await this.lottery.placeBet(5, { value: ethers.parseEther("10") });
        await expect(this.lottery.placeBet(150, { value: ethers.parseEther("10") })).to.be.revertedWith("Only 1 bet per player");
      })
      it("Should revert if bet is <=0", async function () {
        await expect(this.lottery.placeBet(0, { value: ethers.parseEther("10") })).to.be.revertedWith("Must be a number from 1 to 255");
      })
    })
    describe.skip("With bets closed", function () {
      it("Should revert if a user place a bet", async function () {
        await this.lottery.endLottery();
        await expect(this.lottery.placeBet(150, { value: ethers.parseEther("10") })).to.be.revertedWith("Bet are closed");
      })
      it("Should allow only the winner to withdraw the price", async function () {
        await this.lottery.connect(user).placeBet(5, { value: ethers.parseEther("10") });
        await this.lottery.connect(attacker).placeBet(100, { value: ethers.parseEther("10") });
        await this.lottery.placeBet(82, { value: ethers.parseEther("10") });

        let winningNumber = 0;
        while (winningNumber != 5) {
          await this.lottery.endLottery();
          winningNumber = await this.lottery.winningNumber();
        }
        await expect(this.lottery.connect(attacker).withdrawPrize()).to.be.revertedWith("You aren't the winner");
        const userInitialBalance = await ethers.provider.getBalance(user.address);
        await this.lottery.connect(user).withdrawPrize();
        const userFinalBalance = await ethers.provider.getBalance(user.address);
        expect(userFinalBalance).to.be.gt(userInitialBalance);
      })
    })
    describe("Attack", function () {
      it.skip("A miner could guess the number", async function () {
        await this.lottery.connect(user).placeBet(25, { value: ethers.parseEther("10") });
        await this.lottery.connect(attacker).placeBet(5, { value: ethers.parseEther("10") });
        await this.lottery.placeBet(82, { value: ethers.parseEther("10") });
        await ethers.provider.send("evm_setNextBlockTimestamp", [1708960812]);
        let winningNumber = 0;
        while (winningNumber != 5) {

          await this.lottery.endLottery();
          winningNumber = await this.lottery.winningNumber();
          console.log(winningNumber)
        }
        console.log(await ethers.provider.getBlock("latest"));

        const attackerInitialBalance = await ethers.provider.getBalance(attacker.address);
        await this.lottery.connect(attacker).withdrawPrize()
        const attackerFinalBalance = await ethers.provider.getBalance(attacker.address);
        expect(attackerFinalBalance).to.be.gt(attackerInitialBalance);
      })
      it("Attack from an attacker contract", async function () {
        await this.LotteryAttacker.attack({value :ethers.parseEther("10")});
        await this.lottery.endLottery();
        await ethers.provider.send("evm_mine");
        const LotterAttacker = await ethers.getContractFactory("LotteryContract", attacker);
        this.LotterAttacker = await LotterAttacker.deploy();
      })
    })
  })


});
