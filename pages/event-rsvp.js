import { MailIcon } from "@heroicons/react/outline"
import { doc, setDoc } from "firebase/firestore"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import SuccessRSVPModal from "../components/SuccessRSVPModal"
import { db } from "../utils/firebase-config"
import { QUESTIONS_DATA } from "../utils/questions-data"

const EventRSVP = () => {
    const router = useRouter()
    const eventID = router.query.eventID

    const [event, setEvent] = useState({})
    const [questionIds, setQuestionIds] = useState([])
    const [name, setName] = useState("")
    const [status, setStatus] = useState("Attending")
    const [answers, setAnswers] = useState(new Map())

    const [showLoadingSpinner, setShowLoadingSpinner] = useState(false)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        if (router.query.event !== undefined) {
            const event = JSON.parse(router.query.event)
            const questions = event.questions.map(question => { return parseInt(question) })
            const answersMap = new Map()

            setEvent(event)
            setQuestionIds(questions)
            
            for (const question of questions) {
                switch (question) {
                    case 1:
                        answersMap.set(1, "Attending")
                        break
                    case 2:
                        answersMap.set(2, false)
                        break
                    case 3:
                        answersMap.set(3, false)
                        break
                    default:
                        break
                }
            }

            setAnswers(answersMap)
        }
    }, [router.query.event])

    const updateAnswers = (questionId, newValue) => {
        setAnswers(new Map(answers.set(questionId, newValue)))
    }

    const onRSVPSubmit = async (event) => {
        event.preventDefault()

        setShowLoadingSpinner(true)
        let responseCollection = {}

        responseCollection = {
            rsvpStatus: status,
            answers: Object.fromEntries(answers)
        }
        
        await setDoc(doc(db, `/events/${eventID}/guests`, name), responseCollection)

        setShowLoadingSpinner(false)
        setShowModal(true)
    }

    return (
        <>
            <SuccessRSVPModal showModal={showModal} eventID={eventID} event={event} />
            <div className={`flex flex-col py-5 h-screen ${showModal ? "opacity-30" : "opacity-100"}`}>
                {
                    showLoadingSpinner ?
                        <button disabled type="button" className="btn btn-success loading mr-5 mb-2 self-end">
                            Loading...
                        </button> :
                        <button type='submit' className="btn btn-success gap-2 mr-5 mb-2 self-end" form='rsvpform'>
                            <MailIcon className="mr-2 h-5 w-5" />
                            Submit RSVP
                        </button>
                }
                <form id="rsvpform" className='flex flex-col items-stretch justify-center gap-4 mx-3' onSubmit={onRSVPSubmit}>
                    <label className="label">Your Name</label>
                    <input required value={name} onChange={(event) => { setName(event.target.value) } } type="text" placeholder="Bruce Wayne" className="input input-bordered w-full max-w-xs" />
                    <label className="label">Attending?</label>
                    <select id="status" required value={status} onChange={(event) => { setStatus(event.target.value) }} className="select select-bordered w-full max-w-xs">
                        <option value="Attending">{"I'll be there!"}</option>
                        <option value="Maybe">{"Not sure yet."}</option>
                        <option value="Declined">{"I can't make it."}</option>
                    </select>
                    {
                        QUESTIONS_DATA.map((question) => {
                            if (questionIds.indexOf(question.id) !== -1) {
                                return <div key={question.id}>
                                    {
                                        (question.type === 'boolean') &&
                                        <label className="label cursor-pointer"><label className="label-text">{question.title}</label><input type="checkbox" className="toggle" style={{ backgroundImage: 'none' }} checked={answers.get(question.id) ?? false} onChange={(event) => { updateAnswers(question.id, !answers.get(question.id)) }} /></label>
                                    }
                                    {
                                        (question.type === 'rsvp') &&
                                        <>
                                            <label className="label">{question.title}</label>
                                            <select id={`question + ${question.id}`} required={true} value={answers.get(question.id)} onChange={(event) => { updateAnswers(question.id, event.target.value) }} className="select select-bordered w-full max-w-xs">
                                                <option value="Attending">{"I'll be there!"}</option>
                                                <option value="Maybe">{"Not sure yet."}</option>
                                                <option value="Declined">{"I can't make it."}</option>
                                            </select>
                                        </>
                                    }
                                </div>
                            }
                        })
                    }
                </form>
            </div>
        </>
    )
}

export default EventRSVP