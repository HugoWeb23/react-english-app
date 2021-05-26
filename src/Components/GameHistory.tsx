import { useEffect, useState } from "react"
import { IParty } from '../Types/Parties'
import { apiFetch } from "../Utils/Api"
import { useHistory } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import { Loader } from "../UI/Loader"
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import { ElementsPerPage } from '../UI/ElementsPerPage'
import { usePagination } from '../Hooks/usePagination'
import { Paginate } from '../UI/Pagination'
import '../assets/css/styles.css'

export const GameHistory = () => {
  const [parties, setParties] = useState<IParty[]>([])
  const [dataLoading, setDataLoading] = useState<boolean>(true)
  const [loadingNextPage, setLoadingNextPage] = useState(false)
  const { totalPages, currentPage, elementsPerPage, setTotalPages, setCurrentPage, setElementsPerPage } = usePagination()

  useEffect(() => {
    (async () => {
      setLoadingNextPage(true)
      const fetch = await apiFetch(`/api/parts?limit=${elementsPerPage}&page=${currentPage}`)
      setParties(fetch.allParts)
      if (fetch.allParts.length === 0) {
        setCurrentPage(fetch.totalPages)
      }
      setTotalPages(fetch.totalPages)
      setLoadingNextPage(false)
      setDataLoading(false)
    })()
  }, [elementsPerPage, currentPage])

  const handleElementsChange = (elements: number) => {
    setElementsPerPage(elements)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (dataLoading) {
    return <Loader />
  }

  return <>
    <div className="d-flex justify-content-end mb-3">
      <ElementsPerPage elementsPerPage={elementsPerPage} onChange={handleElementsChange} />
    </div>
    <Table striped bordered hover className={loadingNextPage ? "opacity-table" : ''}>
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
        {parties.map((party: IParty, index: number) => <Party key={index} party={party} />)}
      </tbody>
    </Table>
    <Paginate totalPages={totalPages} currentPage={currentPage} pageChange={handlePageChange} />
  </>
}

interface PartyProps {
  party: IParty
}

const Party = ({ party }: PartyProps) => {
  const history = useHistory();
  const handleRedirect = () => {
    return history.push(`/results/${party._id}`)
  }
  return <tr>
    <td>{party.date}</td>
    <td>{party.totalQuestions}</td>
    {party.isFinished ? <>
      <td>{party.trueQuestions}</td>
      <td>{party.falseQuestions}</td>
    </> : <td colSpan={2} style={{ textAlign: 'center' }} className="table-danger">Cette partie n'est pas terminée <a href="#" className="card-link">Terminer la partie</a></td>
    }
    <td>
      <DropdownButton variant="info" title="Actions">
        {party.isFinished && <Dropdown.Item eventKey="1" onClick={handleRedirect}>Consulter</Dropdown.Item>}
        <Dropdown.Item eventKey="2">Supprimer</Dropdown.Item>
      </DropdownButton>
    </td>
  </tr>
}