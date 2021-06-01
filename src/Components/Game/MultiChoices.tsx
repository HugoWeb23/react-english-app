import {QuestionType} from '../../Types/Questions'
import '../../assets/css/styles.css'

interface IChoicesProps {
    question: QuestionType,
    handleChange: (prop: any, e: any) => void
}

export const MultiChoices = ({ question, handleChange }: IChoicesProps) => {

    const Change = (p: any, e: any) => {
        handleChange(p, e)
    }

    return <div className="selection-wrapper">
        {question.propositions.map((p, index) => <>
        <label htmlFor={`check-${index}`} className="selected-label">
        <input type="checkbox" key={p._id} onChange={(e: any) => Change(p, e)} id={`check-${index}`} />
        <div className="selected-content">
            {p.proposition}
        </div>
        </label>
        </>)}
    </div>
}