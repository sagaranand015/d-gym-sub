// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import GymStoreToken from "./contracts/gym-store-token.json";
import GymStoreContractAddress from "./contracts/gym-store-contract-address.json";

export default async function GetStoreContract() {

    // We first initialize ethers by creating a provider using window.ethereum
    const _provider = new ethers.providers.Web3Provider(window.ethereum);

    // Then, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    const storeContact = new ethers.Contract(
        GymStoreContractAddress.Token,
        GymStoreToken.abi,
        _provider.getSigner(0)
    );
    return storeContact;
};

export async function GetStoreTokenDetails(userAddress) {
    const storeContact = await GetStoreContract();
    const name = await storeContact.name();
    const symbol = await storeContact.symbol();
    const storeTokenBalance = await storeContact.balanceOf(userAddress);
    return [name, symbol, storeTokenBalance]
};

export async function CreateStoreNFT(city, shortDesc, googleAddr, storeLogo) {
    const storeContract = await GetStoreContract();
    const tx = await storeContract.createStore(city, shortDesc, googleAddr, storeLogo, []);
    await tx.wait();
    return tx;
};