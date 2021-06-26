import { AllHTMLAttributes, ChangeEvent, FormEvent, HtmlHTMLAttributes, useRef, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import { SearchByThemes } from './SearchByThemes'
import Card from 'react-bootstrap/Card'
import { ClosableBadge } from '../../UI/ClosableBadge'
import { createRef } from 'react'

interface IQuestionFilters {
    selectedTypes: any[],
    selectedThemes: any[],
    typeChange: (checked: boolean, type: number) => void,
    themeChanges: (themes: any, type?: string) => void,
    textChange: (text: string) => void,
    resetFilters: () => void
}

export const QuestionFilters = ({ selectedTypes, selectedThemes, typeChange, themeChanges, textChange, resetFilters }: IQuestionFilters) => {
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
                    <a className="link" style={{ display: 'block', cursor: 'pointer' }} onClick={() => setModalThemes(true)}>
                        Afficher les thèmes
                    </a>
                </Form.Group>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="write_search">
                        <Form.Label>Recherche écrite</Form.Label>
                        <Form.Control type="text" placeholder="" ref={searchRef} />
                        <Form.Text className="text-muted">
                            Appuyez sur ENTER pour chercher
                        </Form.Text>
                    </Form.Group>
                </Form>
                {modalThemes && <SearchByThemes themesList={selectedThemes} handleClose={() => setModalThemes(false)} onSubmit={handleThemesChange} />}
                {(selectedTypes.length > 0 || selectedThemes.length > 0 || (searchRef.current && searchRef.current.value.length > 0)) && <Button variant="outline-danger" className="mt-2" size="sm" onClick={() => (resetFilters(), resetTextSearch())}>Supprimer les filtres</Button>}
            </Card.Body>
        </Card>
    </>
}