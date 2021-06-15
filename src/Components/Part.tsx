import {useForm, useFormContext, useFieldArray, SubmitHandler} from 'react-hook-form'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { ChangeEvent, useEffect, useState, useRef } from 'react'
import {Themes} from '../Hooks/GetThemes'
import {Loader} from '../UI/Loader'
import {CloseIcon} from '../Icons/Close'
import Modal from 'react-bootstrap/Modal'
import { apiFetch } from '../Utils/Api'
import ListGroup from 'react-bootstrap/ListGroup'
import {useHistory} from 'react-router-dom'
import {Container} from '../UI/Container'
import { QuestionType } from '../Types/Questions'
import { ThemeType } from '../Types/Themes'

interface IPartData {
limit: number,
random: boolean
}

interface ISelectedQuestions {
    questionId: string,
    themeId: string
}

export const Part = () => {
    const history = useHistory()
    const {register, setError, handleSubmit, clearErrors, control, watch, formState, getValues} = useForm({defaultValues: {
        themes: "",
        types: [{}],
        limit: "",
        random: true
    }});
    const {errors} = formState;
    const {themes, GetThemes, loadingThemes} = Themes();
    const types = [{type: 1, title: "Réponse à écrire"}, {type: 2, title: "Choix multiples"}]
    const {selectedThemes, selectedTypes, addOption, deleteOption} = useOptions();
    const [modal, setModal] = useState(false)
    const [selectedQuestions, setSelectedQuestions] = useState<ISelectedQuestions[]>([]);
    const typesRef = useRef<any>(null)
    const themesRef = useRef<any>(null)
    useEffect(() => {
        (async() => {
            await GetThemes()
        })()
    }, [])

    const submit: SubmitHandler<IPartData> = async(e) => {
        const values = { questions: selectedQuestions.map(q => q.questionId), 
                        themes: selectedThemes.map(t => t._id),
                        types: selectedTypes.map(t => t.type),
                        limit: e.limit, 
                        random: e.random }
        try {
            const reponse = await apiFetch('/api/part/new', {
                method: 'POST',
                body: JSON.stringify(values)
            })
            history.push({pathname: `/play/${reponse.id_part}`, state: {...reponse, infos: {points: 0, totalQuestions: reponse.totalQuestions}}})
        } catch(e) {

        }
     }

    const handleThemeChange = (e: ChangeEvent<HTMLInputElement>) => {
        clearErrors("themes")
        if(themes[parseInt(e.target.value, 10)] != undefined) {
        addOption(themes[parseInt(e.target.value, 10)], 'themes')
        themesRef.current.selectedIndex = 0
        }
    }

    const handleTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(types[parseInt(e.target.value, 10)] != undefined) {
            addOption(types[parseInt(e.target.value, 10)], 'types')
        }
        typesRef.current.selectedIndex = 0
    }

    const handleManualQuestions = () => {
        setModal(true)
    }

    const handleDeleteOption = (theme: ThemeType) => {
        setSelectedQuestions(questions => questions.filter(q => q.themeId != theme._id))
        deleteOption(theme, 'themes')
    }

    return <>
    <Container>
    <h1>Nouvelle partie</h1>
    <Form onSubmit={handleSubmit(submit)}>
    <Form.Group controlId="theme">
    <Form.Label>Thème(s)</Form.Label>
    {loadingThemes ? <Loader/> : <><Form.Control as="select" {...register('themes')} onChange={handleThemeChange} ref={themesRef}>
        <option value="">Sélectionner un thème</option>
        {themes.map((theme, index) => <option disabled={selectedThemes.filter(t => t._id === theme._id).length > 0} key={theme._id} value={index}>{theme.theme}</option>)}
    </Form.Control>
       <Form.Text className="text-muted">
       Tous les thèmes sont sélectionnés par défaut.
     </Form.Text></>}
    {errors.themes && <Form.Control.Feedback type="invalid">{errors.themes.message}</Form.Control.Feedback>}
    </Form.Group>
    <Form.Group controlId="selected-themes">
    <div className="d-flex flex-wrap">
    {selectedThemes.map((theme: ThemeType, index: number) => {
        return <a href="#" key={index} onClick={() => handleDeleteOption(theme)} className="badge badge-primary mr-2 mb-2">{theme.theme} <CloseIcon/></a>
    })}
    </div>
    </Form.Group>
    {selectedThemes.length > 0 &&
    <>
    <Form.Group controlId="theme">
    <Form.Label>Questions</Form.Label>
   <Button block={true} variant="warning" onClick={handleManualQuestions}>Sélection manuelle ({selectedQuestions.length})</Button>
   <Button variant="outline-danger" className="mt-3" size="sm" onClick={() => setSelectedQuestions([])}>Supprimer les questions sélectionnées</Button>
    </Form.Group>
    {modal && <ManualQuestionsModal 
        handleClose={() => setModal(false)} 
        themes={selectedThemes} 
        onConfirm={(e: ISelectedQuestions[]) => setSelectedQuestions(e)}
        checkedQuestions={selectedQuestions}/>}
    </>
    }
    <Form.Group controlId="types">
    <Form.Label>Type(s)</Form.Label>
    <Form.Control as="select" onChange={handleTypeChange} ref={typesRef}>
        <option value="">Sélectionner un type</option>
        {types.map((type, index) => <option disabled={selectedTypes.filter(t => t.type === type.type).length > 0} key={type.type} value={index}>{type.title}</option>)}
    </Form.Control>
    <Form.Text className="text-muted">
      Tous les types sont sélectionnés par défaut.
    </Form.Text>
    </Form.Group>
    <Form.Group controlId="selected-themes">
    <div className="d-flex flex-wrap">
    {selectedTypes.map((type: ISelectedType, index: number) => {
        return <a href="#" key={index} onClick={() => deleteOption(type, 'types')} className="badge badge-primary mr-2 mb-2">{type.title} <CloseIcon/></a>
    })}
    </div>
    </Form.Group>
    <Form.Group controlId="limit">
    <Form.Label>Limite de questions</Form.Label>
    <Form.Control type="number" {...register('limit')}/>
    <Form.Text className="text-muted">
      Si le champ est laissé vide, la limite sera fixée à 30 questions.
    </Form.Text>
    </Form.Group>
    <Form.Group controlId="random">
      <Form.Check custom defaultChecked={true} type="checkbox" id="custom-limit" label="Questions aléatoires" {...register('random')}/>
    </Form.Group>
    <Button type="submit" variant="success">Lancer la partie</Button>
    </Form>
    </Container>
    </>
}

interface ISelectedType {
    type: number,
    title: string
}

const useOptions = () => {
    const [options, setOptions] = useState<{themes: ThemeType[], types: ISelectedType[]}>({themes: [], types: []});
    return {
        selectedThemes: options.themes,
        selectedTypes: options.types,
        addOption: (data: ISelectedType | ThemeType, option: 'themes' | 'types') => {
                setOptions(state => {
                    return {...state, [option]: [...state[option], data]}
                })
        },
        deleteOption: (data: ISelectedType | ThemeType, option: 'themes' | 'types') => {
                setOptions((state: any) => {
                    return {...state, [option]: state[option].filter((t: any) => t !== data)}
                })
        }
    }
}

interface IManualQuestionsModal {
    handleClose: () => void,
    themes: ThemeType[],
    onConfirm: (selectedQuestions: ISelectedQuestions[]) => void,
    checkedQuestions: ISelectedQuestions[]
}

const ManualQuestionsModal = ({handleClose, themes, onConfirm, checkedQuestions}: IManualQuestionsModal) => {
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [loader, setLoader] = useState<boolean>(true)
    const [selectedQuestions, setSelectedQuestions] = useState(checkedQuestions || []);
    useEffect(() => {
        (async() => {
            const questions = await apiFetch('/api/questions', {
                method: 'POST',
                body: JSON.stringify({themes: themes.map((t: ThemeType) => t._id)})
            })
            setQuestions(questions)
            setLoader(false)
        })()
    }, [])

    const handleQuestionChange = (value: boolean, question: QuestionType) => {
        if(value === true) {
            setSelectedQuestions(questions => [...questions, {questionId: question._id, themeId: question.theme._id}])
           
        } else if(value === false) {
           setSelectedQuestions(questions => questions.filter(q => q.questionId != question._id))
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
    <Modal.Body>
      <p className="font-weight-normal">{themes.length} {themes.length > 1 ? "thèmes sélectionnés" : "thème sélectionné"}</p>
      {loader ? <Loader/> : themes.map(t => {
        return <>
        <div style={{fontWeight: 'bold', marginBottom: '10px'}}>{t.theme}</div>
        <ListGroup className="mb-3">{questions.map((q: QuestionType, i: number) => q.theme._id === t._id ? <Question question={q} onChange={handleQuestionChange} checkedQuestions={checkedQuestions}/> : null)}</ListGroup>
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

interface IQuestion {
    question: QuestionType,
    onChange: (value: boolean, question: QuestionType) => void,
    checkedQuestions: ISelectedQuestions[]
}

const Question = ({question, onChange, checkedQuestions}: IQuestion) => {
const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked, question)
}
const isChecked = () => {
    return checkedQuestions.some(q => q.questionId === question._id) ? true : undefined
}

    return <>
    <ListGroup.Item className="d-flex justify-content-between">
      {question.question}
      <Form.Check custom type="checkbox" id={question._id} onChange={handleQuestionChange} defaultChecked={isChecked()}/>
    </ListGroup.Item>
  </>
}