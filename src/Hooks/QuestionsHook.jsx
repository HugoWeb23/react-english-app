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
    const [state, dispatch] = useReducer(reducer, {questions: null});
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
            //await time(10000);
            dispatch({type: 'DELETE_QUESTION', payLoad: question});
        }, [])
    }
}