import { useEffect, useState, useMemo, memo } from "react"
import { apiFetch } from "../../Utils/Api";
import { QuestionsHook } from '../../Hooks/QuestionsHook'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Badge from 'react-bootstrap/Badge'
import { ModalQuestion } from '../../Questions/ModalQuestion'
import { Loader } from '../../UI/Loader'
import { DeleteModal } from "../../UI/DeleteModal"
import { QuestionType, PropositionType } from '../../Types/Questions'
import {QuestionFilters} from './QuestionFilters'
import {IFiletredQuestions} from '../../Types/Interfaces'
import {ElementsPerPage} from '../../UI/ElementsPerPage'
import {Paginate} from '../../UI/Pagination'
import { stringify } from "querystring";


export const Questions = () => {
  const { questions, totalPages, currentPage, getQuestions, deleteQuestion, createQuestion, updateQuestion } = QuestionsHook();
  const [loader, setLoader] = useState<boolean>(true);
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
      await getQuestions(filteredQuestions);
      setLoader(false);
    })()
  }, [filteredQuestions])

  const handleCreateQuestion = () => {
    setnewQuestion(!newQuestion)
  }

  const handleThemeChange = (theme: any, type?: string) => {
    setFilteredQuestions((filters: IFiletredQuestions) => {
      if(type === 'delete') {
        return {...filters, theme: filters.theme.filter(t => t != theme)}
      } else {
        return {...filters, theme: theme}
      }
    })
  }

  const handleTypeChange = (checked: any, type: any) => {
    setFilteredQuestions((filters: IFiletredQuestions) => {
     if(checked && !filters.type.includes(type)) {
      return {...filters, type: [...filters.type, type]}
     } else {
       return {...filters, type: filters.type.filter(f => f != type)}
     }
    })
  }

  const handleTextChange = (text: string) => {
    setFilteredQuestions((filters: IFiletredQuestions) => {
      return {...filters, text: text}
    })
  }

  const resetFilters = () => {
    setFilteredQuestions((filters: IFiletredQuestions) => {
      return {...filters, theme: [], type: []}
    })
  }

  const handleElementsChange = (elements: number) => {
    setFilteredQuestions((filters: IFiletredQuestions) => {
      return {...filters, limit: elements}
    })
  }

  const handlePageChange = (page: number) => {
    setFilteredQuestions((filters: IFiletredQuestions) => {
      return {...filters, page: page}
    })
  }

  return <>
    <div className="d-flex justify-content-between align-items-center mb-2 mt-2">
      <h1>Les questions</h1>
      <Button variant="primary" onClick={handleCreateQuestion}>Créer une question</Button>
    </div>
    <div className="d-flex justify-content-end mb-3">
        <ElementsPerPage elementsPerPage={filteredQuestions.limit} onChange={handleElementsChange}/>
        </div>
    {newQuestion && <CreateQuestion handleClose={handleCreateQuestion} onSubmit={createQuestion} />}
    <div className="row">
      <div className="col-md-3">
        <QuestionFilters
        selectedTypes={filteredQuestions.type}
        selectedThemes={filteredQuestions.theme} 
        typeChange={handleTypeChange}
        themeChanges={handleThemeChange}
        textChange={handleTextChange}
        resetFilters={resetFilters}
        />
     </div>
      <div className="col-md-9">
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Intitulé</th>
          <th>Question</th>
          <th>Réponse(s)</th>
          <th>Type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {loader && <Loader display="block" animation="border" variant="primary" />} 
        {questions && questions.map((question: QuestionType, index: number) => <Question key={index} question={question} onDelete={deleteQuestion} onUpdate={updateQuestion} />)}
      </tbody>
    </Table>
    <Paginate totalPages={totalPages} currentPage={currentPage} pageChange={handlePageChange} />
    </div>
    </div>
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

  const updateQuestion = async (data: QuestionType) => {
    await onUpdate(question, data)
  }

  return <tr>
    <td>{question.intitule}</td>
    <td>{question.question}</td>
    <td>{question.reponse || question.propositions.map((p: PropositionType, index: number) => <p key={index} className={`mb-0 ${p.correcte ? "text-success" : "text-danger"}`}>{'[' + p.proposition + ']'}</p>)}</td>
    <td>{question.type == 1 ? <Badge pill variant="primary">Réponse unique</Badge> : <Badge pill variant="secondary">Choix multiples</Badge>}</td>
    <td>
      <DropdownButton variant="info" title="Actions" disabled={loading}>
        <Dropdown.Item eventKey="1" onClick={() => setEditQuestion(true)}>Modifier</Dropdown.Item>
        <Dropdown.Item eventKey="2" onClick={() => setDeleteModal(true)}>Supprimer</Dropdown.Item>
      </DropdownButton>
    </td>
    {deleteModal && <DeleteModal handleClose={() => setDeleteModal(false)} element={question} onConfirm={Delete} />}
    {editQuestion && <EditQuestion handleClose={() => setEditQuestion(false)} question={question} onSubmit={updateQuestion} />}
  </tr>
})

interface CreateQuestionProps {
  handleClose: () => void,
  onSubmit: (question: QuestionType) => Promise<void>
}

const CreateQuestion = ({ handleClose, onSubmit }: CreateQuestionProps) => {
  return <ModalQuestion handleClose={handleClose} onSubmit={onSubmit} type="create" />
}

interface EditQuestionProps {
  handleClose: () => void,
  question: QuestionType,
  onSubmit: (data: QuestionType) => Promise<any>
}

const EditQuestion = ({ handleClose, question, onSubmit }: EditQuestionProps) => {
  return <ModalQuestion handleClose={handleClose} question={question} onSubmit={onSubmit} type="edit" />
}

