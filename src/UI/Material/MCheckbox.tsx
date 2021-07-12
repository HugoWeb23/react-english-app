import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import { Controller } from 'react-hook-form'

interface ICheckbox extends CheckboxProps {
    name: string,
    control: any,
    rules?: {},
    defaultValue?: any
}

export const MCheckbox = ({name, control, rules, defaultValue, ...restProps}: ICheckbox) => {
    return <Controller
    name={name}
    control={control}
    rules={rules}
    defaultValue={defaultValue}
    render={(props) => (
        <>
        <Checkbox
        checked={props.field.value}
        id="outlined-basic"
        onChange={props.field.onChange} 
        ref={props.field.ref}
        {...restProps}
         />
         </>
    )}
    />
}