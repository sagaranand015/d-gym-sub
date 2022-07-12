const fs = require("fs");

// This file is only here to make interacting with the Dapp easier,
// feel free to ignore it if you don't need it.

task("GetAccounts", "Gets the accounts using ethers")
  .setAction(async ({}, { ethers }) => {
    
    var provider = ethers.providers.getDefaultProvider('rinkeby');
    console.log("provider is: ", provider);
    var acs = await provider.

    console.log("===== acs are: ", acs);
    
  });
