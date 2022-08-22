import { collection, doc, getDoc, getDocs, query } from "firebase/firestore"
import { Button, Card, Table } from "flowbite-react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { db } from "../../utils/firebase-config"
import { QUESTIONS_DATA } from "../../utils/questions-data"

const GuestList = () => {
    const router = useRouter()
    const eventId = router.query.id
    const [guests, setGuests] = useState([])
    const [shouldDisplayPhoneNumbers, setShouldDisplayPhoneNumbers] = useState(false)
    const [eventQuestions, setEventQuestions] = useState([])
    const [countMap, setCountMap] = useState(new Map())

    useEffect(() => {
        const fetchFirestoreData = async () => {
            if (eventId) {
                const guestData = []
                const answersData = new Map()
                const answersCountData = new Map()
            
                const eventRef = doc(db, "events", String(eventId))
                const eventSnap = await getDoc(eventRef)
                
                const eventData = eventSnap.data()
                
                const q = query(collection(db, `events/${eventId}/guests`))
                const querySnapshot = await getDocs(q)

                querySnapshot.forEach((doc) => {
                    guestData.push({ id: doc.id, data: doc.data() })

                    for (const [id, answer] of Object.entries(doc.data().answers)) {
                        if (answersData.has(id)) {
                            const answersArray = answersData.get(id)
                            answersArray.push(answer)
                        } else {
                            answersData.set(id, [answer])
                        }
                    }

                    if (answersData.has("0")) {
                        const rsvpStatusArray = answersData.get("0")
                        rsvpStatusArray.push(doc.data().rsvpStatus)
                    } else {
                        answersData.set("0", [doc.data().rsvpStatus])
                    }
                })

                for (const [id, answers] of answersData) {
                    const count = {}

                    for (const element of answers) {
                        if (count[element]) {
                            count[element] += 1
                        } else {
                            count[element] = 1
                        }
                    }

                    answersCountData.set(id, Object.entries(count).map(entry => { return { name: entry[0], value: entry[1]  } }))
                }

                setGuests(guestData)
                setEventQuestions(eventData.questions)
                setShouldDisplayPhoneNumbers(eventData.shouldCollectNumbers)
                setCountMap(answersCountData)
            }
        }

        fetchFirestoreData()
    }, [eventId])

    return (
        <div className="px-4 py-0 bg-gray-900">
            <main className="flex flex-col items-stretch px-2 py-6 h-screen gap-3">
                <Button color="dark" pill={true} onClick={() => router.back()} size='sm'>
                    Go Back
                </Button>
                <Card className="text-lg flex flex-col gap-1.5">
                    <h6 className="text-center text-lg font-bold text-white">Guest Responses</h6>
                    {Array.from(countMap.keys()).map((key, id) => {
                        if (key === "0") {
                            const attendingCount = countMap.get(key).filter(element => element.name === "Attending").length ?? 0
                            return (
                                <div className="inline-flex gap-2"><p className="font-semibold text-gray-300">Attending Event: </p><p className="text-blue-600">{attendingCount.value}</p></div>
                            )
                        } else if (key === "1") {
                            const attendingCount = countMap.get(key).filter(element => element.name === "Attending").length ?? 0
                            return (
                                <div className="inline-flex gap-2"><p className="font-semibold text-gray-300">Attending Pregame: </p><p className="text-blue-600">{attendingCount.value}</p></div>
                            )
                        } else if (key === "2") {
                            const attendingCount = countMap.get(key).filter(element => element.name === "true").length ?? 0
                            return (
                                <div className="inline-flex gap-2"><p className="font-semibold text-gray-300">Bringing a +1: </p><p className="text-blue-600">{attendingCount.value}</p></div>
                            )
                        } else if (key === "3") {
                            const drinkingCount = countMap.get(key).filter(element => element.name === "true").length ?? 0
                            return (
                                <div className="inline-flex gap-2"><p className="font-semibold text-gray-300">Will be drinking: </p><p className="text-blue-600">{drinkingCount.value}</p></div>
                            )
                        }
                    })}
                </Card>
            <Table className="text-xs">
                <Table.Head>
                    <Table.HeadCell>
                        Name
                    </Table.HeadCell>
                    {
                        shouldDisplayPhoneNumbers && <Table.HeadCell>Phone Number</Table.HeadCell>
                    }
                    <Table.HeadCell>
                        RSVP Status
                    </Table.HeadCell>
                    {
                        QUESTIONS_DATA.map((data, id) => {
                            if (eventQuestions.indexOf(data.id) !== -1) {
                                return <Table.HeadCell key={id}>
                                    {data.columnName}
                                </Table.HeadCell>
                            }
                        })
                    }
                </Table.Head>
                <Table.Body className="divide-y">
                    {
                        guests.map((guest, id) => {
                            return (
                                <Table.Row key={id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {guest.id}
                                    </Table.Cell>
                                    {shouldDisplayPhoneNumbers && <Table.Cell>{guest.data.phoneNumber}</Table.Cell>}
                                    <Table.Cell>
                                        {guest.data.rsvpStatus}
                                    </Table.Cell>
                                    {Object.values(guest.data.answers).map((response, id) => {
                                        const answer = String(response)
                                        return <Table.Cell key={id}>{answer}</Table.Cell>
                                    })}
                                </Table.Row>
                            )
                        })
                    }
                </Table.Body>
                </Table>
                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    <Link
                        href={`/share-event/${encodeURIComponent(eventId)}`}>
                        View Event Page
                    </Link>
                </button>
            </main>
        </div>
    )
}

export default GuestList