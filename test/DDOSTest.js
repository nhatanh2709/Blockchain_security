const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SavingsAccount", function () {
  let deployer, user, attacker;

  beforeEach(async function () {
    [deployer, user, attacker] = await ethers.getSigners();

    const Auction = await ethers.getContractFactory("Auction", deployer);
    this.auction = await Auction.deploy();
    this.auction.bid({ value: 100 });
    const AuctionV2 = await ethers.getContractFactory("AuctionV2", deployer);
    this.auctionV2 = await AuctionV2.deploy();
    this.auctionV2.bid({ value: 0});
  });
  describe("Auction", function () {
    describe("if bid is lower than highestBid", function () {
      it.skip("Should Not accept bids lower than current", async function () {
        await expect(this.auction.connect(user).bid({ value: 50 })).to.be.revertedWith("Bid not high enough")
      })
    })
    describe("if a bid is higher than highestBid", function () {
      it.skip("Should accpect it and update highestBid", async function () {
        await this.auction.connect(user).bid({ value: 150 });
        expect(await this.auction.highestBid()).to.eq(150);
      })
      it.skip("Should make msg.sender currentLeader", async function () {
        await this.auction.connect(user).bid({ value: 150 });
        expect(await this.auction.currentLeader()).to.eq(user.address);
      })
      it.skip("Should add previous leader and highestBid to refunds", async function () {
        await this.auction.connect(user).bid({ value: 150 });
        [addr, amount] = await this.auction.refunds(0);
        expect(addr).to.eq(deployer.address);
        expect(amount).to.eq(100);
      })
    })
    describe("When callling refundAll()", function () {
      it.skip("Should refund the bidders that didn't win", async function () {
        await this.auction.connect(user).bid({ value: 150 });
        await this.auction.bid({ value: 200 });
        const userBalanceBefore = await ethers.provider.getBalance(user.address);
        await this.auction.refundAll();
        const userBalanceAfter = await ethers.provider.getBalance(user.address);
        expect(userBalanceAfter).to.eq(userBalanceBefore.add(150));
      })
      it.skip("Should revert if the amount of computation hits the block gas limit", async function () {
        for (let i = 1; i <= 1500; i++) {
          await this.auction.connect(attacker).bid({ value: 150 + i })
        }
        await this.auction.refundAll({ gasLimit: 100000000 })
      })
    })
    describe("AutionV2", function () {
      describe("Pull over push solution", function () {
        it.skip("A user should be able to refunded for a small number of bids", async function () {
          await this.auctionV2.connect(user).bid({ value: ethers.parseEther("1") });
          await this.auctionV2.bid({ value: ethers.parseEther("2") });
          const userBalanceBefore = await ethers.provider.getBalance(user.address);
          await this.auctionV2.connect(user).withdrawRefund();
          const userBalanceAfter = await ethers.provider.getBalance(user.address);
          expect(userBalanceAfter).to.be.gt(userBalanceBefore);
        })
        it("A user should be able to be refunded for a very large number of bids", async function () {
           for (let i = 1; i < 1500; i++) {
            await this.auctionV2.connect(user).bid({ value: i });
           }

          const userBalanceBefore = await ethers.provider.getBalance(user.address);

          await this.auctionV2.connect(user).withdrawRefund();
          const userBalanceAfter = await ethers.provider.getBalance(user.address);
          expect(userBalanceAfter).to.be.gt(userBalanceBefore);
        })
      })
    })
  })


});
