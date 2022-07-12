// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract GymStoreNFT is ERC721URIStorage {
    uint256 storeNumber = 1;

    struct storeDetails {
        uint256 tokenId;
        string city;
        string shortDescription;
        address owner;
        string googleAddress;
        string logo;
        uint256 createdAt; // timestamp
        string[] subscriptions; // services
    }

    storeDetails[] stores;

    mapping(uint256 => storeDetails) storeMappings;
    mapping(uint256 => address) storeOwner;
    mapping(address => uint256) storeNumberMapping;
    mapping(address => bool) registeredAStore;

    constructor() ERC721("GymStoreNFT", "GST") {
        // create the token here. Nothing to do for now, might add something later
    }

    function createStore(
        string memory cityName,
        string memory description,
        string memory _googleAddress,
        string memory _logo,
        string[] memory _subscriptions
    ) public {
        require(
            registeredAStore[msg.sender] == false,
            "You already have a store in place"
        );
        // Does one member can have only one business, or can have more?
        // Going with only 1 store per account for now
        uint256 sid = stores.length;
        storeDetails memory nextStore = storeDetails(
            sid,
            cityName,
            description,
            msg.sender,
            _googleAddress,
            _logo,
            block.timestamp,
            _subscriptions
        );
        stores.push(nextStore);
        _mint(msg.sender, storeNumber);

        registeredAStore[msg.sender] = true;
        storeNumberMapping[msg.sender] = storeNumber;
        storeOwner[sid] = msg.sender;

        storeNumber++;
    }

    function getStore(uint256 _id)
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            address,
            string memory,
            uint256,
            string[] memory
        )
    {
        return (
            stores[_id].tokenId,
            stores[_id].city,
            stores[_id].shortDescription,
            stores[_id].owner,
            stores[_id].googleAddress,
            stores[_id].createdAt,
            stores[_id].subscriptions
        );
    }

    function deleteStore(uint256 _storeId) public {
        require(storeOwner[_storeId] == msg.sender);
        delete storeOwner[_storeId];
    }

    function getStoreId(address _address) public view returns (uint256) {
        return storeNumberMapping[_address];
    }

    // This function might not be needed as we will lists everything with Covalent probably
    /*  function listAllBusiness() public view returns(string[] memory lists){ 
        string[] memory _listOfBusinesses = new string[](businesses.length);
        for(uint256 i = 0; i < businesses.length; i++){
            
        }        


        return _listOfBusinesses;



        if(businesses.length == 0){
            return new string[](0);
        }
        else {
            uint256[] memory _listOfBusinesses = new uint[](businesses.length);
            for(uint256 i = 0; i < businesses.length; i++){
                _listOfBusinesses.push(businessDetails[i].shortDescription);
            }
                    return _listOfBusinesses;
        } 

    }  */

    // function verifyBusiness(uint256 _tokenId) external {
    //     require(
    //         _PunkCities.checkRegisteredPlace(msg.sender) == true,
    //         "You must be registered for Punk Cities in order to verify a place"
    //     );

    //     placeVerification[_tokenId]++;
    // }

    // function checkBusinessVerification(uint256 _tokenId)
    //     public
    //     view
    //     returns (uint256)
    // {
    //     return placeVerification[_tokenId]; // How many times this business have been verified
    // }

    function ownsAStore(address _storeOWner) public view returns (bool) {
        return registeredAStore[_storeOWner];
    }

    /* function listServices() public view returns(string memory) {
        uint256 businessNumber = businessNumberMapping[msg.sender];
        return 
    } */
}
