import { useEffect, useState } from "react"
import {IParty} from '../Types/Parties'
import { apiFetch } from "../Utils/Api"
import { useHistory } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import { Loader } from "../UI/Loader"
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

export const GameHistory = () => {
    const [parties, setParties] = useState<IParty[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        (async() => {
            const fetch = await apiFetch('/api/parts')
            setParties(fetch)
            setLoading(false)
        })()
    }, [])

    if(loading) {
        return <Loader/>
    }

    return <Table striped bordered hover>
    <thead>
      <tr>
        <th>Date</th>
        <th>Nombre de questions</th>
        <th>Réponses correctes</th>
        <th>Réponses fausses</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {parties.map((party: IParty, index: number) => <Party key={index} party={party}/>)}
    </tbody>
  </Table>
}

interface PartyProps {
    party: IParty
}

const Party = ({party}: PartyProps) => {
const history = useHistory();
  const handleRedirect = () => {
    return history.push(`/results/${party._id}`)
  }
return <tr>
    <td>{party.date}</td>
    <td>{party.totalQuestions}</td>
    <td>{party.trueQuestions}</td>
    <td>{party.falseQuestions}</td>
    <td> <DropdownButton variant="info" title="Actions">
        <Dropdown.Item eventKey="1" onClick={handleRedirect}>Consulter</Dropdown.Item>
        <Dropdown.Item eventKey="2">Supprimer</Dropdown.Item>
      </DropdownButton>
    </td>
</tr>
}