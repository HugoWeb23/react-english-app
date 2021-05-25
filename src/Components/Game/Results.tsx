import { useEffect, useState } from "react"
import { Loader } from "../../UI/Loader"
import { apiFetch } from "../../Utils/Api"
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import { Link, RouteComponentProps } from 'react-router-dom'
import Badge from 'react-bootstrap/Badge'
import { QuestionType } from '../../Types/Questions'
import { Smile } from '../../Icons/Smile'
import { Frown } from '../../Icons/Frown'
import { Paginate } from '../../UI/Pagination'
import {ElementsPerPage} from '../../UI/ElementsPerPage'
import {usePagination} from '../../Hooks/usePagination'

interface IResults extends QuestionType {
    propositionsSelect: string[],
    reponseEcrite: string,
    correcte: boolean
}

type TParams = {
    id: string
}

export const Results = ({ match }: RouteComponentProps<TParams>) => {
    const idPart: string = match.params.id;
    const [partInfo, setPartInfo] = useState<any>({})
    const [loader, setLoader] = useState<boolean>(true)
    const {totalPages, currentPage, elementsPerPage, setTotalPages, setCurrentPage, setElementsPerPage} = usePagination()

    useEffect(() => {
        (async () => {
            setLoader(true)
            const part = await apiFetch(`/api/part/${idPart}?limit=${elementsPerPage}&page=${currentPage}`)
            if (part.questions.length === 0) {
                setCurrentPage(part.totalPages)
            }
            setPartInfo(part);
            setTotalPages(part.totalPages)
            setLoader(false)
        })()
    }, [elementsPerPage, currentPage])

    if (loader) {
        return <Loader />
    }

    const handleElementsChange = (page: number) => {
        setElementsPerPage(page)
    }

    const handlePageChange = (page: number): any => {
        setCurrentPage(page)
    }

    return <>
        <div className="d-flex justify-content-between align-items-center mb-2">
            <h2>Résultats</h2>
            <Link to="/gamehistory" className="card-link">Retour à l'historique des parties</Link>
        </div>
        <div className="d-flex justify-content-end mb-3">
        <ElementsPerPage elementsPerPage={elementsPerPage} onChange={handleElementsChange}/>
        </div>

        {partInfo.questions.map((question: IResults) => <>
            <Card key={question._id} border={question.correcte ? "success" : "danger"} className="mb-3 position-relative">
                <div style={{ position: 'absolute', top: "-13px", right: "-20px" }}>{question.correcte ? <Smile /> : <Frown />}</div>
                <Card.Body>
                    <Card.Title>{question.intitule} - {question.question}</Card.Title>
                    {question.propositions && <ListGroup>{question.propositions.map(p =>
                        <ListGroup.Item key={p._id} className="d-flex justify-content-between align-items-center" variant={p.correcte === true ? "success" : "danger"}>{p.proposition} {question.propositionsSelect.includes(p._id) ? <Badge variant="secondary">Sélectionné</Badge> : null}</ListGroup.Item>)}
                    </ListGroup>}
                    {question.reponse && <><div>Réponse attendue : {question.reponse}</div>
                        <div className="font-weight-bolder">Votre réponse : {question.reponseEcrite}</div></>}
                </Card.Body>
            </Card>
        </>)}
        <Paginate totalPages={totalPages} currentPage={currentPage} pageChange={handlePageChange} />
    </>
}