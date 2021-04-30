import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'

export const MultiChoices = ({register, remove, field, index}) => {
    return <Form.Group key={field.id}>
    <Form.Row>
    <Col xs={10}>
<Form.Control type="text" className="mb-2" defaultValue={field.proposition} placeholder="Entrez une proposition" {...register(`propositions.${index}.proposition`)} />
<Form.Check defaultChecked={field.correcte} custom type="checkbox" label="Réponse correcte" id={`custom-${index}`} {...register(`propositions.${index}.correcte`)}/>
</Col>
<Col>
<Button variant="danger" onClick={() => remove(index)}>X</Button>
</Col>
</Form.Row>
</Form.Group>
}