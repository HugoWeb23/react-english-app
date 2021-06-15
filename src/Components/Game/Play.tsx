import { useEffect, useState, useRef } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useHistory, Redirect, RouteComponentProps } from 'react-router-dom'
import { QuestionType } from '../../Types/Questions'
import { useForm, useFieldArray } from 'react-hook-form'
import {WriteResponse} from './WriteResponse'
import {MultiChoices} from './MultiChoices'
import { apiFetch } from '../../Utils/Api'
import {Loader} from '../../UI/Loader'
import '../../assets/css/styles.css'
import {RobotError} from '../../Icons/RobotError'

interface IDataType {
    id_part: string,
    AllQuestions: QuestionType[],
    infos: {
        points: number,
        totalQuestions: number
    }
}

type TParams = {
    id: string
}

interface IPlayProps {
    location: any,
    match: RouteComponentProps<TParams>
}

export const Play = ({ location = {}, match }: any) => {
    const history = useHistory();
    const idPart: string = match.params.id
    const [data, setData] = useState<IDataType | null>(null);
    const [indexQuestion, setIndexQuestion] = useState<number>(0)
    const [numberOfCurrentQuestion, setNumberOfCurrentQuestion] = useState<number>(0)
    const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null)
    const [dataLoading, setDataLoading] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false)
    const [endGame, setEndGame] = useState(false);
    const [errors, setErrors] = useState<boolean>(false)
    const { register, handleSubmit, control, reset, formState } = useForm();
    const {errors: formErrors} = formState
    const [selectedProps, setSelectedProps] = useState<any[]>([])
    const [propsError, setPropsError] = useState<boolean>(false)

    useEffect(() => {
        (async() => {
            document.body.className = "game-body"
            if(location.state === undefined) {
                try {
                    const fetchQuestions = await apiFetch(`/api/part/getparty/${idPart}`)
                    setData({...fetchQuestions, infos: {points: fetchQuestions.trueQuestions, totalQuestions: fetchQuestions.totalQuestions}})
                    setCurrentQuestion(fetchQuestions.AllQuestions[0])
                    setNumberOfCurrentQuestion(fetchQuestions.currentIndex)
                } catch(e) {
                   setErrors(true)
                }
            }
            if(location.state != undefined && location.state.AllQuestions.length > 0) {
                setData(location.state)
                setCurrentQuestion(location.state.AllQuestions[0])
                setNumberOfCurrentQuestion(1)
            }
            setDataLoading(false)
        })()
        return () => {
            document.body.classList.remove("game-body")
            }
    }, [])

    if(errors || data?.AllQuestions.length === 0) {
        return <ErrorPart/>
    }

    if(dataLoading === true || data === null || currentQuestion === null) {
        return <>
        <div className="game">
        <div className="error-container">
        <div className="lds-hourglass"></div>
        </div>
        </div>
        </>
    }

    const handlePropsChange = (prop: any, e: any) => {
       const {checked}: {checked: boolean} = e.target
       checked && setPropsError(false)
       checked && setSelectedProps((props: any) => [...props, prop._id])
       checked === false && setSelectedProps((props: any) => props.filter((p: any) => p != prop._id))
    }

    const nextQuestion = (): void => {
        if (indexQuestion < data.AllQuestions.length - 1) {
            setCurrentQuestion(data.AllQuestions[indexQuestion + 1])
            setIndexQuestion(index => index + 1)
            setNumberOfCurrentQuestion(current => current + 1)
            reset()
        } else if(indexQuestion == data.AllQuestions.length - 1) {
            setEndGame(true)
        }
    }

    const submit = async (e: any) => {
        if(currentQuestion.type === 2 && selectedProps.length === 0) {
            setPropsError(true)
            return;
        }
        let response: any = { id_part: data.id_part, id_question: currentQuestion._id, type: currentQuestion.type }
        if (currentQuestion.type === 1) {
            response = { ...response, reponseEcrite: e.reponse }
        }
        if (currentQuestion.type === 2) {
            const props = selectedProps
            response = { ...response, propositionsSelect: props }
        }
            setLoading(true)
            const fetch = await apiFetch('/api/questions/checkreply', {
                method: 'POST',
                body: JSON.stringify(response)
            })
            if(fetch.isCorrect) {
                setData({...data, infos: {...data.infos, points: data.infos.points + 1}})
            }
            setSelectedProps([])
            nextQuestion()
            setLoading(false)
    }

    if (endGame) {
        return <Redirect to={{pathname: `/results/${data.id_part}`}}/>
    }

    return <>
        <div className="game">
            <div className="back">
                <button onClick={() => history.push('/part')} className="game-back-button">Quitter la partie</button>
            </div>
            <div className="game-container">
            {data.AllQuestions.length > 0 && <>
            <Form onSubmit={handleSubmit(submit)}>
                <div className="game-title">
                <div className="game-score">Score {data.infos.points} / {data.infos.totalQuestions}</div>
                    <div className="game-questions-counter">
                    Question {numberOfCurrentQuestion} / {data.infos.totalQuestions}
                    </div>
                <div className="game-title-intitule">
                    {currentQuestion.intitule}
                </div>
                <div className="game-title-question">
                    {currentQuestion.question}
                </div>
                </div>
                {currentQuestion.type === 1 && <WriteResponse question={currentQuestion} register={register} errors={formErrors} />}
                {currentQuestion.type === 2 && <MultiChoices question={currentQuestion} errors={propsError} handleChange={handlePropsChange} />}
                <button type="submit" className={`submit-button ${loading ? "loading-button" : ""}`}>Valider</button>
            </Form>
        </>}
            </div>
        </div>
    </>
}

const ErrorPart = () => {
    const history = useHistory();
    return <div className="game">
        <div className="error-container">
        <RobotError/>
        <div className="error-title">Une erreur est survenue</div>
        <button type="button" className="submit-button" onClick={() => history.push('/part')}>Retour à l'accueil</button>
        </div>
    </div>
}

