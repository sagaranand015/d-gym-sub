import React from "react";

import './App.css';

import { ConnectWallet } from "./components/ConnectWallet";
import { NoWalletDetected } from "./components/NoWalletDetected";
import { Loading } from "./components/Loading";
import GetStoreContract from "./scripts";
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
      console.log("===== final state:", this.state);
    });

    await this._initialiseStoreTokenDetails();
  }

  async _initialiseStoreTokenDetails() {
    const storeToken = await GetStoreContract();
    const name = await storeToken.name();
    const symbol = await storeToken.symbol();
    const storeTokenBalance = await storeToken.balanceOf(this.state.selectedAddress);

    console.log("======== storeTokenBalance", storeTokenBalance.toString());

    this.setState({ storeToken: storeToken,  storeTokenData: { name, symbol}, storeTokenBalance: storeTokenBalance.toNumber()});
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

    if(!this.state.storeToken || !this.state.storeTokenData) {
      return (
        <Loading />
      )
    }

    return (
      <div id="wrapper">  
        <GymStoreTable allState={this.state} storeTokenData={this.state.storeTokenData} />
      </div>
    );

  }
}

export default App;
