import { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'
import {userContext} from '../Contexts/Contexts'

export const PrivateRoute = ({ component: Component, ...rest }) => {
const {user} = useContext(userContext);
if(user && user.admin == false) {
  return <Redirect to={{ pathname: '/acces_denied' }} />
}
  return (
    <Route
      {...rest}
      render={props => <>
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