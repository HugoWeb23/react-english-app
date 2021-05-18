import { useEffect, useState, FC } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useHistory, Redirect } from 'react-router-dom'
import { QuestionType } from '../../Types/Questions'
import { useForm, useFieldArray } from 'react-hook-form'
import {WriteResponse} from './WriteResponse'
import {MultiChoices} from './MultiChoices'
import { apiFetch } from '../../Utils/Api'
import {Loader} from '../../UI/Loader'

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
    const { register, handleSubmit, control, reset } = useForm();

    useEffect(() => {
        setData(location.state)
        setLoading(false)
    }, [])

    if(loading === true || data === null) {
        return <Loader/>
    }

    const nextQuestion = (): void => {
        if (indexQuestion < data.questions.length - 1) {
            setCurrentQuestion(data.questions[indexQuestion + 1])
            setIndexQuestion(index => index + 1)
            reset()
        }
    }

    const submit = async (e: any) => {
        let response: any = { id_part: data?.id_part, id_question: currentQuestion._id, type: currentQuestion.type }
        if (currentQuestion.type === 1) {
            response = { ...response, reponse: e.reponse }
        }
        if (currentQuestion.type === 2) {
            const props = e.propositions.filter((p: any) => p.proposition === true).map((p: any) => p._id)
            response = { ...response, propositions: props }
        }

        const fetch = await apiFetch('/api/questions/checkreply', {
            method: 'POST',
            body: JSON.stringify(response)
        })
        if(fetch.isCorrect) {
            setData({...data, score: {...data.score, points: data.score.points + 1}})
        }
        nextQuestion()
        if (data != null && indexQuestion == data.questions.length - 1) {
            history.push('/part')
        }
    }

    return <>
        {data != null && data.questions.length > 0 && <>
            <Form onSubmit={handleSubmit(submit)}>
                <h3>{currentQuestion.intitule} : {currentQuestion.question}</h3>
                {currentQuestion.type === 1 && <WriteResponse question={currentQuestion} register={register} />}
                {currentQuestion.type === 2 && <MultiChoices question={currentQuestion} register={register} />}
                <Button type="submit" variant="danger">Valider</Button>
            </Form>
            {JSON.stringify(data)}
        </>}
    </>
}

