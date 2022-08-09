import Image from "next/image"
import Link from "next/link"
import rsvpSuccess from "../public/rsvpSuccess.png"

const SuccessRSVPModal = ({ showModal, eventID }) => {
    return (
        <div id="defaultModal" tabIndex="-1" className={`${ showModal ? "" : "hidden"} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full`}>
            <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex flex-col p-5">
                    <Image src={rsvpSuccess} alt="celebration" />
                    <p className="mt-5">
                        Thanks for submitting your response!
                    </p>
                    </div>
                    <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                        <Link href={`/events/${eventID}`}><button data-modal-toggle="defaultModal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Take Me Back</button></Link>
                    </div>
                </div>
            </div>
    </div>)
}

export default SuccessRSVPModal