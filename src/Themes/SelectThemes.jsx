import { useEffect, useState } from "react"
import { apiFetch } from "../Utils/Api"
import Form from 'react-bootstrap/Form'
import {Loader} from '../UI/Loader'

export const SelectThemes = ({register, errors}) => {
    const [themes, setThemes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async() => {
            const fetchThemes = await apiFetch('/api/themes/all');
            setThemes(fetchThemes)
            setLoading(false)
        })()
    }, [])

    return <>
    {loading ? <><Loader display="block" animation="border" variant="primary" /></> :
<Form.Group controlId="themeId">
    <Form.Control as="select" isInvalid={errors.themeId} {...register('themeId', {required: "Le thème est obligatoire"})}>
        <option value="">Sélectionner un thème</option>
    {themes.map((theme, index) => {
        return <option key={theme._id} value={theme._id}>{theme.theme}</option>
    })}
  </Form.Control>
  {errors.themeId && <Form.Control.Feedback type="invalid">{errors.themeId.message}</Form.Control.Feedback>}
  </Form.Group>}
  </>

}