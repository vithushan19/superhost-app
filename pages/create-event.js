import { useEffect, useState } from "react"
import { format, setHours, setMinutes } from 'date-fns'
import PlacesAutocomplete from '../components/PlacesAutocomplete'
import DatePicker from 'react-datepicker'
import { storage } from "../utils/firebase-config"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { v4 } from "uuid"

import "react-datepicker/dist/react-datepicker.css"
import { useRouter } from "next/router"
import { QUESTIONS_DATA } from "../utils/questions-data"

const DateTimePicker = ({ date, setDate }) => {
    return (
      <DatePicker
        showTimeSelect
        dateFormat={"MMM dd, yyyy hh:mm aa"}
        selected={date}
        onChange={(date) => setDate(date)}
        className="input input-bordered"
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
      <div className="py-5 h-screen w-full justify-between">
        {
          showLoadingSpinner ?
            <button className="btn loading absolute right-0 mr-2">
              Loading
            </button> :
            <button type='submit' className="btn absolute right-0 mr-2" form='neweventform'>Finalize Design</button>
        }
        <form id="neweventform" className='flex flex-col items-stretch gap-4 mt-12 p-3' onSubmit={onFormSubmit}>
          <label htmlFor="location" className="label">
            {"Where's it happening?"}
          </label>
          <PlacesAutocomplete setLocation={setEventLocation} location={eventLocation} />
          <label htmlFor="date" className="label">{"Let's add a date to it."}</label>
          <div className='flex items-center self-end'>
            <p className="label-text mr-2">From</p> <DateTimePicker date={startDate} setDate={setStartDate} />
          </div>
          <div className='flex items-center self-end'>
            <p className="label-text mr-2">To</p><DateTimePicker date={endDate} setDate={setEndDate} />
          </div>
          <div className="form-control w-1/2">
            <label className="label cursor-pointer">
              <span className="label">Add an Image?</span>
              <input type="checkbox" className="toggle" style={{ backgroundImage: 'none' }} checked={displayImageUpload} onChange={(event) => { setDisplayImageUpload(!displayImageUpload) }} />
            </label>
          </div>
          { displayImageUpload && <div id="fileUpload" className='text-left'>
            <div>
              <label className="label-text" htmlFor="file_input">Upload Invitation Image</label>
              <input className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" type="file" onChange={(event) => { setImage(event.target.files[0]) }} />
            </div>
          </div>}
          {
            displayImageUpload && <div id="title" className="text-left">
              <div>
                <label className="label-text">Event Title</label>
                <input type="text" className="input input-bordered w-full max-w-s" placeholder="Anna's Bridal Shower!" required value={title} onChange={(event) => setTitle(event.target.value)}></input>
              </div>
            </div>
          }
          <label className="label">{"Enable relevant questions you'd like to ask guests."}</label>
          <div className="flex flex-col gap-4 text-left">
            {
              QUESTIONS_DATA.map((question) => {
                return (
                  <div className="form-control" 
                  key={question.id}>
                  <label className="label cursor-pointer">
                    <span className="label-text">{question.title}</span>
                    <input
                      type="checkbox"
                      className="toggle"
                      style={{ backgroundImage: 'none' }}
                      checked={savedQuestions.find(id => id === question.id) ?? false}
                      onChange={(checked) => { updateSavedQuestions(question.id, checked) }} />
                  </label>
                </div>
                )
              })
            }
          </div>
      </form>
      </div>
      </>
  )
}

export default CreateEvent