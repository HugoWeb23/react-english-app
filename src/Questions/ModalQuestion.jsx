import { FormProvider, useForm } from "react-hook-form";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import {QuestionForm} from '../Questions/QuestionForm'
import { Form } from "react-bootstrap";
import {ApiErrors} from '../Utils/Api'
import { useState } from "react";

export const ModalQuestion = ({handleClose, onSubmit, question = {}, type}) => {
    const methods = useForm({
      defaultValues: {
          type: question.type || "1",
          themeId: question.theme && question.theme._id || null,
          intitule: question.intitule || null,
          question: question.question || null,
          propositions: question.propositions || [{}],
          reponse: question.reponse ||null
      }
    })

    const [loading, setLoading] = useState(false)
    
    const submit = async(question, close) => {
      try {
       setLoading(true)
       await onSubmit(question)
       if(close == true) {
        handleClose()
       }
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
    <Form onSubmit={methods.handleSubmit(data => submit(data, true))}>
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