//SPDX-License-Identifier:MIT
pragma solidity ^0.8.4; 

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenids;
    address contractAddress;


    constructor(address marketplaceaddress) ERC721("OleanjiArts Tokens", "OATs") {
        contractAddress = marketplaceaddress;
    }

    function createToken(string memory tokenURI) public returns (uint){
        _tokenids.increment();
        uint256 newItemId = _tokenids.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);

        return newItemId;
    }
}
