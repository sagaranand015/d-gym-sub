// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./GymStore.sol";

contract StoreSubscription is ERC721URIStorage {
    
    GymStoreNFT private _gymStore;
    uint256 serviceId = 0;

    struct storeSubscription {
        uint256 tokenId;
        string ipfsHash;
        address owner;
        uint256 createdAt;     // timestamp
        uint256 invalidAfter;  // timestamp after which service is invalid
    }

    storeSubscription[] subscriptions;

    constructor(address gymStoreContract) ERC721("Service NFT", "SFT")  {
        _gymStore = GymStoreNFT(gymStoreContract);
    }

    function createSubscription(string memory ipfsHash, uint256 invalidAfter) public {
        uint256 sid = subscriptions.length;
        storeSubscription memory nextSub = storeSubscription(
            sid,
            ipfsHash,
            msg.sender,
            block.timestamp,
            invalidAfter
        );
        subscriptions.push(nextSub);
        _mint(msg.sender, serviceId);
        serviceId++;
    }

    function hasStoreSubscription(address userAddr) public view returns(bool) {
        for(uint256 i=0;i<=serviceId;i++) {
            if(subscriptions[i].owner == userAddr) {
                return true;
            }
        }
        return false;
    }

    function transferSubscription(uint256 sId, address transferAddr) public returns(bool) {
        for(uint256 i=0;i<=serviceId;i++) {
            if(subscriptions[i].tokenId == sId) {
                // make the transfer now
                subscriptions[i].owner = transferAddr;
                return true;
            }
        }
        return false;
    }
    
}
