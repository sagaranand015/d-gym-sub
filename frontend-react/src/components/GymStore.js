import Button from 'react-bootstrap/esm/Button';
import Table from 'react-bootstrap/Table';

export function GymStoreTable({allState, storeTokenData, refreshBalance}) {

  if(!allState.storeTokenBalance) {
    return (
      <div className='container'>
        <h3 className='header' >
          Oops! No Store NFT yet. Go create one!
        </h3>
        <Button variant='primary' size='lg' >Create Store NFT Now!</Button>
      </div>
    );
  }
  else {
    return (
      <div className='container'>
        <h1 className='header'>
          You have the Store NFT!
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
              <td>{storeTokenData.name}</td>
              <td>{storeTokenData.symbol}</td>
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
                <Button size='sm' onClick={refreshBalance} disabled={!allState.storeTokenBalance}>Click to refresh balance</Button>
              </td>
              <td align="right">
                <small>
                  Store Token Balance: <strong>{allState.storeTokenBalance}</strong>
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