import { ClockIcon, LocationMarkerIcon } from "@heroicons/react/outline"
import Image from "next/image"
import CardDetails from "./CardDetails"
import LocationCardDetails from "./LocationCardDetails"

const InvitationCard = ({ title, imageURL, message, location, startDate, endDate, primaryButton, secondaryButton }) => {
    const dateDetails = `${startDate} - ${endDate}`
    const imageLoader = () => {
        return imageURL
    }

    return (
        <>
            <div className='flex flex-col'>
                <p className="text-transparent bg-clip-text bg-gradient-to-l from-gray-700 via-gray-900 to-black text-2xl text-center font-extrabold font-dancingScript tracking-wide pt-5">
                    Your invited to
                </p>
                <p className="bg-gradient-to-l from-gray-700 via-gray-900 to-black bg-clip-text text-transparent font-extrabold text-2xl mt-5 uppercase text-center font-playfairDisplay">
                    {title}
                </p>
            </div>
            <Image loader={imageLoader} src={imageURL} height={300} width='100%' alt="" className="object-scale-down" />
            <div className="flex flex-col items-stretch pb-5">
                <div className="backdrop-blur-sm my-5">
                    <p className="text-slate-700 text-left">{message}</p>
                </div>
                <CardDetails
                    text={dateDetails}
                    icon={<ClockIcon className="mr-1 h-5 w-5 text-slate-900" />}
                />
                <LocationCardDetails
                    text={location}
                    icon={
                        <LocationMarkerIcon className="mr-1 h-5 w-5 text-slate-900" />
                    }
                />
                <div>{primaryButton}</div>
                <div>{secondaryButton}</div>
            </div>
        </>)
}

export default InvitationCard