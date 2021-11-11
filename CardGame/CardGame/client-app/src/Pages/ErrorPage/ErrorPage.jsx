import { Modal } from "react-bootstrap";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
const ErrorPage = () => {
    return ( 
        <div>
            <Modal
            show={true}
            centered
        >
            <Modal.Header>Hi</Modal.Header>
            <Modal.Body>asdfasdf</Modal.Body>
            <Modal.Footer>This is the footer</Modal.Footer>
        </Modal>
        </div>
    );
}
 
export default ErrorPage;