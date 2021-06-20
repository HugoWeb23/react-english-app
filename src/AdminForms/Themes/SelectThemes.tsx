import { useEffect, useState } from "react"
import Form from 'react-bootstrap/Form'
import { ThemeType } from "../../Types/Themes"
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"

interface ISelectedThemes {
    themes: ThemeType[],
    name: string,
    register: UseFormRegister<FieldValues>,
    errors: FieldErrors
}

export const SelectThemes = ({themes, name, register, errors}: ISelectedThemes) => {
    const [loading, setLoading] = useState<boolean>(true)

    return <>
    <Form.Group controlId="themeId">
    <Form.Control as="select" isInvalid={errors.themeId} {...register(name, {required: "Le thème est obligatoire"})}>
        <option value="">Sélectionner un thème</option>
    {themes.map((theme: ThemeType, index: number) => {
        return <option key={theme._id} value={theme._id}>{theme.theme}</option>
    })}
  </Form.Control>
  {errors.themeId && <Form.Control.Feedback type="invalid">{errors.themeId.message}</Form.Control.Feedback>}
  </Form.Group>
  </>

}