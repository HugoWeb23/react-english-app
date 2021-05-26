import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import {CloseIcon} from '../../Icons/Close'
import {useState} from 'react'
import { apiFetch } from '../../Utils/Api'

export const SearchByThemes = () => {

    const [show, setShow] = useState(false)
    const [themes, setThemes] = useState([])
    const [selectedThemes, setSelectedThemes] = useState<any>([])
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const searchTheme = async(e: any) => {
        if(e.target.value.length > 0) {
            const themes = await apiFetch('/api/themes/search', {
                method: 'POST',
                body: JSON.stringify({theme: e.target.value})
            })
            setThemes(themes.filter((theme: any) => !selectedThemes.some((t: any) => t._id == theme._id)))
        }
    }

    const handleSelectTheme = (theme: any): void => {
        if(!selectedThemes.some((t: any) => t._id == theme._id)) {
            setSelectedThemes((themes: any) => [...themes, theme])
            setThemes((themes: any) => themes.filter((t: any) => t._id != theme._id))
        }
    }

    return <>
        <Button variant="primary" onClick={handleShow}>
            Afficher les thèmes
    </Button>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Rechercher des thèmes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Nom du thème</Form.Label>
                    <Form.Control type="text" placeholder="Nom du thème" onChange={searchTheme}/>
                </Form.Group>
                <Form.Group>
                    {selectedThemes.length > 0 && selectedThemes.map((t: any, index: number) => <a href="#" key={index} className="badge badge-primary mr-2 mb-2">{t.theme} <CloseIcon/></a>)}
                </Form.Group>
                {themes.length > 0 && themes.map((theme: any, index: number) => {
                    return <Form.Check
                    key={index}
                    type="checkbox"
                    id={theme._id}
                    label={theme.theme}
                    custom
                    onChange={() => handleSelectTheme(theme)}
                />
                })}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Fermer
        </Button>
                <Button variant="primary" onClick={handleClose}>
                    Sauvegarder
        </Button>
            </Modal.Footer>
        </Modal>
    </>
}