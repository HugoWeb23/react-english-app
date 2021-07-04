import { StandardTextFieldProps } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import { Controller } from 'react-hook-form'

interface ITextField extends StandardTextFieldProps {
    name: string,
    control: any,
    rules?: {},
}

export const MTextField = ({ name, control, rules, ...restProps }: ITextField) => {
    return <Controller
        name={name}
        control={control}
        rules={rules}
        render={(props) => (
            <TextField
            {...restProps}
            id="outlined-basic"
            onChange={props.field.onChange} 
            error={props.fieldState.invalid}
            helperText={props.fieldState.error?.message}
            inputRef={props.field.ref}
             />
        )}
        />
}