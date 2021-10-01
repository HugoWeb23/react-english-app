import * as yup from 'yup'

export const AccountValidator = yup.object().shape({
    nom: yup.string().required('Le nom est obligatoire'),
    prenom: yup.string().required('Le prénom est obligatoire'),
    email: yup.string().required("L'email est obligatoire").email("L'email n'est pas valide"),
    pass: yup.string(),
    admin: yup.string().required("Veuillez saisir un rôle")
});