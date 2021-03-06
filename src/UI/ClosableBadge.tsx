import {CloseIcon} from '../Icons/Close'

interface IClosableBadge {
    element: any,
    elementName: string,
    index?: number,
    variant?: string,
    handleClose: (element: any) => void
}

export const ClosableBadge = ({element, elementName, index, variant = "primary", handleClose}: IClosableBadge) => {
    return <a href="#" key={index} onClick={() => handleClose(element)} className={`badge badge-${variant} mr-2 mb-2`}>{elementName} <CloseIcon /></a>
}