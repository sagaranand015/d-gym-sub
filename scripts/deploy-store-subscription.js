// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const path = require("path");

async function main() {

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance of the deploying account:", (await deployer.getBalance()).toString());

  const gymStore = await ethers.getContractFactory("StoreSubscription");
  const storeTkn = await gymStore.deploy("0x83Ef4328E745e1aC0A45C229b699dc6676556B1F");
  await storeTkn.deployed();

  console.log("Store Subscription Token address:", storeTkn.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(storeTkn);
}

function saveFrontendFiles(token) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend-react", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "store-subscription-contract-address.json"),
    JSON.stringify({ Token: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("StoreSubscription");

  fs.writeFileSync(
    path.join(contractsDir, "store-subscription-token.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
