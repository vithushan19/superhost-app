import { Flowbite } from 'flowbite-react'
import Head from 'next/head'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Flowbite>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
          <meta name="description" content="Effortless Event Planning." />
          <title>Superhost</title>
          <link rel="icon" type="image/x-icon" sizes="32x27" href="/images/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </Flowbite>
    </>
  )
}

export default MyApp
