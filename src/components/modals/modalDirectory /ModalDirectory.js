import {useDispatch, useSelector} from "react-redux";
import {
    fetchDirectories,
    postDirectory,
    putDirectory,
    changeBtnStatus, directories, setActiveDirectory
} from "../../directoryList/directoriesSlice";
import {Formik} from "formik";
import * as Yup from 'yup';

import {findElement} from "../../../helper";

import {Form, Modal, Button} from 'react-bootstrap'


const ModalDirectory = ({edit, show, onHide}) => {

    const allDirectory = useSelector(directories);
    const activeDirectoryId = useSelector(state => state.directories.activeDirectory);

    const activeElement = findElement(allDirectory, activeDirectoryId);

    const dispatch = useDispatch();

    const schema = Yup.object().shape({
        title: Yup.string().trim().min(2).required()
    })

    const onSubmit = values => {
        dispatch(changeBtnStatus('loading'))
        edit
            ? dispatch(putDirectory({id: activeElement.id, parentId: activeElement.parentId, name: values.title}))
                .then(() => dispatch(fetchDirectories()))
                .then(() => dispatch(changeBtnStatus('idle')))

            : dispatch(postDirectory({parentId: activeElement ? activeElement.id : 1, name: values.title}))
                .then((res) => dispatch(setActiveDirectory(res.payload.id)))
                .then(() => dispatch(fetchDirectories()))
                .then(() => dispatch(changeBtnStatus('idle')))

    }


    return (
        <Modal
            show={show}
            onHide={onHide}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            animation
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {edit ? 'Redact title' : 'Add new directory'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    validationSchema={schema}
                    onSubmit={onSubmit}
                    initialValues={{
                        title: `${edit ? activeElement.name : ''}`
                    }}

                >{({
                       handleSubmit,
                       handleChange,
                       values,
                       errors,

                   }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group controlId='title'>
                            <Form.Label>Title </Form.Label>
                            <Form.Control
                                className='mb-4'
                                autoComplete="off"
                                type="text"
                                placeholder="Enter title"
                                name="title"
                                value={values.title}
                                onChange={handleChange}
                                isInvalid={!!errors.title}
                                autoFocus
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.title}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Modal.Footer>
                            <Button type='submit' variant='dark'>{edit ? 'Save' : 'Add'}</Button>
                            <Button onClick={onHide} variant='dark'>Close</Button>
                        </Modal.Footer>
                    </Form>
                )}

                </Formik>

            </Modal.Body>

        </Modal>

    )
}
export default ModalDirectory;