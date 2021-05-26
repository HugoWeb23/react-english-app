import Spinner from 'react-bootstrap/Spinner'

export const AbsoluteLoader = () => {
return <Spinner animation="grow" variant="primary" style={{position: 'absolute', top: '50%', right: '50%', zIndex: 2}} />
}