import { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import { Container } from '../../UI/Container'
import { IUsers } from '../../Types/Interfaces'
import { apiFetch } from '../../Utils/Api'
import { ManageUsersHook } from '../../Hooks/ManageUsersHook'
import { Loader } from '../../UI/Loader'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import { ModalAccount } from '../../Accounts/ModalAccount'
import { AccountForm } from '../../Accounts/AccountForm'
import { DeleteModal } from '../../UI/DeleteModal'

export const ManageAccounts = () => {
    const {users, GetAllUsers, UpdateUser, DeleteUser} = ManageUsersHook()
    const [loader, setLoader] = useState<boolean>(true)

useEffect(() => {
    (async () => {
       await GetAllUsers()
       setLoader(false)
    })()
}, [])

return  <>
<Container>
<div className="d-flex justify-content-between align-items-center mb-2 mt-2">
<h1>Gestion des comptes</h1>
</div>
<Table striped bordered hover>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>E-mail</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loader && <Loader animation="border" variant="primary"/>}
              {users.map(user => <User user={user} onSubmit={UpdateUser} onDelete={DeleteUser}/>)}
            </tbody>
          </Table>
</Container>
</>
}

interface UserInterface {
    user: IUsers,
    onSubmit: (user: IUsers, data: IUsers) => Promise<void>,
    onDelete: (user: IUsers) => Promise<void>
}

const User = ({user, onSubmit, onDelete}: UserInterface) => {
    const [editModal, setEditModal] = useState<boolean>(false)
    const [deleteModal, setDeleteModal] = useState<boolean>(false)

    return <>
    <tr>
        <td>{user.nom}</td>
        <td>{user.prenom}</td>
        <td>{user.email}</td>
        <td>{user.admin ? 'Administrateur' : 'Utilisateur'}</td>
        <td><DropdownButton variant="info" title="Actions">
        <Dropdown.Item eventKey="1" onClick={() => setEditModal(true)}>Modifier</Dropdown.Item>
        <Dropdown.Item eventKey="2" onClick={() => setDeleteModal(true)}>Supprimer</Dropdown.Item>
      </DropdownButton></td>
    </tr>
    {editModal && <EditUser user={user} handleClose={() => setEditModal(false)} onSubmit={data => onSubmit(user, data)}/>}
    {deleteModal && <DeleteModal handleClose={() => setDeleteModal(false)} onConfirm={onDelete} element={user}/>}
    </>
}

interface IEditUser {
    user: IUsers,
    handleClose: () => void,
    onSubmit: (user: IUsers) => Promise<any>,
}

const EditUser = ({user, handleClose, onSubmit}: IEditUser) => {
    return <ModalAccount user={user} handleClose={handleClose} onSubmit={(user) => onSubmit(user)} type="edit">
        <AccountForm/>
    </ModalAccount>
}