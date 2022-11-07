import {useDispatch, useSelector} from "react-redux";
import {useRef, useState} from "react";

import {changeBtnStatus, deleteNote, putNotes, setActiveNote} from "../noteList/notesSlice";
import {ButtonGroup, Container, OverlayTrigger, Toast, ToastContainer, Tooltip} from "react-bootstrap";

import * as Icon from "react-bootstrap-icons";
import ContentEditable from "react-contenteditable";

const Note = ({el, setModalShow}) => {
    const activeNote = useSelector(state => state.notes.activeNote);

    const [value, setValue] = useState(el.title);
    const [disabled, setDisabled] = useState(true)
    const [showError, setShowError] = useState(false);

    const dispatch = useDispatch();
    const ref = useRef();

    const changeActiveNote = () => {
        el.id === activeNote
            ? dispatch(setActiveNote(null))
            : dispatch(setActiveNote(el.id));
    }


    return (

        <OverlayTrigger overlay={<Tooltip id="add-note-tooltip-">Double touch for redact </Tooltip>}
                        placement='top'>
            <Container>
                <Container className='d-flex align-items-center justify-content-center flex-nowrap'>

                    {activeNote !== el.id
                        ?
                        <Icon.FileEarmarkText
                            size={40}
                            color='black'
                            onClick={changeActiveNote}
                        />
                        :
                        <Icon.FileEarmarkTextFill
                            size={40}
                            color='black'
                            onClick={changeActiveNote}
                        />
                    }

                    <ButtonGroup vertical>

                        <OverlayTrigger
                            overlay={<Tooltip id="add-note-tooltip-">Touch for redact </Tooltip>}
                            placement='right'>
                            <Icon.Pencil
                                color='black' className='m-2'
                                onClick={() => {
                                    dispatch(setActiveNote(el.id))
                                    dispatch(changeBtnStatus('edit'))
                                    setModalShow(true)

                                }}/>
                        </OverlayTrigger>

                        <OverlayTrigger
                            overlay={<Tooltip id="add-note-tooltip-">Touch for delete </Tooltip>}
                            placement='right'>
                            <Icon.Trash3
                                color='black' className='m-2'
                                onClick={() =>
                                    dispatch(deleteNote(el.id))
                                }/>
                        </OverlayTrigger>

                    </ButtonGroup>

                </Container>

                <OverlayTrigger
                    overlay={<Tooltip id="add-note-tooltip-">Touch and redact this name </Tooltip>}
                    placement='bottom'>

                    <ContentEditable
                        style={{color: 'black', textAlign: 'center'}}
                        data-tip data-for='note'
                        html={value}
                        disabled={disabled}
                        innerRef={ref}
                        onClick={() => setDisabled(false)}
                        onChange={(e) => {
                            setValue(e.target.value)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                if (e.target.innerText.length > 0) {
                                    dispatch(putNotes({...el, title: e.target.innerText}))
                                    setDisabled(true)
                                } else {
                                    setShowError(true)
                                    setValue(el.title)
                                    setDisabled(true)

                                }
                            }

                        }}
                    />

                </OverlayTrigger>

                <ToastContainer position="middle-top">
                    <Toast className="d-inline-block m-1" bg='danger' show={showError} delay={3000}
                           autohide
                           onClose={() => setShowError(false)}>
                        <Toast.Body className='text-black'>Name can be more than 1 symbol</Toast.Body>
                    </Toast>
                </ToastContainer>
            </Container>
        </OverlayTrigger>

    )

}
export default Note;