import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import {useFieldArray, useForm, useFormContext} from 'react-hook-form'
import {MultiChoices} from './MultiChoices'
import { useEffect, useState } from "react"
import { SelectThemes } from "../Themes/SelectThemes"
import {Themes} from '../Hooks/GetThemes'
import { Loader } from "../UI/Loader"

export const QuestionForm = () => {
    const {register, control, watch, formState, getValues} = useFormContext();
    const {errors} = formState;
    const {fields, append, remove} = useFieldArray({control, name: "propositions"})
    const [themesLoader, setThemesLoader] = useState<boolean>(true)
    const questionType = watch('type');

    const {themes, GetThemes} = Themes();

    useEffect(() => {
        (async() => {
            await GetThemes();
            setThemesLoader(false)
        })()
    }, [])

    const checkReponse = (value: string) => {
        const questionType = watch('type');
        if(value == null && questionType == "1") {
            return "La réponse est obligatoire"
        }
        return true
    }

    const removeField = (field: any) => {
        if(fields.length > 1) {
            remove(field)
        }
    }

return <>
<Form.Group controlId="type">
    <Form.Label>Type de question</Form.Label>
    <Form.Control as="select" isInvalid={errors.type} {...register('type', {required: "Le type est obligatoire", min: 1, max: 2})}>
      <option value="1">Réponse à écrire</option>
      <option value="2">Choix multiples</option>
    </Form.Control>
    {errors.type && <Form.Control.Feedback type="invalid">{errors.type.message}</Form.Control.Feedback>}
</Form.Group>
<Form.Group controlId="themeId">
    <Form.Label>Thème de la question</Form.Label>
    {themesLoader ? <Loader display="block" animation="border" variant="primary" /> : <SelectThemes themes={themes} name="themeId" register={register} errors={errors}/>}
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
<Form.Group controlId="reponse">
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
        return <MultiChoices field={field} key={index} index={index} errors={errors} register={register} remove={removeField}/>
})}
<Button variant="info" onClick={() => append({})}>Ajouter une proposition</Button>
</>}
</>
}