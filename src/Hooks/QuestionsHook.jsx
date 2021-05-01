import { useReducer, useCallback } from "react"
import { apiFetch } from "../Utils/Api";

export const QuestionsHook = () => {
    const reducer = (state, action) => {
        switch(action.type) {
            case 'FETCH_QUESTIONS':
                return {questions: action.payLoad}
            case 'DELETE_QUESTION':
                return {...state, questions: state.questions.filter(q => q != action.payLoad)}
            case 'CREATE_QUESTION':
                return {...state, questions: [...state.questions, action.payLoad]}
            case 'UPDATE_QUESTION':
                return {questions: state.questions.map(q => q._id == action.payLoad._id ? action.payLoad : q)}
        }
    }
    const [state, dispatch] = useReducer(reducer, {questions: null, errors: ['test']});
    const time = (time) => {
        return new Promise((resolve) => {
            setTimeout(resolve, time)
        })
    }

    return {
        questions: state.questions,
        getQuestions: async() => {
            const fetch = await apiFetch('/api/questions/all')
            dispatch({type: 'FETCH_QUESTIONS', payLoad: fetch});
        },
        deleteQuestion: useCallback(async(question) => {
            const fetch = await apiFetch(`/api/question/${question._id}`, {
                method: 'DELETE'
            })
            dispatch({type: 'DELETE_QUESTION', payLoad: question});
        }, []),
        createQuestion: useCallback(async(question) => {
            const fetch = await apiFetch('/api/questions/new', {
                method: "POST",
                body: JSON.stringify(question)
            })
            dispatch({type: 'CREATE_QUESTION', payLoad: question});
        }, []),
        updateQuestion: useCallback(async(question, data) => {
           console.log(question, data)
            dispatch({type: 'UPDATE_QUESTION', payLoad: question});
        }, [])
    }
}