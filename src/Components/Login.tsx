import { createRef, useContext, useState } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import { useForm, SubmitHandler } from 'react-hook-form'
import {apiFetch, ApiErrors} from '../Utils/Api'
import {UserType} from '../Types/User'

interface LoginProps {
  onConnect: (user: UserType) => void
}

type FormValues = {
  email: string,
  pass: string
}

export const Login = ({onConnect}: LoginProps) => {
   const [errorsPerField, setErrorsPerField] = useState({});
   const [globalErrors, setGlobalErrors] = useState<{message: string} | null>(null);

   const {watch, register, formState, handleSubmit, setError} = useForm();
   const {errors, isSubmitting} = formState;

   const onSubmit:SubmitHandler<FormValues> = async data => {
      try {
         const user = await apiFetch('/login', {
            method: 'POST',
            body: JSON.stringify(data)
         })
         localStorage.setItem('token', user.token);
         onConnect(user);
      } catch(e) {
        if(e instanceof ApiErrors) {
          setErrorsPerField(e.errorsPerField)
          setGlobalErrors(e.globalErrors);
         console.log(globalErrors)
         console.log(errorsPerField)
        }
      }
     
   }
   return <Form noValidate className="container mt-4" onSubmit={handleSubmit(onSubmit)}>
      {globalErrors && globalErrors.message != undefined && <Alert variant="danger">{globalErrors.message}</Alert>}
   <Form.Group controlId="email">
     <Form.Label>Adresse e-mail</Form.Label>
     <Form.Control type="email" placeholder="Entrez votre adresse e-mail" isInvalid={errors.email} {...register('email', {required: 'Veuillez saisir une adresse email'})}/>
     {errors.email && <Form.Control.Feedback type="invalid">{errors.email.message}</Form.Control.Feedback>}
   </Form.Group>
   <Form.Group controlId="pass">
     <Form.Label>Mot de passe</Form.Label>
     <Form.Control type="password" placeholder="Entrez votre mot de passe" isInvalid={errors.pass} {...register('pass', {required: 'Veuillez saisir un mot de passe'})} />
     {errors.pass && <Form.Control.Feedback type="invalid">{errors.pass.message}</Form.Control.Feedback>}
    
   </Form.Group>
   <Button variant="primary" type="submit" disabled={isSubmitting}>
     {isSubmitting ? 'Chargement...' : 'Connexion'}
   </Button>
 </Form>
}