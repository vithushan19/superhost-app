import { set } from "date-fns"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const PortraitImagePreview = ({ imageURL }) => (
    <div className="w-full flex justify-center">
        <div className="w-full flex flex-col justify-between items-center" style={{ height: '50vh', backgroundImage: `url("${(imageURL)}")`, aspectRatio: '4/3', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <div className="h-1/6 w-full" style={{ background: 'linear-gradient(to top, transparent, rgba(0, 0, 0, 0.7)' }}>
                <p className="text-gray-50 tracking-wide font-dancingScript text-4xl font-bold text-center pt-3">{"Event Title"}</p>
            </div>
            <div className="h-1/6 w-full pt-5" style={{ background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.7)' }}>
                <p className="text-gray-50 tracking-wide font-dancingScript text-xl font-semibold text-center">Your message will go here...</p>
            </div>
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
    const [isPortraitImage, setIsPortraitImage] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedBg, setSelectedBg] = useState("")

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
            const isPortrait = image.height > image.width
            
            setIsPortraitImage(isPortrait)
            
            if (isPortrait == false) {
                setSelectedBg("1.jpg")
            }

            setIsLoading(false)
        }

        setListOfImages(importAll(require.context('../public/backgrounds/', false, /\.(png|jpe?g|svg)$/)))
    }, [imageURL])

    return (
        <>
        <div className={`flex flex-col h-screen w-full bg-gray-900 justify-center items-center ${ isLoading ? 'block' : 'hidden' }`}>
                <p className="text-white text-2xl mb-5">Loading...</p>
                <div role="status">
                    <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
        </div>
        <div className={`flex flex-col px-7 pt-5 bg-gray-900 ${ isLoading ? 'hidden' : 'block' }`}>
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
            </>
    )
}

export default CardDesignLayout