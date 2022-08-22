import { SparklesIcon } from "@heroicons/react/outline";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import InvitationCard from "../../components/InvitationCard";
import { db } from "../../utils/firebase-config";

const ShareEvent = () => {
    const router = useRouter()
    const eventId = router.query.id
    const [event, setEvent] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            if (eventId) {
                const eventRef = doc(db, "events", String(eventId))
                const eventSnap = await getDoc(eventRef)

                setEvent(eventSnap.data())
            }
        }

        fetchData()
    }, [eventId])

    const ShareButton = () => {
        if (loading) {
            return (
                <button disabled type="button" className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-pink-800 inline-flex items-center justify-center my-2 w-full">
                    <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>
                    Loading...
                </button>)
        } else {
            return (
                <button type="button" onClick={onSharePress} className="justify-center flex text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4 mb-2 w-full">
                    <SparklesIcon className='text-white h-5 w-5 mr-2' />
                    Share Event
                </button>)
        }
    }
    
    const onSharePress = async (event) => {
        event.preventDefault()
        
        setLoading(true)
      
        if (navigator.share) {
          navigator.share({
            title: title,
            text: 'Your invited!',
            url: `https://app.usesuperhost.com/events/${eventId}`
          }).then(() => {
            setLoading(false)
          }).catch((error) => {
            setLoading(false)
            alert("Please try again later on a mobile device.")
          })
        }
    }

    return (
        <>
          <div className="flex flex-col justify-between h-screen w-full" style={{ padding: "0 1rem", backgroundImage: "radial-gradient(73% 147%, #EADFDF 59%, #ECE2DF 100%), radial-gradient(91% 146%, rgba(255,255,255,0.50) 47%, rgba(0,0,0,0.50) 100%)", backgroundBlendMode: "screen" }}>
            <InvitationCard title={event.eventTitle} imageURL={event.imageURL} message={event.message} location={event.location} startDate={event.startDate} endDate={event.endDate} primaryButton={<ShareButton />} />
          </div>
          <footer className="border-t w-full border-black py-4 text-center" style={{ backgroundImage: "radial-gradient(73% 147%, #EADFDF 59%, #ECE2DF 100%), radial-gradient(91% 146%, rgba(255,255,255,0.50) 47%, rgba(0,0,0,0.50) 100%)"}}>
            <a
              href="https://usesuperhost.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by <b>SUPERHOST</b>
            </a>
          </footer>
        </>
    )
}

export default ShareEvent