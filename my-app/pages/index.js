import { ethers } from "ethers"
import { useEffect, useState } from "react"
import axios from "axios"
import Web3Modal from "web3modal"
import {nftaddress , nftmarketaddress , nftaddressabi , nftmarketaddressabi} from '../config'


export default function Home() {
  const [nfts ,setNfts] = useState([])
  const [loadingState , setLoadingState] =useState('not-loaded')
  useEffect(() =>{
    loadNFTs()
  }, [])

// this is a  function that loads and stores the array of unsold market items using the function from the 
// NFTMarketplace smart contract 
  async function loadNFTs() {
    const provider =new ethers.providers.JsonRpcProvider()
    const tokenContract = new ethers.Contract(nftaddress,nftaddressabi,provider)
    const MarketContract = new ethers.Contract(nftmarketaddress,nftmarketaddressabi,provider)
    const data = await MarketContract.fetchMarketItems()
// we then map through the data const 
    const items = await Promise.all(data.map(async i => {
      const tokenURi = await tokenContract.tokenURI(i.tokenId)
      // we get the tokenUri and try to get all the information stored in it by using axios
      const meta = await axios.get(tokenURi)
      ////doesnt use the 18 decimals just normal
      let price =ethers.utils.formatUnits(i.price.toString(), 'ether')
      //here we then pick what we need to see in the home page and put them into item the return it
      let item ={
        price,
        tokenId : i.tokenId.toNumber(),
        seller: i.seller,
        owner : i.owner,
        image : meta.data.image,
        name : meta.data.name,
        description : meta.data.description,
      }
      return item
    }))
    /// it is set to items because it returns a map of item object
    setNfts(items)
    setLoadingState('loaded')
  }

  if(loadingState === 'loaded' && !nfts.length) return(<h1 className="px-20 py-10 text-3xl"> 
  No items in the Marketplace</h1>
  )


    async function buyNft(nft) {
      const web3Modal = new Web3Modal()
      const connection = await Web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)

      const signer = provider.getSigner()
      const contract = new ethers.Contract(nftmarketaddress,nftmarketabi,signer)
///////uses wei i.e 18 decimals
      const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')

      const transaction = await contract.createMarketSale(nftaddress,nft.tokenId, {value :price})

      await transaction.wait()
      
      loadNFTs()

    }


  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth :'1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            // here we loop through the nft that was set and using i as index and key we get each item in the nft
            nfts.map((nft, i) => (
              <div  key={i} className="border shadow rounded-xl overflow-hidden">
                <img src = {nft.image}/>
                <div className="p-4"> 
                    <p style={{height :'64px'}} className="text-2xl font-semibold">{nft.name}</p>
                    <div style={{height :'70px' , overflow :'hidden'}} >
                      <p className="text-gray-400">{nft.description}</p>
                    </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">{nft.price} Matic</p>
                  <button className="w-full bg-blue-500 text-white font-bold py-2 px-12 rounded" onClick={
                    () => buyNft(nft)
                  }> Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
