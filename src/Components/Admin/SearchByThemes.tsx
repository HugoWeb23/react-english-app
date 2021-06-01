import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { CloseIcon } from '../../Icons/Close'
import React, { useEffect, useState, useRef } from 'react'
import { apiFetch } from '../../Utils/Api'
import {ClosableBadge} from '../../UI/ClosableBadge'


interface ISearchByThemes {
    themesList: IThemes[],
    handleClose: () => void,
    onSubmit: (selectedThemes: IThemes[]) => void
}

interface IThemes {
    _id: string,
    theme: string
}

export const SearchByThemes = ({themesList, handleClose, onSubmit}: ISearchByThemes) => {

    const [themes, setThemes] = useState<IThemes[]>([])
    const [selectedThemes, setSelectedThemes] = useState<IThemes[]>([])
    const searchThemeRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setSelectedThemes(themesList)
    }, [])

    const searchTheme = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.value.length > 2) {
            const themes = await apiFetch('/api/themes/search', {
                method: 'POST',
                body: JSON.stringify({ theme: e.target.value })
            })
            setThemes(themes)
        } else if(e.target.value.length === 0) {
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
        setThemes([])
    }

    const handleDeleteTheme = (theme: IThemes) => {
        setSelectedThemes((themes: IThemes[]) => themes.filter((t: IThemes) => t != theme))
    }

    const handleSaveThemes = () => {
        onSubmit(selectedThemes)
        handleClose()
    }

    return <>
        <Modal show={true} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Rechercher des thèmes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Nom du thème</Form.Label>
                    <Form.Control type="text" placeholder="Nom du thème" ref={searchThemeRef} onChange={searchTheme} />
                </Form.Group>
                <Form.Group>
                    {selectedThemes.length > 0 && <>{selectedThemes.map((t: IThemes, index: number) => <ClosableBadge element={t} elementName={t.theme} index={index} variant="dark" handleClose={handleDeleteTheme} />)}
                        <Form.Text className="text-muted">
                            Cliquez sur un thème pour le supprimer.
                        </Form.Text>
                    </>}
                </Form.Group>
                {themes.length > 0 && themes.map((theme: IThemes, index: number) => {
                    return <Form.Check
                        key={theme._id}
                        type="checkbox"
                        id={theme._id}
                        label={theme.theme}
                        custom
                        checked={selectedThemes.some((t: IThemes) => t._id == theme._id)}
                        onChange={(e) => handleSelectTheme(e, theme)}
                    />
                })}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Fermer
        </Button>
                <Button variant="outline-success" onClick={handleSaveThemes}>
                    Appliquer
        </Button>
            </Modal.Footer>
        </Modal>
    </>
}