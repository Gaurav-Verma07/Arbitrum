require("@nomicfoundation/hardhat-toolbox");

require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "arbitrumTestnet",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/HKPIXNdXAyF4k4UA5fegMXIDtjTWHLR9",
      accounts: [
        "2bca72c6d87160dd947814cff6cdd145d6f84a2b886a5dc779bb398220bbeb7c",
      ],
      saveDeployments: true,
      chainId: 11155111,
    },
    avalancheTestnet: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [
        "2bca72c6d87160dd947814cff6cdd145d6f84a2b886a5dc779bb398220bbeb7c",
      ],
      saveDeployments: true,
      chainId: 43113,
    },
    arbitrumTestnet: {
      url: "https://arb-goerli.g.alchemy.com/v2/eOooH-_33r2FiZD9AwTNj8UXBJt7KITq",
      accounts: [
        "2bca72c6d87160dd947814cff6cdd145d6f84a2b886a5dc779bb398220bbeb7c",
      ],
      saveDeployments: true,
      chainId: 421613,
    },
  },

  etherscan: {
    // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
    apiKey: "1F4IKDGN5KCHQV7QRA595ZYY7ZIPMVB456",
  },
  solidity: "0.8.19",
};
