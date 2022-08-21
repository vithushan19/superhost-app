import { MailIcon } from "@heroicons/react/outline"
import { doc, setDoc } from "firebase/firestore"
import { Label, Textarea, TextInput, ToggleSwitch } from "flowbite-react"
import { useRouter } from "next/router"
import { useState } from "react"
import SuccessRSVPModal from "../components/SuccessRSVPModal"
import { db } from "../utils/firebase-config"
import { QUESTIONS_DATA } from "../utils/questions-data"

const EventRSVP = () => {
    const router = useRouter()
    const questionIds = JSON.parse(router.query.questionIds ?? "[]")
    const shouldCollectNumbers = router.query.questionIds === 'true'
    const eventID = router.query.id

    const [name, setName] = useState("")
    const [status, setStatus] = useState("Attending")
    const [answers, setAnswers] = useState((questionIds.indexOf(1) !== -1) ? new Map(Object.entries({ 1: "Attending" })) : new Map())

    const [showLoadingSpinner, setShowLoadingSpinner] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState("")

    const updateAnswers = (questionId, newValue) => {
        setAnswers(new Map(answers.set(questionId, newValue)))
    }

    const onRSVPSubmit = async (event) => {
        event.preventDefault()

        setShowLoadingSpinner(true)
        let responseCollection = {}

        responseCollection = shouldCollectNumbers ?
            {
                rsvpStatus: status,
                answers: answers,
                phoneNumber: phoneNumber
            } : {
                rsvpStatus: status,
                answers: Object.fromEntries(answers)
            }
        
        await setDoc(doc(db, `/events/${eventID}/guests`, name), responseCollection)

        setShowLoadingSpinner(false)
        setShowModal(true)
    }

    return (
        <div className="flex flex-col py-5 bg-stone-50 h-screen">
            <SuccessRSVPModal showModal={showModal} eventID={eventID} />
            {
                showLoadingSpinner ? <button disabled type="button" className="self-end text-white bg-gradient-to-br from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 text-center mr-5 dark:focus:ring-cyan-800 inline-flex items-center justify-center">
                <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                </svg>
                Loading...
            </button> : <button type='submit' className="flex text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-5 mb-2 self-end bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800" form='rsvpform'>
                <MailIcon className="mr-2 h-5 w-5"/>
                Submit RSVP
            </button>
            }
            <form id="rsvpform" className='flex flex-col items-stretch justify-center gap-4 mx-3' onSubmit={onRSVPSubmit}>
                <div className="mb-2 block px-2.5">
                    <Label
                        htmlFor="name"
                        value="Your Name"
                    />
                    <TextInput
                        id="name"
                        type="text"
                        placeholder="Bruce Wayne"
                        required={true}
                        value={name}
                        onChange={(event) => { setName(event.target.value) }}
                    />
                </div>
                <div className="mb-2 block px-2.5">
                    <Label
                        htmlFor="status"
                        value="Attending?"
                    />
                    <select id="status" required value={status} onChange={(event) => { setStatus(event.target.value) }} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="Attending">{"I'll be there!"}</option>
                        <option value="Maybe">{"Not sure yet."}</option>
                        <option value="Declined">{"I can't make it."}</option>
                    </select>
                </div>
                {
                    QUESTIONS_DATA.map((question) => {
                        if (questionIds.indexOf(question.id) !== -1) {
                            return <div className="mb-2 block px-2.5" key={question.id}>
                                <Label htmlFor={`question + ${question.id}`} value={question.title} />
                                {
                                    (question.type === 'boolean') && <ToggleSwitch label={ (answers.get(question.id) == true) ? "Yes" : "No" } checked={ answers.get(question.id) ?? false } onChange={(checked) => { updateAnswers(question.id, checked) }}  />
                                }
                                {
                                    (question.type === 'rsvp') &&
                                    <select id={`question + ${question.id}`} required={true} value={answers.get(question.id)} onChange={(event) => { updateAnswers(question.id, event.target.value) }} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                            <option value="Attending">{"I'll be there!"}</option>
                                            <option value="Maybe">{"Not sure yet."}</option>
                                            <option value="Declined">{"I can't make it."}</option>
                                    </select>
                                }
                                {
                                    (question.type === 'text') &&
                                    <Textarea
                                        id={`question + ${question.id}`}
                                        required={true}
                                        rows={4}
                                        value={answers.get(question.id) ?? ""}
                                        onChange={(event) => { updateAnswers(question.id, event.target.value) }}
                                    />
                                }
                            </div>
                        }
                    })
                }
                {
                    shouldCollectNumbers &&
                    <div className="mb-2 block px-2.5">
                        <Label
                            htmlFor="phonenumber"
                            value="Phone #"
                        />
                        <TextInput
                            id="phonenumber"
                            type="tel"
                            placeholder="416-345-6578"
                            value={phoneNumber}
                            required
                            onChange={(event) => { setPhoneNumber(event.target.value) }}
                        />
                    </div>
                }
            </form>
        </div>
    )
}

export default EventRSVP