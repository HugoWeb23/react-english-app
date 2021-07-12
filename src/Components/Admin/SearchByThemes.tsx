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
    const searchThemeRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setSelectedThemes(themesList)
    }, [])

    const searchTheme = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 2) {
            const themes = await apiFetch('/api/themes/search', {
                method: 'POST',
                body: JSON.stringify({ theme: e.target.value })
            })
            setThemes(themes)
        } else if (e.target.value.length === 0) {
            setThemes([])
        }
    }

    const handleSelectTheme = (e: React.ChangeEvent<HTMLInputElement>, theme: IThemes): void => {
        if (e.target.checked && !selectedThemes.some((t: IThemes) => t._id == theme._id)) {
            setSelectedThemes((themes: IThemes[]) => [...themes, theme])
        } else if (e.target.checked === false) {
            setSelectedThemes((themes: IThemes[]) => themes.filter((t: IThemes) => t._id != theme._id))
        }
        searchThemeRef.current && (searchThemeRef.current.value = "")
        searchThemeRef.current?.focus()
      
    }

    const handleDeleteTheme = (theme: IThemes) => {
        setSelectedThemes((themes: IThemes[]) => themes.filter((t: IThemes) => t != theme))
    }

    const handleSaveThemes = () => {
        onSubmit(selectedThemes)
        handleClose()
    }

    return <>
        <Dialog open={true} onClose={handleClose} fullWidth>
            <DialogTitle id="alert-dialog-title">Rechercher des thèmes</DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    <TextField placeholder="Nom du thème" inputRef={searchThemeRef} onChange={searchTheme} />
                </FormControl>
                <FormControl>
                    {selectedThemes.length > 0 && <>{selectedThemes.map((t: IThemes, index: number) => <ClosableBadge element={t} elementName={t.theme} index={index} variant="dark" handleClose={handleDeleteTheme} />)}
                        <FormHelperText>
                            Cliquez sur un thème pour le supprimer.
                        </FormHelperText>
                    </>}
                </FormControl>
                {themes.length > 0 && themes.map((theme: IThemes, index: number) => {
                    return <>
                    <Box>
                    <FormControlLabel
                        key={theme._id}
                        control={<Checkbox checked={selectedThemes.some((t: IThemes) => t._id == theme._id)} onChange={(e) => handleSelectTheme(e, theme)} name={`check${index}`} />}
                        label={theme.theme}
                    />
                    </Box>
                    </>
                })}
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