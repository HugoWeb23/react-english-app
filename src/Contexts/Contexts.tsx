import { createContext } from "react";
import {UserType} from '../Types/User'

export interface IUserContext {
user: UserType | null,
alertDisconnect: boolean,
toggleUser: (user?: UserType) => void
}

export const userContext = createContext<IUserContext>({} as IUserContext);