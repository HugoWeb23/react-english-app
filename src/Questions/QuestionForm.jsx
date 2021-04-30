import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col"
import {useFieldArray, useForm} from 'react-hook-form'
import {MultiChoices} from './MultiChoices'
import { useEffect } from "react"

export const QuestionForm = ({question}) => {

    const {register, handleSubmit, control, watch, Controller} = useForm({
        defaultValues: {
            type: question.type || 1,
            intitule: question.intitule || null,
            question: question.question || null,
            propositions: question.propositions || [{}],
            reponse: question.reponse ||null
        }
      });
    const {fields, append, remove} = useFieldArray({control, name: "propositions"})
    const questionType = watch('type');

    const submitForm = (e) => {
        console.log(e)
    }
return <Form onSubmit={handleSubmit(submitForm)}>
<Form.Group controlId="type">
    <Form.Label>Type de question</Form.Label>
    <Form.Control as="select" {...register('type')}>
      <option value="1">Réponse à écrire</option>
      <option value="2">Choix multiples</option>
    </Form.Control>
</Form.Group>
<Form.Group controlId="intitule">
    <Form.Label>Intitulé de la question</Form.Label>
    <Form.Control type="text" placeholder="Intitulé de la question" {...register('intitule')}/>
</Form.Group>
<Form.Group controlId="question">
    <Form.Label>Question</Form.Label>
    <Form.Control type="text" placeholder="Question" {...register('question')}/>
</Form.Group>
{questionType == "1" && <>
<Form.Group controlId="intitule">
    <Form.Label>Réponse à la question</Form.Label>
    <Form.Control type="text" placeholder="Réponse" {...register('reponse')}/>
</Form.Group>
</>}
{questionType == "2" && <>
<Form.Label>Propositions de réponses</Form.Label>
{fields.map((field, index) => {
        return <MultiChoices field={field} index={index} register={register} remove={remove}/>
})}
<Button variant="info" onClick={() => append({})}>Ajouter une proposition</Button>
</>}
<Form.Group controlId="submit">
    <Button type="submit" variant="success">Envoyer</Button>
</Form.Group>
</Form>
}