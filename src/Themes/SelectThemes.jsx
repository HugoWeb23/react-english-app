import { useEffect, useState } from "react"
import { apiFetch } from "../Utils/Api"
import Form from 'react-bootstrap/Form'
import {Loader} from '../UI/Loader'

export const SelectThemes = ({themes = null, name, register, errors}) => {
    const [loading, setLoading] = useState(true)

    return <>
    {themes == null ? <><Loader display="block" animation="border" variant="primary" /></> :
    <Form.Group controlId="themeId">
    <Form.Control as="select" isInvalid={errors.themeId} {...register(name, {required: "Le thème est obligatoire"})}>
        <option value="">Sélectionner un thème</option>
    {themes.map((theme, index) => {
        return <option key={theme._id} value={theme._id}>{theme.theme}</option>
    })}
  </Form.Control>
  {errors.themeId && <Form.Control.Feedback type="invalid">{errors.themeId.message}</Form.Control.Feedback>}
  </Form.Group>}
  </>

}