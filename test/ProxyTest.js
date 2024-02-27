const { expect } = require("chai");
const { ethers } = require("hardhat");
const { int } = require("hardhat/internal/core/params/argumentTypes");
const { walkUpBindingElementsAndPatterns } = require("typescript");

describe("SavingsAccount", function () {
  let deployer, user;

  beforeEach(async function () {
    [deployer, user] = await ethers.getSigners();
    const LogicV1 = await ethers.getContractFactory("LogicV1", deployer);
    this.logicV1 = await LogicV1.deploy();
    const LogicV2 = await ethers.getContractFactory("LogicV2",deployer);
    this.logicV2 = await LogicV2.deploy();
    const Proxy = await ethers.getContractFactory("Proxy",deployer);
    this.proxy = await Proxy.deploy(this.logicV1.getAddress());
    
    this.proxyPattern = await ethers.getContractAt("LogicV1", this.proxy.getAddress());
    this.proxyPattern2 = await ethers.getContractAt("LogicV2", this.proxy.getAddress());
  });

  describe("From EOA", function () {
    it("Should return the address of LogicV1 when calling logicContract" ,async function () {
      expect(await this.proxy.logicContract()).to.eq(this.logicV1.getAddress());
    });
    it("Should revert of anyone than the owner tries to updagrate", async function() {
      await expect(this.proxy.connect(user).upgrade(this.logicV2.getAddress()).to.be.revertedWith("Access restricted"));
    })
    it("Should allow the owner to update the Logic Contract", async function() {
      await this.proxy.upgrade(this.logicV2.getAddress());
      expect(await this.proxy.logicContract()).to.eq(this.logicV2.getAddress());
    })
    it("Callong increaseX of LogicV1 should add 1 to x Proxy's state", async function() {
      await this.proxyPattern.connect(user).increaseX();
      expect(await this.proxy.x()).to.eq(1);
      expect(await this.logicV1.x()).to.eq(0);
    })
    it("Calling increaseX of LogicV2 should add 2 to x Proxy's state", async function() {
      await this.proxy.upgrade(this.logicV2.getAddress());
      await this.proxyPattern2.increaseX();
      expect(await this.proxy.x()).to.eq(2);
      expect(await this.logicV2.x()).to.eq(0);
    })
    it("Should set y", async function(){
      await this.proxy.upgrade(this.logicV2.getAddress());
      await this.proxyPattern2.setY(5);

      expect(await this.proxy.owner()).to.eq("0x0000000000000000000005");
    })
  })
});
