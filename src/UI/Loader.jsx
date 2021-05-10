import Spinner from 'react-bootstrap/Spinner'

export const Loader = ({display = "block", animation = "border", variant = "primary"}) => {
return <Spinner style={{display: display}} animation={animation} variant={variant} />
}