import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import {QuestionForm} from './QuestionForm'
import { Form } from "react-bootstrap";
import {ApiErrors} from '../Utils/Api'
import { useState } from "react";
import {QuestionType} from '../Types/Questions'

interface IModalQuestion {
  handleClose: () => void,
  onSubmit: (question: any) => Promise<any>,
  question?: QuestionType,
  type: 'edit' | 'create'
}

export const ModalQuestion = ({handleClose, onSubmit, question = {} as QuestionType, type}: IModalQuestion) => {
    const methods = useForm({
      defaultValues: {
          type: question.type || "1",
          themeId: question.theme && question.theme._id || null,
          intitule: question.intitule || null,
          question: question.question || null,
          propositions: question.propositions || [{}],
          reponse: question.reponse || null
      }
    })

    const [loading, setLoading] = useState(false)
    
    const submit: SubmitHandler<QuestionType> = async(question) => {
      try {
       setLoading(true)
       await onSubmit(question)
       handleClose()
       /*
       if(close === true) {
        handleClose()
       }
       */
       if(type != 'edit') {
        methods.reset()
       }
       setLoading(false)
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
      <Button variant="success" onClick={methods.handleSubmit(submit)} disabled={loading}>{type == 'create' ? "Créer" : "Éditer"}</Button>
      <Button variant="success" type="submit" disabled={loading}>
      {type == 'create' ? "Créer et fermer" : "Éditer et fermer"}
      </Button>
    </Modal.Footer>
    </Form>
    </FormProvider>
    </Modal>
    }