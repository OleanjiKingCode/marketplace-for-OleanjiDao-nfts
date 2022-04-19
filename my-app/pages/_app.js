import '../styles/globals.css'
import Link from 'next/link'
//Link helps to navigate between pages 

function MyApp({ Component, pageProps }) {
  return (
    <div>

      <nav className="border-b p-6">
          <p className="text-4xl font-bold">
            OleanjiFuture DAO Marketplace
          </p>
          <div className="flex mt-4">
             {/* first link is to the index.js as it is home */}
            <Link href='/'>
              <a className="mr-6 text-blue-500">
                Home
              </a>
            </Link>
            {/* the next link is called create-items where you can create items to sell and the name 
            here should be the same as the file name */}
            <Link href='/create-items'>
              <a className='mr-6 text-blue-500'>
               Sell Asset
              </a>
            </Link>

            <Link href='/my-assets'>
              <a className='mr-6 text-blue-500'>
               My Assets
              </a>
            </Link>

            <Link href='/creator-dashboard'>
              <a className='mr-6 text-blue-500'>
                Dashboard
              </a>
            </Link>
          </div>
      </nav>
      <Component {...pageProps} />
   </div>
  
  )
}

export default MyApp
