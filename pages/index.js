import Head from 'next/head'
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
    <div className="py-0 px-8 bg-base-100">
      <Head>
        <meta name="description" content="Effortless Event Planning." />
        <title>Superhost</title>
        <link rel="icon" href="/superhost-icon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center h-screen gap-5">
        <h6 className='text-white text-2xl uppercase font-semibold'>Superhost App</h6>
        <label htmlFor="my-modal-6" className="btn modal-button">Login</label>
        <input type="checkbox" id="my-modal-6" className="modal-toggle" />
        <LoginModal showLoadingSpinner={showLoadingSpinner} onLoginSubmit={onLoginSubmit} />
      </main>
    </div>
  )
}
