import { Flowbite } from 'flowbite-react'
import Head from 'next/head'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Flowbite>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        </Head>
        <Component {...pageProps} />
      </Flowbite>
    </>
  )
}

export default MyApp
