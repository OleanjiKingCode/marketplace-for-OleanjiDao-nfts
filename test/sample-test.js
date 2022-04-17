const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function () {
  it("Should should create and sell out market items", async function () {

    const Market = await ethers.getContractFactory("NFTMarket")
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftAddress = nft.address


    let listingPrice = await market.getListingPrice()
    listingPrice =listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('100' , 'ether')

    await nft.createToken("https://www.mytokenlocation.com")
    await nft.createToken("https://www.mytokenlocation2.com")

    await market.createMarketItem(nftAddress, 1 , auctionPrice, {value: listingPrice})
    await market.createMarketItem(nftAddress, 2 , auctionPrice, {value: listingPrice})

    // here we call all the addresses of hardhat node the 20 and specifying the one to use we call it the buyers
    // address here and the underscore is meant to omit the first one and go to the next cos the first is
    // to be used to deploy and create tokens threby making the buyer and seller addresses diifferent

    const [_, buyerAddress] = await ethers.getSigners()

    await market.connect(buyerAddress).createMarketSale(nftAddress , 1, {value : auctionPrice})

    const items =await market.fetchMarketItems()
    console.log("items:", items)

  });
});
