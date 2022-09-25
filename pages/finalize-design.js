import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { animated } from "react-spring"
import { useDrag } from "react-use-gesture"
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { SwatchesPicker } from "react-color"
import { AdjustmentsIcon, SparklesIcon } from "@heroicons/react/outline"
import ShareModal from "../components/ShareModal"
import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore"
import { db } from "../utils/firebase-config"
import Image from "next/future/image"

const ImagePreview = ({ titlePos, bindTitlePos, detailsPos, bindDetailsPos, title, titleFont, titleColor, fontSize, backgroundURL, dateDetails, location }) => {
    const locationText = (location !== undefined ) ? location : ""
    return (
        <div className="w-full flex justify-center px-2" style={{ height: '65vh', touchAction: 'none' }}>
            <div className={`w-full flex flex-col justify-center items-center ${ backgroundURL ? 'bg-black' : 'bg-white' }`} style={{ backgroundImage: `url("${`backgrounds/${backgroundURL ?? '1.jpg'}`}")`, aspectRatio: '4/3', backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                <animated.div {...bindTitlePos()} style={{ y: titlePos.y, x: titlePos.x }}>
                    <p style={{ color: titleColor, fontSize: `${fontSize}px` }} className={`tracking-wide ${titleFont} font-bold`}>{title}</p>
                </animated.div>
                <animated.div {...bindDetailsPos()} style={{ y: detailsPos.y, x: detailsPos.x }} className="text-neutral flex flex-col text-xs text-left">
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
    const [title, setTitle] = useState("Placeholder Title")
    const [titleColor, setTitleColor] = useState("#475569")
    const [titleFont, setTitleFont] = useState("font-dancingScript")
    const [fontSize, setFontSize] = useState(24)
    const [displayColorDrawer, setDisplayColorDrawer] = useState(false)
    const [displayFontDrawer, setDisplayFontDrawer] = useState(false)
    const [displayTitleDrawer, setDisplayTitleDrawer] = useState(false)
    const [displaySizeDrawer, setDisplaySizeDrawer] = useState(false)
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
            showLoadingSpinner ?
                <button className="btn btn-primary btn-sm loading self-end mr-2 my-2">Loading</button> :
                <button onClick={onCreateEvent} className="btn btn-primary btn-sm gap-2 self-end mr-2 my-2">
                    <SparklesIcon className='h-5 w-5 mr-2' />
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

        if (title === 'Placeholder Title') {
            alert("Please enter a title before creating the event.")
            
            return
        }
        
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
                fontSize: fontSize,
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

    const onFontSizeChange = (event) => {
        setFontSize(event.target.value)
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
            <div className={`flex flex-col h-screen w-full justify-between`}>
                <CreateEventButton />
                <ImagePreview titlePos={titlePos} bindTitlePos={bindTitlePos} detailsPos={detailsPos} bindDetailsPos={bindDetailsPos} title={title} titleFont={titleFont} titleColor={titleColor} fontSize={fontSize} backgroundURL={selectedBg} dateDetails={startDate} location={eventLocation} />
                <div className="flex flex-col w-full justify-center items-center gap-5">
                    <div className="flex w-full items-center justify-around">
                        <button className="btn btn-outline btn-xs gap-2" onClick={() => { setDisplayColorDrawer(!displayColorDrawer) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                            </svg>
                            Colors
                        </button>
                        <button className="btn btn-outline btn-xs gap-2" onClick={() => { setDisplayFontDrawer(!displayFontDrawer) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                <polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line>
                            </svg>
                            Fonts
                        </button>
                        <button className="btn btn-outline btn-xs gap-2" onClick={() => { setDisplaySizeDrawer(!displaySizeDrawer) }}>
                            <AdjustmentsIcon className="h-5 w-5 mr-2"/>
                            Size
                        </button>
                        <button className="btn btn-outline btn-xs gap-2" onClick={() => { setDisplayTitleDrawer(!displayFontDrawer) }}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                            Add Title
                        </button>
                    </div>
                    <div className="flex w-full overflow-x-scroll flex-nowrap mx-2 rounded">
                        {listOfImages.map((image, index) => {
                            return (
                                <div key={index} className={`w-full p-1 ${ (image === selectedBg) ? 'border-2 border-orange-700' : '' }`} onClick={(event) => { onBackgroundSelect(event, image) }}>
                                    <Image alt="gallery" height={100} width={100} style={{ borderRadius: '8px', display: 'block', objectFit: 'cover', objectPosition: 'center', height: '15vh', width: '10vh', minWidth: '10vh' }} src={`/backgrounds/${image}`} />
                                </div>)
                        })}
                    </div>
                </div>
            </div>
            <Drawer
                open={displayTitleDrawer}
                onClose={() => { setDisplayTitleDrawer(!displayTitleDrawer) }}
                direction='bottom'
                size={200}
            >
                <div className="bg-base-100 h-full w-full px-5 py-3 flex flex-col justify-between items-center">
                    <div className="w-full">
                        <label className="label">Event Title</label>
                        <input type="title" id="title" className="input input-bordered max-w-xs w-full p-2.5" value={title} required onChange={onTitleChange} />
                    </div>
                </div>
            </Drawer>
            <Drawer
                open={displaySizeDrawer}
                onClose={() => { setDisplaySizeDrawer(!displaySizeDrawer) }}
                direction='bottom'
                size={200}
            >
                <div className="bg-base-100 h-full w-full px-5 py-3 flex flex-col justify-between items-center">
                    <div className="w-full">
                        <label className="label">Adjust Font Size</label>
                        <input type="range" min="0" max="128" value={fontSize} className="range" onInput={onFontSizeChange} />
                    </div>
                </div>
            </Drawer>
            <Drawer
                open={displayColorDrawer}
                onClose={() => { setDisplayColorDrawer(!displayColorDrawer) }}
                direction='bottom'
                size={300}
            >
                <div className="items-center justify-around flex flex-col gap-2 py-2 bg-base-100">
                    <p>Choose a Text Color:</p>
                    <SwatchesPicker color={titleColor} onChangeComplete={(color) => { setTitleColor(color.hex) }} />
                </div>
            </Drawer>
            <Drawer
                open={displayFontDrawer}
                onClose={() => { setDisplayFontDrawer(!displayFontDrawer) }}
                direction='bottom'
                size={290}
            >
                <div className="w-full">
                    <ul className="menu menu-compact bg-base-100 p-2">
                        <li onClick={() => { setTitleFont("font-dancingScript") }}>
                            <p className="font-dancingScript">Dancing Script</p>
                        </li>
                        <li onClick={() => { setTitleFont("font-cinzel") }}>
                            <p className="font-cinzel">Cinzel</p>
                        </li>
                        <li onClick={() => { setTitleFont("font-montserrat") }}>
                            <p className="font-montserrat">Montserrat</p>
                        </li>
                        <li onClick={() => { setTitleFont("font-playfairDisplay") }}>
                            <p className="font-playfairDisplay">Playfair Display</p>
                        </li>
                        <li onClick={() => { setTitleFont("font-greatVibes") }}>
                            <p className="font-greatVibes">Great Vibes</p>
                        </li>
                        <li onClick={() => { setTitleFont("font-merriweather") }}>
                            <p className="font-merriweather">Merriweather</p>
                        </li>
                        <li onClick={() => { setTitleFont("font-lato") }}>
                            <p className="font-lato">Lato</p>
                        </li>
                        <li onClick={() => { setTitleFont("font-kalam") }}>
                            <p className="font-kalam">Kalam</p>
                        </li>
                    </ul>
                </div>
            </Drawer>
        </>
    )
}

export default CardDesignLayout