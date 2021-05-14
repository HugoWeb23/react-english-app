import { createContext } from "react";
import {UserType} from '../Types/User'

export interface IUserContext {
user: UserType | null,
alertDisconnect: boolean,
toggleUser: (user: UserType) => void,
toggleAlert: () => void
}

export const userContext = createContext<null | IUserContext>(null);