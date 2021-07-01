import { useForm, useFormContext, useFieldArray, SubmitHandler } from 'react-hook-form'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { ChangeEvent, useEffect, useState, useRef } from 'react'
import { Themes } from '../Hooks/GetThemes'
import { Loader } from '../UI/Loader'
import { CloseIcon } from '../Icons/Close'
import Modal from 'react-bootstrap/Modal'
import { apiFetch } from '../Utils/Api'
import ListGroup from 'react-bootstrap/ListGroup'
import { useHistory } from 'react-router-dom'
import { Container } from '../UI/Container'
import { QuestionType } from '../Types/Questions'
import { ThemeType } from '../Types/Themes'

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { MultipleValues } from '../UI/Material/MultipleValues'

interface IPartData {
    themes: ThemeType[],
    types: any[],
    limit: number,
    random: boolean
}

interface ISelectedQuestions {
    questionId: string,
    themeId: string
}

export const Part = () => {
    const history = useHistory()
    const { register, setError, handleSubmit, clearErrors, control, watch, formState, getValues } = useForm<any>({
        defaultValues: {
            themes: [],
            types: [],
            limit: "",
            random: true
        }
    });
    const { errors } = formState;
    const { themes, GetThemes, loadingThemes } = Themes();
    const types = [{ type: 1, title: "Réponse à écrire" }, { type: 2, title: "Choix multiples" }]
    const [modal, setModal] = useState(false)
    const [selectedQuestions, setSelectedQuestions] = useState<ISelectedQuestions[]>([]);
    const typesRef = useRef<any>(null)
    const themesRef = useRef<any>(null)
    useEffect(() => {
        (async () => {
            await GetThemes()
        })()
    }, [])

    const submit: SubmitHandler<IPartData> = async (e) => {
        const values = {
            questions: selectedQuestions.map(q => q.questionId),
            themes: e.themes.map(t => t._id),
            types: e.types.map(t => t.type),
            limit: e.limit,
            random: e.random
        }
        try {
            const reponse = await apiFetch('/api/part/new', {
                method: 'POST',
                body: JSON.stringify(values)
            })
            console.log(values)
            history.push({ pathname: `/play/${reponse.id_part}`, state: { ...reponse, infos: { points: 0, totalQuestions: reponse.totalQuestions } } })
        } catch (e) {

        }
    }

    const handleManualQuestions = () => {
        setModal(true)
    }

    const handleDeleteOption = (data: any) => {
       if(data != null) {
        setSelectedQuestions(questions => questions.filter(q => q.themeId != data.option._id))
       }
    }

    const themesWatch = watch('themes')

    return <>
        <Container>
            <h1>Nouvelle partie</h1>
            <Form onSubmit={handleSubmit(submit)}>
                <Form.Group controlId="theme">
                    <Form.Label>Thème(s)</Form.Label>
                    {loadingThemes ? <Loader /> : <>
                        <MultipleValues
                            name="themes"
                            optionLabel="theme"
                            inputLabel="Sélectionnez un thème"
                            control={control}
                            data={themes}
                            deleteOption={handleDeleteOption}
                        /></>}
                    {errors.themes && <Form.Control.Feedback type="invalid">{errors.themes.message}</Form.Control.Feedback>}
                </Form.Group>
                {(themesWatch && themesWatch.length > 0) &&
                    <>
                        <Form.Group controlId="theme">
                            <Form.Label>Questions</Form.Label>
                            <Button block={true} variant="warning" onClick={handleManualQuestions}>Sélection manuelle ({selectedQuestions.length})</Button>
                            <Button variant="outline-danger" className="mt-3" size="sm" onClick={() => setSelectedQuestions([])}>Supprimer les questions sélectionnées</Button>
                        </Form.Group>
                        {modal && <ManualQuestionsModal
                            handleClose={() => setModal(false)}
                            themes={themesWatch}
                            onConfirm={(e: ISelectedQuestions[]) => setSelectedQuestions(e)}
                            checkedQuestions={selectedQuestions} />}
                    </>
                }
                <Form.Group controlId="types">
                    <Form.Label>Type(s)</Form.Label>
                    <MultipleValues
                            name="types"
                            optionLabel="title"
                            inputLabel="Sélectionnez un type"
                            control={control}
                            data={types}
                        />
                </Form.Group>
                <Form.Group controlId="limit">
                    <Form.Label>Limite de questions</Form.Label>
                    <Form.Control type="number" {...register('limit')} />
                    <Form.Text className="text-muted">
                        Si le champ est laissé vide, la limite sera fixée à 30 questions.
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="random">
                    <Form.Check custom defaultChecked={true} type="checkbox" id="custom-limit" label="Questions aléatoires" {...register('random')} />
                </Form.Group>
                <Button type="submit" variant="success">Lancer la partie</Button>
            </Form>
        </Container>
    </>
}

interface IManualQuestionsModal {
    handleClose: () => void,
    themes: ThemeType[],
    onConfirm: (selectedQuestions: ISelectedQuestions[]) => void,
    checkedQuestions: ISelectedQuestions[]
}

const ManualQuestionsModal = ({ handleClose, themes, onConfirm, checkedQuestions }: IManualQuestionsModal) => {
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [loader, setLoader] = useState<boolean>(true)
    const [selectedQuestions, setSelectedQuestions] = useState(checkedQuestions || []);
    useEffect(() => {
        (async () => {
            const questions = await apiFetch('/api/questions', {
                method: 'POST',
                body: JSON.stringify({ themes: themes.map((t: ThemeType) => t._id) })
            })
            setQuestions(questions)
            setLoader(false)
        })()
    }, [])

    const handleQuestionChange = (value: boolean, question: QuestionType) => {
        if (value === true) {
            setSelectedQuestions(questions => [...questions, { questionId: question._id, themeId: question.theme._id }])

        } else if (value === false) {
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
            {loader ? <Loader /> : themes.map(t => {
                return <>
                    <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>{t.theme}</div>
                    <ListGroup className="mb-3">{questions.map((q: QuestionType, i: number) => q.theme._id === t._id ? <Question question={q} onChange={handleQuestionChange} checkedQuestions={checkedQuestions} /> : null)}</ListGroup>
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

const Question = ({ question, onChange, checkedQuestions }: IQuestion) => {
    const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked, question)
    }
    const isChecked = () => {
        return checkedQuestions.some(q => q.questionId === question._id) ? true : undefined
    }

    return <>
        <ListGroup.Item className="d-flex justify-content-between">
            {question.question}
            <Form.Check custom type="checkbox" id={question._id} onChange={handleQuestionChange} defaultChecked={isChecked()} />
        </ListGroup.Item>
    </>
}