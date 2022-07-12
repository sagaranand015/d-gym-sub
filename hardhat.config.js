require("@nomicfoundation/hardhat-toolbox");

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");
require("./tasks/get_accounts");
require("./tasks/get_stores");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1337 // We set 1337 to make interacting with MetaMask simpler
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/0efd07c5eb0647e988af6099b55ac9c4", //Infura url with projectId
      accounts: ["3d31f2f1c1de57e57c2830192cfab9032a88ce2ba4601dd307267bdf59be3edf"] // add the account that will deploy the contract (private key)
    },  
  }
};
