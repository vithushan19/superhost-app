import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const PortraitImagePreview = ({ imageURL }) => (
    <div className="w-full flex justify-center">
        <div className="w-full flex flex-col justify-center items-center py-28" style={{ height: '50vh', backgroundImage: `url("${(imageURL)}")`, aspectRatio: '4/3', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        </div>
    </div>
)

const LandscapeImagePreview = ({ imageURL, backgroundURL }) => (
    <div className="w-full flex justify-center">
        <div className="w-full flex flex-col justify-between items-center py-20" style={{ height: '50vh', backgroundImage: `url("${`backgrounds/${ backgroundURL ?? '1.jpg' }`}")`, aspectRatio: '4/3', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <p className="text-gray-900 tracking-wide font-dancingScript text-3xl font-bold">{"Event Title"}</p>
            <picture>
                <img src={imageURL} alt="invitation image" className="px-2 rounded shadow-xl w-60" style={{ maxHeight: '45vh' }} />
            </picture>
            <p className="text-gray-900 tracking-wide font-dancingScript text-xl font-semibold">Your message will go here...</p>
        </div>
    </div>
)

const CardDesignLayout = () => {
    const router = useRouter()
    const [listOfImages, setListOfImages] = useState([])
    const [selectedBg, setSelectedBg] = useState(null)
    const [isPortraitImage, setIsPortraitImage] = useState(false)

    const {
        hostEmail,
        title,
        eventLocation,
        startDate,
        endDate,
        imageURL,
        eventMessage,
        savedQuestions,
    } = router.query

    const onCreateEvent = (event) => {
        event.preventDefault()

        router.push({
            pathname: '/confirmation',
            query: {
                hostEmail,
                title,
                eventLocation,
                startDate: startDate,
                endDate: endDate,
                imageURL,
                eventMessage,
                savedQuestions,
                selectedBg
            }
        })
    }

    const onBackgroundSelect = (event, image) => {
        event.preventDefault()

        setSelectedBg(image)
    }

    const importAll = (r) => {
        return r.keys().map((key) => { return key.replace('./', '') })
    }

    useEffect(() => {
        const image = new Image()
        image.src = imageURL

        image.onload = () => {
            const actualWidth = image.width
            const actualHeight = image.height
            
            setIsPortraitImage(actualHeight > actualWidth)
            setSelectedBg(isPortraitImage ? null : '1.jpg')
        }

        setListOfImages(importAll(require.context('../public/backgrounds/', false, /\.(png|jpe?g|svg)$/)))
    }, [imageURL, isPortraitImage])

    return (
        <div className="flex flex-col px-7 pt-5 bg-gray-900">
            <button onClick={onCreateEvent} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 self-end" form='neweventform'>Create Event</button>
            <div className="my-5">
                <h3 className="mb-5 font-bold text-lg text-white">Layout Preview:</h3>
                {
                    isPortraitImage ? <PortraitImagePreview imageURL={imageURL}/> : <LandscapeImagePreview imageURL={imageURL} backgroundURL={selectedBg} />
                }
            </div>
            <div className={`mt-2 mb-5`}>
                <h3 className="font-bold text-lg mb-2 text-white">Choose a background:</h3>
                <div className={`text-gray-700 mx-2 ${ isPortraitImage ? 'overflow-hidden' : 'overflow-y-scroll' }`} style={{ height: '400px' }}>
                    <div className="container px-1 py-2 mx-auto lg:pt-12 lg:px-32 h-full">
                        <div className="w-full h-full relative">
                            <div className={`flex flex-wrap -m-1 md:-m-2 w-full h-full absolute top-0 left-0 ${isPortraitImage ? 'opacity-20' : 'opacity-100'}`}>
                                {listOfImages.map((image, index) => {
                                    return (
                                        <div key={index} className="flex flex-wrap w-1/3">
                                            <label htmlFor="backgroundPicCheckbox">
                                                <div className={`w-full p-1 md:p-2 ${ (image === selectedBg) ? 'border-4 border-orange-700' : '' }`}>
                                                    <picture>
                                                        <img alt="gallery" className={`block object-cover object-center w-full rounded-lg h-40 ${isPortraitImage ? "pointer-events-none" : ""}`} src={`backgrounds/${image}`} onClick={(event) => { onBackgroundSelect(event, image) }} />
                                                    </picture>
                                                </div>
                                            </label>
                                        </div>)
                                })}
                            </div>
                            {isPortraitImage && <div className="text-2xl text-white z-10 absolute w-full h-full top-0 left-0 flex flex-col items-center justify-center">
                                <p className="text-sm text-center text-gray-300">Use a landscape image to enable this feature.</p>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardDesignLayout