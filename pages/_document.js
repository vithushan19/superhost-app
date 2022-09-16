import Document, { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

class MyDocument extends Document {
  render() {
    return (
      <Html data-theme="night">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500&family=Dancing+Script:wght@500&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500&display=swap" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css2?family=Merriweather&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Lato&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Kalam&display=swap" rel="stylesheet" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/add-to-calendar-button/assets/css/atcb.min.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <Script type="text/javascript" src={"https://maps.googleapis.com/maps/api/js?key=AIzaSyB2eVG5g0fw57MqQ7hgVoqEAs9yED1j1Mg&libraries=places"} strategy="beforeInteractive"></Script>
          <Script src="https://cdn.jsdelivr.net/npm/add-to-calendar-button" async defer></Script>
        </body>
      </Html>
    )
  }
}

export default MyDocument