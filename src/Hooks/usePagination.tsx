import { useState } from "react"

interface IStatePagination {
    totalPages: number,
    currentPage: number,
    elementsPerPage: number
}

export const usePagination = () => {
    const [state, setState] = useState<IStatePagination>({totalPages: 1, currentPage: 1, elementsPerPage: 10})
    return {
        totalPages: state.totalPages,
        currentPage: state.currentPage,
        elementsPerPage: state.elementsPerPage,
        setTotalPages: (totalPages: number) => {
            setState((state: IStatePagination) => {
                return {...state, totalPages: totalPages}
            })
        },
        setCurrentPage: (currentPage: number) => {
            setState((state: IStatePagination) => {
                return {...state, currentPage: currentPage}
            })
        },
        setElementsPerPage: (elements: number) => {
            setState((state: IStatePagination) => {
                return {...state, elementsPerPage: elements}
            })
        }
    }
}