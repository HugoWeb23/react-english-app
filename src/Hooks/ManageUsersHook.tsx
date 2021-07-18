import { useState, useEffect } from "react"
import { IUsers } from "../Types/Interfaces"
import { apiFetch } from "../Utils/Api"

interface IState {
    loading: boolean,
    users: IUsers[],
    totalPages: number,
    currentPage: number,
    elementsPerPage: number
}

export const ManageUsersHook = () => {
    const [state, setState] = useState<IState>({loading: false, users: [], totalPages: 1, currentPage: 1, elementsPerPage: 10})
   
    const FetchUsers = async(page: number = 1, limit: number = 10) => {
        setState(state => {
            return {...state, loading: true}
        })
        const FetchUsers = await apiFetch(`/api/users?page=${page}&limit=${limit}`);
        setState(state => {
            return {...state, loading: false, users: FetchUsers.allUsers, totalPages: FetchUsers.totalPages, currentPage: FetchUsers.currentPage, elementsPerPage: FetchUsers.elementsPerPage}
        })
    }

    return {
        loading: state.loading,
        users: state.users,
        totalPages: state.totalPages,
        currentPage: state.currentPage,
        elementsPerPage: state.elementsPerPage,
        GetAllUsers: async() => {
            await FetchUsers()
        },
        UpdateUser: async(olduser: IUsers, newuser: IUsers) => {
            const UpdateUser = await apiFetch('/api/user', {
                method: 'PUT',
                body: JSON.stringify(newuser)
            })
            setState(state => {
                return {...state, users: state.users.map(user => olduser == user ? UpdateUser : user)}
            })
        },
        DeleteUser: async(data: IUsers) => {
            const DeleteUser = await apiFetch(`/api/user/${data._id}`, {
                method: 'DELETE'
            })
            setState(state => {
                return {...state, users: state.users.filter(user => user != data)}
            })
        },
        ChangeLimit: async(limit: number) => {
            await FetchUsers(state.currentPage, limit)
        },
        ChangePage: async(page: number) => {
            await FetchUsers(page, state.elementsPerPage)
        }
    }
}