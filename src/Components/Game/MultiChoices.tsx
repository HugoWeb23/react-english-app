import { QuestionType } from '../../Types/Questions'
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
        {question.propositions.map((p, index: number) => <>
            <label htmlFor={`check-${index}`} tabIndex={index + 1} className="selected-label">
                <input type="checkbox" tabIndex={index + 1} key={p._id} onChange={(e: any) => Change(p, e)} id={`check-${index}`} />
                <div className="selected-content">
                    <div className="proposition">
                        {p.proposition}
                    </div>
                    <div className="proposition-infos">
                        <div className="numero-proposition">
                            {index + 1}
                        </div>
                    </div>
                </div>
            </label>
        </>)}
    </div>
}