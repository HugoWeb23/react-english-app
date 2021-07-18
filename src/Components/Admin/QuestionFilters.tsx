import { useRef, useState } from 'react'
import { SearchByThemes } from './SearchByThemes'
import { ClosableBadge } from '../../UI/ClosableBadge'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
    Paper,
    FormControlLabel,
    Checkbox,
    FormControl,
    TextField,
    FormHelperText,
    Button,
    Chip,
    Box
} from '@material-ui/core'

interface IQuestionFilters {
    selectedTypes: any[],
    selectedThemes: any[],
    typeChange: (checked: boolean, type: number) => void,
    themeChanges: (themes: any, type?: string) => void,
    textChange: (text: string) => void,
    resetFilters: () => void
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: theme.spacing(2)
        },
        formControl: {
            marginBottom: theme.spacing(1)
        },
        checkBox: {
            "&:not(:last-child)": {
                marginBottom: "-15px"
            }
        }
    }),
);


export const QuestionFilters = ({ selectedTypes, selectedThemes, typeChange, themeChanges, textChange, resetFilters }: IQuestionFilters) => {
    const classes = useStyles()
    const [modalThemes, setModalThemes] = useState(false)
    const searchRef = useRef<HTMLInputElement>(null)

    const handleThemesChange = (themes: any, type?: string) => {
        themeChanges(themes, type)
    }

    const handleTypeChange = (checked: boolean, type: number) => {
        typeChange(checked, type)
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        textChange(e.target[0].value)
    }

    const resetTextSearch = () => {
        textChange('')
        searchRef.current && (searchRef.current.value = "")
    }

    return <>
        <Paper className={classes.paper}>
            <h4>Les filtres</h4>
            <p>Filtrer par type</p>
            <FormControl className={classes.formControl}>
                {[
                    { type: 1, name: 'Réponse unique' },
                    { type: 2, name: 'Choix multiples' }
                ].map((type: any, index: number) => <FormControlLabel
                    className={classes.checkBox}
                    control={<Checkbox checked={selectedTypes.includes(type.type)} onChange={(e) => handleTypeChange(e.target.checked, type.type)} name={`check${index}`} />}
                    label={type.name}
                />)}
            </FormControl>
            <FormControl className={classes.formControl}>
                <p className="mb-1">Filtrer par thèmes</p>
                {selectedThemes.map((theme: any, index: number) =>
                    <>
                        <Box marginBottom="5px">
                            <Chip label={theme.theme} size="small" style={{maxWidth: 200}} onDelete={() => handleThemesChange(theme, 'delete')} color="primary" />
                        </Box>
                    </>
                )}
                <Box display="block">
                <Button color="primary" onClick={() => setModalThemes(true)}>
                    Afficher les thèmes
                </Button>
                </Box>
            </FormControl>
            <form onSubmit={handleSubmit}>
                <FormControl>
                    <TextField label="Recherche" inputRef={searchRef} />
                    <FormHelperText>
                        Appuyez sur ENTER pour chercher
                    </FormHelperText>
                </FormControl>
            </form>
            {modalThemes && <SearchByThemes themesList={selectedThemes} handleClose={() => setModalThemes(false)} onSubmit={handleThemesChange} />}
            {(selectedTypes.length > 0 || selectedThemes.length > 0 || (searchRef.current && searchRef.current.value.length > 0)) &&
            <Box marginTop="15px">
            <Button color="secondary" size="small" variant="outlined" onClick={() => (resetFilters(), resetTextSearch())}>Supprimer les filtres</Button>
            </Box>}
        </Paper>
    </>
}