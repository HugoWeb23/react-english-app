import { UseFormReturn } from 'react-hook-form'
import { MTextField } from "../../UI/Material/MTextField"
import {
    FormControl
} from '@material-ui/core'

export const ThemeForm = (props: UseFormReturn) => {
    const { register, control } = props
    return <>
        <FormControl fullWidth>
            <MTextField
                name="theme"
                control={control}
                label="Nom du thème"
                rules={{ required: 'Le thème est obligatoire' }}
            />
        </FormControl>
    </>
}