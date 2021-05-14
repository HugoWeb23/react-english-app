import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import {apiFetch, ApiErrors} from '../Utils/Api'
import {UserType} from '../Types/User'

interface RegisterProps {
  onConnect: (user: UserType) => void
}

type FormValues = {
  nom: string,
  prenom: string,
  email: string,
  pass: string,
  repeatpass?: string
}

export const Register = ({onConnect}: RegisterProps) => {
  const {watch, register, formState, handleSubmit, setError} = useForm({mode: 'onTouched'});
  const {errors, isSubmitting} = formState;
  const password = watch('pass');
  console.log(password);
  const onSubmit:SubmitHandler<FormValues> = async data => {
    delete data.repeatpass
    try {
      const user = await apiFetch('/register', {
         method: 'POST',
         body: JSON.stringify(data)
      })
      localStorage.setItem('token', user.token);
      onConnect(user);
   } catch(e) {
     if(e instanceof ApiErrors) {
      e.errorsPerField.forEach(err => {
        setError(err.field, {
          type: "manual",
          message: err.message
        });
      })
     }
   }
  }
    return <>
    <Form className="container mt-4" onSubmit={handleSubmit(onSubmit)}>
    <h2 className="mb-4">Créer un compte</h2>
    <Form.Group controlId="nom">
      <Form.Label>Nom</Form.Label>
      <Form.Control type="text" placeholder="Entrez un nom" isInvalid={errors.nom} {...register('nom', {required: 'Veuillez saisir un nom'})} />
      {errors.nom && <Form.Control.Feedback type="invalid">{errors.nom.message}</Form.Control.Feedback>}
    </Form.Group>
    <Form.Group controlId="prenom">
      <Form.Label>Prénom</Form.Label>
      <Form.Control type="text" placeholder="Entrez un prénom" isInvalid={errors.prenom} {...register('prenom', {required: 'Veuillez saisir un prénom'})} />
      {errors.prenom && <Form.Control.Feedback type="invalid">{errors.prenom.message}</Form.Control.Feedback>}
    </Form.Group>
    <Form.Group controlId="email">
      <Form.Label>Adresse e-mail</Form.Label>
      <Form.Control type="email" placeholder="Entrez une adresse e-mail" isInvalid={errors.email} {...register('email', {required: 'Veuillez saisir une adresse email'})} />
      {errors.email && <Form.Control.Feedback type="invalid">{errors.email.message}</Form.Control.Feedback>}
    </Form.Group>
    <Form.Group controlId="pass">
      <Form.Label>Mot de passe</Form.Label>
      <Form.Control type="password" placeholder="Entrez un mot de passe" isInvalid={errors.pass} {...register('pass', {required: 'Veuillez saisir un mot de passe'})} />
      {errors.pass && <Form.Control.Feedback type="invalid">{errors.pass.message}</Form.Control.Feedback>}
    </Form.Group>
    <Form.Group controlId="pass">
      <Form.Label>Répéter le mot de passe</Form.Label>
      <Form.Control type="password" placeholder="Répétez le mot de passe" isInvalid={errors.repeatpass} {...register('repeatpass', {required: 'Veuillez répéter le mot de passe', validate: value => value === password || "Les deux mots de passe ne correspondent pas"})} />
      {errors.repeatpass && <Form.Control.Feedback type="invalid">{errors.repeatpass.message}</Form.Control.Feedback>}
    </Form.Group>
    <Button variant="success" type="submit" disabled={isSubmitting}>
      {isSubmitting ? 'Chargement...' : 'S\'enregistrer'}
    </Button>
  </Form>
  </>
}