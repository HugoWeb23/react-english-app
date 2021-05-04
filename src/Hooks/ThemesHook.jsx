import { useReducer } from "react"
import { apiFetch } from "../Utils/Api";

export const useThemes = () => {
    const reducer = (state, action) => {
        switch(action.type) {
            case 'FETCH_THEMES':
                return {themes: action.payLoad}
            case 'UPDATE_THEME':
                return {themes: state.themes.map(t => t._id == action.payLoad._id ? action.payLoad : t)}
            case 'CREATE_THEME':
                return {themes: [...state.themes, action.payLoad]}
            case 'DELETE_THEME':
                return {themes: state.themes.filter(t => t != action.payLoad)}
        }
    }
    const [state, dispatch] = useReducer(reducer, {themes: null});

    return {
        themes: state.themes,
        getThemes: async() => {
            const fetch = await apiFetch('/api/themes/all');
            dispatch({type: 'FETCH_THEMES', payLoad: fetch})
        },
        editTheme: async(theme, data) => {
            const fetch = await apiFetch(`/api/themes/${theme._id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            dispatch({type: 'UPDATE_THEME', payLoad: fetch})
        },
        createTheme: async(data) => {
            const fetch = await apiFetch(`/api/themes/new`, {
                method: 'POST',
                body: JSON.stringify(data)
            });
            dispatch({type: 'CREATE_THEME', payLoad: fetch})
        },
        deleteTheme: async(theme) => {
            const fetch = await apiFetch(`/api/themes/${theme._id}`, {
                method: 'DELETE'
            })
            dispatch({type: 'DELETE_THEME', payLoad: theme})
        }
    }
}