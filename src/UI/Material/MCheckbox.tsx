import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import { Controller } from 'react-hook-form'

interface ICheckbox extends CheckboxProps {
    name: string,
    control: any,
    rules?: {},
}

export const MCheckbox = ({name, control, rules, ...restProps}: ICheckbox) => {
    return <Controller
    name={name}
    control={control}
    rules={rules}
    render={(props) => (
        <Checkbox
        {...restProps}
        id="outlined-basic"
        onChange={props.field.onChange} 
         />
    )}
    />
}