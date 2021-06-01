import { useEffect, useState, useRef } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useHistory, Redirect } from 'react-router-dom'
import { QuestionType } from '../../Types/Questions'
import { useForm, useFieldArray } from 'react-hook-form'
import {WriteResponse} from './WriteResponse'
import {MultiChoices} from './MultiChoices'
import { apiFetch } from '../../Utils/Api'
import {Loader} from '../../UI/Loader'
import '../../assets/css/styles.css'

interface IPlayProps {
    location: any
}

interface IDataType {
    id_part: string,
    questions: QuestionType[],
    score: {
        points: number,
        totalPoints: number
    }
}

export const Play = ({ location = {} }: IPlayProps) => {
    const history = useHistory();
    const [data, setData] = useState<IDataType | null>(null);
    const [indexQuestion, setIndexQuestion] = useState<number>(0)
    const [currentQuestion, setCurrentQuestion] = useState<QuestionType>(location.state.questions[0])
    const [loading, setLoading] = useState<boolean>(true);
    const [endGame, setEndGame] = useState(false);
    const { register, handleSubmit, control, reset, formState } = useForm();
    const [selectedProps, setSelectedProps] = useState<any[]>([])

    useEffect(() => {
        document.body.className = "game-body"
        setData(location.state)
        setLoading(false)
        return () => {
        document.body.classList.remove("game-body")
        }
    }, [])

    if(loading === true || data === null) {
        return <Loader/>
    }

    const handlePropsChange = (prop: any, e: any) => {
       const {checked}: {checked: boolean} = e.target
       checked && setSelectedProps((props: any) => [...props, prop._id])
       checked === false && setSelectedProps((props: any) => props.filter((p: any) => p != prop._id))
    }

    const nextQuestion = (): void => {
        if (indexQuestion < data.questions.length - 1) {
            setCurrentQuestion(data.questions[indexQuestion + 1])
            setIndexQuestion(index => index + 1)
            reset()
        } else if(indexQuestion == data.questions.length - 1) {
            setEndGame(true)
        }
    }

    const submit = async (e: any) => {
        let response: any = { id_part: data.id_part, id_question: currentQuestion._id, type: currentQuestion.type }
        if (currentQuestion.type === 1) {
            response = { ...response, reponseEcrite: e.reponse }
        }
        if (currentQuestion.type === 2) {
            const props = selectedProps
            response = { ...response, propositionsSelect: props }
        }

        const fetch = await apiFetch('/api/questions/checkreply', {
            method: 'POST',
            body: JSON.stringify(response)
        })
        if(fetch.isCorrect) {
            setData({...data, score: {...data.score, points: data.score.points + 1}})
        }
        setSelectedProps([])
        nextQuestion()
    }

    if (endGame) {
        return <Redirect to={{pathname: `/results/${data.id_part}`}}/>
    }

    return <>
        <div className="game">
            <div className="back">
                <button onClick={() => history.goBack()}>Menu principal</button>
            </div>
            <div className="game-container">
            {data.questions.length > 0 && <>
            <Form onSubmit={handleSubmit(submit)}>
                <div className="game-title">
                <div className="game-title-intitule">
                    {currentQuestion.intitule}
                </div>
                <div className="game-title-question">
                    {currentQuestion.question}
                </div>
                </div>
                <p>Question {indexQuestion + 1} / {data.questions.length}</p>
                {currentQuestion.type === 1 && <WriteResponse question={currentQuestion} register={register} />}
                {currentQuestion.type === 2 && <MultiChoices question={currentQuestion} handleChange={handlePropsChange} />}
                <button type="submit">Valider</button>
            </Form>
        </>}
            </div>
        </div>
    </>
}

