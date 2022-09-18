import { ClockIcon, LocationMarkerIcon, SparklesIcon } from "@heroicons/react/outline"
import { animated } from "react-spring"
import CardDetails from "./CardDetails"
import LocationCardDetails from "./LocationCardDetails"

const PlainTextCard = ({ titlePos, detailsPos, title, titleFont, titleColor, fontSize, backgroundURL, startDate, endDate, location, onRSVP }) => {
    const dateDetails = `${startDate} - ${endDate}`
    const fontSizeCSS = (fontSize !== undefined) ? `${fontSize}px` : '24px' 
    const locationText = (location !== undefined) ? location : ""

    return (
        <div className="w-full h-screen flex flex-col gap-5 justify-start px-2">
            <div className="my-2 w-full flex justify-end">
                <button className="btn btn-primary" onClick={onRSVP}>
                    <SparklesIcon className='h-5 w-5 mr-2' />
                    RSVP to Event
                </button>
            </div>
            <div>
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
            </div>
            <div className="w-full flex flex-col justify-center items-center" style={{ height: '60vh', backgroundImage: `url("${`/backgrounds/${backgroundURL ?? '1.jpg'}`}")`, aspectRatio: '4/3', backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                <animated.div style={{ y: titlePos.y, x: titlePos.x }}>
                    <p style={{ color: titleColor, fontSize: fontSizeCSS}} className={`text-slate-600 ${titleFont} font-bold`}>{title}</p>
                </animated.div>
                <animated.div style={{ y: detailsPos.y, x: detailsPos.x }} className="flex flex-col text-xs text-left">
                    <p className="text-primary-content"><b>Date: </b>{startDate}</p>
                    <p className="text-primary-content whitespace-pre-wrap"><b>Location: </b>{locationText.replace(',', '\n')}</p>
                </animated.div>
            </div>
        </div>
    )
}

export default PlainTextCard