import Spinner from 'react-bootstrap/Spinner'

interface ILoader {
    display?: string,
    animation?: 'border' | 'grow' 
    variant?: string
}

export const Loader = ({display = "block", animation = "border", variant = "primary"}: ILoader) => {
return <Spinner style={{display: display}} animation={animation} variant={variant} />
}