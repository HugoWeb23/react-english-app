import { useForm } from "react-hook-form";
import { ApiErrors } from '../Utils/Api'
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from '@material-ui/core'

interface IAdminModalForm {
  handleClose: () => void,
  onSubmit: (data: any) => Promise<any>,
  type: 'edit' | 'create',
  component: any,
  defaultValues?: any,
  editText: string,
  createText: string,
  successAlert?: string,
  errorAlert?: string
}

export const AdminModalForm = ({ handleClose, onSubmit, type, component: Component, defaultValues, editText, createText, successAlert = "Opération effectuée", errorAlert = "Une erreur est survenue" }: IAdminModalForm) => {
  const [loading, setLoading] = useState(false)
  const props = useForm({ defaultValues: defaultValues })
  const submit: any = async (formData: any, close: boolean) => {
    try {
      setLoading(true)
      await onSubmit(formData)
      if (close) {
        handleClose()
      }
      if (type != 'edit') {
        props.reset()
      }
      setLoading(false)
      toast.success(successAlert)
    } catch (e) {
      if (e instanceof ApiErrors) {
        e.errorsPerField.forEach(err => {
          props.setError(err.field, {
            type: "manual",
            message: err.message
          });
        })
        e.globalErrors.forEach(err => {
          toast.error(err)
        })
      }
      setLoading(false)
    }
  }

  return <Dialog open={true} onClose={() => handleClose()} fullWidth>
    <DialogTitle id="alert-dialog-title">{type == 'create' ? createText : editText}</DialogTitle>
    <form onSubmit={props.handleSubmit(submit)}>
      <DialogContent>
        <Component {...props} />
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={() => handleClose()}>
          Fermer
        </Button>
        <Button color="primary" onClick={props.handleSubmit(data => submit(data, false))} disabled={loading}>{type == 'create' ? "Créer" : "Éditer"}</Button>
        <Button color="primary" type="submit" disabled={loading}>
          {type == 'create' ? "Créer et fermer" : "Éditer et fermer"}
        </Button>
      </DialogActions>
    </form>
  </Dialog>
}