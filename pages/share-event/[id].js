import { SparklesIcon } from "@heroicons/react/outline";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import InvitationCard from "../../components/InvitationCard";
import PlainTextCard from "../../components/PlainTextCard";
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

    const ShareButton = () => (
        loading ? <button className="btn loading my-2 btn-block">Loading...</button> : <button className="btn my-2 btn-block" onClick={onSharePress}>
        <SparklesIcon className='h-5 w-5 mr-2' />
        Share Event
    </button>
    )
    
    const onSharePress = async (event) => {
        event.preventDefault()
        
        setLoading(true)
      
        if (navigator.share) {
          navigator.share({
            title: event.eventTitle,
            text: '',
            url: `https://app.usesuperhost.com/events/${eventId}`
          }).then(() => {
            setLoading(false)
          }).catch((error) => {
            setLoading(false)
            alert("Please try again later on a mobile device.", error)
          })
        }
    }

    return (
        <>
            {
                event.type === 'portrait' && <InvitationCard title={event.eventTitle} imageURL={event.imageURL} location={event.location} startDate={event.startDate} endDate={event.endDate} primaryButton={<ShareButton />} isPortraitImage={true} />
            }
            {
                event.type === 'landscape' && <InvitationCard title={event.eventTitle} imageURL={event.imageURL} location={event.location} startDate={event.startDate} endDate={event.endDate} primaryButton={<ShareButton />} isPortraitImage={false} />
            }
            {
                event.type === 'plainText' && <PlainTextCard titlePos={JSON.parse(event.designProps.titlePos)} detailsPos={JSON.parse(event.designProps.detailsPos)} title={event.eventTitle} titleFont={event.designProps.titleFont} titleColor={event.designProps.titleColor} backgroundURL={event.cardBackground} startDate={event.startDate} endDate={event.endDate} location={event.location} primaryButton={<ShareButton />} />
            }
        </>
    )
}

export default ShareEvent