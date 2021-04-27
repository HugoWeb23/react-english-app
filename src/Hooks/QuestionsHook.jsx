import { useReducer } from "react"
import { apiFetch } from "../Utils/Api";

export const QuestionsHook = () => {
    const reducer = (state, action) => {
        switch(action.type) {
            case 'FETCH_QUESTIONS':
                return {questions: action.payLoad}
            case 'TEST':
                return {...state, questions: state.questions.filter(q => q.intitule == 'Traduis ce mot en anglais')}
        }
    }
    const [state, dispatch] = useReducer(reducer, {questions: null});

    return {
        questions: state.questions,
        getQuestions: async() => {
            const fetch = await apiFetch('/api/questions/all')
            dispatch({type: 'FETCH_QUESTIONS', payLoad: fetch});
        },
        TEST: () => {
            dispatch({type: 'TEST'});
        }
    }
}