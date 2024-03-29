import Image from 'next/future/image'

import { ClockIcon, LocationMarkerIcon } from "@heroicons/react/outline"
import CardDetails from "./CardDetails"
import LocationCardDetails from "./LocationCardDetails"

const FullScreenOverlayCard = ({ title, imageURL, location, dateDetails, primaryButton, secondaryButton }) => (
    <>
        <div className="flex flex-col justify-between h-screen w-full" style={{ backgroundImage: `url("${imageURL}")`, aspectRatio: '4/3', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', backgroundRepeat: 'no-repeat' }}>
            <div className='flex flex-col h-2/6' style={{ background: 'linear-gradient(to top, transparent, rgba(0, 0, 0, 0.5)' }}>
                {secondaryButton}
                <p className="text-gray-50 text-2xl text-center font-extrabold font-dancingScript tracking-wide pt-5 word">
                    {"You're invited to"}
                </p>
                <p className="text-gray-50 text-2xl pt-2 px-2 uppercase text-center font-playfairDisplay">
                    {title}
                </p>
            </div>
            <div className="flex flex-col items-stretch pb-5 px-2">
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
                <div className="my-5">{primaryButton}</div>
            </div>
        </div>
    </>
)

const CenteredOverlayCard = ({ title, imageURL, location, dateDetails, primaryButton, secondaryButton }) => (
    <>
        <div className="flex flex-col justify-between h-screen w-full bg-gray-900">
            <div className='flex flex-col'>
                {secondaryButton}
                <p className="text-slate-100 text-4xl text-center font-extrabold font-dancingScript tracking-wide mt-10">
                    {"You're invited to"}
                </p>
                <p className="text-slate-100 text-2xl mt-5 uppercase text-center font-playfairDisplay">
                    {title}
                </p>
            </div>
            <Image src={imageURL} alt="invitation image" width={500} height={500} style={{ padding: '0px 8px', borderRadius: '4px' }} />
            <div className="flex flex-col shadow items-stretch px-2">
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
                <div className="my-2 w-full flex justify-center">{primaryButton}</div>
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