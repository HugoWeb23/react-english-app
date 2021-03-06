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
import { ElementsPerPage } from '../../UI/ElementsPerPage'
import { usePagination } from '../../Hooks/usePagination'
import { Container } from '../../UI/Container'
import {LeftArrow} from '../../Icons/LeftArrow'

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
    const [loadingNextPage, setLoadingNextPage] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    const { totalPages, currentPage, elementsPerPage, setTotalPages, setCurrentPage, setElementsPerPage } = usePagination()

    useEffect(() => {
        (async () => {
            setLoadingNextPage(true)
            const part = await apiFetch(`/api/part/${idPart}?limit=${elementsPerPage}&page=${page}`)
            setCurrentPage(part.currentPage)
            setPartInfo(part);
            setTotalPages(part.totalPages)
            setLoadingNextPage(false)
            setLoader(false)
        })()
    }, [elementsPerPage, page])

    const handleElementsChange = (page: number) => {
        setElementsPerPage(page)
    }

    const handlePageChange = (page: number): any => {
        setPage(page)
    }

    return <>
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h2>R??sultats</h2>
                <Link to="/gamehistory" className="card-link"><LeftArrow/>Retour ?? l'historique des parties</Link>
            </div>
            {loader ? <Loader /> :
                <>
                    <div className="score">
                        Score : {partInfo.trueQuestions} / {partInfo.totalQuestions}
                    </div>
                    <div className="d-flex justify-content-end mb-3">
                        <ElementsPerPage elementsPerPage={elementsPerPage} onChange={handleElementsChange} />
                    </div>

                    <div className={`position-relative ${loadingNextPage && "opacity-table"}`} style={{ zIndex: 1 }}>
                        {partInfo.questions.map((question: IResults) => <>
                            <Card key={question._id} border={question.correcte ? "success" : "danger"} className="mb-3 position-relative" style={{ zIndex: 1 }}>
                                <div style={{ position: 'absolute', top: "-13px", right: "-20px" }}>{question.correcte ? <Smile /> : <Frown />}</div>
                                <Card.Body>
                                    <Card.Title>{question.intitule} - {question.question}</Card.Title>
                                    {question.propositions && <ListGroup>{question.propositions.map(p =>
                                        <ListGroup.Item key={p._id} className="d-flex justify-content-between align-items-center" variant={p.correcte === true ? "success" : "danger"}>{p.proposition} {question.propositionsSelect.includes(p._id) ? <Badge variant="secondary">S??lectionn??</Badge> : null}</ListGroup.Item>)}
                                    </ListGroup>}
                                    {question.reponses && <><div>{question.reponses.length > 2 ? "R??ponses correctes" : "R??ponse correcte"} : {question.reponses.map((reponse, index) => `${reponse} ${question.reponses.length > index + 1 ? ' - ' : ''}`)}</div>
                                        <div className="font-weight-bolder">Votre r??ponse : {question.reponseEcrite}</div></>}
                                </Card.Body>
                            </Card>
                        </>)}
                    </div>
                    <Paginate totalPages={totalPages} currentPage={currentPage} pageChange={handlePageChange} />
                </>
            }
        </Container>
    </>
}