import { Modal,Button, Dropdown,ListGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';

const LoadingModal = (props) => {
    const {show,friendHub,setShow} = props;
    const navigate = useNavigate();

    const handleCancel = async (e) => {
        const user = e.target.value
        if(!friendHub._connectionStarted) {
            await friendHub.start();
        }
        friendHub.send("GameInviteResponse",user,false)
        setShow({value:false,user:null});
    };

    return ( 
        <Modal
            show={show.value}
            centered
        >
            <Modal.Header>Waiting for {show.user} to start the game.</Modal.Header>
            <Modal.Footer>
                <Button variant="secondary" value={show.user} onClick={(e) => handleCancel(e,"test")}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
 
export default LoadingModal;