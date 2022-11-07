import ReactDOM from "react-dom";
import {useState} from "react";
import {useSelector} from "react-redux";

import {NavLink, useParams} from 'react-router-dom'
import {Helmet} from "react-helmet";

import {notes} from "../../noteList/notesSlice";

import Note from '../../noteItem/Note';
import ModalNote from "../../modals/modalNote/ModalNote";
import ErrorBoundary from "../../errorBoundary/ErrorBoundary";

import {findNotes} from "../../../helper";

import {Col, Container} from 'react-bootstrap'


const SearchPage = () => {

    const {searchPhrase} = useParams();

    const allNotes = useSelector(notes);
    const status = useSelector(state => state.notes.btnStatus);

    const [modalShow, setModalShow] = useState(false);

    const renderFindElement = arr => (arr.map(el => (
        <Col key={el.id}><Note el={el} setModalShow={setModalShow}/></Col>)))

    let searchElements = [];
    if (searchPhrase) {
        searchElements = findNotes(allNotes, searchPhrase);
    }
    const items = searchElements.length > 0 ? renderFindElement(searchElements) : null;

    return (
        <>
            <Helmet>
                <meta name="description" content="Page with find notes"/>
                <title>Search page</title>
            </Helmet>
            <ErrorBoundary>
                {items ? <Container className='d-flex'>{items}</Container> : <NotResult/>}
            </ErrorBoundary>
            <Portal>
                {status === 'edit' && <ModalNote edit={true} show={modalShow} onHide={() => setModalShow(false)}/>}
            </Portal>
        </>

    )
}

const NotResult = () => (
    <Container className='text-center m-4'>
        <h2>Not Result</h2>
        <NavLink to='/'>Back to home page</NavLink>
    </Container>
)


const Portal = (props) => (
    ReactDOM.createPortal(props.children, document.getElementById('modal'))
)


export default SearchPage;