import { useEffect, useState, useMemo, memo } from "react"
import { apiFetch } from "../../Utils/Api";
import {QuestionsHook} from '../../Hooks/QuestionsHook'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Badge from 'react-bootstrap/Badge'
import {ModalQuestion} from '../../Questions/ModalQuestion'
import {Loader} from '../../UI/Loader'
import { DeleteModal } from "../../UI/DeleteModal"
import {Search} from './Search'
import { usePagination, useSortBy, useTable } from 'react-table'

export const Questions = () => {
   const {questions, filteredQuestions, getQuestions, deleteQuestion, createQuestion, updateQuestion, searchQuestion} = QuestionsHook();
   const [loader, setLoader] = useState(true);
   const [newQuestion, setnewQuestion] = useState(false)

    useEffect(() => {
        (async() => {
            await getQuestions();
            setLoader(false);
        })()
    }, [])

    const handleCreateQuestion = () => {
      setnewQuestion(!newQuestion)
    }

    return <>
    <div className="d-flex justify-content-between align-items-center mb-2 mt-2">
    <h1>Les questions</h1>
    <Button variant="primary" onClick={handleCreateQuestion}>Créer une question</Button>
    </div>
    <Search size="lg" onSearch={searchQuestion}/>
   {newQuestion && <CreateQuestion handleClose={handleCreateQuestion} onSubmit={createQuestion}/>}
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
    {loader ? <Loader display="block" animation="border" variant="primary" /> : questions.map((question, index) => <Question key={index} question={question} onDelete={deleteQuestion} onUpdate={updateQuestion}/>)}
  </tbody>
</Table>
    </>
}

const Question = memo(({question, onDelete, onUpdate}) => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editQuestion, setEditQuestion] = useState(false)


  const Delete = async(question) => {
    setLoading(true)
    await onDelete(question)
    setLoading(false)
  }

  const updateQuestion = async(data) => {
    await onUpdate(question, data)
  }

return <tr>
  <td>{question.intitule}</td>
  <td>{question.question}</td>
  <td>{question.reponse || question.propositions.map((q, index) => <p key={index} className={`mb-0 ${q.correcte ? "text-success" : "text-danger"}`}>{'['+q.proposition+']'}</p>)}</td>
  <td>{question.type == 1 ? <Badge pill variant="primary">Réponse unique</Badge> : <Badge pill variant="secondary">Choix multiples</Badge>}</td>
  <td>
    <DropdownButton variant="info" title="Actions" disabled={loading}>
        <Dropdown.Item eventKey="1" onClick={() => setEditQuestion(true)}>Modifier</Dropdown.Item>
        <Dropdown.Item eventKey="2"  onClick={() => setDeleteModal(true)}>Supprimer</Dropdown.Item>
      </DropdownButton>
    </td>
  {deleteModal && <DeleteModal handleClose={() => setDeleteModal(false)} element={question} onConfirm={Delete}/>}
  {editQuestion && <EditQuestion handleClose={() => setEditQuestion(false)} question={question} onSubmit={updateQuestion}/>}
</tr>
})

const CreateQuestion = ({handleClose, onSubmit}) => {
  return <ModalQuestion handleClose={handleClose} onSubmit={onSubmit} type="create"/>
}

const EditQuestion = ({handleClose, question, onSubmit}) => {
  return <ModalQuestion handleClose={handleClose} question={question} onSubmit={onSubmit} type="edit"/>
}

