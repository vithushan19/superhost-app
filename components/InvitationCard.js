import { ClockIcon, LocationMarkerIcon } from "@heroicons/react/outline"
import CardDetails from "./CardDetails"
import LocationCardDetails from "./LocationCardDetails"

const InvitationCard = ({ title, imageURL, message, location, startDate, endDate, primaryButton, secondaryButton }) => {
    const dateDetails = `${startDate} - ${endDate}`

    return (
        <>
            <div className="flex flex-col justify-between h-screen w-full" style={{ backgroundImage: `url("${imageURL}")`, aspectRatio: '4/3', backgroundSize: '375px, 812px' }}>
                <div className='flex flex-col' style={{ background: 'linear-gradient(to top, transparent, rgba(0, 0, 0, 0.5)' }}>
                    <p className="text-gray-200 text-2xl text-center font-extrabold font-dancingScript tracking-wide mt-10">
                        {"You're invited to"}
                    </p>
                    <p className="text-gray-200 text-3xl mt-2 uppercase text-center font-playfairDisplay">
                        {title}
                    </p>
                </div>
                <div className="flex flex-col shadow items-stretch pb-5 px-2">
                    <div className="my-5">
                        <p className="text-white font-semibold text-left text-lg">{message}</p>
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
            </div>
        </>)
}

export default InvitationCard