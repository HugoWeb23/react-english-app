import * as yup from 'yup'

export const ThemeValidator = yup.object().shape({
    theme: yup.string().required('Le thème est obligatoire')
});