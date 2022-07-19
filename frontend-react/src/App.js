import React from "react";

import './App.css';

import { ConnectWallet } from "./components/ConnectWallet";
import { NoWalletDetected } from "./components/NoWalletDetected";
import { Loading } from "./components/Loading";
import GetStoreContract,  { GetStoreTokenDetails, CreateStoreNFT } from "./gymStores";
import { GymStoreTable } from "./components/GymStore"
import { SaveToIpfsStorage } from "./nftStorage";

import { CreateStoreSubscription, GetStoreSubscriptionContract, GetStoreSubscriptionTokenDetails } from "./storeSubscriptions";
import { StoreSubscriptionTable } from "./components/StoreSubsciption";

export class App extends React.Component {
  constructor(props) {
    super(props);
    console.log("In the constructor of the component...");

    // We store multiple things in Dapp's state.
    // You don't need to follow this pattern, but it's an useful example.
    this.initialState = {
      // keeping a handle to the contract itself
      storeContact: undefined,
      // The info of the token (i.e. It's Name and symbol)
      storeTokenData: undefined,
      // The user's address and balance
      selectedAddress: undefined,
      storeTokenBalance: undefined,
      // The ID about transactions being sent, and any possible error with them
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
    };

    this.state = this.initialState;
  }

  async _connectWallet() {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.
  
    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log("Connected address is:", selectedAddress);

    this.setState({
      selectedAddress: selectedAddress,
    }, () => {
      // initialize store contract and store token details
      this._initialiseStoreTokenDetails();
      this._initialiseStoresubscriptionTokenDetails();
      this._refreshAllTokenBalances();
    });

  }

  async _initialiseStoreTokenDetails() {
    const storeContract = await GetStoreContract();
    const [name, symbol, storeTokenBalance] = await GetStoreTokenDetails(this.state.selectedAddress);
    this.setState({ storeContact: storeContract,  storeTokenData: { name, symbol}, storeTokenBalance: storeTokenBalance.toNumber()});
  }

  async _initialiseStoresubscriptionTokenDetails() {
    const subContract = await GetStoreSubscriptionContract();
    const [name, symbol, subTokenBalance] = await GetStoreSubscriptionTokenDetails(this.state.selectedAddress);
    this.setState({ subscriptionContract: subContract,  subscriptionTokenData: { name, symbol}, subscriptionTokenBalance: subTokenBalance.toNumber()});
  }

  async _refreshAllTokenBalances() {
    await this._refreshStoreTokenBalance();
    await this._refreshStoresubscriptionTokenBalance();
  }

  async _refreshStoreTokenBalance() {
    if(!this.state.selectedAddress) {
      console.log("No Address, connect wallet please...");
      return;
    }
    else if(!this.state.storeContact || !this.state.storeTokenData) {
      console.log("No Store Contract or token connected, please try again...");
      return;
    }
    const storeTokenBalance = await this.state.storeContact.balanceOf(this.state.selectedAddress);
    this.setState({
      storeTokenBalance: storeTokenBalance.toNumber()
    });
    return this.state.storeTokenBalance;
  }

  async _refreshStoresubscriptionTokenBalance() {
    if(!this.state.selectedAddress) {
      console.log("No Address, connect wallet please...");
      return;
    }
    else if(!this.state.subscriptionContract || !this.state.subscriptionTokenData) {
      console.log("No Store subscription Contract or token connected, please try again...");
      return;
    }
    const subTokenBalance = await this.state.subscriptionContract.balanceOf(this.state.selectedAddress);
    this.setState({
      subscriptionTokenBalance: subTokenBalance.toNumber()
    });
    return this.state.subscriptionTokenBalance;
  }

  async _createStoreNft() {
    const tx = await CreateStoreNFT("Bangalore", "MyStore02", "http://google.com", "http://image.com");
    await this._refreshStoreTokenBalance();
  }

  async _createStoreSubscriptionNft() {

    var subName = document.getElementById('subName').value;
    console.log("sub name is: ", subName);

    var subImgFile = document.getElementById('subImgFile').files[0];
    console.log("====== file is: ", subImgFile);

    var fileObj = {
      'name': subName,
      'description': 'Some Random Description for now',
      'data': subImgFile,
    }
    var ipfsNetdata = await SaveToIpfsStorage(fileObj.name, fileObj.description, fileObj.data);
    console.log("========= ipfshash data is: ", ipfsNetdata);

    var ts = Math.round((new Date()).getTime() / 1000);
    var mintSubRes = await CreateStoreSubscription(ipfsNetdata, ts)
    console.log("=========== minted store sub is: ", mintSubRes);

    // var imgData = null;
    // let img = await fetch('https://picsum.photos/200/300')
    // let fimgb = Buffer.from(await img.arrayBuffer())

    // var fileObj = {
    //   'name': 'storeSubImageName',
    //   'description': 'Description for the image of the store subscription',
    //   'data': fimgb,
    // }
    // console.log("file obj is: ", fileObj);

    // var ts = Math.round((new Date()).getTime() / 1000);
    // var ipfsNetdata = SaveToIpfsStorage(fileObj.name, fileObj.description, fileObj.data);
    // console.log("========= ipfshash data is: ", ipfsNetdata);

    // const tx = await CreateStoreNFT("Bangalore", "MyStore02", "http://google.com", "http://image.com");
    // await this._refreshStoreTokenBalance();
  }

  render() {

    // Ethereum wallets inject the window.ethereum object. If it hasn't been
    // injected, we instruct the user to install MetaMask.
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    if(!this.state.selectedAddress) {
      return (
        <div id="wrapper">  
          <ConnectWallet 
            connectWallet={() => this._connectWallet()} 
            networkError={this.state.networkError}
            dismiss={() => this._dismissNetworkError()}
          />
        </div>
      );
    }

    if(!this.state.storeContact && !this.state.storeTokenData) {
      return (
        <Loading />
      )
    }

    return (
      <div id="wrapper">  
        <GymStoreTable 
            allState={this.state} 
            storeTokenData={this.state.storeTokenData} 
            refreshBalance={() => this._refreshStoreTokenBalance()}
            createStoreNFT={() => this._createStoreNft()} 
        />

        <StoreSubscriptionTable 
            allState={this.state}
            createSubscriptionNft={() => this._createStoreSubscriptionNft()} 
        />
      </div>
    );

  }
}

export default App;
