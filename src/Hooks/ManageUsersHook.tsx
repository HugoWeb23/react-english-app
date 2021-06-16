import { useState } from "react"
import { IUsers } from "../Types/Interfaces"
import { apiFetch } from "../Utils/Api"

export const ManageUsersHook = () => {
    const [users, setUsers] = useState<IUsers[]>([])

    return {
        users,
        GetAllUsers: async() => {
            const FetchUsers = await apiFetch('/api/users');
            setUsers(FetchUsers)
        },
        UpdateUser: async(olduser: IUsers, newuser: IUsers) => {
            setUsers(users => users.map(user => olduser == user ? newuser : user))
        },
        DeleteUser: async(data: IUsers) => {
            setUsers(users => users.filter(user => user != data))
        }
    }
}