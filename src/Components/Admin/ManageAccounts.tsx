import { ChangeEvent, useEffect, useState } from 'react'
import { Container } from '../../UI/Container'
import { IUsers } from '../../Types/Interfaces'
import { ManageUsersHook } from '../../Hooks/ManageUsersHook'
import { AdminModalForm } from '../../ModalForm/AdminModalForm'
import { AccountForm } from '../../AdminForms/Accounts/AccountForm'
import { DeleteModal } from '../../UI/DeleteModal'
import { ElementsPerPage } from '../../UI/ElementsPerPage'
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
  CircularProgress,
  LinearProgress
} from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'

export const ManageAccounts = () => {
  const { loading, users, GetAllUsers, UpdateUser, DeleteUser, elementsPerPage, totalPages, currentPage, ChangeLimit, ChangePage } = ManageUsersHook()
  const [loader, setLoader] = useState<boolean>(true)

  useEffect(() => {
    (async () => {
      await GetAllUsers()
      setLoader(false)
    })()
  }, [])

  return <>
    <Container>
      <Typography variant="h4">Gestion des comptes</Typography>
      <div className="d-flex justify-content-end mb-3">
        <ElementsPerPage elementsPerPage={elementsPerPage} onChange={ChangeLimit} />
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nom</TableCell>
            <TableCell>Prénom</TableCell>
            <TableCell>E-mail</TableCell>
            <TableCell>Rôle</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loader && <CircularProgress />}
          {users.map(user => <User user={user} key={user._id} onSubmit={UpdateUser} onDelete={DeleteUser} />)}
        </TableBody>
      </Table>
      <Box display="flex" justifyContent="flex-end" marginTop="15px">
      <Pagination count={totalPages} page={currentPage} onChange={(e: ChangeEvent<unknown>, page: number) => ChangePage(page)} showFirstButton showLastButton />
      </Box>
    </Container>
  </>
}

interface UserInterface {
  user: IUsers,
  onSubmit: (user: IUsers, data: IUsers) => Promise<void>,
  onDelete: (user: IUsers) => Promise<void>
}

const User = ({ user, onSubmit, onDelete }: UserInterface) => {
  const [editModal, setEditModal] = useState<boolean>(false)
  const [deleteModal, setDeleteModal] = useState<boolean>(false)

  return <>
    <TableRow>
      <TableCell>{user.nom}</TableCell>
      <TableCell>{user.prenom}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.admin === true ? 'Administrateur' : 'Utilisateur'}</TableCell>
      <TableCell>
        <IconButton aria-label="edit" onClick={() => setEditModal(true)}>
          <EditIcon fontSize="inherit" />
        </IconButton>
        <IconButton aria-label="delete" onClick={() => setDeleteModal(true)}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </TableCell>
    </TableRow>
    {editModal && <AdminModalForm
      handleClose={() => setEditModal(false)}
      onSubmit={data => onSubmit(user, data)}
      type="edit"
      component={AccountForm}
      defaultValues={{ ...user, admin: user.admin.toString() }}
      createText="Créer un compte"
      editText="Éditer un compte" />
    }
    {deleteModal && <DeleteModal handleClose={() => setDeleteModal(false)} onConfirm={onDelete} element={user} />}
  </>
}