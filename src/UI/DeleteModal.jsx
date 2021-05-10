import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import {useState} from 'react'

export const DeleteModal = ({handleClose, onConfirm, element}) => {

  const [loading, setLoading] = useState(false)

    const handleConfirm = async() => {
        setLoading(true)
        await onConfirm(element)
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
  <Button variant="danger" className={`${loading ? "progress-bar progress-bar-striped progress-bar-animated bg-danger" : null}`} disabled={loading} onClick={handleConfirm}>
    Supprimer
  </Button>
</Modal.Footer>
</Modal>
}