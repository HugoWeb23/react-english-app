export interface IFiletredQuestions {
    type: number[],
    theme: {
        _id: string,
        theme: string
    }[],
    text: string,
    limit: number,
    page: number
  }