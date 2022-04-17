//SPDX-License-Identifier:MIT
pragma solidity ^0.8.4; 

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemSold;

    address payable owner;
    // sting the price for list an item
    uint256 listingPrice =0.025 ether;

    constructor(){
        owner =payable(msg.sender);
    }


// this is a struct to keep tract of all the properties of a market item wen created or sold
    struct MarketItem{
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }
    // a mapping that can be used to call any marketitem
    mapping (uint256 => MarketItem) private idMarketItem;

    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address  seller,
        address   owner,
        uint256 price,
        bool sold
    );
// useful for thr front end to get the listing price 
    function getListingPrice() public view returns (uint256){
        return listingPrice;
    }


// here a market item is created by supplying the contract of the already minted token
// the token id amd the price the individual seeling it put up
//using the nonreentranr modeifier so as this function should be prone to multiple request  security flaws
    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price should be higher");
        require(msg.value == listingPrice, "Price must be the listing price");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();
        idMarketItem[itemId] =MarketItem (
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            // sets the owner to zero addr as no one owns it yet
            payable(address(0)),
            price,
            false
        );

// after the item as been created the ownership goes to the CA of this contract as well as the listing price
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated (
        itemId,
        nftContract,
        tokenId,
        msg.sender,
        address(0),
        price,
        false
        );



    }


// here a sale for the market item occurs
      function createMarketSale(
        address nftContract,
        uint256 itemId
       
    ) public payable nonReentrant {
        uint price = idMarketItem[itemId].price;
        uint tokenId =idMarketItem[itemId].tokenId;
        require(msg.value == price, "please submit the asking price in order to complete the purchase");
// after the requirement of the price is fulfilled the listing price is then given to the owner of the contract
// as well as the ownership goes to the caller or buyer
// and the price is transffered to the owner of the token or seller
        idMarketItem[itemId].seller.transfer(msg.value);

        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        idMarketItem[itemId].owner = payable(msg.sender);

        idMarketItem[itemId].sold = true; 

        _itemSold.increment();
        payable(owner).transfer(listingPrice);




    }
// gets all the unsold items 
    function fetchMarketItems() public view returns (MarketItem[] memory) {

        uint itemCount = _itemIds.current();
        uint unsoldItemCount = _itemIds.current() - _itemSold.current();

        uint currentIndex = 0;
        MarketItem[] memory items =new MarketItem[] (unsoldItemCount);

        for (uint i = 0; i < itemCount; i++){
            if (idMarketItem[i + 1].owner == address(0)) {
                uint currentId = idMarketItem[i+1].itemId;
                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex +=1;
            } 
            
        }
        return items;
    } 
// gets all nfts that i bought
    function fetchMyNfts() public view returns (MarketItem[] memory){
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i <totalItemCount; i++){
            if (idMarketItem[i+1].owner == msg.sender){
                itemCount +=1;
            }
        }

        MarketItem[] memory items =new MarketItem[] (itemCount);
        for(uint i = 0; i < totalItemCount; i++){
            if(idMarketItem[i+1].owner ==msg.sender){
                uint currentId = idMarketItem[i+1].itemId;
                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex +=1;
            }
        }
        return items;

    }

// gets all nft that i created
    function fetchItemsCreated() public view returns(MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i <totalItemCount; i++){
            if (idMarketItem[i+1].seller == msg.sender){
                itemCount +=1;
            }
        }
        MarketItem[] memory items =new MarketItem[] (itemCount);
        for(uint i = 0; i < totalItemCount; i++){
            if(idMarketItem[i+1].seller ==msg.sender){
                uint currentId = idMarketItem[i+1].itemId;
                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex +=1;
            }
        }
        return items;
        
    }

}