import { useCallback, useEffect, useMemo, useState } from "react"
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { Navigation } from "./Components/Navigation"
import {userContext} from './Contexts/Contexts'
import {UserLoader} from './Loaders/UserLoader'
import {Login} from './Components/Login'
import {Register} from './Components/Register'
import {PrivateRoute} from './Components/PrivateRoute'
import {Questions} from './Components/Questions'
import {apiFetch} from './Utils/Api'

export const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const value = useMemo(() => {
    return {
      user,
      toggleUser
    }
  }, [user, toggleUser])

return loading ? <UserLoader/> :
<>
  <Router>
  <userContext.Provider value={value}>
  <Navigation/>
  <PrivateRoute path="/questions" component={Questions}/>
  <Route path="/login">{user ? <Redirect to="/questions"/> : <Login onConnect={toggleUser}/>}</Route>
  <Route path="/register">{user ? <Redirect to="/questions"/> : <Register onConnect={toggleUser}/>}</Route>
  </userContext.Provider>
</Router>
</>
}
