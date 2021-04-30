import { useEffect, useState } from "react"
import { apiFetch } from "../Utils/Api";
import {QuestionsHook} from '../Hooks/QuestionsHook'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import {QuestionForm} from '../Questions/QuestionForm'
import { useForm } from "react-hook-form";

export const Questions = () => {
   const {questions, getQuestions, deleteQuestion} = QuestionsHook();
   const [loader, setLoader] = useState(true);
   const [createQuestion, setCreateQuestion] = useState(false)
    useEffect(() => {
        (async() => {
            await getQuestions();
            setLoader(false);
        })()
    }, [])

    const handleCreateQuestion = () => {
      setCreateQuestion(!createQuestion)
    }

    return <>
    <h1>Les questions</h1>
    <Button variant="primary" onClick={handleCreateQuestion}>Créer une question</Button>
   {createQuestion && <CreateQuestion handleClose={handleCreateQuestion}/>}
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
    {loader ? 'Chargement' : questions.map((question, index) => <Question key={index} question={question} onDelete={deleteQuestion}/>)}
  </tbody>
</Table>
    </>
}

const Question = ({question, onDelete}) => {
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
return <tr>
  <td>{question.intitule}</td>
  <td>{question.question}</td>
  <td>{question.reponse}</td>
  <td>
    <Button onClick={handleDelete} variant="danger" disabled={loading}>{loading ? 'Chargement...' : 'Supprimer'}</Button> - <Button onClick={handleEditQuestion} variant="primary">Modifier</Button>
    </td>
  {showAlert && <ConfirmDelete handleClose={handleDelete} question={question} confirmDelete={Delete}/>}
  {editQuestion && <EditQuestion handleClose={handleEditQuestion} question={question}/>}
</tr>
}

const CreateQuestion = ({handleClose}) => {
  return <ModalQuestion handleClose={handleClose} type="create"/>
}

const EditQuestion = ({question, handleClose}) => {
  return <ModalQuestion handleClose={handleClose} question={question} type="edit"/>
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

const ModalQuestion = ({handleClose, onSubmit, question = {}, type}) => {
return  <Modal show={true} onHide={() => handleClose()}>
<Modal.Header closeButton>
  <Modal.Title>{type == 'create' ? "Créer une question" : "Éditer une question"}</Modal.Title>
</Modal.Header>
<Modal.Body>
  <QuestionForm question={question}/>
</Modal.Body>
<Modal.Footer>
  <Button variant="secondary" onClick={() => handleClose()}>
    Annuler
  </Button>
  <Button variant="success" type="submit">
  {type == 'create' ? "Créer" : "Éditer"}
  </Button>
</Modal.Footer>
</Modal>
}

