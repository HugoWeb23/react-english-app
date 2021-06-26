import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { Form } from "react-bootstrap";
import { ApiErrors } from '../Utils/Api'
import { useState } from "react";
import { IUsers } from "../Types/Interfaces";
import { Children } from "react";
import { JsxElement } from "typescript";
import { toast } from "react-toastify";

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
  const props = useForm({defaultValues: defaultValues})
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
        console.log(e.globalErrors)
        e.globalErrors.forEach(err => {
          toast.error(err)
        })
      }
      setLoading(false)
    }
  }

  return <Modal show={true} onHide={() => handleClose()}>
    <Modal.Header closeButton>
      <Modal.Title>{type == 'create' ? createText : editText}</Modal.Title>
    </Modal.Header>
    <Form onSubmit={props.handleSubmit(submit)}>
      <Modal.Body>
        <Component {...props} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleClose()}>
          Annuler
        </Button>
        <Button variant="success" onClick={props.handleSubmit(data => submit(data, false))} disabled={loading}>{type == 'create' ? "Créer" : "Éditer"}</Button>
        <Button variant="success" type="submit" disabled={loading}>
          {type == 'create' ? "Créer et fermer" : "Éditer et fermer"}
        </Button>
      </Modal.Footer>
    </Form>
  </Modal>
}