const { expect } = require("chai");
const { ethers } = require("hardhat");
const { int } = require("hardhat/internal/core/params/argumentTypes");

describe("SavingsAccount", function () {
  let deployer, user;

  beforeEach(async function () {
    [deployer, user] = await ethers.getSigners();
    const SavingAccount = await ethers.getContractFactory("SavingsAccount",deployer);
    this.savingAccount = await SavingAccount.deploy();

    const Investor = await ethers.getContractFactory("Investor",deployer);
    this.investor = await Investor.deploy(this.savingAccount.getAddress())
  });

  describe("From EOA", function () {
    it("Should be possible to deposit" ,async function () {
      expect(await this.savingAccount.balanceOf(user.address)).to.eq(0);
      await this.savingAccount.connect(user).deposit({value: 100});
      expect(await this.savingAccount.balanceOf(user.address)).to.eq(100);
    });
    it("Shouble be possible to withdraw", async function() {
      expect(await this.savingAccount.balanceOf(user.address)).to.eq(0);
      await this.savingAccount.connect(user).deposit({value: 100});
      expect(await this.savingAccount.balanceOf(user.address)).to.eq(100);

      await this.savingAccount.connect(user).withdraw();
      expect(await this.savingAccount.balanceOf(user.address)).to.eq(0);
    });
  })
  describe("From a Contract", function() {
    it("Should be possible to deposit", async function() {
      expect(await this.savingAccount.balanceOf(this.investor.getAddress())).to.eq(0);
      await this.investor.depositIntoSavingAccount({value : 100});
      expect(await this.savingAccount.balanceOf(this.investor.getAddress())).to.eq(100);
    });

    it("Shouble be possible to withdraw" ,async function () {
      expect(await this.savingAccount.balanceOf(this.investor.getAddress())).to.eq(0);
      await this.investor.depositIntoSavingAccount({value : 100});
      expect(await this.savingAccount.balanceOf(this.investor.getAddress())).to.eq(100);

      await this.investor.withdrawFromSavingAccount();
      expect(await this.savingAccount.balanceOf(this.investor.getAddress())).to.eq(0);
    })

  })


});
