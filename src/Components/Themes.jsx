import { useEffect, useState } from "react"
import { useThemes } from "../Hooks/ThemesHook"
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import {Loader} from '../UI/Loader'
import { ModalTheme } from "../Themes/ModalTheme"
import {DeleteModal} from '../UI/DeleteModal'

export const Themes = () => {
    const {themes, getThemes, editTheme, createTheme, deleteTheme} = useThemes();
    const [loading, setLoading] = useState(true);
    const [modalCreate, setModalCreate] = useState(false)

    useEffect(() => {
        (async() => {
            await getThemes();
            setLoading(false)
        })()
    }, [])

    const closeModalCreate = () => {
        setModalCreate(false)
    }

    return <>
    <div className="d-flex justify-content-between align-items-center mb-2 mt-2">
    <h1>Les thèmes</h1>
    <Button variant="primary" onClick={() => setModalCreate(true)}>Créer un thème</Button>
    </div>
    {modalCreate && <CreateTheme onCreate={createTheme} handleClose={closeModalCreate}/>}
    <Table striped bordered hover>
  <thead>
    <tr>
      <th>#</th>
      <th>Thème</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {loading ? <Loader display="block" animation="border" variant="primary" /> : themes.map((theme, index) => <Theme key={index} theme={theme} index={index} onEdit={editTheme} onDelete={deleteTheme}/>)}
  </tbody>
</Table>
    </>
}

const Theme = ({theme, index, onEdit, onDelete}) => {
    const [editModal, setEditModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)

    const editTheme = async(data) => {
        await onEdit(theme, data);
    }

    const closeEditModal = () => {
        setEditModal(false)
    }
return <tr>
    <td>{index+1}</td>
    <td>{theme.theme}</td>
    <td><Button variant="info" onClick={() => setEditModal(true)}>Modifier</Button> - <Button variant="danger" onClick={() => setDeleteModal(true)}>Supprimer</Button></td>
    {editModal && <EditTheme handleClose={closeEditModal} theme={theme} onEdit={editTheme}/>}
    {deleteModal && <DeleteModal element={theme} handleClose={() => setDeleteModal(false)} onConfirm={onDelete}/>}
</tr>
}

const CreateTheme = ({onCreate, handleClose}) => {
return <ModalTheme onSubmit={onCreate} handleClose={handleClose} type="create"/>
}

const EditTheme = ({handleClose, theme, onEdit}) => {
return <ModalTheme handleClose={handleClose} theme={theme} onSubmit={onEdit} type="edit"/>
}