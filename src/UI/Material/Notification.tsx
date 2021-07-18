import {useContext} from 'react'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import {
  Snackbar
} from '@material-ui/core'
import {ISnackBarContext} from '../../Contexts/Contexts'
import { SnackBarContext } from '../../Contexts/Contexts';

export const Notification = ({open, message = "C'est fait !"}: any) => {
    const value = useContext(SnackBarContext);
    return <Snackbar open={open} autoHideDuration={6000} onClose={value.NotificationClose}>
        <MuiAlert elevation={6} variant="filled"onClose={value.NotificationClose} severity="success">
          {message}
        </MuiAlert>
        </Snackbar>
}