require("@nomiclabs/hardhat-waffle");
require("@nomicfoundation/hardhat-ethers");
require('dotenv').config();

module.exports = {
  solidity: "0.8.27", // Match the version in your contract
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_SEPOLIA_URL,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
  },
};
