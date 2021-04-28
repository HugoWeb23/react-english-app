import { useEffect, useState } from "react"
import { apiFetch } from "../Utils/Api";
import {QuestionsHook} from '../Hooks/QuestionsHook'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export const Questions = () => {
   const {questions, getQuestions, deleteQuestion} = QuestionsHook();
   const [loader, setLoader] = useState(true);
    useEffect(() => {
        (async() => {
            await getQuestions();
            setLoader(false);
        })()
    }, [])

    return <>
    <h1>Les questions</h1>
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
  const handleDelete = () => {
    setShowAlert(!showAlert);
  }
  const Delete = async(question) => {
    handleDelete();
    setLoading(true)
    await onDelete(question)
    setLoading(false)
  }
return <tr>
  <td>{question.intitule}</td>
  <td>{question.question}</td>
  <td>{question.reponse}</td>
  <td><Button onClick={handleDelete} variant="danger" disabled={loading}>{loading ? 'Chargement...' : 'Supprimer'}</Button></td>
  {showAlert && <ConfirmDelete handleClose={handleDelete} question={question} confirmDelete={Delete}/>}
</tr>
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