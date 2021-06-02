import { FunctionComponent } from "react"

export const Container: FunctionComponent = ({children}) => {
    return <div className="container-sm">
        {children}
    </div>
}