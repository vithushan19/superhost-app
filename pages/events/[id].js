import Head from 'next/head'

import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase-config'
import { SparklesIcon } from '@heroicons/react/outline'
import InvitationCard from '../../components/InvitationCard'
import { useRouter } from 'next/router'
import PlainTextCard from '../../components/PlainTextCard'

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
    <button className="btn btn-block glass text-white" onClick={onRSVPButtonPress}>
      <SparklesIcon className='h-5 w-5 mr-2' />
      RSVP to Event
    </button>
  )

  return (
    <>
      <Head>
        <title>{event.eventTitle}</title>
        <meta name="description" content={event.location} />
        <link rel="icon" href="/superhost-icon.ico" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://app.usesuperhost.com/events/${eventID}`} key="ogurl" />
        <meta property="og:site_name" content="Superhost" key="ogsitename" />
        <meta property="og:title" content={event.eventTitle} key="ogtitle" />
        <meta property="og:description" content={event.location} key="ogdesc" />
      </Head>
      {
        event.type === 'portrait' && <InvitationCard title={event.eventTitle} imageURL={event.imageURL} location={event.location} startDate={event.startDate} endDate={event.endDate} primaryButton={<RSVPToEventButton />} isPortraitImage={true} />
      }
      {
        event.type === 'landscape' && <InvitationCard title={event.eventTitle} imageURL={event.imageURL} location={event.location} startDate={event.startDate} endDate={event.endDate} primaryButton={<RSVPToEventButton />} isPortraitImage={false} />
      }
      {
        event.type === 'plainText' && <PlainTextCard titlePos={JSON.parse(event.designProps.titlePos)} detailsPos={JSON.parse(event.designProps.detailsPos)} title={event.eventTitle} titleFont={event.designProps.titleFont} titleColor={event.designProps.titleColor} backgroundURL={event.cardBackground} startDate={event.startDate} endDate={event.endDate} location={event.location} onRSVP={onRSVPButtonPress} />
      }
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