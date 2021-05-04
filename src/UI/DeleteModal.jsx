import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export const DeleteModal = ({handleClose, onConfirm, element}) => {

    const handleConfirm = () => {
        onConfirm(element)
        handleClose()
    }

return  <Modal show={true} onHide={() => handleClose()}>
<Modal.Header closeButton>
  <Modal.Title>Confirmation</Modal.Title>
</Modal.Header>
<Modal.Body>Voulez-vous vraiment supprimer cet élément ?</Modal.Body>
<Modal.Footer>
  <Button variant="secondary" onClick={() => handleClose()}>
    Annuler
  </Button>
  <Button variant="danger" onClick={handleConfirm}>
    Supprimer
  </Button>
</Modal.Footer>
</Modal>
}