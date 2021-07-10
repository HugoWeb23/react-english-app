import { useFieldArray, UseFormReturn, Controller } from 'react-hook-form'
import { MultiChoices } from './MultiChoices'
import { useEffect, useState } from "react"
import { SelectThemes } from "../Themes/SelectThemes"
import { Themes } from '../../Hooks/GetThemes'
import { Loader } from "../../UI/Loader"
import AddIcon from '@material-ui/icons/Add';
import {
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    createStyles,
    makeStyles,
    Button,
    Theme
} from '@material-ui/core'
import { MTextField } from "../../UI/Material/MTextField"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        form: {
            marginBottom: '15px'
        }
    }),
);

export const QuestionForm = (props: UseFormReturn) => {
    const classes = useStyles()
    const {control, watch, formState, getValues } = props;
    const { errors } = formState;
    const { fields, append, remove } = useFieldArray({ control, name: "propositions" })
    const [themesLoader, setThemesLoader] = useState<boolean>(true)
    const questionType = watch('type');

    const { themes, GetThemes } = Themes();

    useEffect(() => {
        (async () => {
            await GetThemes();
            setThemesLoader(false)
        })()
    }, [])

    const checkReponse = (value: string) => {
        if (value.length == 0 && questionType == "1") {
            return "La réponse est obligatoire"
        }
        return true
    }

    const removeField = (field: any) => {
        if (fields.length > 1) {
            remove(field)
        }
    }

    return <>
        <FormControl className={classes.form} fullWidth>
            <InputLabel id="demo-simple-select-label">Type de question</InputLabel>
            <Controller
                name="type"
                control={control}
                defaultValue={1}
                render={({ field: { value, onChange } }) => (
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={value}
                        onChange={onChange}
                    >
                        <MenuItem value={1}>Réponse à écrire</MenuItem>
                        <MenuItem value={2}>Choix multiples</MenuItem>
                    </Select>
                )}
            />
        </FormControl>
        <SelectThemes themes={themes} name="themeId" styles={classes.form} control={control} />
        <FormControl className={classes.form} fullWidth>
            <MTextField
                name="intitule"
                control={control}
                label="Intitulé de la question"
                rules={{ required: "L'intitulé est obligatoire" }}
            />
        </FormControl>
        <FormControl className={classes.form} fullWidth>
            <MTextField
                name="question"
                control={control}
                label="Question"
                rules={{ required: "La question est obligatoire" }}
            />
        </FormControl>
        {questionType == "1" && <>
            <FormControl className={classes.form} fullWidth>
                <MTextField
                    name="reponse"
                    control={control}
                    label="Réponse"
                    rules={{ validate: checkReponse }}
                />
            </FormControl>
        </>}
        {questionType == "2" && <>
            {fields.map((field, index) => {
                return <MultiChoices field={field} key={index} index={index} control={control} remove={removeField} errors={errors} styles={classes.form} />
            })}
            <Button
                variant="outlined"
                size="small"
                color="primary"
                startIcon={<AddIcon/>}
                onClick={() => append({proposition: "", correcte: false})}
            >
                Ajouter une proposition
            </Button>
        </>}
    </>
}