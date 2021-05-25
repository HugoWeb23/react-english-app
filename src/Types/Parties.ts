export interface IParty {
    _id: string,
    date: Date,
    totalQuestions: number,
    trueQuestions: number,
    falseQuestions: number,
    isFinished: boolean
}