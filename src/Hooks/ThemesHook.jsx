import { useReducer } from "react"
import { apiFetch } from "../Utils/Api";
import {usePagination} from '../Hooks/usePagination'

export const useThemes = () => {
    const reducer = (state, action) => {
        switch(action.type) {
            case 'FETCH_THEMES':
                return {themes: action.payLoad.allThemes, currentPage: action.payLoad.currentPage, totalPages: action.payLoad.totalPages}
            case 'UPDATE_THEME':
                return {themes: state.themes.map(t => t._id == action.payLoad._id ? action.payLoad : t)}
            case 'CREATE_THEME':
                return {themes: [...state.themes, action.payLoad]}
            case 'DELETE_THEME':
                return {themes: state.themes.filter(t => t != action.payLoad)}
        }
    }
    const [state, dispatch] = useReducer(reducer, {themes: null, currentPage: 1, totalPages: 1});

    return {
        themes: state.themes,
        themesCurrentPage: state.currentPage,
        themesTotalPages: state.totalPages,
        getThemes: async(elementsPerPage) => {
            console.log('elements', elementsPerPage)
            const fetch = await apiFetch(`/api/themes/all?page=${1}&limit=${elementsPerPage}`);
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