import { useState } from "react"
import {apiFetch, ApiFetch} from '../Utils/Api'

export const Themes = () => {
    const [themes, setThemes] = useState();

    return {
        themes, 
        GetThemes: async() => {
            const fetch = await apiFetch('/api/themes/all');
            setThemes(fetch);
        }
    }
}