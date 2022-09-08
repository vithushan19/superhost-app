import { useEffect, useState } from "react"
import { format, setHours, setMinutes } from 'date-fns'
import PlacesAutocomplete from '../components/PlacesAutocomplete'
import DatePicker from 'react-datepicker'
import { storage } from "../utils/firebase-config"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { v4 } from "uuid"

import "react-datepicker/dist/react-datepicker.css"
import { Label, ToggleSwitch } from "flowbite-react"
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
  const hostEmail = router.query.hostEmail

  const [title, setTitle] = useState("")
  const [eventLocation, setEventLocation] = useState("")
  const [startDate, setStartDate] = useState(setHours(setMinutes(new Date(), 30), 18))
  const [endDate, setEndDate] = useState(setHours(setMinutes(new Date(), 30), 21))
  const [displayImageUpload, setDisplayImageUpload] = useState(false)
  const [image, setImage] = useState(null)
  const [savedQuestions, setSavedQuestions] = useState([])

  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false)

  const onFormSubmit = async (event) => {
    let imageURL = ""

    event.preventDefault()
    setShowLoadingSpinner(true)

    if (image !== null) {
      const imagePath = image.name + v4()
      const imageRef = ref(storage, imagePath)
      
      const snapshot = await uploadBytes(imageRef, image)
      imageURL = await getDownloadURL(snapshot.ref)

      router.push({
        pathname: '/confirmation',
        query: {
          title,
          hostEmail,
          eventLocation,
          startDate: format(startDate, "MMM dd, yyyy hh:mm aa"),
          endDate: format(endDate, "MMM dd, yyyy hh:mm aa"),
          imageURL,
          savedQuestions
        }
      })
    } else {
      router.push({
        pathname: '/finalize-design',
        query: {
          hostEmail,
          eventLocation,
          startDate: format(startDate, "MMM dd, yyyy hh:mm aa"),
          endDate: format(endDate, "MMM dd, yyyy hh:mm aa"),
          savedQuestions
        }
      })
    }
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

  useEffect(() => {
    if (router.query.formData !== undefined) {
      const formData = JSON.parse(router.query.formData)
      const savedQuestions = Array.isArray(formData.savedQuestions) ? formData.savedQuestions : new Array(formData.savedQuestions)
      setTitle(formData.title)
      setEventLocation(formData.eventLocation)
      setSavedQuestions(savedQuestions.map((id) => { return parseInt(id) }))

      setStartDate(Date.parse(formData.startDate))
      setEndDate(Date.parse(formData.endDate))
    }
  }, [router.query])

  return (
    <>
      <div className="py-5 bg-gray-900 h-screen w-full justify-between">
      {
          showLoadingSpinner ?
            <button disabled type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 absolute right-0">
              <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
              </svg>
              Loading...
            </button> :
            <button type='submit' className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 absolute right-0" form='neweventform'>Finalize Design</button>
        }
        <form id="neweventform" className='flex flex-col items-stretch gap-4 mt-12 mx-3 pb-2' onSubmit={onFormSubmit}>
          <div className='text-left'>
            <div className="mb-2 block">
              <Label
                htmlFor="location"
                value="Where's it happening?"
              />
            </div>
            <PlacesAutocomplete setLocation={setEventLocation} location={eventLocation} />
          </div>
          <div>
          </div>
          <div className="mb-2 block">
            <Label
              htmlFor="date"
              value="Let's add a date to it."
            />
          </div>
          <div className='flex items-center self-end'>
            <p className="text-gray-300 font-medium mr-4">From</p> <DateTimePicker date={startDate} setDate={setStartDate} />
          </div>
          <div className='flex items-center self-end'>
            <p className="text-gray-300 font-medium mr-4">To</p><DateTimePicker date={endDate} setDate={setEndDate} />
          </div>
          <label htmlFor="default-toggle" className="inline-flex relative items-center cursor-pointer">
            <input type="checkbox" value="" id="default-toggle" className="sr-only peer" checked={displayImageUpload} onChange={ (event) => { setDisplayImageUpload(!displayImageUpload) } } />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Add an Image?</span>
          </label>
          { displayImageUpload && <div id="fileUpload" className='text-left'>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="file_input">Upload Invitation Image</label>
              <input className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" type="file" onChange={(event) => { setImage(event.target.files[0]) }} />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">PNG or JPG (MAX. 800x400px).</p>
            </div>
          </div>}
          {
            displayImageUpload && <div id="title" className="text-left">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="file_input">Event Title</label>
                <input type="text" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Anna's Bridal Shower!" required value={title} onChange={(event) => setTitle(event.target.value)}></input>
              </div>
            </div>
          }
          <div className="flex flex-col gap-4 text-left">
            <div className='mb-2 block'>
            <Label value="Enable relevant questions you'd like to ask guests." />
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