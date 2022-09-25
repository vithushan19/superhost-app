import { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const FruitList = [
    {
        id: 1,
        name: 'apple'
    },
    {
        id: 2,
        name: 'orange'
    },
    {
        id: 3,
        name: 'banana'
    }
]

const ItemTypes = {
    BOX: 'box'
}

const dragStyle = {
    border: '1px dashed gray',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    cursor: 'move'
}

const dropStyle = {
    height: '80vh',
    width: '100vh',
    margin: '1.5rem',
    color: 'black',
    padding: '1rem',
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: 'normal'
}

const DropArea = ({ dropArea, addImageHandler }) => {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.BOX,
        drop: (item) => addImageHandler(item.id),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    }))

    const isActive = canDrop && isOver
    let backgroundColor = '#222'
    
    if (isActive) {
        backgroundColor = 'darkgreen'
    } else if (canDrop) {
        backgroundColor = 'darkkhaki'
    }

    return (
        <div ref={drop} style={{ ...dropStyle, backgroundColor }}>
            {dropArea.map((fruit) => {
                return <Drag key={fruit.id} fruit={fruit} />
            })}
        </div>
    )
}

const TrashArea = ({ trashHandler }) => {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.BOX,
        drop: (item) => trashHandler(item.id),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    }))

    return (
        <div ref={drop}>
            Trash Can
        </div>
    )
}

const Drag = ({ fruit }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.BOX,
        item: fruit,
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult()
            
            if (item && dropResult) {
                alert(`You dropped ${fruit.name}`)
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId()
        })
    }))

    const opacity = isDragging ? 0.4 : 1
    return (
        <div ref={drag} style={{ ...dragStyle, opacity }}>
            {fruit.name}
        </div>
    )
}

const FormBuilder = () => {
    const [dropArea, setDropArea] = useState([])

    const addImageToBoard = (id) => {
        const fruitsList = FruitList.filter((fruit) => id === fruit.id)
        setDropArea((dropArea) => [...dropArea, fruitsList[0]])
    }

    const removeImagefromBoard = (id) => {
        setDropArea((dropArea) => dropArea.filter((fruit) => fruit.id !== id))
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="w-full flex flex-col justify-between items-center" style={{ height: '100vh' }}>
                <div className="w-full h-4/6 bg-blue-500 overflow-hidden">
                    <DropArea dropArea={dropArea} addImageHandler={addImageToBoard} />
                </div>
                <div className="w-full h-2/6 flex items-center overflow-hidden mx-2">
                    <div className="w-1/2 h-full py-5 px-2">
                        {FruitList.map((fruit) => {
                            return <Drag key={fruit.id} fruit={fruit} />
                        })}
                    </div>
                    <div className="w-1/2 border h-full flex justify-center items-center">
                        <TrashArea trashHandler={removeImagefromBoard} />
                    </div>
                </div>
            </div>
        </DndProvider>
    )
}

export default FormBuilder