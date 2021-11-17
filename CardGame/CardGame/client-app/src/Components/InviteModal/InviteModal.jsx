import { Modal,Button, Dropdown } from 'react-bootstrap';
import './InviteModal.css';
import {useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';

const InviteModal = (props) => {
    const {setShow,friendHub,friends} = props;
    const [invitedFriends, setInvitedFriends] = useState([]);
    const navigate = useNavigate();
    const handleCancel = async (e) => {
        console.log(friendHub.connectionId)
        //await friendHub.start();
        await friendHub.send("GameInvite","val").then(res => {
            console.log(res)
        })

        setShow(false)
    };
    const handlePlay = (e) => {

        navigate('/Hearts')
    };
    

    return ( 
        <Modal
            show={props.show}
            centered
        >
            <Modal.Header>Invite Friends</Modal.Header>
            <Modal.Body>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Select Friend
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {
                        friends.filter(x => x.isOnline).map(x => 
                            <Dropdown.Item key={x.user}>{x.user}</Dropdown.Item>
                            )
                    }
                </Dropdown.Menu>
                </Dropdown>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() =>props.cancelInvite()}>
                    Cancel
                </Button>
                <Button onClick={()=>handlePlay()}>
                    Play
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
 
export default InviteModal;