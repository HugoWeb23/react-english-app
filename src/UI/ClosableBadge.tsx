import {CloseIcon} from '../Icons/Close'

interface IClosableBadge {
    element: object,
    elementName: string,
    index?: number,
    variant?: string,
    handleClose: (element: object) => void
}

export const ClosableBadge = ({element, elementName, index, variant = "primary", handleClose}: IClosableBadge) => {
    return <a href="#" key={index} onClick={() => handleClose(element)} className={`badge badge-${variant} mr-2 mb-2`}>{elementName} <CloseIcon /></a>
}