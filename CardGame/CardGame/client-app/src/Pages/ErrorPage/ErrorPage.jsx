import { Modal } from 'react-bootstrap';
import '../../../node_modules/bootstrap/dist/css/bootstrap.css';
const ErrorPage = () => {
  return (
    <div>
      <Modal show={true} centered>
        <Modal.Header>404 Page not found</Modal.Header>
        <Modal.Body></Modal.Body>
        {/* <Modal.Footer></Modal.Footer> */}
      </Modal>
    </div>
  );
};

export default ErrorPage;
