import { useContext } from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import {userContext} from '../Contexts/Contexts'

interface IPrivateRoute extends RouteProps {
  component: any,
  admin?: boolean
}

export const PrivateRoute = ({ component: Component, admin = false, ...rest }: IPrivateRoute) => {
const value = useContext(userContext);
if(value?.user && (admin === true && value.user.admin == false)) {
  return <Redirect to={{ pathname: '/part' }} />
}
  return (
    <Route
      {...rest}
      render={props => <>
        {value?.user ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )}
        </>
      }
    />
  )
}