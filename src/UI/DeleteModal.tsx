import Modal from 'react-bootstrap/Modal'
import { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from '@material-ui/core'
import { SnackBarContext } from '../Contexts/Contexts';

interface IDeleteModal {
  handleClose: () => void,
  onConfirm: (element: any) => Promise<void>,
  element: any,
  alertMessage?: string,
  deleteMessage?: string
}

export const DeleteModal = ({ handleClose, onConfirm, element, alertMessage = 'Voulez-vous vraiment supprimer cet élément ?', deleteMessage = 'Élément supprimé' }: IDeleteModal) => {
  const value = useContext(SnackBarContext)
  const [loading, setLoading] = useState(false)

  const Gne = () => {
   value.Open()
  }

  const handleConfirm = async () => {
    setLoading(true)
    await onConfirm(element)
    handleClose()
    Gne()
  }

  return <Dialog open={true} onClose={() => handleClose()}>
    <DialogTitle>Confirmation</DialogTitle>
    <DialogContent>{alertMessage}</DialogContent>
    <DialogActions>
      <Button color="default" onClick={() => handleClose()}>
        Annuler
      </Button>
      <Button color="secondary" disabled={loading} onClick={handleConfirm}>
        Supprimer
      </Button>
    </DialogActions>
  </Dialog>
}