import {QuestionType} from '../../Types/Questions'

interface WriteProps {
    question: QuestionType,
    register: any,
    errors: any
}

export const WriteResponse = ({ question, register, errors }: WriteProps) => {
    return <>
        <div className="game-write-response">
        <label htmlFor="game-response" className="game-response-label">Réponse :</label>
        <input type="text" {...register('reponse', { required: 'La réponse est obligatoire' })} className="game-response" id="game-response" autoComplete="off" autoFocus={true} />
        {errors.reponse && <div className="error-response">{errors.reponse.message}</div>}
        </div>
    </>
}