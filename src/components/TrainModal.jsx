import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export function TrainModal(props) {
    return (
      <Modal
        {...props}
        backdrop="static"
        keyboard={false}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <h4>Your classifier training has started</h4>
          <p>
            This may take some time. In your classifier view, you can see if the classifier is still training. When it is finished, a new classifier will be created, so the older one is not deleted.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Go to the classifier</Button>
        </Modal.Footer>
      </Modal>
    );
  }