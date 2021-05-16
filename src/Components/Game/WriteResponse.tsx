import {QuestionType} from '../../Types/Questions'
import Form from 'react-bootstrap/Form'

interface WriteProps {
    question: QuestionType,
    register: any
}

export const WriteResponse = ({ question, register }: WriteProps) => {
    return <Form.Group controlId="reponse">
        <Form.Label>Répnse :</Form.Label>
        <Form.Control type="text" {...register('reponse', { required: 'La réponse est obligatoire' })} />
    </Form.Group>
}