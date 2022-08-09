require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat :{},
    ropsten: {
      url: "https://ropsten.infura.io/v3/f301364bb81842cb851f218679ce8f6c",
      accounts: ["0xcdbdf00e0afb4408f0db0bbf2a6581c589f52c290878c67605b4e7aa6d447830"]
    }
  },
  etherscan:{
    apiKey: "NPI2UWCE5AFWNJ8NJRCW2HQUWK2SM578CH"
  }
};
