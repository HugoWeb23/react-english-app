import { useReducer, useCallback } from "react"
import { apiFetch } from "../Utils/Api";

export const QuestionsHook = () => {
    const reducer = (state, action) => {
        switch(action.type) {
            case 'FETCH_QUESTIONS':
                return {questions: action.payLoad}
            case 'DELETE_QUESTION':
                return {...state, questions: state.questions.filter(q => q != action.payLoad)}
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
        errors: state.errors,
        getQuestions: async() => {
            const fetch = await apiFetch('/api/questions/all')
            dispatch({type: 'FETCH_QUESTIONS', payLoad: fetch});
        },
        deleteQuestion: useCallback(async(question) => {
            //const fetch = await apiFetch(`/api/question/${question._id}`, {
                //method: 'DELETE'
            //})
            dispatch({type: 'DELETE_QUESTION', payLoad: question});
            return {type: 'ok', message: 'Validé'}
        }, [])
    }
}