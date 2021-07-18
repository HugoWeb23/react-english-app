import { createContext } from "react";
import {UserType} from '../Types/User'

export interface IUserContext {
user: UserType | null,
toggleUser: (user?: UserType) => void
}

export interface ISnackBarContext {
    notificationOpen: boolean,
    notificationMessage?: string | null,
    NotificationClose?: () => void,
    Open: () => void
}

export const userContext = createContext<IUserContext>({} as IUserContext);
export const SnackBarContext = createContext<any>({Open: () => {}})