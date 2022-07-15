import Button from 'react-bootstrap/esm/Button';
import Table from 'react-bootstrap/Table';

export function GymStoreTable({allState, storeTokenData, refreshBalance}) {
  return (
    <div className='container'>
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
              <Button size='sm' onClick={refreshBalance}>Click to refresh balance</Button>
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

// export module GymStoreTable;