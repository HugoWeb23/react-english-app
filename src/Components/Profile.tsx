import { ChangeEvent, useContext } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import { userContext } from '../Contexts/Contexts'
import { ProfileValues } from '../Types/Interfaces'
import { apiFetch, ApiErrors } from '../Utils/Api'
import { toast } from "react-toastify"

export const Profile = () => {
    const value = useContext(userContext);
    const {watch, register, formState, handleSubmit, setValue, setError, clearErrors} = useForm<any>({defaultValues: {
        nom: value.user?.nom,
        prenom: value.user?.prenom,
        email: value.user?.email
    }});
    const {errors, isSubmitting} = formState;
    const password = watch('pass', '');

    const onSubmit: SubmitHandler<ProfileValues> = async(data) => {
      delete data.repeatpass
        try {
          const user = await apiFetch('/api/user', {
            method: 'PUT',
            body: JSON.stringify({_id: value.user?._id, ...data})
          });
          ['pass', 'repeatpass'].forEach((input: string) => {
            setValue(input, '')
          })
          value.toggleUser(user)
          toast.success('Votre profil a été mis à jour !')
        } catch (e) {
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
    <h2 className="mb-4">Modifier mes informations</h2>
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
      <Form.Control type="password" autoComplete="new-password" placeholder="Entrez un mot de passe" isInvalid={errors.pass} {...register('pass')} />
      {errors.pass && <Form.Control.Feedback type="invalid">{errors.pass.message}</Form.Control.Feedback>}
      <Form.Text className="text-muted">
      Laisser vide pour ne pas modifier
    </Form.Text>
    </Form.Group>
    <Form.Group controlId="repat-pass">
      <Form.Label>Répéter le mot de passe</Form.Label>
      <Form.Control type="password" placeholder="Répétez le mot de passe" autoComplete="false" disabled={password.length === 0} isInvalid={errors.repeatpass} {...register('repeatpass', {validate: value => {
        value = value === undefined ? '' : value
        if(password.length === 0) {
          return true
        }
        return (value === password) || "Les deux mots de passe ne correspondent pas"
      }})} />
      {errors.repeatpass && <Form.Control.Feedback type="invalid">{errors.repeatpass.message}</Form.Control.Feedback>}
    </Form.Group>
    <Button variant="primary" type="submit" disabled={isSubmitting} size="lg" block>
      {isSubmitting ? 'Chargement...' : 'Valider'}
    </Button>
  </Form>
    </>
}