import { ClockIcon, LocationMarkerIcon } from "@heroicons/react/outline"
import { EditText, EditTextarea } from "react-edit-text"
import CardDetails from "./CardDetails"
import LocationCardDetails from "./LocationCardDetails"

import 'react-edit-text/dist/index.css'

const FullScreenOverlayCard = ({ isEditable, title, onTitleChange, imageURL, location, dateDetails, primaryButton, secondaryButton }) => (
    <>
        <div className="flex flex-col justify-between h-screen w-full" style={{ backgroundImage: `url("${imageURL}")`, aspectRatio: '4/3', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', backgroundRepeat: 'no-repeat' }}>
            <div className='flex flex-col h-2/6' style={{ background: 'linear-gradient(to top, transparent, rgba(0, 0, 0, 0.5)' }}>
                {secondaryButton}
                <p className="text-gray-50 text-2xl text-center font-extrabold font-dancingScript tracking-wide pt-5 word">
                    {"You're invited to"}
                </p>
                {isEditable ?
                    <EditText showEditButton editButtonProps={{ style: { marginRight: '5px', width: 16 } }} value={title} onChange={onTitleChange} className={'text-gray-50 text-2xl pt-2 px-2 uppercase text-center font-playfairDisplay'} /> :
                    <p className="text-gray-50 text-2xl pt-2 px-2 uppercase text-center font-playfairDisplay">
                        {title}
                    </p>
                }
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

const CenteredOverlayCard = ({ isEditable, title, onTitleChange, imageURL, location, dateDetails, primaryButton, secondaryButton }) => (
    <>
        <div className="flex flex-col justify-between h-screen w-full bg-gray-900">
            <div className='flex flex-col'>
                {secondaryButton}
                <p className="text-slate-100 text-4xl text-center font-extrabold font-dancingScript tracking-wide mt-10">
                    {"You're invited to"}
                </p>
                {isEditable ?
                    <EditText showEditButton editButtonProps={{ style: { marginRight: '5px', width: 16 } }} value={title} onChange={onTitleChange} className={'text-slate-100 text-2xl mt-5 uppercase text-center font-playfairDisplay'} /> :
                    <p className="text-slate-100 text-2xl mt-5 uppercase text-center font-playfairDisplay">
                        {title}
                    </p>
                }
            </div>
            <picture>
                <img src={imageURL} alt="invitation image" className="px-2 w-full rounded shadow-xl" style={{ maxHeight: '60vh' }} />
            </picture>
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
                <div className="my-5">{primaryButton}</div>
            </div>
        </div>
    </>
)

const InvitationCard = ({ isEditable, title, onTitleChange, imageURL, location, startDate, endDate, primaryButton, secondaryButton, isPortraitImage }) => {
    const dateDetails = `${startDate} - ${endDate}`

    return (
        (isPortraitImage) ?
            <FullScreenOverlayCard isEditable={isEditable} title={title} onTitleChange={onTitleChange} imageURL={imageURL} location={location} dateDetails={dateDetails} primaryButton={primaryButton} secondaryButton={secondaryButton} /> :
            <CenteredOverlayCard isEditable={isEditable} title={title} onTitleChange={onTitleChange} imageURL={imageURL} location={location} dateDetails={dateDetails} primaryButton={primaryButton} secondaryButton={secondaryButton} />
    )
}

export default InvitationCard