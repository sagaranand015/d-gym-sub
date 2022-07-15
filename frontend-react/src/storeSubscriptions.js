// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import StoreSubcriptionContractAddress from './contracts/store-subscription-contract-address.json'
import StoreSubscriptionToken from "./contracts/store-subscription-token.json";

export async function GetStoreSubscriptionContract() {

    // We first initialize ethers by creating a provider using window.ethereum
    const _provider = new ethers.providers.Web3Provider(window.ethereum);

    // Then, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    const subscriptionContract = new ethers.Contract(
        StoreSubcriptionContractAddress.Token,
        StoreSubscriptionToken.abi,
        _provider.getSigner(0)
    );
    return subscriptionContract;
};

export async function GetStoreSubscriptionTokenDetails(userAddress) {
    const subContract = await GetStoreSubscriptionContract();
    const name = await subContract.name();
    const symbol = await subContract.symbol();
    const subTokenBalance = await subContract.balanceOf(userAddress);
    return [name, symbol, subTokenBalance]
};

// export async function CreateStoreSubscription(city, shortDesc, googleAddr, storeLogo) {
//     const storeContract = await GetStoreContract();
//     const tx = await storeContract.createStore(city, shortDesc, googleAddr, storeLogo, []);
//     await tx.wait();
//     return tx;
// };