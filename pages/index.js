import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState } from 'react'
import LoginModal from '../components/LoginModal'
import { db } from '../utils/firebase-config'
import { doc, getDoc } from 'firebase/firestore'
import Link from 'next/link'

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [hostEmail, setHostEmail] = useState("")
  const [events, setEvents] = useState([])

  const onLoginClose = () => {
    setShowLoginModal(false)
  }

  const onLoginSubmit = async (email) => {
    setShowLoadingSpinner(true)

    const hostRef = doc(db, "hosts", email)
    const hostSnap = await getDoc(hostRef)
    const eventsData = []

    if (hostSnap.exists()) {
      for (const eventID of hostSnap.data().events) {
        const eventRef = doc(db, "events", eventID)
        const eventSnap = await getDoc(eventRef)

        eventsData.push({ id: eventSnap.id, event: eventSnap.data() })
      }

      setHostEmail(hostSnap.id)
      setEvents(eventsData)

      setShowLoginModal(false)
      setLoggedIn(true)
    } else {
      alert(
        "Whoops! Looks like your not a host yet. Contact support to setup an account."
      )
    }

    setShowLoadingSpinner(false)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Superhost</title>
        <meta name="description" content="Effortless Event Planning." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center py-6 h-screen">
        {loggedIn ? <button className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 self-end"><Link href={{ pathname: '/create-event', query: { email: hostEmail } }}>Create New Event</Link></button> : <button className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 self-end" onClick={() => { setShowLoginModal(true) }}>Host Login</button>}
        { events.length > 0 && <div className="my-5">
          {events.map((data, id) => {
            return (<a key={id} href={`events/${data.id}`} className="block p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mb-4">
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {data.event.eventTitle}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {data.event.location}
              </p>
          </a>)
          })}
        </div>}
        { !loggedIn && <a href="https://www.usesuperhost.com"><div className="mt-20 text-2xl">What is <b>Superhost</b>?</div></a> }
        { events.length === 0 && loggedIn && <div className='mt-10'>No events to display.</div>}
        <LoginModal showModal={showLoginModal} showLoadingSpinner={showLoadingSpinner} onModalClose={onLoginClose} onLoginSubmit={onLoginSubmit} />
      </main>
    </div>
  )
}
