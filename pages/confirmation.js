import {
  PencilAltIcon,
  SparklesIcon,
} from "@heroicons/react/outline"
import { useRouter } from "next/router"
import { db } from "../utils/firebase-config"
import { doc, collection, addDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { useEffect, useState } from "react"
import ShareModal from "../components/ShareModal"
import InvitationCard from "../components/InvitationCard"

const Confirmation = () => {
  const router = useRouter()

  const {
    hostEmail,
    eventLocation,
    startDate,
    endDate,
    imageURL,
    savedQuestions
  } = router.query

  const [cardTitle, setCardTitle] = useState("Create a Title")
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false)
  const [showShareSpinner, setShowShareSpinner] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [isPortraitImage, setIsPortraitImage] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [eventId, setEventId] = useState("")
  
  useEffect(() => {
    const image = new Image()
    image.src = imageURL
    
    image.onload = () => {
      const isPortrait = image.height > image.width
      
      setIsPortraitImage(isPortrait)
      setIsLoading(false)
    }
  })

  const onCreateEvent = async (event) => {
    event.preventDefault()
    setShowLoadingSpinner(true)

    let questionsData = []

    if (savedQuestions !== undefined) {
        questionsData = Array.isArray(savedQuestions) ? savedQuestions : new Array(savedQuestions)
    }

    const eventRef = await addDoc(collection(db, "events"), {
      host: hostEmail,
      eventTitle: cardTitle,
      location: eventLocation,
      startDate: startDate,
      endDate: endDate,
      questions: questionsData,
      imageURL: imageURL,
      type: isPortraitImage ? "portrait" : "landscape"
    })

    await updateDoc(doc(db, "hosts", hostEmail), {
      events: arrayUnion(eventRef.id)
    })

    setShowShareModal(true)
    setEventId(eventRef.id)

    setShowLoadingSpinner(false)
  }

  const onTitleChange = (event) => {
    setCardTitle(event.target.value)
  }

  const onMakeChanges = (event) => {
    event.preventDefault()
    
    router.push({
      pathname: '/create-event',
      query: {
        hostEmail: hostEmail,
        formData: JSON.stringify({
          eventLocation,
          startDate,
          endDate,
          savedQuestions: savedQuestions,
        })
      }
    })
  }

  const onSharePress = async (event) => {
    event.preventDefault()
    
    setShowShareSpinner(true)
  
    if (navigator.share) {
      navigator.share({
        title: cardTitle,
        text: '',
        url: `https://app.usesuperhost.com/events/${eventId}`
      }).then(() => {
        setShowShareSpinner(false)
      }).catch((error) => {
        setShowShareSpinner(false)
        alert("Please try again later on a mobile device.")
      })
    }
  }

  const MakeChangesButton = () => (
    <button type="button" onClick={onMakeChanges} className="mt-2 self-end inline-flex text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
      <PencilAltIcon className='text-white h-5 w-5 mr-2'/>
      Make Changes
    </button>
  )

  const CreateEventButton = () => {
    return (
      showLoadingSpinner ? <button disabled type="button" className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-pink-800 inline-flex items-center justify-center w-full">
      <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
      </svg>
      Loading...
  </button> : <button type="button" onClick={onCreateEvent} className="justify-center flex text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full">
      <SparklesIcon className='text-white h-5 w-5 mr-2'/>
      Create Event
    </button>
    )
  }

  return (
    <>
      <div className={`flex flex-col h-screen w-full bg-gray-900 justify-center items-center ${ isLoading ? 'block' : 'hidden' }`}>
                <p className="text-white text-2xl mb-5">Loading...</p>
                <div role="status">
                    <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
      </div>
      <div className={`${isLoading ? 'hidden' : 'block'}`}>
        <ShareModal showModal={showShareModal} showSpinner={showShareSpinner} setShowModal={setShowShareModal} onSharePress={onSharePress} />
        <InvitationCard isEditable={true} title={cardTitle} onTitleChange={onTitleChange} imageURL={imageURL} location={eventLocation} startDate={startDate} endDate={endDate} primaryButton={<CreateEventButton />} secondaryButton={<MakeChangesButton/>} isPortraitImage={isPortraitImage} />
      </div>
    </>
  )
}

export default Confirmation