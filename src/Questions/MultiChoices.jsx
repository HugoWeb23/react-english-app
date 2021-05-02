import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'

export const MultiChoices = ({register, errors, remove, field, index}) => {
    return <Form.Group key={field.id}>
    <Form.Row>
    <Col xs={10}>
<Form.Control type="text" className="mb-2" isInvalid={errors.propositions && errors.propositions[index]} defaultValue={field.proposition} placeholder="Entrez une proposition" {...register(`propositions.${index}.proposition`, {required: "La proposition est obligatoire"})} />
{errors.propositions && errors.propositions[index] && <Form.Control.Feedback type="invalid" className="mb-2">{errors.propositions[index].proposition.message}</Form.Control.Feedback>}
<Form.Check defaultChecked={field.correcte} custom type="checkbox" label="Réponse correcte" id={`custom-${index}`} {...register(`propositions.${index}.correcte`)}/>
</Col>
<Col>
<Button variant="danger" onClick={() => remove(index)}>X</Button>
</Col>
</Form.Row>
</Form.Group>
}