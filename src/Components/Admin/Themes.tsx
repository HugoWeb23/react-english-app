import { useEffect, useState } from "react"
import { useThemes } from "../../Hooks/ThemesHook"
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import {Loader} from '../../UI/Loader'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import { ModalTheme } from "../../Themes/ModalTheme"
import {DeleteModal} from '../../UI/DeleteModal'
import {ThemeType} from '../../Types/Themes'

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
    {loading ? <Loader display="block" animation="border" variant="primary" /> : themes.map((theme: ThemeType, index: number) => <Theme key={index} theme={theme} index={index} onEdit={editTheme} onDelete={deleteTheme}/>)}
  </tbody>
</Table>
    </>
}

interface ThemeProps {
  theme: ThemeType,
  index: number,
  onEdit: (theme: ThemeType, data: ThemeType) => Promise<void>,
  onDelete: (theme: ThemeType) => Promise<void>
}

const Theme = ({theme, index, onEdit, onDelete}: ThemeProps) => {
    const [editModal, setEditModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [loading, setLoading] = useState(false)

    const editTheme = async(data: ThemeType) => {
        await onEdit(theme, data);
    }

    const deleteTheme = async(theme: ThemeType) => {
      setLoading(true)
      setDeleteModal(false)
      await onDelete(theme)
      setLoading(false)
    }

    const closeEditModal = () => {
        setEditModal(false)
    }
return <tr>
    <td>{index+1}</td>
    <td>{theme.theme}</td>
    <td>
    <DropdownButton variant="info" title="Actions" disabled={loading}>
        <Dropdown.Item eventKey="1" onClick={() => setEditModal(true)}>Modifier</Dropdown.Item>
        <Dropdown.Item eventKey="2"  onClick={() => setDeleteModal(true)}>Supprimer</Dropdown.Item>
      </DropdownButton></td>
    {editModal && <EditTheme handleClose={closeEditModal} theme={theme} onEdit={editTheme}/>}
    {deleteModal && <DeleteModal element={theme} handleClose={() => setDeleteModal(false)} onConfirm={deleteTheme}/>}
</tr>
}

interface CreateThemeProps {
  onCreate: () => Promise<void>,
  handleClose: () => void
}

const CreateTheme = ({onCreate, handleClose}: CreateThemeProps) => {
return <ModalTheme onSubmit={onCreate} handleClose={handleClose} type="create"/>
}

interface EditThemeProps {
  handleClose: () => void,
  theme: ThemeType,
  onEdit: (data: ThemeType) => Promise<void>
}

const EditTheme = ({handleClose, theme, onEdit}: EditThemeProps) => {
return <ModalTheme handleClose={handleClose} theme={theme} onSubmit={onEdit} type="edit"/>
}