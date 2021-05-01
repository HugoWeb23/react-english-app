import { FormProvider, useForm } from "react-hook-form";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import {QuestionForm} from '../Questions/QuestionForm'
import { Form } from "react-bootstrap";
import {ApiErrors} from '../Utils/Api'

export const ModalQuestion = ({handleClose, onSubmit, question = {}, type}) => {
    const methods = useForm({
      defaultValues: {
          type: question.type || 1,
          themeId: question.theme && question.theme._id || null,
          intitule: question.intitule || null,
          question: question.question || null,
          propositions: question.propositions || [{}],
          reponse: question.reponse ||null
      }
    })
    
    const submit = async(question) => {
      console.log(JSON.stringify(question))
      console.log(question)
      try {
       await onSubmit(question)
      handleClose()
       console.log(methods.formState.isSubmitSuccessful)
      } catch(e) {
        if(e instanceof ApiErrors) {
          console.log('errors')
          e.errorsPerField.forEach(err => {
            methods.setError(err.field, {
              type: "manual",
              message: err.message
            });
          })
         }
      }
    }
    
    return  <Modal show={true} onHide={() => handleClose()}>
    <Modal.Header closeButton>
      <Modal.Title>{type == 'create' ? "Créer une question" : "Éditer une question"}</Modal.Title>
    </Modal.Header>
    <FormProvider {...methods}>
    <Form  onSubmit={methods.handleSubmit(submit)}>
    <Modal.Body>
      <QuestionForm/>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => handleClose()}>
        Annuler
      </Button>
      <Button variant="success" type="submit">
      {type == 'create' ? "Créer" : "Éditer"}
      </Button>
    </Modal.Footer>
    </Form>
    </FormProvider>
    </Modal>
    }