import { ChatIcon, ClockIcon, LocationMarkerIcon } from "@heroicons/react/outline"
import { useEffect, useState } from "react"
import CardDetails from "./CardDetails"
import LocationCardDetails from "./LocationCardDetails"

const FullScreenOverlayCard = ({ title, imageURL, message, location, dateDetails, primaryButton, secondaryButton}) => (
    <>
        <div className="flex flex-col justify-between h-screen w-full" style={{ backgroundImage: `url("${imageURL}")`, aspectRatio: '4/3', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', backgroundRepeat: 'no-repeat' }}>
            <div className='flex flex-col h-2/6' style={{ background: 'linear-gradient(to top, transparent, rgba(229, 231, 235, 0.5)' }}>
                <p className="text-gray-900 text-2xl text-center font-extrabold font-dancingScript tracking-wide pt-5">
                    {"You're invited to"}
                </p>
                <p className="text-gray-900 text-3xl pt-2 uppercase text-center font-playfairDisplay">
                    {title}
                </p>
            </div>
            <div className="flex flex-col items-stretch pb-5 px-2">
                <div className="w-full bg-gray-100 mb-5 pl-5 py-1 rounded shadow-lg inline-flex items-center">
                    <ChatIcon className="mr-3 h-7 w-7 text-slate-900" /><p className="font-bold text-left text-2xl font-dancingScript tracking-wide">{message}</p>
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
    </>
)

const CenteredOverlayCard = ({ title, imageURL, message, location, dateDetails, primaryButton, secondaryButton, background}) => (
    <>
        <div className="flex flex-col justify-between h-screen w-full" style={{ backgroundImage: `url("${`backgrounds/${background}`}")`, aspectRatio: '4/3', backgroundSize: 'contain', backgroundPosition: 'left top', backgroundAttachment: 'fixed' }}>
            <div className='flex flex-col'>
                <p className="text-slate-900 text-4xl text-center font-extrabold font-dancingScript tracking-wide mt-16">
                    {"You're invited to"}
                </p>
                <p className="text-slate-900 text-4xl mt-5 uppercase text-center font-playfairDisplay">
                    {title}
                </p>
            </div>
            <picture>
                <img src={imageURL} alt="invitation image" className="px-2 w-full rounded shadow-xl" style={{ maxHeight: '60vh' }} />
            </picture>
            <div className="flex flex-col shadow items-stretch px-2">
                <div className="mt-5 mb-12">
                    <p className="text-slate-900 text-3xl font-semibold text-left font-dancingScript tracking-wider px-2">{message}</p>
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
    </>
)

const InvitationCard = ({ title, imageURL, message, location, startDate, endDate, primaryButton, secondaryButton, background }) => {
    const [isPortraitImage, setIsPortraitImage] = useState(false)
    const dateDetails = `${startDate} - ${endDate}`

    useEffect(() => {
        const image = new Image()
        image.src = imageURL

        image.onload = () => {
            const actualWidth = image.width
            const actualHeight = image.height
            
            setIsPortraitImage(actualHeight > actualWidth)
        }
    }, [imageURL])

    return (
        isPortraitImage ?
            <FullScreenOverlayCard title={title} imageURL={imageURL} message={message} location={location} dateDetails={dateDetails} primaryButton={primaryButton} secondaryButton={secondaryButton} /> :
            <CenteredOverlayCard title={title} imageURL={imageURL} message={message} location={location} dateDetails={dateDetails} primaryButton={primaryButton} secondaryButton={secondaryButton} background={background} />
    )
}

export default InvitationCard