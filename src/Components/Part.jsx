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
import ListGroup from 'react-bootstrap/ListGroup'

export const Part = () => {
    const {register, handleSubmit, control, watch, Controller, formState, getValues} = useForm({defaultValues: {
        themes: [{}],
        types: [{}]
    }});
    const {errors} = formState;
    const {themes, GetThemes} = Themes();
    const types = [{type: 1, title: "Réponse à écrire"}, {type: 2, title: "Choix multiples"}]
    const {selectedThemes, selectedTypes, addOption, deleteOption} = useOptions();
    const [modal, setModal] = useState(false)
    const [selectedQuestions, setSelectedQuestions] = useState([]);

    useEffect(() => {
        (async() => {
            await GetThemes()
        })()
    }, [])

    const submit = e => {
        console.log({types: selectedTypes}, {themes: selectedThemes}, {questions: selectedQuestions})
        console.log('form', e)
     }

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
   <Button variant="warning" onClick={handleManualQuestions}>Sélection manuelle ({selectedQuestions.length})</Button>
    </Form.Group>
    {modal &&<ManualQuestionsModal 
        handleClose={() => setModal(false)} 
        themes={selectedThemes} 
        onConfirm={(e) => setSelectedQuestions(e)}
        checkedQuestions={selectedQuestions}/>}
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

const ManualQuestionsModal = ({handleClose, themes = null, onConfirm, checkedQuestions}) => {
    const [questions, setQuestions] = useState(null);
    const [selectedQuestions, setSelectedQuestions] = useState(checkedQuestions || []);
    useEffect(() => {
        (async() => {
            const questions = await apiFetch('/api/questions', {
                method: 'POST',
                body: JSON.stringify({themes: themes.map(t => t._id)})
            })
            setQuestions(questions)
        })()
        return () => {
            console.log('component unmount')
        }
    }, [])

    const handleQuestionChange = (value, question) => {
        if(value === true) {
            setSelectedQuestions(questions => [...questions, question._id])
           
        } else if(value === false) {
           setSelectedQuestions(questions => questions.filter(q => q != question._id))
        }
    }

    const handleConfirm = () => {
        onConfirm(selectedQuestions)
        handleClose()
    }
    return <Modal show={true} onHide={() => handleClose()}>
    <Modal.Header closeButton>
      <Modal.Title>Sélection manuelle des questions</Modal.Title>
    </Modal.Header>
    <Modal.Body>{questions === null ? <Loader/> : themes.map(t => {
        return <>
        <div style={{fontWeight: 'bold'}}>{t.theme}</div>
        <ListGroup>{questions.map((q, i) => q.theme._id === t._id ? <Question index={i} question={q} onChange={handleQuestionChange} checkedQuestions={checkedQuestions}/> : null)}</ListGroup>
        </>
    })}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => handleClose()}>
        Fermer
      </Button>
      <Button variant="primary" onClick={handleConfirm}>
        Valider
      </Button>
    </Modal.Footer>
  </Modal>
}

const Question = ({index, question, onChange, checkedQuestions}) => {
const handleQuestionChange = (e) => {
    onChange(e.target.checked, question)
}
const isChecked = () => {
    return checkedQuestions.some(q => q === question._id) ? "checked" : null
}

    return <>
    <ListGroup.Item>
      {question.question}
      <Form.Check custom type="checkbox" id={question._id} onChange={handleQuestionChange} defaultChecked={isChecked()}/>
    </ListGroup.Item>
  </>
}