import {Controller, useFieldArray} from 'react-hook-form'
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { StandardTextFieldProps } from '@material-ui/core';

interface IMultipleValues extends StandardTextFieldProps {
    name: string,
    optionLabel: string,
    inputLabel: string,
    control: any,
    data: any,
    styles?: any,
    multiple?: boolean,
    rules?: any,
    deleteOption?: (value: any) => void,
    addOption?: (value: any) => void
}

export const MultipleValues = ({name, optionLabel, inputLabel, control, data, styles, multiple = true, rules, deleteOption, addOption}: IMultipleValues) => {
return <>
<Controller
    name={name}
    control={control}
    rules={rules}
    render={(props) => (
      <>
        <Autocomplete
        value={props.field.value}
        multiple={multiple}
        options={data}
        getOptionLabel={(option: any) => option[optionLabel]}
        getOptionSelected={(option, value) => option._id == value._id}
        noOptionsText='Aucun résultat'
        className={styles}
        onChange={(_, data, reason, value) => (props.field.onChange(data), deleteOption && (reason == 'remove-option' ? deleteOption(value) : deleteOption(undefined)), addOption && (reason == 'select-option' && addOption(value)))}
        renderInput={(params) => (
          <TextField
            label={inputLabel}
            variant="standard"
            error={props.fieldState.invalid}
            helperText={props.fieldState.error?.message}
            ref={props.field.ref}
            {...params}
          />
        )}
        {...props}
      />
      </>
    )}
    />
</>
}