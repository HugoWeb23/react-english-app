import Form from "react-bootstrap/Form"
import { UseFormReturn } from "react-hook-form";

export const AccountForm = (props: UseFormReturn) => {
    const {register, control, watch, formState, getValues, setValue} = props;
    const {errors} = formState;

return <>
<Form.Group controlId="nom">
    <Form.Label>Nom</Form.Label>
    <Form.Control type="text" placeholder="Intitulé de la question" isInvalid={errors.nom} {...register('nom')}/>
    {errors.nom && <Form.Control.Feedback type="invalid">{errors.nom.message}</Form.Control.Feedback>}
</Form.Group>
<Form.Group controlId="prenom">
    <Form.Label>Prénom</Form.Label>
    <Form.Control type="text" placeholder="Intitulé de la question" isInvalid={errors.prenom} {...register('prenom')}/>
    {errors.prenom && <Form.Control.Feedback type="invalid">{errors.prenom.message}</Form.Control.Feedback>}
</Form.Group>
<Form.Group controlId="email">
    <Form.Label>Adresse e-mail</Form.Label>
    <Form.Control type="text" placeholder="Intitulé de la question" isInvalid={errors.email} {...register('email')}/>
    {errors.email && <Form.Control.Feedback type="invalid">{errors.email.message}</Form.Control.Feedback>}
</Form.Group>
<Form.Group controlId="pass">
    <Form.Label>Mot de passe</Form.Label>
    <Form.Control type="password" placeholder="Nouveau mot de passe" autoComplete="new-password" isInvalid={errors.pass} {...register('pass')}/>
    {errors.pass && <Form.Control.Feedback type="invalid">{errors.pass.message}</Form.Control.Feedback>}
    <Form.Text className="text-muted">
      Laisser vide pour ne pas modifier
    </Form.Text>
</Form.Group>
<Form.Group controlId="role">
    <Form.Label>Rôle de l'utilisateur</Form.Label>
    <Form.Control as="select" isInvalid={errors.admin} {...register('admin')}>
      <option value="false">Utilisateur</option>
      <option value="true">Administrateur</option>
    </Form.Control>
    {errors.admin && <Form.Control.Feedback type="invalid">{errors.admin.message}</Form.Control.Feedback>}
</Form.Group>
</>
}