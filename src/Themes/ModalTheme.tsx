import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { FormProvider, useForm, SubmitHandler } from "react-hook-form"
import { ThemeForm } from './ThemeForm'
import { ApiErrors } from '../Utils/Api'
import { ThemeType } from '../Types/Themes'

interface IModalTheme {
  handleClose: () => void,
  onSubmit: (data: ThemeType) => Promise<void>,
  theme?: ThemeType,
  type: 'create' | 'edit'
}

export const ModalTheme = ({handleClose, onSubmit, theme = {} as ThemeType, type}: IModalTheme) => {

    const methods = useForm({defaultValues: {
        theme: theme.theme || null
    }});

    const submit: SubmitHandler<ThemeType> = async(data) => {
        try {
            await onSubmit(data)
            handleClose()
        } catch(e) {
            if(e instanceof ApiErrors) {
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
      <Modal.Title>{type == 'create' ? "Créer un thème" : "Éditer un thème"}</Modal.Title>
    </Modal.Header>
    <FormProvider {...methods}>
    <Form onSubmit={methods.handleSubmit(submit)}>
    <Modal.Body>
     <ThemeForm/>
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