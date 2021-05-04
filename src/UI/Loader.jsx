import Spinner from 'react-bootstrap/Spinner'

export const Loader = ({display, animation, variant}) => {
return <Spinner style={{display: display}} animation={animation} variant={variant} />
}