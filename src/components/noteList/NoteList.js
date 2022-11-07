import ReactDOM from "react-dom";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {useParams, Link} from "react-router-dom";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";


import {changeBtnStatus, fetchNotes, notes, putNotes, setActiveNote} from "./notesSlice";

import ModalNote from "../modals/modalNote/ModalNote";
import Note from '../noteItem/Note';

import {
    Row,
    Col,
    OverlayTrigger,
    Tooltip,
} from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';


const NoteList = () => {

    const noteList = useSelector(notes)
    const activeDirectory = useSelector(state => state.directories.activeDirectory);
    const status = useSelector(state => state.notes.btnStatus);

    const {directoryId} = useParams();

    const [modalShow, setModalShow] = useState(false);

    const dispatch = useDispatch();


    const activeNoteList = noteList
        .filter(note => note.directoryId === activeDirectory)
        .sort((a, b) => a.position - b.position);

    const handleInDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(activeNoteList);
        const [reorderItem] = items.splice(result.source.index, 1);

        items.splice(result.destination.index, 0, reorderItem);
        const promises = items.map((item, position) => dispatch(putNotes({...item, position})));
        Promise.all(promises).then(() => dispatch(fetchNotes()))
    }

    const renderNotes = (arr) => (arr.map((el, index) => (
        <Draggable draggableId={String(el.id)} index={index} key={el.id}>
            {(provided) => (
                <Col ref={provided.innerRef}
                     {...provided.draggableProps}
                     {...provided.dragHandleProps}

                     onDoubleClick={() => {
                         dispatch(setActiveNote(el.id))
                         dispatch(changeBtnStatus('edit'))
                         setModalShow(true)
                     }}

                >
                    <Link to={`/${directoryId}/${el.id}`}>
                        <Note key={el.id} el={el} setModalShow={setModalShow}/>
                    </Link>
                </Col>

            )}
        </Draggable>)))

    return (
        <>
            <Row>
                {activeDirectory
                    ? <Col sm={2}>
                        <OverlayTrigger overlay={<Tooltip id="add-note-tooltip-">Touch and add new task</Tooltip>}
                                        placement='top'>
                            <Icon.FileEarmarkPlus
                                className='mt-3 ml-3'
                                size={40}
                                data-tip data-for='add-note'
                                onClick={() => {
                                    activeDirectory
                                        ? dispatch(changeBtnStatus('add'))
                                        : dispatch(changeBtnStatus('notActiveDirectory'))
                                    setModalShow(true)
                                }}
                            />
                        </OverlayTrigger>
                    </Col>
                    : null
                }

                <DragDropContext onDragEnd={handleInDragEnd}>
                    <Droppable droppableId='notesList'>
                        {(provided) => (
                            <Col>
                                <Row
                                    {...provided.droppablePops} ref={provided.innerRef}>
                                    {activeDirectory
                                        ? renderNotes(activeNoteList)
                                        : null
                                    }
                                    {provided.placeholder}
                                </Row>
                            </Col>
                        )}
                    </Droppable>
                </DragDropContext>
            </Row>
            <Portal>
                {status === 'add' && <ModalNote show={modalShow} onHide={() => setModalShow(false)}/>}
                {status === 'edit' && <ModalNote edit={true} show={modalShow} onHide={() => setModalShow(false)}/>}
                {status === 'loading' && <div>Loading</div>}
            </Portal>
        </>
    )

}


const Portal = (props) => {
    return (
        ReactDOM.createPortal(props.children, document.getElementById('modal'))
    )
}

export default NoteList;