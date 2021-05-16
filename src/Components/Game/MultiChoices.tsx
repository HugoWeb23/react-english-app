import {QuestionType} from '../../Types/Questions'
import Form from 'react-bootstrap/Form'

interface IChoicesProps {
    question: QuestionType,
    register: any
}

export const MultiChoices = ({ question, register }: IChoicesProps) => {
    return <div>
        {question.propositions.map((p, index) => <><Form.Check {...register(`propositions.${index}.proposition`)} type="checkbox" id={`check-${index}`} label={p.proposition} custom /> <input {...register(`propositions.${index}._id`)} type="hidden" value={p._id} /></>)}
    </div>
}