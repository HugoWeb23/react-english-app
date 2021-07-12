import { StandardTextFieldProps } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import { Controller } from 'react-hook-form'

interface ITextField extends StandardTextFieldProps {
    name: string,
    control: any,
    rules?: {},
    defaultValue?: string
}

export const MTextField = ({ name, control, rules, defaultValue, ...restProps }: ITextField) => {
    return <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={(props) => (
            <TextField
            value={props.field.value}
            id="outlined-basic"
            onChange={props.field.onChange} 
            error={props.fieldState.invalid}
            helperText={props.fieldState.error?.message}
            inputRef={props.field.ref}
            {...restProps}
             />
        )}
        />
}