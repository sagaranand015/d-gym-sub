const fs = require("fs");

// This file is only here to make interacting with the Dapp easier,
// feel free to ignore it if you don't need it.

task("GetStores", "Gets the stores owned by a given address")
  .addPositionalParam("owner", "The address that owns the stores")
  .setAction(async ({ owner }, { ethers }) => {
    
    const addressesFile =
      __dirname + "/../frontend/src/contracts/gym-store-contract-address.json.json";

    if (!fs.existsSync(addressesFile)) {
      console.error("You need to deploy your contract first");
      return;
    }

    const addressJson = fs.readFileSync(addressesFile);
    const address = JSON.parse(addressJson);

    if ((await ethers.provider.getCode(address.Token)) === "0x") {
      console.error("You need to deploy your contract first");
      return;
    }

    const token = await ethers.getContractAt("GymStoreNFT", address.Token);
    
  });
