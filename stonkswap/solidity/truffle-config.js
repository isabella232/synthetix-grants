const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

const env = process.env;

module.exports = {
  networks: {
    fork: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 1,
    },
    kovan_fork: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 42,
    },
    kovan: {
      provider: () => new HDWalletProvider(env.MEMO, env.KINFURA),
      network_id: 42,
    },
    mainnet: {
      provider: () => new HDWalletProvider(env.MEMO, env.INFURA),
      network_id: 1,
    },
  },
  compilers: {
    solc: {
      version: "0.7.6",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    etherscan: env.ETHERSCAN_API,
  },
};
