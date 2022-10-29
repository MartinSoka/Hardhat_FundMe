require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");

const ganacheUrl = process.env.GANACHE_URL;
const ganachePrivateKey = process.env.GANACHE_PRIVATE_KEY;
const goerliUrl = process.env.GOERLI_URL;
const goerliPrivateKey = process.env.GOERLI_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    ganache: {
      url: ganacheUrl,
      accounts: [ganachePrivateKey],
      chainId: 1337,
    },
    hardhat: {
      chainId: 31337,
    },
    goerli: {
      url: goerliUrl,
      accounts: [goerliPrivateKey],
      chainId: 5,
      blockConfirmations: 6,
    },
  },
  gasReporter: {
    enabled: true,
    //coinmarketcap: COINMARKETCAP_API_KEY,
    currency: "USD",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.8",
      },
      {
        version: "0.8.0",
      },
    ],
  },
};
