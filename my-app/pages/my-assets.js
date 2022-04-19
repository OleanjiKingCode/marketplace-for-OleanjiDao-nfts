import { ethers } from "ethers"
import { useEffect, useState } from "react"
import axios from "axios"
import Web3Modal from "web3modal"
import {nftaddress , nftmarketaddress , nftaddressabi , nftmarketaddressabi} from '../config'



export default function MyAssets() {
    const [nfts ,setNfts] = useState([])
    const [loadingState , setLoadingState] =useState('not-loaded')
    useEffect(() =>{
      loadNFTs()
    }, [])

    async function loadNFTs() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
  
        const signer = provider.getSigner()



        const tokenContract = new ethers.Contract(nftaddress,nftaddressabi,provider)
        const MarketContract = new ethers.Contract(nftmarketaddress,nftmarketaddressabi,provider)
        const data = await MarketContract.fetchMyNfts()
    
        const items = await Promise.all(data.map(async i => {
          const tokenURi = await tokenContract.tokenURI(i.tokenId)
          const meta = await axios.get(tokenURi)
          ////doesnt use the 18 decimals just normal
          let price =ethers.utils.formatUnits(i.price.toString(), 'ether')
    
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
    
        setNfts(items)
        setLoadingState('loaded')
      }

      if(loadingState === 'loaded' && !nfts.length) return(<h1 className="px-20 py-10 text-3xl"> 
      No assets owned</h1>
      )

    return (
        <div className="flex justify-center">
            <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {
                nfts.map((nft, i) => (
                <div  key={i} className="border shadow rounded-xl overflow-hidden">
                    <img src = {nft.image} className="rounded"/>
                    <div className="p-4 bg-black">
                    <p className="text-2xl font-bold text-white">{nft.price} Matic</p>
                    
                    </div>
                </div>
            ))
          }
                </div>
            </div>
            
        </div>
    )
}