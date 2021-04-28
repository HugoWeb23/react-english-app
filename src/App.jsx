import { useCallback, useEffect, useMemo, useState } from "react"
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { Navigation } from "./Components/Navigation"
import {userContext} from './Contexts/Contexts'
import {UserLoader} from './Loaders/UserLoader'
import {Login} from './Components/Login'
import {Test} from './Components/Test'
import {Register} from './Components/Register'
import {PrivateRoute} from './Components/PrivateRoute'
import {Questions} from './Components/Questions'
import {apiFetch} from './Utils/Api'
import {ToastAlert} from './UI/Toast'

export const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertDisconnect, setAlertDisconnect] = useState(false)

  useEffect(() => {
    (async() => {
      const user = await apiFetch('/api/user', {
        method: 'GET'
      })
      setUser(user);
      setLoading(false)
    })()
  }, [])

  const toggleUser = (user) => {
    setUser(user)
  }

  const toggleAlert = () => {
    setAlertDisconnect(!alertDisconnect)
  }

  const value = useMemo(() => {
    return {
      user,
      alertDisconnect,
      toggleUser,
      toggleAlert
    }
  }, [user, toggleUser])

return loading ? <UserLoader/> :
<>
  <Router>
  <userContext.Provider value={value}>
  <Navigation/>
  <ToastAlert/>
  <div className="container-md">
  <PrivateRoute path="/questions" component={Questions}/>
  <PrivateRoute path="/test" component={Test}/>
  <Route path="/login">{user ? <Redirect to="/questions"/> : <Login onConnect={toggleUser}/>}</Route>
  <Route path="/register">{user ? <Redirect to="/questions"/> : <Register onConnect={toggleUser}/>}</Route>
  </div>
  </userContext.Provider>
</Router>
</>
}
