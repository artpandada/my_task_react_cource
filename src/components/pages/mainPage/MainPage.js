import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";

import {Helmet} from "react-helmet";
import {useParams} from "react-router-dom";

import {fetchDirectories, directories, setActiveDirectory} from "../../directoryList/directoriesSlice";
import {fetchNotes, setActiveNote} from "../../noteList/notesSlice";

import ButtonsDirectories from "../../buttons/ButtonsDirectories";
import DirectoryList from "../../directoryList/DirectoryList";
import NoteList from "../../noteList/NoteList";
import ErrorBoundary from "../../errorBoundary/ErrorBoundary";

import {Col, Container, Row} from "react-bootstrap";


const MainPage = () => {

    const directoriesService = useSelector(directories);

    const {directoryId} = useParams();
    const {notesId} = useParams();

    const dispatch = useDispatch();

    useEffect(() => {

        dispatch(fetchDirectories());
        dispatch(fetchNotes())

        //eslint-disable-next-line
        if (directoryId) {
            dispatch(setActiveDirectory(+directoryId));
        }
        if (notesId) {
            dispatch((setActiveNote(+notesId)))
        }

    }, [])


    return (
        <>
            <Helmet>
                <meta name="description" content="Notes"/>
                <title>Notes</title>
            </Helmet>
            <Container className='mt-4'>
                <Row>
                    <Col md={{span: 1}} sm={1}>
                        <ErrorBoundary>
                            <ButtonsDirectories/>
                        </ErrorBoundary>
                    </Col>
                    <Col sm={4}>
                        <ErrorBoundary>
                            <DirectoryList directoriesService={directoriesService}/>
                        </ErrorBoundary>
                    </Col>
                    <Col>
                        <ErrorBoundary>
                            <NoteList/>
                        </ErrorBoundary>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
export default MainPage;