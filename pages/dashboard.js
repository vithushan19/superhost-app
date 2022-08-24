import { collection, getDocs, query, where } from 'firebase/firestore'
import { Button } from 'flowbite-react'
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
                email: hostEmail,
                formState: "{}"
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
        <div className='px-3 bg-gray-800'>
            <main className="flex flex-col items-center py-6 h-screen">
                <div className='w-full flex justify-between'>
                    <Button color="dark" size="sm" pill={true} onClick={() => router.back()}>
                        <Link href="/">
                            Logout
                        </Link>
                    </Button>
                    <Button gradientDuoTone='cyanToBlue' onClick={onCreateEvent}>
                        Create Event
                    </Button>
                </div>
                <div className='w-full my-5'>
                    <div className='my-5 text-sm font-semibold text-white'>Select an event to view the guest count.</div>
                    { events.length > 0 && <ul className="w-full text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        {
                            events.map(event => {
                                const location = event.data.location

                                return (<li key={event.id} className="py-4 px-4 w-full border-b border-gray-200 dark:border-gray-600">
                                    <Link href={`/share-event/${encodeURIComponent(event.id)}`}>
                                        <div className='flex flex-col text-left gap-2'>
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
            </main>
        </div>
    )
}

export default Dashboard