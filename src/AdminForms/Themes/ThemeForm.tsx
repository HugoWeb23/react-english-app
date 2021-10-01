import Form from 'react-bootstrap/Form'
import {UseFormReturn} from 'react-hook-form'

export const ThemeForm = (props: UseFormReturn) => {
    const {register, formState} = props
    const {errors} = formState;

    return <>
    <Form.Group controlId="theme">
        <Form.Label>Nom du thème</Form.Label>
        <Form.Control type="text" placeholder="Nom du thème" isInvalid={errors.theme} {...register('theme')}/>
        {errors.theme && <Form.Control.Feedback type="invalid">{errors.theme.message}</Form.Control.Feedback>}
    </Form.Group>
    </>
}