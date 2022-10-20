import Image from 'next/future/image'

import { ClockIcon, LocationMarkerIcon } from "@heroicons/react/outline"
import CardDetails from "./CardDetails"
import LocationCardDetails from "./LocationCardDetails"

const FullScreenOverlayCard = ({ title, imageURL, location, dateDetails, primaryButton, secondaryButton }) => (
    <>
        <div className="flex flex-col justify-between w-full h-screen" style={{ backgroundImage: `url("${imageURL}")`, aspectRatio: '4/3', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', backgroundRepeat: 'no-repeat' }}>
            <div className='flex flex-col h-2/6' style={{ background: 'linear-gradient(to top, transparent, rgba(0, 0, 0, 0.5)' }}>
                {secondaryButton}
                <p className="pt-5 text-2xl font-extrabold tracking-wide text-center text-gray-50 font-dancingScript word">
                    {"You're invited to"}
                </p>
                <p className="px-2 pt-2 text-2xl text-center uppercase text-gray-50 font-playfairDisplay">
                    {title}
                </p>
            </div>
            <div className="flex flex-col items-stretch px-2 pb-5">
                <div className="p-3 mb-2 font-medium text-white border-2 border-white rounded bg-opacity-60 bg-slate-900">
                    <div className='flex justify-center'>
                    <div className='flex items-center font-bold'>
                        <ClockIcon className="w-5 h-5 mr-1 text-white" />
                        Schedule
                    </div>
                    </div>
                    <p>PRE WEDDING</p>
                    <p>5:30 Paal Ceremony at Grooms House</p>
                    <p>7:30 Bride Side Photos at Brides House</p>
                    <p>8:00 Groom Side Photos at Grooms House</p>
                    <p>8:30 Bride Side Goes to the Hall</p>
                    <p>9:00 Grooms Side Goes to the Hall</p>
                    <p className='mt-2'>WEDDING</p>
                    <p>9:00 Brides First Entrance</p>
                    <p>9:30 Grooms Entrance</p>
                    <p>11:00 Brides Second Entrance</p>
                    <p>11:30 Thali Time</p>
                    <p>12:00 Registration</p>
                    <p>12:15 Lunch and Photos</p>
                    <p>14:30 End </p>
                </div>
                <div className="mt-4">{primaryButton}</div>
            </div>
        </div>
    </>
)

const CenteredOverlayCard = ({ title, imageURL, location, dateDetails, primaryButton, secondaryButton }) => (
    <>
        <div className="flex flex-col justify-between w-full h-screen bg-gray-900">
            <div className='flex flex-col'>
                {secondaryButton}
                <p className="mt-10 text-4xl font-extrabold tracking-wide text-center text-slate-100 font-dancingScript">
                    {"You're invited to"}
                </p>
                <p className="mt-5 text-2xl text-center uppercase text-slate-100 font-playfairDisplay">
                    {title}
                </p>
            </div>
            <Image src={imageURL} alt="invitation image" width={500} height={500} style={{ padding: '0px 8px', borderRadius: '4px' }} />
            <div className="flex flex-col items-stretch px-2 shadow">
                <CardDetails
                    text={dateDetails}
                    icon={<ClockIcon className="w-5 h-5 mr-1 text-slate-900" />}
                />
                <LocationCardDetails
                    text={location}
                    icon={
                        <LocationMarkerIcon className="w-5 h-5 mr-1 text-slate-900" />
                    }
                />
                <div className="flex justify-center w-full my-2">{primaryButton}</div>
            </div>
        </div>
    </>
)

const InvitationCard = ({ title, imageURL, location, startDate, endDate, primaryButton, secondaryButton, isPortraitImage }) => {
    const dateDetails = `${startDate} - ${endDate}`

    return (
        (isPortraitImage) ?
            <FullScreenOverlayCard title={title} imageURL={imageURL} location={location} dateDetails={dateDetails} primaryButton={primaryButton} secondaryButton={secondaryButton} /> :
            <CenteredOverlayCard title={title} imageURL={imageURL} location={location} dateDetails={dateDetails} primaryButton={primaryButton} secondaryButton={secondaryButton} />
    )
}

export default InvitationCard