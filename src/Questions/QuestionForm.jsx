import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import {useFieldArray, useForm, useFormContext} from 'react-hook-form'
import {MultiChoices} from './MultiChoices'
import { useEffect } from "react"
import { SelectThemes } from "../Themes/SelectThemes"

export const QuestionForm = () => {
    const {register, control, watch, Controller, formState, getValues} = useFormContext();
    const {errors} = formState;
    const {fields, append, remove} = useFieldArray({control, name: "propositions"})
    const questionType = watch('type');

    const checkReponse = (value) => {
        const questionType = watch('type');
        if(value == null && questionType == "1") {
            return "La réponse est obligatoire"
        }
        return true
    }
return <>
<Form.Group controlId="type">
    <Form.Label>Type de question</Form.Label>
    <Form.Control as="select" isInvalid={errors.type} {...register('type', {required: "Le type de question est obligatoire", min: 1, max: 2})}>
      <option value="1">Réponse à écrire</option>
      <option value="2">Choix multiples</option>
    </Form.Control>
    {errors.type && <Form.Control.Feedback type="invalid">{errors.type.message}</Form.Control.Feedback>}
</Form.Group>
<Form.Group>
    <Form.Label>Thème de la question</Form.Label>
    <SelectThemes register={register} errors={errors}/>
</Form.Group>
<Form.Group controlId="intitule">
    <Form.Label>Intitulé de la question</Form.Label>
    <Form.Control type="text" placeholder="Intitulé de la question" isInvalid={errors.intitule} {...register('intitule', {required: "L'intitulé est obligatoire"})}/>
    {errors.intitule && <Form.Control.Feedback type="invalid">{errors.intitule.message}</Form.Control.Feedback>}
</Form.Group>
<Form.Group controlId="question">
    <Form.Label>Question</Form.Label>
    <Form.Control type="text" placeholder="Question" isInvalid={errors.question} {...register('question', {required: "La question est obligatoire"})}/>
    {errors.question && <Form.Control.Feedback type="invalid">{errors.question.message}</Form.Control.Feedback>}
</Form.Group>
{questionType == "1" && <>
<Form.Group controlId="intitule">
    <Form.Label>Réponse à la question</Form.Label>
    <Form.Control type="text" isInvalid={errors.reponse} placeholder="Réponse" {...register('reponse', {
          validate: checkReponse
        })}/>
    {errors.reponse && <Form.Control.Feedback type="invalid">{errors.reponse.message}</Form.Control.Feedback>}
</Form.Group>
</>}
{questionType == "2" && <>
<Form.Label>Propositions de réponses</Form.Label>
{fields.map((field, index) => {
        return <MultiChoices field={field} index={index} errors={errors} register={register} remove={remove}/>
})}
<Button variant="info" onClick={() => append({})}>Ajouter une proposition</Button>
</>}
</>
}