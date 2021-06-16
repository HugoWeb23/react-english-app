import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import {useState} from 'react'

interface IDeleteModal {
  handleClose: () => void,
  onConfirm: (element: any) => Promise<void>,
  element: any,
  message?: string
}

export const DeleteModal = ({handleClose, onConfirm, element, message = 'Voulez-vous vraiment supprimer cet élément ?'}: IDeleteModal) => {

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
<Modal.Body>{message}</Modal.Body>
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