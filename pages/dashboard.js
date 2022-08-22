import { collection, getDocs, query, where } from 'firebase/firestore'
import { Button, ListGroup } from 'flowbite-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { db } from '../utils/firebase-config'

const Dashboard = () => {
    const router = useRouter()
    const hostEmail = router.query.hostEmail ?? ""
    const [events, setEvents] = useState([])

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
                <div className="self-end">
                    <Button color="dark" size="sm" pill={true} onClick={() => router.back()}>
                        <Link href="/">
                            Logout
                            </Link>
                    </Button>
                    </div>
                <div className='w-full my-5'>
                    <div className='my-5 text-sm font-semibold text-white'>Select an event to view the guest count.</div>
                    <ListGroup>
                        {
                            events.map(event => {
                                const location = event.data.location

                                return (<ListGroup.Item key={event.id} href={`/guestlist/${encodeURIComponent(event.id)}`}>
                                    <div className='flex flex-col text-left gap-2'>
                                        <p>{event.data.eventTitle}</p>
                                        <p className="text-xs text-blue-500">{location.substring(0, location.indexOf(','))}</p>
                                        <p className="text-xs text-blue-500">{`${event.data.startDate} - ${event.data.endDate}`}</p>
                                    </div>
                                </ListGroup.Item>)
                            })
                        }
                    </ListGroup>
                </div>
            </main>
        </div>
    )
}

export default Dashboard