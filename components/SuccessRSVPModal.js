import { CalendarIcon } from "@heroicons/react/outline"
import Image from "next/image"
import Link from "next/link"
import rsvpSuccess from "../public/rsvpSuccess.png"
import { atcb_action } from 'add-to-calendar-button'
import { format } from "date-fns"

const SuccessRSVPModal = ({ showModal, eventID, event }) => {
    const addToCalendarPress = () => {
        atcb_action({
            name: `${event.eventTitle}`,
            startDate: format(new Date(event.startDate), 'yyyy-MM-dd').toString(),
            startTime: format(new Date(event.startDate), 'HH:mm').toString(),
            endDate: format(new Date(event.endDate), 'yyyy-MM-dd').toString(),
            endTime: format(new Date(event.endDate), 'HH:mm').toString(),
            options: ['Apple', 'Google', 'Outlook.com'],
            location: `${event.location}`,
            timeZone: 'America/Toronto',
            trigger: 'click',
            iCalFileName: 'Reminder-Event',
        })
    }

    return (
        <div id="defaultModal" tabIndex="-1" className={`${ showModal ? "" : "hidden"} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full`}>
            <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex flex-col p-5">
                    <Image src={rsvpSuccess} alt="celebration" />
                    <p className="mt-5 text-gray-300">
                        Thanks for submitting your response!
                    </p>
                    </div>
                    <div className="flex flex-col items-center p-6 rounded-b border-t border-gray-200 dark:border-gray-600">
                        <Link href={`/events/${eventID}`}>
                            <button data-modal-toggle="defaultModal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full">
                                Take Me Back
                            </button>
                        </Link>
                        <button type="button" onClick={addToCalendarPress} className="justify-center flex text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-5 w-full">
                            <CalendarIcon className='text-white h-5 w-5 mr-2' />
                            Add to Calendar
                        </button>
                    </div>
                </div>
            </div>
    </div>)
}

export default SuccessRSVPModal