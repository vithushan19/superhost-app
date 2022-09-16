import { animated } from "react-spring"

const PlainTextCard = ({ titlePos, detailsPos, title, titleFont, titleColor, backgroundURL, startDate, endDate, location, primaryButton }) => {
    const locationText = (location !== undefined) ? location : ""

    return (
        <div className="w-full h-screen flex flex-col items-center justify-between py-5 px-2 bg-gray-900">
            <div className="w-full flex flex-col justify-center items-center bg-gray-900" style={{ height: '95vh', backgroundImage: `url("${`/backgrounds/${backgroundURL ?? '1.jpg'}`}")`, aspectRatio: '4/3', backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                <animated.div style={{ y: titlePos.y, x: titlePos.x }}>
                    <p style={{ color: titleColor}} className={`text-slate-600 tracking-wide ${titleFont} text-2xl font-bold`}>{title}</p>
                </animated.div>
                <animated.div style={{ y: detailsPos.y - 10, x: detailsPos.x - 10 }} className="flex flex-col text-xs text-left">
                    <p className="text-primary-content"><b>Date: </b>{startDate}</p>
                    <p className="text-primary-content whitespace-pre-wrap"><b>Location: </b>{locationText.replace(',', '\n')}</p>
                </animated.div>
            </div>
            <div className="my-2 w-full flex justify-center">
                {primaryButton}
            </div>
        </div>
    )
}

export default PlainTextCard