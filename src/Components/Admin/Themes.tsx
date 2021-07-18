import { useEffect, useState, ChangeEvent } from "react"
import { useThemes } from "../../Hooks/ThemesHook"
import { Loader } from '../../UI/Loader'
import { DeleteModal } from '../../UI/DeleteModal'
import { ThemeType } from '../../Types/Themes'
import { ElementsPerPage } from '../../UI/ElementsPerPage'
import { IPaginationProps } from '../../Types/Interfaces'
import { Container } from '../../UI/Container'
import { AdminModalForm } from '../../ModalForm/AdminModalForm'
import { ThemeForm } from "../../AdminForms/Themes/ThemeForm";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Box,
  Typography,
  Grid,
  Chip
} from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';

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
    <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Les thèmes</Typography>
        <Button variant="contained" color="primary" onClick={() => setModalCreate(true)}>Créer un thème</Button>
      </Box>
      <Box display="flex" justifyContent="flex-end" marginTop="15px">
        <ElementsPerPage elementsPerPage={elementsPerPage} onChange={(page) => setPaginationProps(props => { return { ...props, elementsPerPage: page } })} />
      </Box>
      {modalCreate && <CreateTheme onCreate={createTheme} handleClose={closeModalCreate} />}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Thème</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && <Loader display="block" animation="border" variant="primary" />}
          {themes && themes.map((theme: ThemeType, index: number) => <Theme key={index} theme={theme} index={index} onEdit={editTheme} onDelete={deleteTheme} />)}
        </TableBody>
      </Table>
      <Box marginTop="15px" display="flex" justifyContent="flex-end">
            <Pagination count={totalPages} page={currentPage} onChange={(e: ChangeEvent<unknown>, page: number) => setPaginationProps(props => { return { ...props, currentPage: page } })} showFirstButton showLastButton />
          </Box>
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
  return <TableRow key={theme._id}>
    <TableCell>{theme.theme}</TableCell>
    <TableCell>
    <IconButton aria-label="edit" onClick={() => setEditModal(true)}>
        <EditIcon fontSize="inherit" />
      </IconButton>
      <IconButton aria-label="delete" onClick={() => setDeleteModal(true)}>
        <DeleteIcon fontSize="inherit" />
      </IconButton>
    </TableCell>
    {editModal && <EditTheme handleClose={closeEditModal} theme={theme} onEdit={editTheme} />}
    {deleteModal && <DeleteModal element={theme} handleClose={() => setDeleteModal(false)} onConfirm={deleteTheme} />}
  </TableRow>
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
  createText="Créer un thème"
  editText="Éditer un thème" />
}