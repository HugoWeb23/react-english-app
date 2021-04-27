import { useEffect, useState } from "react"
import { apiFetch } from "../Utils/Api";
import {QuestionsHook} from '../Hooks/QuestionsHook'
import Table from 'react-bootstrap/Table'

export const Questions = () => {
   const {questions, getQuestions, TEST} = QuestionsHook();
   const [loader, setLoader] = useState(true);
    useEffect(() => {
        (async() => {
            await getQuestions();
            setLoader(false);
        })()
    }, [])
    return <>
    <h1>Les questions</h1>
    <button onClick={() => TEST()}>TEST</button>
    <Table striped bordered hover>
  <thead>
    <tr>
      <th>Intitulé</th>
      <th>Question</th>
      <th>Réponse</th>
    </tr>
  </thead>
  <tbody>
    {loader ? 'Chargement' : questions.map((question, index) => <tr><td>{question.intitule}</td><td>{question.question}</td><td>{question.reponse}</td></tr>)}
  </tbody>
</Table>
    </>
}