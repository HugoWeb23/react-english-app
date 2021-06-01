import {QuestionType} from '../../Types/Questions'

interface WriteProps {
    question: QuestionType,
    register: any
}

export const WriteResponse = ({ question, register }: WriteProps) => {
    return <>
        <label>Répnse :</label>
        <input type="text" {...register('reponse', { required: 'La réponse est obligatoire' })} autoComplete="off" />
    </>
}