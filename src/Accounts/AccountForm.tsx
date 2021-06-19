import Form from "react-bootstrap/Form"
import {useFormContext} from 'react-hook-form'

export const AccountForm = () => {
    const {register, control, watch, formState, getValues} = useFormContext();
    const {errors} = formState;

return <>
<Form.Group controlId="nom">
    <Form.Label>Nom</Form.Label>
    <Form.Control type="text" placeholder="Intitulé de la question" isInvalid={errors.nom} {...register('nom', {required: "Le nom est obligatoire"})}/>
    {errors.nom && <Form.Control.Feedback type="invalid">{errors.nom.message}</Form.Control.Feedback>}
</Form.Group>
<Form.Group controlId="prenom">
    <Form.Label>Prénom</Form.Label>
    <Form.Control type="text" placeholder="Intitulé de la question" isInvalid={errors.prenom} {...register('prenom', {required: "Le prénom est obligatoire"})}/>
    {errors.prenom && <Form.Control.Feedback type="invalid">{errors.prenom.message}</Form.Control.Feedback>}
</Form.Group>
<Form.Group controlId="email">
    <Form.Label>Adresse e-mail</Form.Label>
    <Form.Control type="text" placeholder="Intitulé de la question" isInvalid={errors.email} {...register('email', {required: "L'adresse e-mail est obligatoire"})}/>
    {errors.email && <Form.Control.Feedback type="invalid">{errors.email.message}</Form.Control.Feedback>}
</Form.Group>
<Form.Group controlId="role">
    <Form.Label>Rôle de l'utilisateur</Form.Label>
    <Form.Control as="select" isInvalid={errors.role} {...register('admin', {required: "Le rôle est obligatoire"})}>
      <option value="false">Utilisateur</option>
      <option value="true">Administrateur</option>
    </Form.Control>
    {errors.role && <Form.Control.Feedback type="invalid">{errors.role.message}</Form.Control.Feedback>}
</Form.Group>
</>
}