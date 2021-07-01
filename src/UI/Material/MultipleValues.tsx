import {Controller} from 'react-hook-form'
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

interface IMultipleValues {
    name: string,
    optionLabel: string,
    inputLabel: string,
    control: any,
    data: any,
    deleteOption?: (value: any) => void
}

export const MultipleValues = ({name, optionLabel, inputLabel, control, data, deleteOption}: IMultipleValues) => {
return <>
<Controller
    name={name}
    control={control}
    render={(props) => (
        <Autocomplete
        {...props}
        multiple
        options={data}
        getOptionLabel={(option: any) => option[optionLabel]}
        noOptionsText='Aucun résultat'
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label={inputLabel}
            variant="outlined"
            ref={props.field.ref}
          />
        )}
        onChange={(_, data, reason, value) => (props.field.onChange(data), deleteOption && (reason == 'remove-option' ? deleteOption(value) : deleteOption(undefined)))}
      />
    )}
    />
</>
}