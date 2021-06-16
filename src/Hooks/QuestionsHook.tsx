import { useReducer, useCallback } from "react"
import { apiFetch } from "../Utils/Api";
import { QuestionType } from '../Types/Questions'
import {ObjectToUrlParameters} from '../Hooks/UrlParameters'
import {IFiletredQuestions} from '../Types/Interfaces'

type State = {
    questions: QuestionType[],
    totalPages: number,
    currentPage: number,
    elementsPerPage: number;
    theme: [],
    type: [],
    text: string
}

type ActionType = {
    type: 'FETCH_QUESTIONS' | 'DELETE_QUESTION' | 'CREATE_QUESTION' | 'UPDATE_QUESTION' | 'SEARCH_QUESTION',
    payLoad: any | []
}

export const QuestionsHook = () => {

    const reducer = (state: State, action: ActionType): State => {
        switch (action.type) {
            case 'FETCH_QUESTIONS':
                return { ...state, questions: action.payLoad.allQuestions, totalPages: action.payLoad.totalPages, currentPage: action.payLoad.currentPage, elementsPerPage: action.payLoad.elementsPerPage, theme: action.payLoad.theme, type: action.payLoad.type, text: action.payLoad.text }
            case 'DELETE_QUESTION':
                return { ...state, questions: state.questions.filter(q => q != action.payLoad) }
            case 'CREATE_QUESTION':
                return { ...state, questions: [...state.questions, action.payLoad] }
            case 'UPDATE_QUESTION':
                return { ...state, questions: state.questions.map(q => q._id == action.payLoad._id ? action.payLoad : q) }
            default:
                return state
        }
    }
    const [state, dispatch] = useReducer(reducer, { questions: [], totalPages: 1, currentPage: 1, elementsPerPage: 10, theme: [], type: [], text: "" });

    const fetchQuestions = async(filters: IFiletredQuestions) => {
        const fetch = await apiFetch(`/api/questions/all${ObjectToUrlParameters(filters)}`)
        const data = {...fetch, ...filters}
        dispatch({ type: 'FETCH_QUESTIONS', payLoad: data });
    }

    return {
        questions: state.questions,
        totalPages: state.totalPages,
        currentPage: state.currentPage,
        elementsPerPage: state.elementsPerPage,
        getQuestions: async (filters: IFiletredQuestions) => {
           await fetchQuestions(filters)
        },
        deleteQuestion: async (question: QuestionType) => {
            const fetch = await apiFetch(`/api/question/${question._id}`, {
                method: 'DELETE'
            })
            if(state.questions.length <= 1 && state.totalPages > 1) {
                await fetchQuestions({page: (state.currentPage > 1 ? state.currentPage - 1 : 1), limit: state.elementsPerPage, type: state.type, theme: state.theme, text: state.text})
            }
            dispatch({ type: 'DELETE_QUESTION', payLoad: question });
        },
        createQuestion: async (question: QuestionType) => {
            const fetch = await apiFetch('/api/questions/new', {
                method: "POST",
                body: JSON.stringify(question)
            })
            dispatch({ type: 'CREATE_QUESTION', payLoad: fetch });
        },
        updateQuestion: async (question: QuestionType, data: QuestionType) => {
            const fetch = await apiFetch(`/api/questions/${question._id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            })
            dispatch({ type: 'UPDATE_QUESTION', payLoad: fetch });
        }
    }
}