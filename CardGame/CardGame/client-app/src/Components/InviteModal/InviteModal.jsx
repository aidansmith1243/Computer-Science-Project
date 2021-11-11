import { Modal } from 'react-bootstrap';
import './InviteModal.css';

const InviteModal = (props) => {
    const {style} = props;
    return ( 
        <Modal
            show={true}
            centered
            
        >
            <Modal.Header>Hi</Modal.Header>
            <Modal.Body>asdfasdf</Modal.Body>
            <Modal.Footer>This is the footer</Modal.Footer>
        </Modal>
    );
}
 
export default InviteModal;