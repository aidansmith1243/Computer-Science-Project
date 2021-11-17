import { Modal } from 'react-bootstrap';
import './InviteModal.css';
import {useNavigate} from 'react-router-dom';

const InviteModal = (props) => {
    const {style} = props;
    const navigate = useNavigate();
    return ( 
        <Modal
            centered
        >
            <Modal.Header>Invite Friends</Modal.Header>
            <Modal.Body>+</Modal.Body>
            <Modal.Footer><button onClick={()=>navigate('/Hearts')}>Play</button></Modal.Footer>
        </Modal>
    );
}
 
export default InviteModal;