const { expect } = require("chai");
const { ethers } = require("hardhat");
const { walkUpBindingElementsAndPatterns } = require("typescript");

describe("Access Control", () => {
  let deployer, attacker, user;

  beforeEach(async function () {
    [deployer, attacker, user] = await ethers.getSigners();
    const MyPets= await ethers.getContractFactory("MyPets", deployer);
    this.myPets = await MyPets.deploy("Lu");
  });
  describe("My Pets", () => {

    it("Should set dog name at deployment", async function () {
      expect(await this.myPets.MyDog()).to.eq("Lu")
    })

    it("Shouble set the deployer account as owner", async function () {
      expect(await this.myPets.Owner()).to.eq(deployer.address);
    });

    it("Should be possible for owner to change the dog name",async function () {
      await this.myPets.updateDog("kiki");
      expect(await this.myPets.MyDog()).to.eq("kiki");
    });

    it("Should not be able to change dog name id not the owner", async function () {
      await expect(this.myPets.connect(attacker).updateDog("kiki")).to.be.revertedWith("Ownable : new owner is the zero address")
    })

    it("Should be possible for owner too transfer ownership", async function () {
      await this.myPets.transferOwnership(user.address);
      expect(await this.myPets.Owner()).to.eq(user.address);
    })

    it("Should be possible for the new owner to update dog name", async function () {
      await this.myPets.transferOwnership(user.address);
      await this.myPets.connect(user).updateDog("kiki");
      expect(await this.myPets.MyDog()).to.eq("kiki");
    });

    it("Should not possible fro the others to tranfer ownership", async function () {
      await expect(this.myPets.connect(attacker).transferOwnership(attacker.address)).to.be.revertedWith("Ownable : new owner is the zero address");
    })

  });
})