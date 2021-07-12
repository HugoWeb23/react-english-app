import React, { useEffect, useState, useRef } from 'react'
import { apiFetch } from '../../Utils/Api'
import { ClosableBadge } from '../../UI/ClosableBadge'
import {
    TextField,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Box
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';


interface ISearchByThemes {
    themesList: IThemes[],
    handleClose: () => void,
    onSubmit: (selectedThemes: IThemes[]) => void
}

interface IThemes {
    _id: string,
    theme: string
}

export const SearchByThemes = ({ themesList, handleClose, onSubmit }: ISearchByThemes) => {

    const [themes, setThemes] = useState<IThemes[]>([])
    const [selectedThemes, setSelectedThemes] = useState<IThemes[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const searchThemeRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setSelectedThemes(themesList)
    }, [])

    const searchTheme = async (value: string) => {
        if (value.length > 2) {
            setLoading(true)
            const themes = await apiFetch('/api/themes/search', {
                method: 'POST',
                body: JSON.stringify({ theme: value })
            })
            setThemes(themes)
            setLoading(true)
        }
    }

    const handleSelectTheme = (themes: IThemes[]): void => {
        let isValid = true
        themes.map(theme => {
            if(typeof theme != 'object') {
                isValid = false
                return
            }
            if('_id' in theme == false || 'theme' in theme == false) {
                isValid = false
            }
        })
        if(isValid) {
            setSelectedThemes(themes)
        }
    }

    const handleSaveThemes = () => {
        onSubmit(selectedThemes)
        handleClose()
    }

    return <>
        <Dialog open={true} onClose={handleClose} fullWidth>
            <DialogTitle id="alert-dialog-title">Rechercher des thèmes</DialogTitle>
            <DialogContent>
                <Autocomplete
                    value={selectedThemes}
                    multiple
                    freeSolo
                    id="tags-standard"
                    options={themes}
                    defaultValue={themesList}
                    getOptionLabel={(option) => option.theme}
                    getOptionSelected={(value: IThemes, option: IThemes) => option._id === value._id}
                    onChange={(e, value) => handleSelectTheme(value as IThemes[])}
                    onInputChange={(e, value) => searchTheme(value)}
                    disableCloseOnSelect={true}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="standard"
                            label="Sélectionnez des thèmes"
                            placeholder="Sélectionnez des thèmes"
                        />
                    )}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Fermer
                </Button>
                <Button color="primary" onClick={handleSaveThemes}>
                    Appliquer
                </Button>
            </DialogActions>
        </Dialog>
    </>
}