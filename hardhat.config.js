require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: ".env" });

const INFURA_API_KEY_MUMBAI_URL = process.env.INFURA_API_KEY_MUMBAI_URL;
const INFURA_API_KEY_MAINNET_URL = process.env.INFURA_API_KEY_MAINNET_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;


module.exports = {
  solidity: "0.8.4",
  networks :{
    hardhat:{
      chainId:1337
    },
    mimbai:{
      url:INFURA_API_KEY_MUMBAI_URL,
      accounts:[PRIVATE_KEY]
    },
    mainnet:{
      url:INFURA_API_KEY_MAINNET_URL,
      accounts:[PRIVATE_KEY]
    },
    

  }
};
