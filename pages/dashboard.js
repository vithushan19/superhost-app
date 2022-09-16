import { collection, getDocs, query, where } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { db } from '../utils/firebase-config'

const Dashboard = () => {
    const router = useRouter()
    const hostEmail = router.query.hostEmail ?? ""
    const [events, setEvents] = useState([])

    const onCreateEvent = (event) => {
        event.preventDefault()

        router.push({
            pathname: '/create-event',
            query: {
                hostEmail
            }
        })
    }

    useEffect(() => {
        const fetchFirestoreData = async () => {
            const eventData = []
            
            const q = query(collection(db, "events"), where("host", "==", hostEmail))
            const querySnapshot = await getDocs(q)

            querySnapshot.forEach((doc) => {
                eventData.push({ id: doc.id, data: doc.data() })
            })

            setEvents(eventData)
        }

        fetchFirestoreData()
    }, [hostEmail])

    return (
        <div className='flex flex-col items-center py-6 h-screen px-3 bg-base-100'>
            <div className='w-full flex justify-between'>
                <button className='btn' onClick={() => router.back()}>
                    <Link href="/">
                        Logout
                    </Link>
                </button>
                <button className='btn btn-primary' onClick={onCreateEvent}>
                    Create Event
                </button>
            </div>
            <div className='w-full my-5'>
                <h6 className='my-5'>Select an event to view the guest count.</h6>
                { events.length > 0 && <ul className="menu bg-base-100 w-full">
                    {
                        events.map(event => {
                            const location = event.data.location

                            return (<li key={event.id} className="py-4 px-4 w-full border-b border-gray-200 dark:border-gray-600">
                                <Link href={`/guestlist/${encodeURIComponent(event.id)}`}>
                                    <div className='flex flex-col items-start'>
                                        <p>{event.data.eventTitle}</p>
                                        <p className="text-xs text-blue-500">{location.substring(0, location.indexOf(','))}</p>
                                        <p className="text-xs text-blue-500">{`${event.data.startDate} - ${event.data.endDate}`}</p>
                                    </div>
                                </Link>
                            </li>)
                        })
                    }
                </ul>}
                {
                    events.length === 0 && <p className='w-full text-center text-blue-500'>No events to display yet. Create your first event!</p>
                }
            </div>
        </div>
    )
}

export default Dashboard