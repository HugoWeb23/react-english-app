import { ChangeEvent, FormEvent, HtmlHTMLAttributes, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import {SearchByThemes} from './SearchByThemes'
import Card from 'react-bootstrap/Card'
import {ClosableBadge} from '../../UI/ClosableBadge'

interface IQuestionFilters {
    selectedTypes: any[],
    selectedThemes: any[],
    typeChange: (checked: boolean, type: number) => void,
    themeChanges: (themes: any, type?: string) => void,
    textChange: (text: string) => void,
    resetFilters: () => void
}

export const QuestionFilters = ({selectedTypes, selectedThemes, typeChange, themeChanges, textChange, resetFilters}: IQuestionFilters) => {
    const [modalThemes, setModalThemes] = useState(false)

    const handleThemesChange = (themes: any, type?: string) => {
        themeChanges(themes, type)
    }

    const handleTypeChange = (checked: boolean, type: number) => {
        typeChange(checked, type)
    }

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        textChange(e.target.value)
    }
    return <>
        <Card>
            <Card.Body>
        <h4>Les filtres</h4>
        <p>Filtrer par type</p>
        <Form.Group>
            {[
                { type: 1, name: 'Réponse unique' },
                { type: 2, name: 'Choix multiples' }
            ].map((type: any, index: number) => <Form.Check
                type="checkbox"
                id={`check${index}`}
                label={type.name}
                onChange={(e) => handleTypeChange(e.target.checked, type.type)}
                checked={selectedTypes.includes(type.type)}
                custom
            />)}
        </Form.Group>
        <Form.Group>
        <p className="mb-1">Filtrer par thèmes</p>
        {selectedThemes.map((theme: any, index: number) =>
            <ClosableBadge element={theme} elementName={theme.theme} index={index} variant="dark" handleClose={() => handleThemesChange(theme, 'delete')} />)}
        <a className="link" style={{cursor: 'pointer'}} onClick={() => setModalThemes(true)}>
            Afficher les thèmes
    </a>
    </Form.Group>
    <Form.Group controlId="write_search">
        <Form.Label>Recherche écrite</Form.Label>
        <Form.Control type="text" placeholder="" onChange={handleTextChange} />
    </Form.Group>
        {modalThemes && <SearchByThemes themesList={selectedThemes} handleClose={() => setModalThemes(false)} onSubmit={handleThemesChange}/>}
        {(selectedTypes.length > 0 || selectedThemes.length > 0) && <Button variant="outline-danger" className="mt-2" size="sm" onClick={() => resetFilters()}>Supprimer les filtres</Button>}
        </Card.Body>
        </Card>
    </>
}