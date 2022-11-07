import {useDispatch, useSelector} from "react-redux";
import {Formik} from "formik";
import * as Yup from 'yup';

import {changeBtnStatus, postNotes, putNotes, setCollectTags, notes, fetchNotes} from "../../noteList/notesSlice";
import Tags from './tags/Tags'

import {Modal, Form, Button} from 'react-bootstrap'


const ModalNote = ({edit, show, onHide}) => {

    const noteList = useSelector(notes);
    const activeNoteId = useSelector(state => state.notes.activeNote)
    const activeDirectory = useSelector(state => state.directories.activeDirectory);
    const tags = useSelector(state => state.notes.collectTags);

    const [activeNote] = noteList.filter(note => note.id === activeNoteId)

    const dispatch = useDispatch();

    const schema = Yup.object().shape({
        title: Yup.string().trim().min(2).required(),
        description: Yup.string().trim().min(2).required()
    })

    const onSubmit = (values, formikBag) => {
        dispatch(changeBtnStatus('loading'))
        edit ?
            dispatch(putNotes({
                directoryId: activeDirectory,
                title: values.title,
                description: values.description,
                tags,
                id: activeNote.id,
                position: activeNote.position
            })).then((e) => console.log(e))
            :
            dispatch(postNotes({
                directoryId: activeDirectory,
                title: values.title,
                description: values.description,
                tags
            }))

        dispatch(changeBtnStatus('idle'))
        dispatch(setCollectTags([]))

    }


    return (
        <Modal show={show}
               onHide={() => {
                   onHide()
                   dispatch(changeBtnStatus('idle'))
               }}
               aria-labelledby="contained-modal-title-vcenter"
               centered
               animation>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {edit ? 'Redact note' : 'Add new note'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    validationSchema={schema}
                    onSubmit={onSubmit}
                    initialValues={{
                        title: `${edit ? activeNote.title : ''}`,
                        description: `${edit ? activeNote.description : ''}`
                    }}
                >{({
                       handleSubmit,
                       handleChange,
                       values,
                       errors
                   }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group controlId='title'>
                            <Form.Control
                                className='mb-4'
                                type="text"
                                placeholder="Enter title"
                                name="title"
                                value={values.title}
                                onChange={handleChange}
                                isInvalid={!!errors.title}

                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.title}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId='description'>
                            <Form.Control as='textarea'
                                          className='mb-4'
                                          placeholder="Enter description"
                                          name="description"
                                          value={values.description}
                                          onChange={handleChange}
                                          isInvalid={!!errors.description}

                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.description}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Tags </Form.Label>
                            <Tags edit={edit} activeNote={activeNote}/>
                            <Modal.Footer>
                                <Button type='submit' variant='dark'>Add</Button>
                                <Button onClick={() => {
                                    onHide()
                                    dispatch(changeBtnStatus('idle'))
                                }} variant='dark'>Close</Button>
                            </Modal.Footer>
                        </Form.Group>
                    </Form>
                )}
                </Formik>

            </Modal.Body>
        </Modal>

    )
}

export default ModalNote;