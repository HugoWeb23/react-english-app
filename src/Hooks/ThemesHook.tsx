import { useReducer } from "react"
import { apiFetch } from "../Utils/Api"
import { ThemeType } from "../Types/Themes"
import { IPaginationProps } from "../Types/Interfaces"

export const useThemes = () => {

    interface IState {
        themes: ThemeType[],
        currentPage: number,
        totalPages: number,
        elementsPerPage: number
    }

    interface ActionType {
        type: 'FETCH_THEMES' | 'UPDATE_THEME' | 'CREATE_THEME' | 'DELETE_THEME',
        payLoad: any | []
    }
    
    const reducer = (state: IState, action: ActionType) => {
        switch(action.type) {
            case 'FETCH_THEMES':
                return {...state, themes: action.payLoad.allThemes, currentPage: action.payLoad.currentPage, totalPages: action.payLoad.totalPages, elementsPerPage: action.payLoad.elementsPerPage}
            case 'UPDATE_THEME':
                return {...state, themes: state.themes.map(t => t._id == action.payLoad._id ? action.payLoad : t)}
            case 'CREATE_THEME':
                return {...state, themes: [...state.themes, action.payLoad]}
            case 'DELETE_THEME':
                return {...state, themes: state.themes.filter(t => t != action.payLoad)}
        }
    }
    const [state, dispatch] = useReducer(reducer, {themes: [], currentPage: 1, totalPages: 1, elementsPerPage: 10});

    const fetchThemes = async(props: IPaginationProps) => {
        const fetch = await apiFetch(`/api/themes/all?page=${props.currentPage}&limit=${props.elementsPerPage}`);
        dispatch({type: 'FETCH_THEMES', payLoad: fetch})
    }

    return {
        themes: state.themes,
        currentPage: state.currentPage,
        totalPages: state.totalPages,
        elementsPerPage: state.elementsPerPage,
        getThemes: async(props: IPaginationProps) => {
           await fetchThemes(props)
        },
        editTheme: async(theme: ThemeType, data: ThemeType) => {
                const fetch = await apiFetch(`/api/themes/${theme._id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                });
                dispatch({type: 'UPDATE_THEME', payLoad: fetch})
        },
        createTheme: async(data: ThemeType) => {
            const fetch = await apiFetch(`/api/themes/new`, {
                method: 'POST',
                body: JSON.stringify(data)
            });
            dispatch({type: 'CREATE_THEME', payLoad: fetch})
        },
        deleteTheme: async(theme: ThemeType) => {
            const fetch = await apiFetch(`/api/themes/${theme._id}`, {
                method: 'DELETE'
            })
            if(state.themes.length <= 1 && state.totalPages > 1) {
                fetchThemes({currentPage: (state.currentPage > 1 ? state.currentPage - 1 : 1), elementsPerPage: state.elementsPerPage})
            }
            dispatch({type: 'DELETE_THEME', payLoad: theme})
        }
    }
}