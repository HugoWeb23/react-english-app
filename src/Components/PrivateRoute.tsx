import { useContext } from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { userContext } from '../Contexts/Contexts'
import { PublicNavigation } from '../Components/PublicNavigation'
import { Navigation } from '../Components/Navigation'

interface IPrivateRoute extends RouteProps {
  component: any,
  admin?: boolean,
  navigation?: string
}

export const PrivateRoute = ({ component: Component, admin = false, navigation = "none", ...rest }: IPrivateRoute) => {
  const value = useContext(userContext);
  if (value?.user && (admin === true && value.user.admin == false)) {
    return <Redirect to={{ pathname: '/part' }} />
  }

  return (
    <Route
      {...rest}
      render={props => <>
        {value?.user ?
          <>
            {navigation == 'public' &&
              <PublicNavigation>
                <Component {...props} />
              </PublicNavigation> 
            }
            {navigation == 'admin' &&
                <Navigation>
                <Component {...props} />
                </Navigation>
            }
            {navigation == 'none' &&
            <Component {...props}/>
            }
          </>
          :
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }
      </>
      }
    />
  )
}