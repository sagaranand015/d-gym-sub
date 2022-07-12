// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const { sign } = require("crypto");
const { ethers } = require("hardhat");
const path = require("path");
const fs = require("fs");

async function main() {

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Minting Gym Store NFT with the account:",
    await deployer.getAddress()
  );
  console.log("Account balance of the minting:", (await deployer.getBalance()).toString());

  var provider = ethers.providers.getDefaultProvider('rinkeby');
  console.log("Provider is: ", provider);

  var signers = await ethers.getSigners();
  console.log("signers: ", signers);

  // get the contract
  const addressesFile =
      __dirname + "/../frontend/src/contracts/gym-store-contract-address.json";

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
  var contract = await ethers.getContractAt("GymStoreNFT", address.Token);
  console.log("Contract is: ", contract);

  const tx = await contract.createStore("Ludhiana", "Store01",  "store01-google-address", "http://logo.com", []);
  await tx.wait();

  console.log("Gym Store Created Address is: ", tx);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
