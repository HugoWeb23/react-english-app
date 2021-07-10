import { useEffect, useState } from "react"
import Form from 'react-bootstrap/Form'
import { ThemeType } from "../../Types/Themes"
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"
import {MultipleValues} from '../../UI/Material/MultipleValues'
import {FormControl} from '@material-ui/core'

interface ISelectedThemes {
    themes: ThemeType[],
    name: string,
    control?: any,
    styles?: any
}

export const SelectThemes = ({themes, name, control, styles}: ISelectedThemes) => {
    const [loading, setLoading] = useState<boolean>(true)

    return <>
   <FormControl fullWidth>
       <MultipleValues
        name={name}
        optionLabel="theme"
        data={themes}
        inputLabel="Sélectionnez un thème"
        control={control}
        styles={styles}
        multiple={false}
        rules={{required: 'Veuillez sélectionner un thème'}}
        />
   </FormControl>
  </>

}