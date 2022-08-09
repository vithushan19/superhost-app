import Image from 'next/image'
import Head from 'next/head'

import { atcb_action } from 'add-to-calendar-button'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '../../utils/firebase-config'
import CardDetails from '../../components/CardDetails'
import { CalendarIcon, ClockIcon, LocationMarkerIcon, SparklesIcon } from '@heroicons/react/outline'
import { format } from 'date-fns'
import Link from 'next/link'

const Event = ({ eventID, event }) => {
  const dateDetails = `${event.startDate} - ${event.endDate}`

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

  return (
    <div className="flex flex-col justify-center items-center h-full w-full bg-black" style={{ padding: "0 1rem" }}>
      <Head>
        <title>{event.eventTitle}</title>
        <meta name="description" content={event.location} />
        <link rel="icon" href={"https://ik.imagekit.io/ikmedia/women-dress-2.jpg"} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:url" content={`https://app.usesuperhost.com/events/${eventID}`} key="ogurl" />
        <meta property="og:image" content={"https://ik.imagekit.io/ikmedia/women-dress-2.jpg"} key="ogimage" />
        <meta property="og:site_name" content="Superhost" key="ogsitename" />
        <meta property="og:title" content={event.eventTitle} key="ogtitle" />
        <meta property="og:description" content={event.location} key="ogdesc" />
      </Head>
      <div className="flex flex-col justify-center items-center h-screen w-full bg-black">
        <div className="flex flex-col justify-between bg-contain bg-center bg-no-repeat h-full w-full" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2)), url("https://ik.imagekit.io/ikmedia/women-dress-2.jpg")` }}>
          <div className="bg-gradient-to-b from-black to-transparent">
            <p className="text-stone-100 text-2xl text-center font-dancingScript tracking-wide pt-5">
              {"You're invited to"}
            </p>
            <p className="text-stone-100 font-bold text-xl mt-5 uppercase text-center">
              {event.eventTitle}
            </p>
          </div>
          <div className="flex flex-col items-stretch pb-5 gap-2 bg-gradient-to-t from-black-900 to-transparent">
            <div className="backdrop-blur-sm my-5">
              <p className="text-white text-left">{event.message}</p>
            </div>
            <CardDetails
              text={dateDetails}
              icon={<ClockIcon className="mr-1 h-5 w-5 text-stone-900" />}
            />
            <CardDetails
              text={
                <p>
                  <u>{event.location}</u>
                </p>
              }
              icon={
                <LocationMarkerIcon className="mr-1 h-5 w-5 text-stone-900" />
              }
            />
          </div>
        </div>
        <div className="self-center flex flex-col w-96">
          <button type="button" onClick={addToCalendarPress} className="justify-center flex text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-3 mb-2">
            <CalendarIcon className='text-black h-5 w-5 mr-2'/>
            Add to Calendar
          </button>
          <Link href={{
            pathname: '/event-rsvp/',
            query: {
              id: eventID,
              questionData: JSON.stringify(event.questions)
            }
          }}>
            <button type="button" className="justify-center flex text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-3 mb-2">
              <SparklesIcon className='text-white h-5 w-5 mr-2' />
              RSVP to Event
            </button>
          </Link>
        </div>
      </div>
      <footer className="text-white border-t w-full mt-2 mb-4 border-white py-4 text-center">
        <a
          href="https://usesuperhost.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <b>SUPERHOST</b>
        </a>
      </footer>
    </div>
  )
}

export async function getStaticPaths() {
  const querySnapshot = await getDocs(collection(db, "events"))

  return {
    paths: querySnapshot.docs.map((doc) => {
        return { params: { id: doc.id }}
      }),
      fallback: false
  }
}

export async function getStaticProps(context) {
  const eventID = context.params.id
  const eventRef = doc(db, "events", eventID)
  const eventSnap = await getDoc(eventRef)

  return {
    props: { eventID, event: eventSnap.exists() ? eventSnap.data() : {} }
  }
}
  

export default Event