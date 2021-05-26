import Form from 'react-bootstrap/Form'
import {SearchByThemes} from './SearchByThemes'

export const QuestionFilters = () => {
    return <>
        <h4>Les filtres</h4>
        <p>Filtrer par type</p>
        <Form.Group>
            {[
                { type: 'single_answer', name: 'Réponse unique' },
                { type: 'multiple_choice', name: 'Choix multiples' }
            ].map(type => <Form.Check
                type="checkbox"
                id={type.type}
                label={type.name}
                custom
            />)}
        </Form.Group>
        <p>Filtrer par thèmes</p>
        <SearchByThemes/>
    </>
}