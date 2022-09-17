import { CalendarIcon, SparklesIcon } from "@heroicons/react/outline"
import Link from "next/link"
import rsvpSuccess from "../public/rsvpSuccess.png"
import { atcb_action } from 'add-to-calendar-button'
import { format } from "date-fns"

const SuccessRSVPModal = ({ showModal, event }) => {
    const addToCalendarPress = () => {
        atcb_action({
            name: `${event.eventTitle}`,
            startDate: format(new Date(event.startDate), 'yyyy-MM-dd').toString(),
            startTime: format(new Date(event.startDate), 'HH:mm').toString(),
            endDate: format(new Date(event.endDate), 'yyyy-MM-dd').toString(),
            endTime: format(new Date(event.endDate), 'HH:mm').toString(),
            options: ['Apple', 'Google', 'iCal', 'Outlook.com'],
            location: `${event.location}`,
            timeZone: 'America/Toronto',
            trigger: 'click',
            iCalFileName: 'Reminder-Event',
        })
    }

    return (
        <div id="defaultModal" className={`${showModal ? "" : "hidden"} fixed bottom-0 right-0 left-0 pb-10`}>
            <div className="modal-box w-full">
                <h3 className="font-bold text-lg">
                    Thanks for submitting your response!
                </h3>
                <div className="modal-action items-center justify-between">
                    <button onClick={addToCalendarPress} className="btn btn-primary">
                        Add to Calendar
                    </button>
                    <button onClick={() => { window.open('http://www.usesuperhost.com', '_blank') }} className="btn btn-accent">
                        Join Superhost
                    </button>
                </div>
            </div>
        </div>)
}

export default SuccessRSVPModal