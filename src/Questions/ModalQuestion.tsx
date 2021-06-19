import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import {QuestionForm} from './QuestionForm'
import { Form } from "react-bootstrap";
import {ApiErrors} from '../Utils/Api'
import { useState } from "react";
import {QuestionType} from '../Types/Questions'
import { toast } from 'react-toastify'

interface IModalQuestion {
  handleClose: () => void,
  onSubmit: (question: any) => Promise<any>,
  question?: QuestionType,
  type: 'edit' | 'create'
}

export const ModalQuestion = ({handleClose, onSubmit, question = {} as QuestionType, type}: IModalQuestion) => {
    const [loading, setLoading] = useState(false)
    const methods = useForm({
      defaultValues: {...question, propositions: (question.propositions === undefined ? [{}] : question.propositions), themeId: question.theme?._id }
    })
    
    const submit: any = async(question: any, close: any) => {
      try {
       setLoading(true)
       await onSubmit(question)
       if(close) {
        handleClose()
       }
       if(type != 'edit') {
        methods.reset()
       }
       setLoading(false)
       toast.success('TEST')
      } catch(e) {
        if(e instanceof ApiErrors) {
          e.errorsPerField.forEach(err => {
            methods.setError(err.field, {
              type: "manual",
              message: err.message
            });
          })
         }
         setLoading(false)
      }
    }
    
    return  <Modal show={true} onHide={() => handleClose()}>
    <Modal.Header closeButton>
      <Modal.Title>{type == 'create' ? "Créer une question" : "Éditer une question"}</Modal.Title>
    </Modal.Header>
    <FormProvider {...methods}>
    <Form onSubmit={methods.handleSubmit(submit)}>
    <Modal.Body>
      <QuestionForm/>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => handleClose()}>
        Annuler
      </Button>
      <Button variant="success" onClick={methods.handleSubmit(data => submit(data, false))} disabled={loading}>{type == 'create' ? "Créer" : "Éditer"}</Button>
      <Button variant="success" type="submit" disabled={loading}>
      {type == 'create' ? "Créer et fermer" : "Éditer et fermer"}
      </Button>
    </Modal.Footer>
    </Form>
    </FormProvider>
    </Modal>
    }