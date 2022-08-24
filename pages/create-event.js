import { useState } from "react"
import { format, setHours, setMinutes } from 'date-fns'
import PlacesAutocomplete from '../components/PlacesAutocomplete'
import DatePicker from 'react-datepicker'
import { storage } from "../utils/firebase-config"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { v4 } from "uuid"

import "react-datepicker/dist/react-datepicker.css"
import { Checkbox, Label, Textarea, TextInput, ToggleSwitch } from "flowbite-react"
import { useRouter } from "next/router"
import { QUESTIONS_DATA } from "../utils/questions-data"

const DateTimePicker = ({ date, setDate }) => {
    return (
      <DatePicker
        showTimeSelect
        dateFormat={"MMM dd, yyyy hh:mm aa"}
        selected={date}
        onChange={(date) => setDate(date)}
      />)
}
  
const CreateEvent = () => {
  const router = useRouter()
  const hostEmail = router.query.email
  const formState = JSON.parse(router.query.formState ?? "{}")

  const [title, setTitle] = useState(formState.title ?? "")
  const [eventLocation, setEventLocation] = useState(formState.eventLocation ?? "")
  const [startDate, setStartDate] = useState(setHours(setMinutes(new Date(), 30), 18))
  const [endDate, setEndDate] = useState(setHours(setMinutes(new Date(), 30), 21))
  const [image, setImage] = useState(JSON.parse(formState.imageData ?? "{}") ?? null)
  const [eventMessage, setEventMessage] = useState(formState.eventMessage ?? "")
  const [savedQuestions, setSavedQuestions] = useState(formState.savedQuestions ?? [])

  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false)

  const onFormSubmit = async (event) => {
    event.preventDefault()

    setShowLoadingSpinner(true)
    
    if (image == null) {
      alert("You must provide an image.")
      setShowLoadingSpinner(false)
      return
    }

    const imagePath = image.name + v4()
    const imageRef = ref(storage, imagePath)

    const snapshot = await uploadBytes(imageRef, image)
    const imageURL = await getDownloadURL(snapshot.ref)

    router.push({
      pathname: '/confirmation',
      query: {
        hostEmail,
        title,
        eventLocation,
        startDate: format(startDate, "MMM dd, yyyy hh:mm aa"),
        endDate: format(endDate, "MMM dd, yyyy hh:mm aa"),
        imageData: JSON.stringify(image),
        imageURL,
        eventMessage,
        savedQuestions
      }
    })

    setShowLoadingSpinner(false)
  }

  const updateSavedQuestions = (id, checked) => {
    if (checked) {
      setSavedQuestions([...savedQuestions, id])
    } else {
      const savedQuestionsArray = [...savedQuestions]
      const index = savedQuestionsArray.indexOf(id)

      if (index !== -1) {
        savedQuestionsArray.splice(index, 1)
        setSavedQuestions(savedQuestionsArray)
      }
    }
  }

  return (
    <>
      <div className="flex flex-col py-5 bg-gray-900">
      {
        showLoadingSpinner ?
          <button disabled type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center self-end">
            <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
            </svg>
            Loading...
          </button> :
          <button type='submit' className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 self-end" form='neweventform'>Preview Card</button>
      }
      <form id="neweventform" className='flex flex-col items-stretch gap-4 mx-3' onSubmit={onFormSubmit}>
        <div className='text-left'>
          <div className="mb-2 block">
            <Label
              htmlFor="title"
              value="Event Title"
              />
          </div>
          <TextInput
            id="title"
            placeholder="Anna + Jamie's Wedding"
            required
            helperText="This is what your guests will see on their calendar."
            value={title}
            onChange={(event) => { setTitle(event.target.value) }}
          />
        </div>
        <div className='text-left'>
          <div className="mb-2 block">
            <Label
              htmlFor="location"
              value="Location"
            />
          </div>
          <PlacesAutocomplete setLocation={setEventLocation} location={eventLocation} />
        </div>
        <div className='flex flex-row gap-4 items-center self-end'>
          <p className="text-gray-300 font-medium">From</p> <DateTimePicker date={startDate} setDate={setStartDate} />
        </div>
        <div className='flex flex-row gap-4 items-center self-end'>
          <p className="text-gray-300 font-medium">To</p><DateTimePicker date={endDate} setDate={setEndDate} />
        </div>
        <div id="fileUpload" className='text-left'>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="file_input">Upload Invitation Image</label>
            <input className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" type="file" onChange={(event) => { setImage(event.target.files[0]) }} />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
          </div>
        </div>
        <div id="textArea" className="text-left">
          <div className="mb-2 block">
            <Label
              htmlFor="comment"
              value="Anything your guests should know?"
            />
          </div>
          <Textarea
            id="comment"
            placeholder="Please join us for lunch afterwards at noon!"
            rows={4}
            value={eventMessage}
            onChange={(event) => { setEventMessage(event.target.value) }}
          />
          </div>
          <div className="flex flex-col gap-4 text-left">
            <div className='mb-2 block'>
            <Label value="Enable the questions you'd like to ask guests." />
            </div>
            {
              QUESTIONS_DATA.map((question) => {
                return <ToggleSwitch
                  key={question.id}
                  label={question.title}
                  checked={savedQuestions.find(id => id === question.id) ?? false}
                  onChange={(checked) => { updateSavedQuestions(question.id, checked) }} />
              })
            }
          </div>
      </form>
      </div>
      </>
  )
}

export default CreateEvent