import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { animated } from "react-spring"
import { useDrag } from "react-use-gesture"
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { SwatchesPicker } from "react-color"
import { Button, ListGroup } from "flowbite-react"
import { EditText } from "react-edit-text"
import { SparklesIcon } from "@heroicons/react/outline"
import ShareModal from "../components/ShareModal"
import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore"
import { db } from "../utils/firebase-config"

import 'react-edit-text/dist/index.css'

const ImagePreview = ({ titlePos, bindTitlePos, detailsPos, bindDetailsPos, onTitleChange, title, titleFont, titleColor, backgroundURL, dateDetails, location }) => {
    const locationText = (location !== undefined ) ? location : ""
    return (
        <div className="w-full flex justify-center px-2" style={{ height: '65vh' }}>
            <div className="w-full flex flex-col justify-center items-center bg-gray-300" style={{ backgroundImage: `url("${`backgrounds/${backgroundURL ?? '1.jpg'}`}")`, aspectRatio: '4/3', backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                <animated.div {...bindTitlePos()} style={{ y: titlePos.y, x: titlePos.x }}>
                    <EditText showEditButton editButtonProps={{ style: { marginLeft: '5px', width: 16 } }} style={{ color: titleColor}} className={`text-slate-600 tracking-wide ${titleFont} text-2xl font-bold`} value={title} onChange={onTitleChange} />
                </animated.div>
                <animated.div {...bindDetailsPos()} style={{ y: detailsPos.y, x: detailsPos.x }} className="flex flex-col text-xs text-left">
                    <p><b>Date: </b>{dateDetails}</p>
                    <p className="whitespace-pre-wrap"><b>Location: </b>{locationText.replace(',', '\n')}</p>
                </animated.div>
            </div>
        </div>
    )
}

const CardDesignLayout = () => {
    const [titlePos, setTitlePos] = useState({ x: 0, y: 0 })
    const [detailsPos, setDetailsPos] = useState({ x: 0, y: 40 })

    const bindTitlePos = useDrag((params) => {
        setTitlePos({
            x: params.offset[0],
            y: params.offset[1]
        })
    })

    const bindDetailsPos = useDrag((params) => {
        setDetailsPos({
            x: params.offset[0],
            y: params.offset[1]
        })   
    })

    const router = useRouter()
    const [showLoadingSpinner, setShowLoadingSpinner] = useState(false)
    const [showShareSpinner, setShowShareSpinner] = useState(false)
    const [showShareModal, setShowShareModal] = useState(false)
    const [listOfImages, setListOfImages] = useState([])
    const [selectedBg, setSelectedBg] = useState("")
    const [title, setTitle] = useState("Write a Title")
    const [titleColor, setTitleColor] = useState("#475569")
    const [titleFont, setTitleFont] = useState("font-dancingScript")
    const [displayColorDrawer, setDisplayColorDrawer] = useState(false)
    const [displayFontDrawer, setDisplayFontDrawer] = useState(false)
    const [eventId, setEventId] = useState("")

    const {
        hostEmail,
        eventLocation,
        startDate,
        endDate,
        savedQuestions,
    } = router.query

    const CreateEventButton = () => {
        return (
            showLoadingSpinner ? <button disabled type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 self-end flex items-center">
            <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
            </svg>
            Loading...
        </button> : <button type="button" onClick={onCreateEvent} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 self-end flex items-center">
            <SparklesIcon className='text-white h-5 w-5 mr-2'/>
            Create Event
        </button>
        )
    }

    const onSharePress = async (event) => {
        event.preventDefault()
        
        setShowShareSpinner(true)
      
        if (navigator.share) {
          navigator.share({
            title: title,
            text: '',
            url: `https://app.usesuperhost.com/events/${eventId}`
          }).then(() => {
            setShowShareSpinner(false)
          }).catch((error) => {
            setShowShareSpinner(false)
            alert("Please try again later on a mobile device.")
          })
        }
    }
      
    const onCreateEvent = async (event) => {
        event.preventDefault()
        setShowLoadingSpinner(true)

        let questionsData = []

        if (savedQuestions !== undefined) {
            questionsData = Array.isArray(savedQuestions) ? savedQuestions : new Array(savedQuestions)
        }

        const eventRef = await addDoc(collection(db, "events"), {
            host: hostEmail,
            eventTitle: title,
            location: eventLocation,
            startDate: startDate,
            endDate: endDate,
            questions: questionsData,
            cardBackground: selectedBg,
            type: "plainText",
            designProps: {
                titleFont: titleFont,
                titleColor: titleColor,
                titlePos: JSON.stringify({ x: titlePos.x, y: titlePos.y }) ,
                detailsPos: JSON.stringify({ x: detailsPos.x, y: detailsPos.y })
            }
        })

        await updateDoc(doc(db, "hosts", hostEmail), {
        events: arrayUnion(eventRef.id)
        })

        setShowShareModal(true)
        setEventId(eventRef.id)

        setShowLoadingSpinner(false)
    }

    const onTitleChange = (event) => {
        setTitle(event.target.value)
    }

    const onBackgroundSelect = (event, image) => {
        event.preventDefault()

        setSelectedBg(image)
    }

    const importAll = (r) => {
        return r.keys().map((key) => { return key.replace('./', '') })
    }

    useEffect(() => {
        setListOfImages(importAll(require.context('../public/backgrounds/', false, /\.(png|jpe?g|svg)$/)))
    }, [])

    return (
        <>
            <ShareModal showModal={showShareModal} showSpinner={showShareSpinner} setShowModal={setShowShareModal} onSharePress={onSharePress} />
            <div className={`flex flex-col h-screen w-full justify-between py-2 bg-gray-900`} style={{ touchAction: 'none' }}>
                <CreateEventButton />
                <ImagePreview titlePos={titlePos} bindTitlePos={bindTitlePos} detailsPos={detailsPos} bindDetailsPos={bindDetailsPos} onTitleChange={onTitleChange} title={title} titleFont={titleFont} titleColor={titleColor} backgroundURL={selectedBg} dateDetails={startDate} location={eventLocation} />
                <div className="flex flex-col w-full justify-center items-center gap-5">
                    <div className="flex w-full items-center justify-around">
                        <Button color="dark" onClick={() => { setDisplayColorDrawer(!displayColorDrawer) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                            </svg>
                            <p className="ml-3">Colors</p>
                        </Button>
                        <Button color="dark" onClick={() => { setDisplayFontDrawer(!displayFontDrawer) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-type">
                                <polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line>
                            </svg>
                            <p className="ml-3">Fonts</p>
                        </Button>
                    </div>
                    <div className="flex w-full overflow-x-scroll flex-nowrap mx-2 bg-gray-900 rounded">
                        {listOfImages.map((image, index) => {
                            return (
                                <div key={index} className={`w-full p-1 ${ (image === selectedBg) ? 'border-2 border-orange-700' : '' }`}>
                                    <picture>
                                        <img alt="gallery" className="block object-cover object-center rounded-lg" style={{ height: '15vh', width: '10vh', minWidth: '10vh' }} src={`backgrounds/${image}`} onClick={(event) => { onBackgroundSelect(event, image) }} />
                                    </picture>
                                </div>)
                        })}
                    </div>
                </div>
            </div>
            <Drawer
                open={displayColorDrawer}
                onClose={() => { setDisplayColorDrawer(!displayColorDrawer) }}
                direction='bottom'
                size={300}
            >
                <div className="h-full w-full items-center justify-around flex flex-col">
                    <p className="font-semibold text-lg">Choose a Text Color:</p>
                    <SwatchesPicker color={titleColor} onChangeComplete={(color) => { setTitleColor(color.hex) }} />
                </div>
            </Drawer>
            <Drawer
                open={displayFontDrawer}
                onClose={() => { setDisplayFontDrawer(!displayFontDrawer) }}
                direction='bottom'
                size={290}
                className="bg-slate-900"
            >
                <div className="w-full">
                    <ListGroup>
                        <ListGroup.Item onClick={() => { setTitleFont("font-dancingScript") }}>
                            <p className="font-dancingScript">Dancing Script</p>
                        </ListGroup.Item>
                        <ListGroup.Item onClick={() => { setTitleFont("font-cinzel") }}>
                            <p className="font-cinzel">Cinzel</p>
                        </ListGroup.Item>
                        <ListGroup.Item onClick={() => { setTitleFont("font-montserrat") }}>
                            <p className="font-montserrat">Montserrat</p>
                        </ListGroup.Item>
                        <ListGroup.Item onClick={() => { setTitleFont("font-playfairDisplay") }}>
                            <p className="font-playfairDisplay">Playfair Display</p>
                        </ListGroup.Item>
                        <ListGroup.Item onClick={() => { setTitleFont("font-greatVibes") }}>
                            <p className="font-greatVibes">Great Vibes</p>
                        </ListGroup.Item>
                        <ListGroup.Item onClick={() => { setTitleFont("font-merriweather") }}>
                            <p className="font-merriweather">Merriweather</p>
                        </ListGroup.Item>
                        <ListGroup.Item onClick={() => { setTitleFont("font-lato") }}>
                            <p className="font-lato">Lato</p>
                        </ListGroup.Item>
                        <ListGroup.Item onClick={() => { setTitleFont("font-kalam") }}>
                            <p className="font-kalam">Kalam</p>
                        </ListGroup.Item>
                    </ListGroup>
                </div>
            </Drawer>
        </>
    )
}

export default CardDesignLayout