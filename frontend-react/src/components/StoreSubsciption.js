import Button from 'react-bootstrap/esm/Button';
import Table from 'react-bootstrap/Table';

export function StoreSubscriptionTable({allState, refreshBalance, createSubscriptionNft}) {
  if(!allState.subscriptionTokenBalance) {
    return (
      <div className='container'>
        <h3 className='header' >
          Oops! No Subscription NFT yet. Go create one!
        </h3>
        <form>
          <div className="form-group">
            <input type="text" className="form-control" id="subName" placeholder="Enter Subscription Name" />
          </div>
          <div className="form-group">
            <input type="file" className="custom-file-input" id="subImgFile" />
          </div>
          <Button variant='primary' size='lg' onClick={createSubscriptionNft} >Create Subscription NFT Now!</Button>
        </form>
      </div>
    );
  }
  else {
    return (
      <div className='container'>
        <h1 className='header'>
          Congrats! You have the Subscription NFT!
        </h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Token Name</th>
              <th>Token Symbol</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{allState.subscriptionTokenData.name}</td>
              <td>{allState.subscriptionTokenData.symbol}</td>
            </tr>
            <tr>
              <td colSpan={2} align="right">
                <small>
                  Current Address: {allState.selectedAddress}
                </small>
              </td>
            </tr>
            <tr>
              <td>
                {/* <Button size='sm' onClick={refreshBalance} active={() => showRefreshBalanceButton(storeTokenData)}>Click to refresh balance</Button> */}
                <Button size='sm' onClick={refreshBalance} disabled={!allState.subscriptionTokenBalance}>Click to refresh balance</Button>
              </td>
              <td align="right">
                <small>
                  Subscription Token Balance: <strong>{allState.subscriptionTokenBalance}</strong>
                </small>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

// export module GymStoreTable;