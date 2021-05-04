import { useEffect, useState } from "react"
import { apiFetch } from "../Utils/Api";
import {QuestionsHook} from '../Hooks/QuestionsHook'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Badge from 'react-bootstrap/Badge'
import {ModalQuestion} from '../Questions/ModalQuestion'
import {Loader} from '../UI/Loader'
import { DeleteModal } from "../UI/DeleteModal";

export const Questions = () => {
   const {questions, getQuestions, deleteQuestion, createQuestion, updateQuestion} = QuestionsHook();
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
    {loader ? <Loader display="block" animation="border" variant="primary" /> : questions.sort((a, b) => a.reponse > b.reponse ? 1 : -1).map((question, index) => <Question key={index} question={question} onDelete={deleteQuestion} onUpdate={updateQuestion}/>)}
  </tbody>
</Table>
    </>
}

const Question = ({question, onDelete, onUpdate}) => {
  const [showAlert, setShowAlert] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editQuestion, setEditQuestion] = useState(false)

  const handleDelete = () => {
    setShowAlert(!showAlert);
  }

  const Delete = async(question) => {
    handleDelete();
    setLoading(true)
    const result = await onDelete(question)
    setLoading(false)
  }

  const handleEditQuestion = () => {
    setEditQuestion(!editQuestion)
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
        <Dropdown.Item eventKey="1" onClick={handleEditQuestion}>Modifier</Dropdown.Item>
        <Dropdown.Item eventKey="2"  onClick={handleDelete}>Supprimer</Dropdown.Item>
      </DropdownButton>
    </td>
  {showAlert && <DeleteModal handleClose={handleDelete} element={question} onConfirm={Delete}/>}
  {editQuestion && <EditQuestion handleClose={handleEditQuestion} question={question} onSubmit={updateQuestion}/>}
</tr>
}

const CreateQuestion = ({handleClose, onSubmit}) => {
  return <ModalQuestion handleClose={handleClose} onSubmit={onSubmit} type="create"/>
}

const EditQuestion = ({handleClose, question, onSubmit}) => {
  return <ModalQuestion handleClose={handleClose} question={question} onSubmit={onSubmit} type="edit"/>
}

