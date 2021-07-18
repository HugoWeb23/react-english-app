import { ChangeEvent, useState } from 'react'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

interface IElementsPerPage {
    elementsPerPage: number,
    onChange: (page: number) => void
}

export const ElementsPerPage = ({ elementsPerPage, onChange }: IElementsPerPage) => {

    const [elements, setElements] = useState<number>(elementsPerPage)

    const handleChange = (e: ChangeEvent<{ value: unknown }>) => {
        setElements(parseInt(e.target.value as string, 10))
        onChange(parseInt(e.target.value as string, 10))
    }

    return <FormControl variant="outlined">
        <InputLabel id="elementsPerPageLabel">Éléments par page</InputLabel>
        <Select
            autoWidth
            labelId="elementsPerPage"
            id="demo-simple-select"
            value={elements}
            onChange={handleChange}
        >
            {[2, 5, 10, 15, 25, 50].map((n: number, index: number) => {
                return <MenuItem key={index} value={n}>{`${n} éléments`}</MenuItem>
            })}
        </Select>
    </FormControl>
}