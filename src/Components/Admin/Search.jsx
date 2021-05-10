import {useForm} from 'react-hook-form'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export const Search = ({onSearch, size}) => {
    const {register, handleSubmit} = useForm()

    const submit = e => {
        console.log(e)
        onSearch(e)
    }

    return <>
    <Form onSubmit={handleSubmit(submit)}>
    <Form.Group controlId="search">
    <Form.Label>Rechercher une question</Form.Label>
    <Form.Control {...register('value')} size={size}/>
    <Button variant="info" type="submit">Chercher</Button>
    </Form.Group>
    </Form>
    </>
}