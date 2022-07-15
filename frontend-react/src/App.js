import React from "react";

import './App.css';

import { ConnectWallet } from "./components/ConnectWallet";
import { NoWalletDetected } from "./components/NoWalletDetected";
import { Loading } from "./components/Loading";
import GetStoreContract,  { GetStoreTokenDetails } from "./scripts";
import { GymStoreTable } from "./components/GymStore"

import { TASK_COMPILE_SOLIDITY_RUN_SOLCJS } from "hardhat/builtin-tasks/task-names";

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
    });

  }

  async _initialiseStoreTokenDetails() {
    const storeContract = await GetStoreContract();
    const [name, symbol, storeTokenBalance] = await GetStoreTokenDetails(this.state.selectedAddress);
    this.setState({ storeContact: storeContract,  storeTokenData: { name, symbol}, storeTokenBalance: storeTokenBalance.toNumber()});
  }

  async _refreshStoreTokenBalance() {
    if(!this.state.storeContact || !this.state.storeTokenData) {
      console.log("No Store Tokens associated with the account...");
      return;
    }
    const storeTokenBalance = await this.state.storeContact.balanceOf(this.state.selectedAddress);
    this.setState({
      storeTokenBalance: storeTokenBalance.toNumber()
    });
    return this.state.storeTokenBalance;
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

    if(!this.state.storeContact || !this.state.storeTokenData) {
      return (
        <Loading />
      )
    }

    return (
      <div id="wrapper">  
        <GymStoreTable allState={this.state} storeTokenData={this.state.storeTokenData} refreshBalance={() => this._refreshStoreTokenBalance()}/>
      </div>
    );

  }
}

export default App;
