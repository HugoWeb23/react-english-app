import * as yup from 'yup'

export const QuestionFormValidator = yup.object().shape({
    type: yup.string().required('Le type est obligatoire'),
    themeId: yup.string().required('Le thème est obligatoire'),
    intitule: yup.string().required("L'intitulé est obligatoire"),
    question: yup.string().required("La question est obligatoire"),
    reponses: yup.mixed().when('type', {
        is: (val: string) => val === "1",
        then: yup.array().of(
            yup.string().required("La réponse est obligatoire")
        )
    }),
    propositions: yup.mixed().when('type', {
        is: (val: string) => val === "2",
        then: yup.array().of(
            yup.object().shape({
                proposition: yup.string().required('Veuillez saisir une proposition')
            })
        )
    })
});