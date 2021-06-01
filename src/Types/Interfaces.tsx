export interface IFiletredQuestions {
    type: number[],
    theme: {
        _id: string,
        theme: string
    }[],
    limit: number,
    page: number
  }