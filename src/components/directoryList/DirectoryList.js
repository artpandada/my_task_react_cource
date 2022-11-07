import {useRef, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Link} from "react-router-dom";
import ContentEditable from 'react-contenteditable'

import {directories, setActiveDirectory, putDirectory, fetchDirectories} from "./directoriesSlice";
import {findParentsId} from "../../helper";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import {ListGroup, Col, Row, OverlayTrigger, Tooltip, Overlay, Toast, ToastContainer} from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';


const DirectoryList = ({directoriesService}) => {

    const directoriesStatus = useSelector(state => state.directories.directoriesLoadingStatus)

    if (directoriesStatus === 'loading') {
        return (
            <Spinner/>
        )
    } else if (directoriesStatus === 'error') {
        return (
            <ErrorMessage/>
        )
    }

    const renderDirectories = (arr) => {
        const item = arr.map(el => (<Directory key={el.id} el={el}/>))
        return (
            <ListGroup variant='flush'>
                {item}
            </ListGroup>
        )
    }

    return renderDirectories(directoriesService);


}

const Directory = ({el}) => {
    const allDirectories = useSelector(directories);
    const activeDirectoryId = useSelector(state => state.directories.activeDirectory);

    const openDirectory = findParentsId(allDirectories, activeDirectoryId).find(e => e === el.id);

    const [expand, setExpand] = useState(!!openDirectory);
    const [value, setValue] = useState(el.name);
    const [showError, setShowError] = useState(false);
    const [disabled, setDisabled] = useState(true)

    const ref = useRef();
    const dispatch = useDispatch();


    const changeActiveDirectory = () => {
        el.id === activeDirectoryId
            ? dispatch(setActiveDirectory(null))
            : dispatch(setActiveDirectory(el.id))
    }

    return (

        <ListGroup.Item key={el.id}>
            <Row>
                <Col md={{span: 1}}>
                    <Link to={`/${el.id}`}>
                        {
                            activeDirectoryId !== el.id
                                ? <Icon.Folder

                                    size={20}
                                    color='black'
                                    onClick={changeActiveDirectory}
                                />
                                : <Icon.FolderFill
                                    size={20}
                                    color='black'
                                    onClick={changeActiveDirectory}
                                />
                        }
                    </Link>
                </Col>

                <Col sm md={{span: "auto"}}>
                    <OverlayTrigger
                        placement='right'
                        overlay={<Tooltip id="editable-dir-tooltip">Touch and redact this name</Tooltip>}>
                        <ContentEditable
                            className='position-relative'
                            innerRef={ref}
                            html={value}
                            name='title'
                            disabled={disabled}
                            onChange={(e) => {
                                setValue(e.target.value)
                            }}
                            onClick={() => setDisabled(false)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    if (e.target.innerText.length > 0) {
                                        dispatch(putDirectory({...el, name: e.target.innerText}))
                                        dispatch(fetchDirectories());
                                    } else {
                                        setShowError(true)
                                        setValue(el.name)
                                        setDisabled(true)

                                    }
                                }
                            }}
                        />
                    </OverlayTrigger>

                    <ToastContainer position="middle-center">
                        <Toast className="d-inline-block m-1" bg='danger' show={showError} delay={3000} autohide
                               onClose={() => setShowError(false)}>
                            <Toast.Body>Name can be more than 1 symbol</Toast.Body>
                        </Toast>
                    </ToastContainer>
                </Col>

                <Col sm>
                    {expand
                        ? <Icon.DashCircleDotted onClick={() => setExpand(!expand)} size={20}/>
                        : <Icon.PlusCircleDotted onClick={() => setExpand(!expand)} size={20}/>
                    }
                </Col>

                <div className='m-lg-8' style={{display: expand ? "block" : "none"}}>
                    {el.children.length > 0 && (<DirectoryList directoriesService={el.children}/>)}
                </div>

            </Row>
        </ListGroup.Item>


    )
}

export default DirectoryList;
