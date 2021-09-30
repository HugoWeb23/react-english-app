export type QuestionType = {
    _id: string,
    type: number,
    intitule: string,
    question: string,
    theme: {_id: string, theme: string},
    reponses: [string],
    propositions: PropositionType[]
}

export type PropositionType = {
    _id: string,
    proposition: string,
    correcte: boolean
}