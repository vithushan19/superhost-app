import Head from 'next/head'

import { atcb_action } from 'add-to-calendar-button'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase-config'
import { CalendarIcon, SparklesIcon } from '@heroicons/react/outline'
import { format } from 'date-fns'
import Link from 'next/link'
import InvitationCard from '../../components/InvitationCard'

const Event = ({ eventID, event}) => {
  const addToCalendarPress = () => {
    atcb_action({
      name: `${event.eventTitle}`,
      startDate: format(new Date(event.startDate), 'yyyy-MM-dd').toString(),
      startTime: format(new Date(event.startDate), 'hh:mm').toString(),
      endDate: format(new Date(event.endDate), 'yyyy-MM-dd').toString(),
      endTime: format(new Date(event.endDate), 'hh:mm').toString(),
      options: ['Apple', 'Google', 'Outlook.com'],
      location: `${event.location}`,
      timeZone: 'Europe/Berlin',
      trigger: 'click',
      iCalFileName: 'Reminder-Event',
    })
  }

  const AddToCalendarButton = () => (
    <button type="button" onClick={addToCalendarPress} className="justify-center flex text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-5 w-full">
        <CalendarIcon className='text-black h-5 w-5 mr-2'/>
        Add to Calendar
    </button>
  )

  const RSVPToEventButton = () => (
    <Link href={{
      pathname: '/event-rsvp/',
      query: {
        id: eventID,
        questionData: JSON.stringify(event.questions)
      }
    }}>
      <button type="button" className="justify-center flex text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-2 w-full">
        <SparklesIcon className='text-white h-5 w-5 mr-2' />
        RSVP to Event
      </button>
    </Link>
  )

  return (
    <>
      <Head>
        <title>{event.eventTitle}</title>
        <meta name="description" content={event.location} />
        <link rel="icon" href={event.imageURL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://app.usesuperhost.com/events/${eventID}`} key="ogurl" />
        <meta property="og:image" content={event.imageURL} key="ogimage" />
        <meta property="og:site_name" content="Superhost" key="ogsitename" />
        <meta property="og:title" content={event.eventTitle} key="ogtitle" />
        <meta property="og:description" content={event.location} key="ogdesc" />
      </Head>
      <div className="flex flex-col justify-between h-screen w-full" style={{ padding: "0 1rem", backgroundImage: "radial-gradient(73% 147%, #EADFDF 59%, #ECE2DF 100%), radial-gradient(91% 146%, rgba(255,255,255,0.50) 47%, rgba(0,0,0,0.50) 100%)", backgroundBlendMode: "screen" }}>
        <InvitationCard title={event.eventTitle} imageURL={event.imageURL} message={event.message} location={event.location} startDate={event.startDate} endDate={event.endDate} primaryButton={<AddToCalendarButton />} secondaryButton={<RSVPToEventButton />} />
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

export async function getServerSideProps(context) {
  const eventID = context.params.id
  const eventRef = doc(db, "events", eventID)
  const eventSnap = await getDoc(eventRef)
  
  return {
    props: { eventID, event: eventSnap.exists() ? eventSnap.data() : null }
  }
}
  

export default Event