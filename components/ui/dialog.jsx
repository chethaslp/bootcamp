import { Modal } from 'react-bootstrap';

const showAlert = (title, msg)=>{
    const [showModal, setShowModal] = React.useState(true);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    return <Modal centered show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>{msg}</p>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
                Okay
            </Button>
        </Modal.Footer>
    </Modal>
}

export {showAlert}