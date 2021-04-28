import { useEffect, useState } from "react"
import { apiFetch } from "../Utils/Api";
import {QuestionsHook} from '../Hooks/QuestionsHook'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export const Questions = () => {
   const {questions, getQuestions, deleteQuestion} = QuestionsHook();
   const [loader, setLoader] = useState(true);
   const [alert, setAlert] = useState(false)
   const [selectQuestion, setSelectQuestion] = useState({})
    useEffect(() => {
        (async() => {
            await getQuestions();
            setLoader(false);
        })()
    }, [])

    const toggleAlert = (question = {}) => {
      setAlert(!alert)
      setSelectQuestion(question)
    }
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
    <ConfirmDelete show={alert} handleClose={toggleAlert} question={selectQuestion} confirmDelete={deleteQuestion}/>
    {loader ? 'Chargement' : questions.map((question, index) => <Question question={question} onDelete={toggleAlert}/>)}
  </tbody>
</Table>
    </>
}

const Question = ({question, onDelete}) => {
  const handleDelete = () => {
    onDelete(question);
  }
return <tr>
  <td>{question.intitule}</td>
  <td>{question.question}</td>
  <td>{question.reponse}</td>
  <td><Button onClick={handleDelete} variant="danger">Supprimer</Button></td>
</tr>
}

const ConfirmDelete = ({show, handleClose, question, confirmDelete}) => {
  const [loading, setLoading] = useState(false);
  const onDelete = async() => {
    setLoading(true);
    await confirmDelete(question);
    handleClose();
    setLoading(false);
  }
return  <Modal show={show} onHide={handleClose}>
<Modal.Header closeButton>
  <Modal.Title>Question {question._id}</Modal.Title>
</Modal.Header>
<Modal.Body>Voulez-vous vraiment supprimer cette question ?</Modal.Body>
<Modal.Footer>
  <Button variant="secondary" onClick={handleClose}>
    Fermer
  </Button>
  <Button variant="danger" onClick={onDelete} disabled={loading}>
    {loading ? 'Chargement...' : 'Supprimer'}
  </Button>
</Modal.Footer>
</Modal>
}