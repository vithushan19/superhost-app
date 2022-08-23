import Head from 'next/head'

import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase-config'
import { SparklesIcon } from '@heroicons/react/outline'
import InvitationCard from '../../components/InvitationCard'
import { useRouter } from 'next/router'

const Event = ({ eventID, event }) => {
  const router = useRouter()

  const onRSVPButtonPress = () => {
    router.push({
      pathname: '/event-rsvp',
      query: {
        eventID: eventID,
        event: JSON.stringify(event)
      }
    })
  }

  const RSVPToEventButton = () => (
    <button type="button" onClick={onRSVPButtonPress} className="justify-center flex text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4 mb-2 w-full">
      <SparklesIcon className='text-white h-5 w-5 mr-2' />
      RSVP to Event
    </button>
  )

  return (
    <>
      <Head>
        <title>{event.eventTitle}</title>
        <meta name="description" content={event.location} />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://app.usesuperhost.com/events/${eventID}`} key="ogurl" />
        <meta property="og:image" content="/favicon.ico" key="ogimage" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:site_name" content="Superhost" key="ogsitename" />
        <meta property="og:title" content={event.eventTitle} key="ogtitle" />
        <meta property="og:description" content={event.location} key="ogdesc" />
      </Head>
      <InvitationCard title={event.eventTitle} imageURL={event.imageURL} message={event.message} location={event.location} startDate={event.startDate} endDate={event.endDate} primaryButton={<RSVPToEventButton />} />
    </>
  )
}

export async function getServerSideProps(context) {
  const eventID = context.params.id
  const eventRef = doc(db, "events", eventID)
  const eventSnap = await getDoc(eventRef)
  
  return {
    props: { eventID, event: eventSnap.exists() ? eventSnap.data() : null }
  }
}
  

export default Event