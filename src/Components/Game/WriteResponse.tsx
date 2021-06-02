import {QuestionType} from '../../Types/Questions'

interface WriteProps {
    question: QuestionType,
    register: any
}

export const WriteResponse = ({ question, register }: WriteProps) => {
    return <>
        <div className="game-write-response">
        <label htmlFor="game-response" className="game-response-label">Réponse :</label>
        <input type="text" {...register('reponse', { required: 'La réponse est obligatoire' })} className="game-response" id="game-response" autoComplete="off" autoFocus={true} />
        </div>
    </>
}