import { MailIcon } from "@heroicons/react/outline"
import { addDoc, collection } from "firebase/firestore"
import { Label, Radio, Textarea, TextInput, ToggleSwitch } from "flowbite-react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { db } from "../utils/firebase-config"

const EventRSVP = () => {
    const router = useRouter()
    const questions = router.query.questionData !== undefined ? JSON.parse(router.query.questionData) : {}
    const eventID = router.query.id

    const questionsMap = new Map(Object.entries(questions))

    const [name, setName] = useState("")
    const [status, setStatus] = useState(0)
    const [phoneNumber, setPhoneNumber] = useState("")

    const [answer1, setAnswer1] = useState(false)
    const [answer2, setAnswer2] = useState(false)
    const [answer3, setAnswer3] = useState("")

    const [showLoadingSpinner, setShowLoadingSpinner] = useState(false)

    const convertToRSVPStatus = () => {
        switch (status) {
            case 0:
                return "Attending"
            case 1:
                return "Maybe"
            case 2:
                return "Declined"
        }
    }

    const onRSVPSubmit = async (event) => {
        event.preventDefault()

        setShowLoadingSpinner(true)

        const guestResponseRef = await addDoc(collection(db, `/events/${eventID}/guests`), {
            guestName: name,
            rsvpStatus: convertToRSVPStatus(),
            phoneNumber: phoneNumber,
            a1: (questionsMap.get("1") === "true") ? answer1 : null,
            a2: (questionsMap.get("2") === "true") ? answer2 : null,
            a3: (questionsMap.get("3") === "true") ? answer3 : null
        })

        setShowLoadingSpinner(false)
    }

    return (
        <div className="flex flex-col py-5 bg-stone-50">
            <button type='submit' className="flex text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-5 mb-2 self-end bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800" form='rsvpform'>
                <MailIcon className="mr-2 h-5 w-5"/>
                { showLoadingSpinner ? "Loading..." : "Submit RSVP"}
            </button>
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
                    <select id="status" value={status} onChange={(event) => { setStatus(event.target.value); }} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value={0}>{"I'll be there!"}</option>
                        <option value={1}>{"Not sure yet."}</option>
                        <option value={2}>{"I can't make it."}</option>
                    </select>
                </div>
                <div className="mb-2 block px-2.5">
                    <Label
                        htmlFor="status"
                        value="Phone #"
                    />
                    <TextInput
                        id="phonenumber"
                        type="tel"
                        placeholder="416-345-6578"
                        value={phoneNumber}
                        onChange={(event) => { setPhoneNumber(event.target.value) }}
                        required
                    />
                </div>
                {(questionsMap.get("1") === "true" && (status == 0)) ? <div className="mb-2 block px-2.5">
                <Label
                    htmlFor="question1"
                        value="Will you be drinking at this event?"
                    />
                <ToggleSwitch
                    checked={answer1}
                    label={answer1 ? "Yes" : "No"}
                    onChange={() => { setAnswer1(!answer1) }}
                    color="warning"
                />
                </div> : <></>}
            { (questionsMap.get("2") === "true" && (status == 0)) ? <div className="mb-7 block px-2.5">
                <Label
                    htmlFor="question2"
                    value="Will you be bringing a +1?"
                />
                <ToggleSwitch
                    checked={answer2}
                    label={ answer2 ? "Yes" : "No"}
                    onChange={() => { setAnswer2(!answer2) }}
                />
                </div> : <></>}
            {
                (questionsMap.get("3") === "true" && (status == 0)) ? <div className="mb-2 block px-2.5">
                <Label
                    htmlFor="comment"
                    value="Let us know of any food restrictions."
                />
                <Textarea
                    id="comment"
                        placeholder="Leave a comment..."
                        value={answer3}
                        onChange={(event) => { setAnswer3(event.target.value)}}
                    required={true}
                    rows={3}
                />
            </div> : <></>
            }
            </form>
        </div>
    )
}

export default EventRSVP