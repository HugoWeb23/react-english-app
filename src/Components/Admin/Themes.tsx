import { useEffect, useState } from "react"
import { useThemes } from "../../Hooks/ThemesHook"
import { ThemeValidator } from "./Validators/ThemeValidator"
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import { Loader } from '../../UI/Loader'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import { DeleteModal } from '../../UI/DeleteModal'
import { ThemeType } from '../../Types/Themes'
import { ElementsPerPage } from '../../UI/ElementsPerPage'
import { Paginate } from '../../UI/Pagination'
import { IPaginationProps } from '../../Types/Interfaces'
import { Container } from '../../UI/Container'
import { AdminModalForm } from '../../ModalForm/AdminModalForm'
import { ThemeForm } from "../../AdminForms/Themes/ThemeForm";

export const Themes = () => {
  const { themes, currentPage, totalPages, elementsPerPage, getThemes, editTheme, createTheme, deleteTheme } = useThemes();
  const [loading, setLoading] = useState<boolean>(true)
  const [modalCreate, setModalCreate] = useState<boolean>(false)
  const [paginationProps, setPaginationProps] = useState<IPaginationProps>({
    currentPage: 1,
    elementsPerPage: 10
  })

  useEffect(() => {
    (async () => {
      await getThemes(paginationProps);
      setLoading(false)
    })()
  }, [paginationProps])

  const closeModalCreate = () => {
    setModalCreate(false)
  }

  return <>
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-2 mt-2">
        <h1>Les thèmes</h1>
        <Button variant="primary" onClick={() => setModalCreate(true)}>Créer un thème</Button>
      </div>
      <div className="d-flex justify-content-end mb-3">
        <ElementsPerPage elementsPerPage={elementsPerPage} onChange={(page) => setPaginationProps(props => { return { ...props, elementsPerPage: page } })} />
      </div>
      {modalCreate && <CreateTheme onCreate={createTheme} handleClose={closeModalCreate} />}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Thème</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && <Loader display="block" animation="border" variant="primary" />}
          {themes && themes.map((theme: ThemeType, index: number) => <Theme key={index} theme={theme} index={index} onEdit={editTheme} onDelete={deleteTheme} />)}
        </tbody>
      </Table>
      <Paginate totalPages={totalPages} currentPage={currentPage} pageChange={(page) => setPaginationProps(props => { return { ...props, currentPage: page } })} />
    </Container>
  </>
}

interface ThemeProps {
  theme: ThemeType,
  index: number,
  onEdit: (theme: ThemeType, data: ThemeType) => Promise<any>,
  onDelete: (theme: ThemeType) => Promise<void>
}

const Theme = ({ theme, index, onEdit, onDelete }: ThemeProps) => {
  const [editModal, setEditModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const editTheme = async (data: ThemeType) => {
    await onEdit(theme, data);
  }

  const deleteTheme = async (theme: ThemeType) => {
    setLoading(true)
    setDeleteModal(false)
    await onDelete(theme)
    setLoading(false)
  }

  const closeEditModal = () => {
    setEditModal(false)
  }
  return <tr>
    <td>{theme.theme}</td>
    <td>
      <DropdownButton variant="info" title="Actions" disabled={loading}>
        <Dropdown.Item eventKey="1" onClick={() => setEditModal(true)}>Modifier</Dropdown.Item>
        <Dropdown.Item eventKey="2" onClick={() => setDeleteModal(true)}>Supprimer</Dropdown.Item>
      </DropdownButton></td>
    {editModal && <EditTheme handleClose={closeEditModal} theme={theme} onEdit={editTheme} />}
    {deleteModal && <DeleteModal element={theme} handleClose={() => setDeleteModal(false)} onConfirm={deleteTheme} />}
  </tr>
}

interface CreateThemeProps {
  onCreate: (data: ThemeType) => Promise<void>,
  handleClose: () => void
}

const CreateTheme = ({ onCreate, handleClose }: CreateThemeProps) => {
  return <AdminModalForm
  handleClose={handleClose}
  onSubmit={onCreate}
  type="create"
  component={ThemeForm}
  resolver={ThemeValidator}
  createText="Créer un thème"
  editText="Éditer un thème" />
}

interface EditThemeProps {
  handleClose: () => void,
  theme: ThemeType,
  onEdit: (data: ThemeType) => Promise<any>
}

const EditTheme = ({ handleClose, theme, onEdit }: EditThemeProps) => {
  return <AdminModalForm
  handleClose={handleClose}
  onSubmit={onEdit}
  type="edit"
  component={ThemeForm}
  defaultValues={theme}
  resolver={ThemeValidator}
  createText="Créer un thème"
  editText="Éditer un thème" />
}