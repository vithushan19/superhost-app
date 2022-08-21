import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState } from 'react'
import LoginModal from '../components/LoginModal'
import { db } from '../utils/firebase-config'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false)

  const onLoginClose = () => {
    setShowLoginModal(false)
  }

  const onLoginSubmit = async (email) => {
    setShowLoadingSpinner(true)

    const hostRef = doc(db, "hosts", email)
    const hostSnap = await getDoc(hostRef)

    if (hostSnap.exists()) {
      router.push({
        pathname: '/dashboard',
        query: {
          hostEmail: email
        }
      })

      setShowLoginModal(false)
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
        <button className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 self-end" onClick={() => { setShowLoginModal(true) }}>
          Host Login
        </button>
        <LoginModal showModal={showLoginModal} showLoadingSpinner={showLoadingSpinner} onModalClose={onLoginClose} onLoginSubmit={onLoginSubmit} />
      </main>
    </div>
  )
}
