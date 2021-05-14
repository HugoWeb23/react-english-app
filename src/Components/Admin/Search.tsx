import {useForm} from 'react-hook-form'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { JsxAttribute } from 'typescript'

interface SearchProps {
    onSearch: (e: object) => Promise<void>,
    size: 'sm' | 'lg'
}

export const Search = ({onSearch, size}: SearchProps) => {
    const {register, handleSubmit} = useForm()

    const submit = (e: object) => {
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