import Form from 'react-bootstrap/Form'
import {useFormContext} from 'react-hook-form'

export const ThemeForm = () => {
    const {register, formState} = useFormContext();
    const {errors} = formState;

    return <>
    <Form.Group controlId="theme">
        <Form.Label>Nom du thème</Form.Label>
        <Form.Control type="text" placeholder="Nom du thème" isInvalid={errors.theme} {...register('theme', {required: "Le thème est obligatoire"})}/>
        {errors.theme && <Form.Control.Feedback type="invalid">{errors.theme.message}</Form.Control.Feedback>}
    </Form.Group>
    </>
}