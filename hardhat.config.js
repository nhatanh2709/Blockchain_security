require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks:{
    hardhat:{
      initialBaseFeePerGas: 0,
      mining: {
        auto: false,
        interval: 3000,
      }
    }
  },
  solidity: "0.8.24",
};
