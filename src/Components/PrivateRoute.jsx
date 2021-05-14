import { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'
import {userContext} from '../Contexts/Contexts'

export const PrivateRoute = ({ component: Component, ...rest }) => {
const {user} = useContext(userContext);
  return (
    <Route
      {...rest}
      render={props => <>
      {user && user.admin == false && <Redirect to={{ pathname: '/acces_denied', state: { from: props.location } }} />}
        {user ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )}
        </>
      }
    />
  )
}