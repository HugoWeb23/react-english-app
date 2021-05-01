import { useEffect, useState } from "react"
import { apiFetch } from "../Utils/Api";
import {QuestionsHook} from '../Hooks/QuestionsHook'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import {ModalQuestion} from '../Questions/ModalQuestion'

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
    <h1>Les questions</h1>
    <Button variant="primary" onClick={handleCreateQuestion}>Créer une question</Button>
   {newQuestion && <CreateQuestion handleClose={handleCreateQuestion} onSubmit={createQuestion}/>}
    <Table striped bordered hover>
  <thead>
    <tr>
      <th>Intitulé</th>
      <th>Question</th>
      <th>Réponse</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {loader ? 'Chargement' : questions.sort((a, b) => a.reponse > b.reponse ? 1 : -1).map((question, index) => <Question key={index} question={question} onDelete={deleteQuestion} onUpdate={updateQuestion}/>)}
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

  const updateQuestion = (data) => {
    onUpdate(question, data)
  }
return <tr>
  <td>{question.intitule}</td>
  <td>{question.question}</td>
  <td>{question.reponse}</td>
  <td>
    <Button onClick={handleDelete} variant="danger" disabled={loading}>{loading ? 'Chargement...' : 'Supprimer'}</Button> - <Button onClick={handleEditQuestion} variant="primary">Modifier</Button>
    </td>
  {showAlert && <ConfirmDelete handleClose={handleDelete} question={question} confirmDelete={Delete}/>}
  {editQuestion && <EditQuestion handleClose={handleEditQuestion} question={question} onSubmit={updateQuestion}/>}
</tr>
}

const CreateQuestion = ({handleClose, onSubmit}) => {
  return <ModalQuestion handleClose={handleClose} onSubmit={onSubmit} type="create"/>
}

const EditQuestion = ({handleClose, question, onSubmit}) => {
  return <ModalQuestion handleClose={handleClose} question={question} onSubmit={onSubmit} type="edit"/>
}

const ConfirmDelete = ({handleClose, question, confirmDelete}) => {
  const onDelete = () => {
  confirmDelete(question)
  }
return  <Modal show={true} onHide={() => handleClose()}>
<Modal.Header closeButton>
  <Modal.Title>Confirmation</Modal.Title>
</Modal.Header>
<Modal.Body>Voulez-vous vraiment supprimer cette question ?</Modal.Body>
<Modal.Footer>
  <Button variant="secondary" onClick={() => handleClose()}>
    Fermer
  </Button>
  <Button variant="danger" onClick={onDelete}>
   Supprimer
  </Button>
</Modal.Footer>
</Modal>
}

