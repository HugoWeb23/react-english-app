import { useState } from "react"
import {apiFetch} from '../Utils/Api'
import {ThemeType} from '../Types/Themes'

export const Themes = () => {
    const [themes, setThemes] = useState<ThemeType | null>();

    return {
        themes, 
        GetThemes: async() => {
            const fetch = await apiFetch('/api/themes/all');
            setThemes(fetch);
        }
    }
}