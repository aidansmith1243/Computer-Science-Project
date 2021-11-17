import { Modal,Button } from 'react-bootstrap';
import './InviteModal.css';
import {useNavigate} from 'react-router-dom';

const InviteModal = (props) => {
    const setShow = props.setShow;
    const navigate = useNavigate();
    return ( 
        <Modal
            show={props.show}
            
            centered
        >
            <Modal.Header>Invite Friends</Modal.Header>
            <Modal.Body>+</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Cancel
                </Button>
                <Button onClick={()=>navigate('/Hearts')}>
                    Play
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
 
export default InviteModal;