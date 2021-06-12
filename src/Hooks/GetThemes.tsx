import { useState } from "react"
import {apiFetch} from '../Utils/Api'
import {ThemeType} from '../Types/Themes'

export const Themes = () => {
    const [themes, setThemes] = useState<ThemeType[]>([]);

    return {
        themes, 
        GetThemes: async() => {
            const fetch = await apiFetch('/api/themes');
            setThemes(fetch);
        }
    }
}