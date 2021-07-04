import { useForm, useFormContext, useFieldArray, SubmitHandler } from 'react-hook-form'
import Form from 'react-bootstrap/Form'
import { ChangeEvent, useEffect, useState, useRef } from 'react'
import { Themes } from '../Hooks/GetThemes'
import { Loader } from '../UI/Loader'
import Modal from 'react-bootstrap/Modal'
import { apiFetch } from '../Utils/Api'
import ListGroup from 'react-bootstrap/ListGroup'
import { useHistory } from 'react-router-dom'
import { Container } from '../UI/Container'
import { QuestionType } from '../Types/Questions'
import { ThemeType } from '../Types/Themes'
import { TypeType } from '../Types/Interfaces'

import { MultipleValues } from '../UI/Material/MultipleValues'
import { MTextField } from '../UI/Material/MTextField'
import { MCheckbox } from '../UI/Material/MCheckbox'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
    Typography,
    FormControl,
    FormControlLabel,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Card,
    CardContent,
    CardActionArea,
    Grid,
    TextField,
    CircularProgress
} from '@material-ui/core'

interface IPartData {
    themes: ThemeType[],
    types: any[],
    limit: number,
    random: boolean
}

interface ISelectedQuestions {
    questionId: string,
    themeId: string,
    type: number
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
                marginTop: theme.spacing(1),
                marginBottom: theme.spacing(1)
            },
        },
        button: {
            margin: '10px 0 10px 0'
        },
        card: {
            margin: '0 0 5px 0'
        },
        cardContent: {
            padding: '10px 15px 10px 15px!important'
        },
        grid: {
            justifyContent: 'space-between',
            alignItems: 'center'
        }
    }),
);

export const Part = () => {
    const history = useHistory()
    const classes = useStyles()
    const { register, setError, handleSubmit, clearErrors, control, watch, formState, getValues } = useForm<any>({
        defaultValues: {
            themes: [],
            types: []
        }
    });
    const { errors } = formState;
    const [loading, setLoading] = useState<boolean>(true)
    const { themes, GetThemes, loadingThemes } = Themes();
    const types: TypeType[] = [{ id: 1, type: 1, title: "Réponse à écrire" }, { id: 2, type: 2, title: "Choix multiples" }]
    const [modal, setModal] = useState(false)
    const [selectedQuestions, setSelectedQuestions] = useState<ISelectedQuestions[]>([]);
    useEffect(() => {
        (async () => {
            await GetThemes()
            setLoading(false)
        })()
    }, [])

    const submit: SubmitHandler<IPartData> = async (e) => {
        const values = {
            questions: selectedQuestions.map(q => q.questionId),
            themes: e.themes.map(t => t._id),
            types: e.types.map(t => t.type),
            limit: e.limit,
            random: e.random
        }
        try {
            setLoading(true)
            const reponse = await apiFetch('/api/part/new', {
                method: 'POST',
                body: JSON.stringify(values)
            })
            console.log(values)
            history.push({ pathname: `/play/${reponse.id_part}`, state: { ...reponse, infos: { points: 0, totalQuestions: reponse.totalQuestions } } })
        } catch (e) {

        }
        setLoading(false)
    }

    const handleManualQuestions = () => {
        setModal(true)
    }

    const handleDeleteOption = (data: any) => {
        if (data != null) {
            setSelectedQuestions(questions => questions.filter(q => q.themeId != data.option._id))
        }
    }

    const themesWatch = watch('themes')
    const typesWatch = watch('types')

    return <>
        <Container>
           <Typography variant="h4">Lancer une partie</Typography>
           {JSON.stringify(selectedQuestions)}
            <form onSubmit={handleSubmit(submit)}>
                <FormControl className={classes.root} fullWidth>
                    {loadingThemes ? <Loader /> : <>
                        <MultipleValues
                            name="themes"
                            optionLabel="theme"
                            inputLabel="Sélectionnez un thème"
                            control={control}
                            data={themes}
                            deleteOption={handleDeleteOption}
                        /></>}
                </FormControl>
                {(themesWatch && themesWatch.length > 0) &&
                    <>
                        <Button fullWidth variant="contained" className={classes.button} onClick={handleManualQuestions}>Sélection manuelle ({selectedQuestions.length})</Button>
                        {selectedQuestions.length > 0 && <Button fullWidth={false} size="small" variant="outlined" color="secondary" className={classes.button} onClick={() => setSelectedQuestions([])}>Supprimer les questions sélectionnées</Button>}

                        {modal && <ManualQuestionsModal
                            handleClose={() => setModal(false)}
                            themes={themesWatch}
                            types={typesWatch}
                            onConfirm={(e: ISelectedQuestions[]) => setSelectedQuestions(e)}
                            checkedQuestions={selectedQuestions} />}
                    </>
                }
                <FormControl className={classes.root} fullWidth>
                    <MultipleValues
                        name="types"
                        optionLabel="title"
                        inputLabel="Sélectionnez un type"
                        control={control}
                        data={types}
                    />
                </FormControl>
                <FormControl className={classes.root} fullWidth>
                    <MTextField
                        name="limit"
                        control={control}
                        label="Limite de questions"
                        type="number"
                    />
                </FormControl>
                <FormControl className={classes.root}>
                    <FormControlLabel control={
                        <MCheckbox
                            name="random"
                            control={control}
                            color="primary"
                            defaultChecked
                        />
                    }
                        label="Questions aléatoires"
                    />
                </FormControl>
                <FormControl className={classes.root} fullWidth>
                    <Button type="submit" disabled={loading} variant="contained" color="primary">Lancer la partie</Button>
                </FormControl>
            </form>
        </Container>
    </>
}

interface IManualQuestionsModal {
    handleClose: () => void,
    themes: ThemeType[],
    types: TypeType[],
    onConfirm: (selectedQuestions: ISelectedQuestions[]) => void,
    checkedQuestions: ISelectedQuestions[]
}

const ManualQuestionsModal = ({ handleClose, themes, types, onConfirm, checkedQuestions }: IManualQuestionsModal) => {
    const [filteredThemes, setFilteredThemes] = useState<ThemeType[]>(themes)
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [loader, setLoader] = useState<boolean>(true)
    const [selectedQuestions, setSelectedQuestions] = useState(checkedQuestions || []);
    useEffect(() => {
        (async () => {
            const questions = await apiFetch('/api/questions', {
                method: 'POST',
                body: JSON.stringify({ themes: themes.map((t: ThemeType) => t._id), types: types.map(t => t.type) })
            })
            setQuestions(questions)
            setLoader(false)
        })()
    }, [])

    const handleQuestionChange = (value: boolean, question: QuestionType) => {
        if (value === true) {
            setSelectedQuestions(questions => [...questions, { questionId: question._id, themeId: question.theme._id, type: question.type }])

        } else if (value === false) {
            setSelectedQuestions(questions => questions.filter(q => q.questionId != question._id))
        }
    }

    const handleFilterThmes = (theme: ThemeType | null) => {
        if (theme != null) {
            setFilteredThemes(themes => themes.filter(t => t._id === theme._id))
        } else {
            setFilteredThemes(themes)
        }
    }

    const handleConfirm = () => {
        onConfirm(selectedQuestions)
        handleClose()
    }
    return <Dialog open={true} onClose={() => handleClose()} fullWidth>
        <DialogTitle id="alert-dialog-title">{"Sélection manuelle des questions"}</DialogTitle>
        <DialogContent>
            {loader ? <CircularProgress /> :
                <>
                    <Typography variant="subtitle1">{themes.length} {themes.length > 1 ? "thèmes sélectionnés" : "thème sélectionné"}</Typography>
                    <Autocomplete
                        id="combo-box-demo"
                        fullWidth
                        options={themes}
                        getOptionLabel={(option) => option.theme}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Filtrer les thèmes" />}
                        noOptionsText="Aucun résultat"
                        onChange={(e, value) => handleFilterThmes(value)}
                    />
                    {filteredThemes.map(t => {
                        return <>
                            <Typography variant="subtitle2">{t.theme}</Typography>
                            <ListGroup className="mb-3">{questions.map((q: QuestionType, i: number) => q.theme._id === t._id ? <Question question={q} onChange={handleQuestionChange} checkedQuestions={selectedQuestions} /> : null)}</ListGroup>
                        </>
                    })}</>}</DialogContent>
        <DialogActions>
            <Button color="secondary" onClick={() => handleClose()}>
                Fermer
            </Button>
            <Button color="primary" onClick={handleConfirm} disabled={loader}>
                Valider
            </Button>
        </DialogActions>
    </Dialog>
}

interface IQuestion {
    question: QuestionType,
    onChange: (value: boolean, question: QuestionType) => void,
    checkedQuestions: ISelectedQuestions[]
}

const Question = ({ question, onChange, checkedQuestions }: IQuestion) => {
    const classes = useStyles()
    const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked, question)
    }
    const isChecked = () => {
        return checkedQuestions.some(q => q.questionId === question._id) ? true : undefined
    }

    return <>
        <Card className={classes.card}>
            <CardActionArea>
                <CardContent className={classes.cardContent}>
                    <Grid container className={classes.grid}>
                        <Grid item> {question.question}</Grid>
                        <Grid item><Checkbox color="primary" id={question._id} onChange={handleQuestionChange} defaultChecked={isChecked()} /></Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
        </Card>
    </>
}