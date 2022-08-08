import { Button, Modal, Spinner } from "flowbite-react"
import {
  ClockIcon,
  LocationMarkerIcon,
  PencilAltIcon,
  SparklesIcon,
  XIcon,
} from "@heroicons/react/outline"
import { useRouter } from "next/router"
import { db } from "../utils/firebase-config"
import { doc, collection, addDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { useState } from "react"
import ShareModal from "../components/ShareModal"
import CardDetails from "../components/CardDetails"

const Confirmation = () => {
  const router = useRouter()

  const {
      hostEmail,
      title,
      eventLocation,
      startDate,
      endDate,
      image,
      eventMessage,
      q1Enabled,
      q2Enabled,
      q3Enabled,
  } = router.query
    
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  
  const dateDetails = `${startDate} - ${endDate}`
    
  const onCreateEvent = async (event) => {
    event.preventDefault()
    setShowLoadingSpinner(true)

    const eventRef = await addDoc(collection(db, "events"), {
      eventTitle: title,
      location: eventLocation,
      startDate: startDate,
      endDate: endDate,
      message: eventMessage,
      questions: {
          1: q1Enabled,
          2: q2Enabled,
          3: q3Enabled,
      },
    })

    await updateDoc(doc(db, "hosts", hostEmail), {
      events: arrayUnion(eventRef.id)
    })

    setShowShareModal(true)
    setShowLoadingSpinner(false)
  }

  const onSharePress = async (event) => {
      event.preventDefault()
  
      if (navigator.share) {
          navigator.share({
              title: title,
              text: 'Your invited!',
              url: 'https://app.superhost.com/events/1234'
          }).then(() => {
              console.log("Successful Share!")
          }).catch((error) => {
              console.log('Error sharing', error)
          })
      }
  }
    
  return (
    <>
      <ShareModal showModal={showShareModal} setShowModal={setShowShareModal} onSharePress={onSharePress} />
      <div className="flex flex-col justify-center items-center h-screen w-full bg-black" style={{ padding: "0 1rem" }}>
        <div className="flex flex-col justify-between bg-contain bg-center bg-no-repeat h-full" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2)), url("https://ik.imagekit.io/ikmedia/women-dress-2.jpg")` }}>
          <div className="bg-gradient-to-b from-black to-transparent">
            <p className="text-stone-100 text-2xl text-center font-dancingScript tracking-wide pt-5">
              {"You're invited to"}
            </p>
            <p className="text-stone-100 font-bold text-xl mt-5 uppercase text-center">
              {title}
            </p>
          </div>
          <div className="flex flex-col items-stretch pb-5 gap-2 bg-gradient-to-t from-black-900 to-transparent">
            <div className="backdrop-blur-sm my-5">
              <p className="text-white text-left">{eventMessage}</p>
            </div>
            <CardDetails
              text={dateDetails}
              icon={<ClockIcon className="mr-1 h-5 w-5 text-stone-900" />}
            />
            <CardDetails
              text={
                <p>
                  <u>{eventLocation}</u>
                </p>
              }
              icon={
                <LocationMarkerIcon className="mr-1 h-5 w-5 text-stone-900" />
              }
            />
          </div>
        </div>
        <div className="self-center flex flex-col items-stretch w-full mx-5 h-1/6">
          <button type="button" className="justify-center flex text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
            <PencilAltIcon className='text-black h-5 w-5 mr-2'/>
            Make Changes
          </button>
          <button type="button" onClick={onCreateEvent} className="justify-center flex text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2">
            <SparklesIcon className='text-white h-5 w-5 mr-2'/>
            {showLoadingSpinner ? "Loading..." : "Create Event"}
          </button>
        </div>
      </div>
    </>
  )
}

export default Confirmation