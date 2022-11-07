import ReactDOM from "react-dom";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";

import {
    changeBtnStatus,
    deleteDirectory, directories,
    fetchDirectories,
    setActiveDirectory
} from "../directoryList/directoriesSlice";
import ModalDirectory from "../modals/modalDirectory /ModalDirectory";
import Spinner from "../spinner/Spinner";

import {findParentsId} from "../../helper";

import {ButtonGroup, Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';


const ButtonsDirectories = () => {

    const allDir = useSelector(directories)
    const status = useSelector(state => state.directories.btnStatus);
    const activeDirectory = useSelector(state => state.directories.activeDirectory);

    const [modalShow, setModalShow] = useState(false);

    const dispatch = useDispatch();


    return (
        <>
            <ButtonGroup vertical>
                <OverlayTrigger
                    overlay={<Tooltip id="button-add-dir-tooltip-">Choose directory where you want add new</Tooltip>}
                    placement='right'>
                    <Button
                        className='p-3'
                        variant='dark'
                        data-tip data-for='add-directory'
                        onClick={() => {
                            dispatch(changeBtnStatus('add'))
                            setModalShow(true)
                        }}
                    >
                        <Icon.FolderPlus
                            size={20}
                        />
                    </Button>
                </OverlayTrigger>

                <OverlayTrigger
                    overlay={<Tooltip id="button-edit-dir-tooltip-">Choose directory what you want redact</Tooltip>}
                    placement='right'>
                    <Button
                        className='p-3'
                        variant='dark'
                        data-tip data-for='edit-directory'
                        onClick={() => {
                            if (activeDirectory) {
                                dispatch(changeBtnStatus('edit'))
                                setModalShow(true)

                            }
                        }}
                    ><Icon.PencilSquare size={20}/>
                    </Button>
                </OverlayTrigger>

                <OverlayTrigger
                    overlay={<Tooltip id="button-edit-dir-tooltip-">Choose directory what you want delete</Tooltip>}
                    placement='right'>
                    <Button
                        className='p-3'
                        variant='dark'
                        data-tip data-for='delete-directory'
                        onClick={() =>
                            dispatch(deleteDirectory(activeDirectory))
                                .then(() => {
                                    dispatch(setActiveDirectory(findParentsId(allDir, activeDirectory)[1]))
                                })
                                .then(() => {
                                    dispatch(fetchDirectories())
                                })
                        }
                    ><Icon.FolderX size={20}/>
                    </Button>
                </OverlayTrigger>

            </ButtonGroup>
            <Portal>
                {status === 'add' && <ModalDirectory show={modalShow} onHide={() => setModalShow(false)}/>}
                {status === 'edit' && <ModalDirectory edit={true} show={modalShow} onHide={() => setModalShow(false)}/>}
                {status === 'loading' && <Spinner/>}
            </Portal>
        </>

    )
}


const Portal = (props) => {
    return (
        ReactDOM.createPortal(props.children, document.getElementById('modal'))
    )
}

export default ButtonsDirectories;