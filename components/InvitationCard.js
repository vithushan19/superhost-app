import { ClockIcon, LocationMarkerIcon } from "@heroicons/react/outline"
import CardDetails from "./CardDetails"
import LocationCardDetails from "./LocationCardDetails"

const FullScreenOverlayCard = ({ title, imageURL, message, location, dateDetails, primaryButton }) => (
    <>
        <div className="flex flex-col justify-between h-screen w-full" style={{ backgroundImage: `url("${imageURL}")`, aspectRatio: '4/3', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', backgroundRepeat: 'no-repeat' }}>
            <div className='flex flex-col h-2/6' style={{ background: 'linear-gradient(to top, transparent, rgba(0, 0, 0, 0.5)' }}>
                <p className="text-gray-50 text-2xl text-center font-extrabold font-dancingScript tracking-wide pt-5">
                    {"You're invited to"}
                </p>
                <p className="text-gray-50 text-3xl pt-2 uppercase text-center font-playfairDisplay">
                    {title}
                </p>
            </div>
            <div className="flex flex-col items-stretch pb-5 px-2">
                { message !== undefined && <div className="w-full border-stone-900 bg-stone-100 border-2 mb-5 pl-5 py-1 rounded shadow-lg inline-flex items-center">
                    <p className="text-stone-900 font-bold text-left text-lg font-montserrat">{message}</p>
                </div>}
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

const CenteredOverlayCard = ({ title, imageURL, message, location, dateDetails, primaryButton, secondaryButton, background}) => (
    <>
        <div className="flex flex-col justify-between h-screen w-full" style={{ backgroundImage: `url("${`/backgrounds/${background}`}")`, aspectRatio: '4/3', backgroundSize: 'contain', backgroundPosition: 'left top', backgroundAttachment: 'fixed' }}>
            <div className='flex flex-col'>
                {secondaryButton}
                <p className="text-slate-900 text-4xl text-center font-extrabold font-dancingScript tracking-wide mt-10">
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
                { message !== undefined && <div className="mt-5 mb-5 border-2 bg-stone-100 border-stone-900 w-full py-1 rounded shadow-lg">
                    <p className="text-slate-900 text-lg font-semibold text-left font-montserrat px-2">{message}</p>
                </div>}
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

const InvitationCard = ({ title, imageURL, message, location, startDate, endDate, primaryButton, secondaryButton, background }) => {
    const dateDetails = `${startDate} - ${endDate}`
    const isPortraitImage = background === ""

    return (
        (isPortraitImage) ?
            <FullScreenOverlayCard title={title} imageURL={imageURL} message={message} location={location} dateDetails={dateDetails} primaryButton={primaryButton} secondaryButton={secondaryButton} /> :
            <CenteredOverlayCard title={title} imageURL={imageURL} message={message} location={location} dateDetails={dateDetails} primaryButton={primaryButton} secondaryButton={secondaryButton} background={background} />
    )
}

export default InvitationCard