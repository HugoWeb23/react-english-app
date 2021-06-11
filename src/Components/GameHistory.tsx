import { useEffect, useState } from "react"
import { IParty } from '../Types/Parties'
import { apiFetch } from "../Utils/Api"
import { useHistory, Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table'
import { Loader } from "../UI/Loader"
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import { ElementsPerPage } from '../UI/ElementsPerPage'
import { usePagination } from '../Hooks/usePagination'
import { Paginate } from '../UI/Pagination'
import '../assets/css/styles.css'
import {DeleteModal} from '../UI/DeleteModal'

export const GameHistory = () => {
  const [parties, setParties] = useState<IParty[]>([])
  const [dataLoading, setDataLoading] = useState<boolean>(true)
  const [loadingNextPage, setLoadingNextPage] = useState(false)
  const [page, setPage] = useState<number>(1)
  const { totalPages, currentPage, elementsPerPage, setTotalPages, setCurrentPage, setElementsPerPage } = usePagination()

  useEffect(() => {
    (async () => {
      setLoadingNextPage(true)
      const fetch = await apiFetch(`/api/parts?limit=${elementsPerPage}&page=${page}`)
      setParties(fetch.allParts)
      setCurrentPage(fetch.currentPage)
      setTotalPages(fetch.totalPages)
      setLoadingNextPage(false)
      setDataLoading(false)
    })()
  }, [elementsPerPage, page])

  const handleElementsChange = (elements: number) => {
    setElementsPerPage(elements)
  }

  const handlePageChange = (page: number) => {
    setPage(page)
  }


  const handlePartDelete = async(part: IParty) => {
    try {
      await apiFetch(`/api/part/${part._id}`, {
        method: 'DELETE'
      })
      setParties((parties: IParty[]) => parties.filter(party => party._id != part._id))
    } catch(e) {

    }
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
          <th>Temps</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {parties.map((party: IParty, index: number) => <Party key={index} party={party} onDelete={handlePartDelete} />)}
      </tbody>
    </Table>
    <Paginate totalPages={totalPages} currentPage={currentPage} pageChange={handlePageChange} />
  </>
}

interface PartyProps {
  party: IParty,
  onDelete: (party: IParty) => Promise<void>
}

const Party = ({ party, onDelete }: PartyProps) => {
  const [deleteModal, setDeleteModal] = useState<boolean>(false)
  const history = useHistory();

  const handleRedirect = () => {
    return history.push(`/results/${party._id}`)
  }

  const handleDelete = async(party: IParty) => {
    await onDelete(party)
  }
  return <tr>
    <td>{party.date}</td>
    <td>{party.totalQuestions}</td>
    {party.isFinished ? <>
      <td>{party.trueQuestions}</td>
      <td>{party.falseQuestions}</td>
      <td>{party.temps}</td>
    </> : <td colSpan={3} style={{ textAlign: 'center' }} className="table-danger">Cette partie n'est pas terminée <a onClick={() => history.push(`/play/${party._id}`)} className="card-link cursor-pointer">Terminer la partie</a></td>
    }
    <td>
      <DropdownButton variant="info" title="Actions">
        {party.isFinished && <Dropdown.Item eventKey="1" onClick={handleRedirect}>Consulter</Dropdown.Item>}
        <Dropdown.Item eventKey="2" onClick={() => setDeleteModal(true)}>Supprimer</Dropdown.Item>
      </DropdownButton>
    </td>
    {deleteModal && <DeleteModal handleClose={() => setDeleteModal(false)} element={party} onConfirm={handleDelete}/>}
  </tr>
}