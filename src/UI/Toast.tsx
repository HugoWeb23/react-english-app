import Toast from 'react-bootstrap/Toast'
import Col from 'react-bootstrap/Col'
import {userContext} from '../Contexts/Contexts'
import { useContext } from 'react'

export const ToastAlert = () => {
    const value = useContext(userContext)
    return <Col xs={6}>
    <Toast show={value?.alertDisconnect} onClose={() => value?.toggleAlert()} delay={3000} autohide={true}>
      <Toast.Header>
        <strong className="mr-auto">Notification</strong>
      </Toast.Header>
      <Toast.Body>Vous êtes maintenant déconnecté.</Toast.Body>
    </Toast>
  </Col>
}