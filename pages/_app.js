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
          <link rel="icon" type="image/png" sizes="32x32" href="/images/superhost-icon.png" />
        </Head>
        <Component {...pageProps} />
      </Flowbite>
    </>
  )
}

export default MyApp
