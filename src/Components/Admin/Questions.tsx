import { useEffect, useState, useMemo, memo, ChangeEvent } from "react"
import { QuestionsHook } from '../../Hooks/QuestionsHook'
import { DeleteModal } from "../../UI/DeleteModal"
import { QuestionType, PropositionType } from '../../Types/Questions'
import { QuestionFilters } from './QuestionFilters'
import { IFiletredQuestions } from '../../Types/Interfaces'
import { ElementsPerPage } from '../../UI/ElementsPerPage'
import { Container } from "../../UI/Container"
import { AdminModalForm } from '../../ModalForm/AdminModalForm'
import { QuestionForm } from "../../AdminForms/Questions/QuestionForm";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  CircularProgress
} from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import { Alert, AlertTitle } from '@material-ui/lab';

export const Questions = () => {
  const { questions, totalPages, currentPage, elementsPerPage, getQuestions, deleteQuestion, createQuestion, updateQuestion } = QuestionsHook();
  const [loader, setLoader] = useState<boolean>(true);
  const [loadingNextPage, setLoadingNextPage] = useState<boolean>(false)
  const [newQuestion, setnewQuestion] = useState<boolean>(false)
  const [filteredQuestions, setFilteredQuestions] = useState<IFiletredQuestions>({
    type: [],
    theme: [],
    text: "",
    limit: 10,
    page: 1
  });

  useEffect(() => {
    (async () => {
      setLoadingNextPage(true);
      await getQuestions(filteredQuestions);
      setLoader(false);
      setLoadingNextPage(false);
    })()
  }, [filteredQuestions])

  const handleCreateQuestion = async (question: any) => {
    await createQuestion({ ...question, themeId: question.themeId._id })
  }

  const handleThemeChange = (theme: any, type?: string) => {
    setFilteredQuestions((filters: IFiletredQuestions) => {
      if (type === 'delete') {
        return { ...filters, theme: filters.theme.filter(t => t != theme) }
      } else {
        return { ...filters, theme: theme }
      }
    })
  }

  const handleTypeChange = (checked: any, type: any) => {
    setFilteredQuestions((filters: IFiletredQuestions) => {
      if (checked && !filters.type.includes(type)) {
        return { ...filters, type: [...filters.type, type] }
      } else {
        return { ...filters, type: filters.type.filter(f => f != type) }
      }
    })
  }

  const handleTextChange = (text: string) => {
    setFilteredQuestions((filters: IFiletredQuestions) => {
      return { ...filters, text: text }
    })
  }

  const resetFilters = () => {
    setFilteredQuestions((filters: IFiletredQuestions) => {
      return { ...filters, theme: [], type: [] }
    })
  }

  const handleElementsChange = (elements: number) => {
    setFilteredQuestions((filters: IFiletredQuestions) => {
      return { ...filters, limit: elements }
    })
  }

  const handlePageChange = (e: ChangeEvent<unknown>, page: number) => {
    setFilteredQuestions((filters: IFiletredQuestions) => {
      return { ...filters, page: page }
    })
  }

  return <>
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Les questions</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setnewQuestion(true)}
          startIcon={<AddIcon />}
        >
          Créer une question
        </Button>
      </Box>
      <Box display="flex" justifyContent="flex-end" marginTop="15px">
        <ElementsPerPage elementsPerPage={elementsPerPage} onChange={handleElementsChange} />
      </Box>
      {newQuestion && <CreateQuestion handleClose={() => setnewQuestion(false)} onSubmit={handleCreateQuestion} />}
      <Grid container>
        <Grid item xs={12} sm={12} md={3}>
          <Box marginRight="10px">
            <QuestionFilters
              selectedTypes={filteredQuestions.type}
              selectedThemes={filteredQuestions.theme}
              typeChange={handleTypeChange}
              themeChanges={handleThemeChange}
              textChange={handleTextChange}
              resetFilters={resetFilters}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={9}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Intitulé</TableCell>
                <TableCell>Question</TableCell>
                <TableCell>Réponse(s)</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loader && <CircularProgress />}
              {questions && questions.map((question: QuestionType, index: number) => <Question key={question._id} question={question} onDelete={deleteQuestion} onUpdate={updateQuestion} />)}
            </TableBody>
          </Table>
          {(loader === false && questions.length === 0) && (
            <Alert severity="info">
              <AlertTitle>Information</AlertTitle>
              Aucun résultat
            </Alert>)}
          <Box marginTop="15px" display="flex" justifyContent="flex-end">
            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} showFirstButton showLastButton />
          </Box>
        </Grid>
      </Grid>
    </Container>
  </>
}

interface QuestionProps {
  question: QuestionType,
  onDelete: (question: QuestionType) => Promise<void>,
  onUpdate: (question: QuestionType, daya: QuestionType) => Promise<void>
}

const Question = memo(({ question, onDelete, onUpdate }: QuestionProps) => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editQuestion, setEditQuestion] = useState(false)


  const Delete = async (question: QuestionType) => {
    setLoading(true)
    await onDelete(question)
    setLoading(false)
  }

  const updateQuestion = async (data: any) => {
    await onUpdate(question, { ...data, themeId: data.themeId._id })
  }

  return <TableRow key={question._id}>
    <TableCell>{question.intitule}</TableCell>
    <TableCell>{question.question}</TableCell>
    <TableCell>{question.reponse || question.propositions.map((p: PropositionType, index: number) => <p key={index} className={`mb-0 ${p.correcte ? "text-success" : "text-danger"}`}>{'[' + p.proposition + ']'}</p>)}</TableCell>
    <TableCell><Chip color={question.type === 1 ? 'default' : 'primary'} size="small" label={question.type === 1 ? 'Réponse unique' : 'Choix multiples'} /></TableCell>
    <TableCell>
      <IconButton aria-label="edit" onClick={() => setEditQuestion(true)}>
        <EditIcon fontSize="inherit" />
      </IconButton>
      <IconButton aria-label="delete" onClick={() => setDeleteModal(true)}>
        <DeleteIcon fontSize="inherit" />
      </IconButton>
    </TableCell>
    {deleteModal && <DeleteModal handleClose={() => setDeleteModal(false)} element={question} onConfirm={Delete} deleteMessage="La question a été supprimée" />}
    {editQuestion && <EditQuestion handleClose={() => setEditQuestion(false)} question={question} onSubmit={updateQuestion} />}
  </TableRow>
})

interface CreateQuestionProps {
  handleClose: () => void,
  onSubmit: (question: QuestionType) => Promise<void>
}

const CreateQuestion = ({ handleClose, onSubmit }: CreateQuestionProps) => {
  const defaultValues = { themeId: null, propositions: [{ proposition: "", correcte: false }] }
  return <AdminModalForm
    handleClose={handleClose}
    onSubmit={onSubmit}
    type="create"
    component={QuestionForm}
    defaultValues={defaultValues}
    createText="Créer une question"
    editText="Éditer une question" />
}

interface EditQuestionProps {
  handleClose: () => void,
  question: QuestionType,
  onSubmit: (data: QuestionType) => Promise<any>
}

const EditQuestion = ({ handleClose, question, onSubmit }: EditQuestionProps) => {
  const defaultValues = { ...question, propositions: (question.propositions === undefined ? [{ proposition: "", correcte: false }] : question.propositions), themeId: question.theme }
  return <AdminModalForm
    handleClose={handleClose}
    onSubmit={onSubmit}
    type="edit"
    component={QuestionForm}
    defaultValues={defaultValues}
    createText="Créer une question"
    editText="Éditer une question" />
}

