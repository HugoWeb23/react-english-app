import {useForm, useFormContext, useFieldArray} from 'react-hook-form'
import {SelectThemes} from '../Themes/SelectThemes'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useEffect, useState } from 'react'
import {Themes} from '../Hooks/GetThemes'
import {Loader} from '../UI/Loader'
import {CloseIcon} from '../Icons/Close'
import Modal from 'react-bootstrap/Modal'
import { apiFetch } from '../Utils/Api'

export const Part = () => {
    const {register, handleSubmit, control, watch, Controller, formState, getValues} = useForm({defaultValues: {
        themes: [{}],
        types: [{}]
    }});
    const {fields: themeFields, append: themesAppend, remove: themesRemove} = useFieldArray({control, name: "themes"})
    const {fields: typesFields, append: typesAppend, remove: typesRemove} = useFieldArray({control, name: "types"})
    const {errors} = formState;
    const {themes, GetThemes} = Themes();
    const types = [{type: 1, title: "Réponse à écrire"}, {type: 2, title: "Choix multiples"}]

    const {selectedThemes, selectedTypes, addOption, deleteOption} = useOptions();
    const [modal, setModal] = useState(false)

    useEffect(() => {
        (async() => {
            await GetThemes()
        })()
    }, [])

    const submit = e => console.log('submit', e)

    const filteredThemes = (themes || []).filter(theme => {
        return !selectedThemes.some(t => t._id === theme._id);
    })

    const filteredTypes = (types || []).filter(type => {
        return !selectedTypes.some(t => t.type === type.type);
    })

    const handleThemeChange = (e) => {
        addOption(filteredThemes[parseInt(e.target.value, 10)], 'themes')
    }

    const handleTypeChange = (e) => {
        addOption(filteredTypes[parseInt(e.target.value, 10)], 'types')
    }

    const handleManualQuestions = () => {
        setModal(true)
    }

    return <>
    <h1>Nouvelle partie</h1>
    <Form onSubmit={handleSubmit(submit)}>
    <Form.Group controlId="theme">
    <Form.Label>Thème(s)</Form.Label>
    {themes == null ? <Loader/> : 
   <Form.Control as="select" onChange={handleThemeChange} disabled={filteredThemes.length == 0}>
        <option value="">Sélectionner un thème</option>
        {filteredThemes.map((theme, index) => <option key={theme._id} value={index}>{theme.theme}</option>)}
    </Form.Control>}
    </Form.Group>
    <Form.Group controlId="selected-themes">
    <div className="d-flex flex-wrap">
    {selectedThemes.map((theme, index) => {
        return <a href="#" key={index} onClick={() => deleteOption(theme, 'themes')} className="badge badge-primary mr-2 mb-2">{theme.theme} <CloseIcon/></a>
    })}
    </div>
    </Form.Group>
    {selectedThemes.length > 0 &&
    <>
    <Form.Group controlId="theme">
    <Form.Label>Questions</Form.Label>
   <Button variant="warning" onClick={handleManualQuestions}>Sélection manuelle</Button>
    </Form.Group>
    {modal &&<ManualQuestionsModal handleClose={() => setModal(false)} themes={selectedThemes.map(t => t._id)}/>}
    </>
    }
    <Form.Group controlId="types">
    <Form.Label>Type(s)</Form.Label>
    <Form.Control as="select" onChange={handleTypeChange} disabled={filteredTypes.length == 0}>
        <option value="">Sélectionner un type</option>
        {filteredTypes.map((type, index) => <option key={type.type} value={index}>{type.title}</option>)}
    </Form.Control>
    </Form.Group>
    <Form.Group controlId="selected-themes">
    <div className="d-flex flex-wrap">
    {selectedTypes.map((type, index) => {
        return <a href="#" key={index} onClick={() => deleteOption(type, 'types')} className="badge badge-primary mr-2 mb-2">{type.title} <CloseIcon/></a>
    })}
    </div>
    </Form.Group>
    <Form.Group controlId="limit">
    <Form.Label>Limite de questions</Form.Label>
    <Form.Control type="number" {...register('limit')}/>
    </Form.Group>
    <Form.Group controlId="random">
      <Form.Check custom type="checkbox" id="custom-limit" label="Questions aléatoires" {...register('random')}/>
    </Form.Group>
    <Button type="submit" variant="success">Lancer la partie</Button>
    </Form>
    </>
}

const useOptions = () => {
    const [options, setOptions] = useState({themes: [], types: []});

    return {
        selectedThemes: options.themes,
        selectedTypes: options.types,
        addOption: (data, option) => {
                setOptions(state => {
                    return {...state, [option]: [...state[option], data]}
                })
        },
        deleteOption: (data, option) => {
                setOptions(state => {
                    return {...state, [option]: state[option].filter(t => t !== data)}
                })
        }
    }
}

const ManualQuestionsModal = ({handleClose, themes = null}) => {
    const [questions, setQuestions] = useState(null);
    useEffect(() => {
        (async() => {
            const questions = await apiFetch('/api/questions', {
                method: 'POST',
                body: JSON.stringify({themes: themes})
            })
            setQuestions(questions)
        })()
    }, [])

    const groupThemes = []
    if(questions != null) {
        questions.map(q => {
            if(groupThemes.length === 0 || !groupThemes.some((t, index) => t._id == q.theme._id)) {
                groupThemes.push(q.theme);
            }
        })
    }
    console.log(groupThemes)
    return <Modal show={true} onHide={() => handleClose()}>
    <Modal.Header closeButton>
      <Modal.Title>Modal heading</Modal.Title>
    </Modal.Header>
    <Modal.Body>{groupThemes.map(t => {
        return <>
        <div style={{fontWeight: 'bold'}}>{t.theme}</div>
        {questions.map(q => q.theme._id === t._id ? <div>{q.question}</div> : null)}
        </>
    })}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => handleClose()}>
        Close
      </Button>
      <Button variant="primary">
        Save Changes
      </Button>
    </Modal.Footer>
  </Modal>
}