import { useState } from "react"
import { format, setHours, setMinutes } from 'date-fns'
import PlacesAutocomplete from '../components/PlacesAutocomplete'
import DatePicker from 'react-datepicker'
import { storage } from "../utils/firebase-config"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { v4 } from "uuid"

import "react-datepicker/dist/react-datepicker.css"
import { Label, Textarea, TextInput, ToggleSwitch } from "flowbite-react"
import { useRouter } from "next/router"

const DateTimePicker = ({ date, setDate }) => {
    return (
      <DatePicker
        showTimeSelect
        dateFormat={"MMM dd, yyyy hh:mm aa"}
        selected={date}
        onChange={(date) => setDate(date)}
      />)
}
  
const ToggleQuestion = ({ title, value, onToggleChange }) => {
    return (
        <ToggleSwitch
            checked={value}
            label={title}
            onChange={() => { onToggleChange(!value) }}
        />)
}

const CreateEvent = () => {
  const router = useRouter()

  const hostEmail = router.query.email
  const [title, setTitle] = useState("")
  const [eventLocation, setEventLocation] = useState("")
  const [startDate, setStartDate] = useState(setHours(setMinutes(new Date(), 30), 18))
  const [endDate, setEndDate] = useState(setHours(setMinutes(new Date(), 30), 21))
  const [image, setImage] = useState(null)
  const [eventMessage, setEventMessage] = useState("")
  const [q1Enabled, setQ1Enabled] = useState(false)
  const [q2Enabled, setQ2Enabled] = useState(false)
  const [q3Enabled, setQ3Enabled] = useState(false)

  const onFormSubmit = async (event) => {
    event.preventDefault()
    
    if (image == null) return

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
        imageURL,
        eventMessage,
        q1Enabled,
        q2Enabled,
        q3Enabled
      }
    })
  }

  return (
    <div className="flex flex-col py-5 bg-stone-200">
      <button type='submit' className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 self-end" form='neweventform'>Preview Card</button>
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
          <p className="text-black font-medium">From</p> <DateTimePicker date={startDate} setDate={setStartDate} />
        </div>
        <div className='flex flex-row gap-4 items-center self-end'>
          <p className="text-black font-medium">To</p><DateTimePicker date={endDate} setDate={setEndDate} />
        </div>
        <div id="fileUpload" className='text-left'>
          <div className='mb-2 block'>
            <Label htmlFor="file" value="Upload your image" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="file_input">Upload file</label>
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
            required={true}
            rows={4}
            value={eventMessage}
            onChange={(event) => { setEventMessage(event.target.value) }}
          />
        </div>
        <div className="flex flex-col gap-4 text-left">
          <div className='mb-2 block'>
            <Label value="Enable the questions you'd like to ask guests." />
          </div>
          <ToggleQuestion title="Will you be drinking at this event?" value={q1Enabled} onToggleChange={setQ1Enabled} />
          <ToggleQuestion title="Will you be bringing a +1?" value={q2Enabled} onToggleChange={setQ2Enabled} />
          <ToggleQuestion title="Let us know of any food restrictions." value={q3Enabled} onToggleChange={ setQ3Enabled} />
        </div>
      </form>
    </div>
  )
}

export default CreateEvent