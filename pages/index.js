import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button, Card } from 'flowbite-react'
import { useState } from 'react'
import LoginModal from '../components/LoginModal'
import { db } from '../utils/firebase-config'
import { doc, getDoc } from 'firebase/firestore'
import Link from 'next/link'
import Script from 'next/script'

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [hostName, setHostName] = useState("")
  const [hostEmail, setHostEmail] = useState("")
  const [events, setEvents] = useState([])

  const onLoginClose = () => {
    setShowLoginModal(false)
  }

  const onLoginSubmit = async (email) => {
    const hostRef = doc(db, "hosts", email)
    const hostSnap = await getDoc(hostRef)
    const eventsData = []

    if (hostSnap.exists()) {
      for (const eventID of hostSnap.data().events) {
        const eventRef = doc(db, "events", eventID)
        const eventSnap = await getDoc(eventRef)

        eventsData.push(eventSnap.data())
      }

      setHostEmail(hostSnap.id)
      setHostName(hostSnap.data().name)
      setEvents(eventsData)

      setShowLoginModal(false)
      setLoggedIn(true)
    } else {
      alert(
        "Whoops! Looks like your not a host yet. Contact support to setup an account."
      )
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center py-6 h-screen">
        <Script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB2eVG5g0fw57MqQ7hgVoqEAs9yED1j1Mg&libraries=places" async defer />
        <Script src="https://cdn.jsdelivr.net/npm/add-to-calendar-button" async defer />
        {loggedIn ? <button className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 self-end"><Link href={{ pathname: '/create-event', query: { email: hostEmail } }}>Create New Event</Link></button> : <button className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 self-end" onClick={() => { setShowLoginModal(true) }}>Login to Superhost</button>}
        { events.length > 0 && <div className="my-5">
          {events.map((event, id) => {
            return (<a key={id} href="#" className="block p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mb-4">
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {event.eventTitle}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {event.location}
              </p>
          </a>)
          })}
        </div>}
        <LoginModal showModal={showLoginModal} onModalClose={onLoginClose} onLoginSubmit={onLoginSubmit} />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
