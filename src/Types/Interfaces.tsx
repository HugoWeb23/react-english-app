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

export interface IPaginationProps {
    currentPage: number,
    elementsPerPage: number
}

export interface IUsers {
    _id: string,
    nom: string,
    prenom: string,
    email: string,
    admin: boolean
}

export interface ProfileValues {
    nom: string,
    prenom: string,
    email: string,
    pass?: string,
    repeatpass?: string
  }

export interface TypeType {
    _id?: number,
    type: number,
    title: string
}