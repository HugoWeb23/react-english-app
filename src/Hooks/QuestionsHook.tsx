import { useReducer, useCallback } from "react"
import { apiFetch } from "../Utils/Api";
import { QuestionType } from '../Types/Questions'
import {ObjectToUrlParameters} from '../Hooks/UrlParameters'
import {IFiletredQuestions} from '../Types/Interfaces'

type State = {
    questions: QuestionType[],
    totalPages: number,
    currentPage: number
}

type ActionType = {
    type: 'FETCH_QUESTIONS' | 'DELETE_QUESTION' | 'CREATE_QUESTION' | 'UPDATE_QUESTION' | 'SEARCH_QUESTION',
    payLoad: any | []
}

export const QuestionsHook = () => {
    const reducer = (state: State, action: ActionType): State => {
        switch (action.type) {
            case 'FETCH_QUESTIONS':
                return { ...state, questions: action.payLoad.allQuestions, totalPages: action.payLoad.totalPages, currentPage: action.payLoad.currentPage }
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
    const [state, dispatch] = useReducer(reducer, { questions: [], totalPages: 1, currentPage: 1 });

    return {
        questions: state.questions,
        totalPages: state.totalPages,
        currentPage: state.currentPage,
        getQuestions: async (filters: IFiletredQuestions) => {
            const fetch = await apiFetch(`/api/questions/all${ObjectToUrlParameters(filters)}`)
            dispatch({ type: 'FETCH_QUESTIONS', payLoad: fetch });
        },
        deleteQuestion: useCallback(async (question) => {
            const fetch = await apiFetch(`/api/question/${question._id}`, {
                method: 'DELETE'
            })
            dispatch({ type: 'DELETE_QUESTION', payLoad: question });
        }, []),
        createQuestion: useCallback(async (question) => {
            const fetch = await apiFetch('/api/questions/new', {
                method: "POST",
                body: JSON.stringify(question)
            })
            dispatch({ type: 'CREATE_QUESTION', payLoad: fetch });
        }, []),
        updateQuestion: useCallback(async (question, data) => {
            const fetch = await apiFetch(`/api/questions/${question._id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            })
            dispatch({ type: 'UPDATE_QUESTION', payLoad: fetch });
        }, [])
    }
}