import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import { MTextField } from '../../UI/Material/MTextField'
import { MCheckbox } from '../../UI/Material/MCheckbox'
import DeleteIcon from '@material-ui/icons/Delete';
import {
    FormControlLabel,
    FormControl,
    Grid,
    createStyles,
    makeStyles,
    IconButton,
    FormHelperText
} from '@material-ui/core'

interface IMultiChoices {
    control: any,
    remove: (index: number) => void,
    errors: any,
    field: any,
    index: number,
    styles?: any
}

const useStyles = makeStyles(() =>
    createStyles({
        flexChoice: {
            justifyContent: 'space-between',
            alignItems: 'center'
        }
    }),
);

export const MultiChoices = ({ control, remove, errors, field, index, styles }: IMultiChoices) => {
    const classes = useStyles()
    return <FormControl key={field.id} className={styles} fullWidth>
        <Grid container className={classes.flexChoice}>
            <Grid item>
                <FormControl fullWidth>
                    <MTextField
                        name={`propositions.${index}.proposition`}
                        control={control}
                        defaultValue={field.proposition}
                        label="Proposition"
                        rules={{ required: "La proposition est obligatoire" }}
                    />
                </FormControl>
                <FormControlLabel control={
                    <MCheckbox
                        name={`propositions.${index}.correcte`}
                        control={control}
                        defaultValue={field.correcte}
                        color="primary"
                    />
                }
                    label="Question correcte"
                />
            </Grid>
            <Grid item>
                <IconButton aria-label="delete" onClick={() => remove(index)}>
                    <DeleteIcon fontSize="inherit" />
                </IconButton>
            </Grid>
        </Grid>
    </FormControl>
}