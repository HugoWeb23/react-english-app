import { useCallback, useEffect, useMemo, useState } from "react"
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { Navigation } from "./Components/Navigation"
import {userContext} from './Contexts/Contexts'
import {UserLoader} from './Loaders/UserLoader'
import {Login} from './Components/Login'
import {Test} from './Components/Test'
import {Register} from './Components/Register'
import {PrivateRoute} from './Components/PrivateRoute'
import {Questions} from './Components/Admin/Questions'
import {Themes} from './Components/Admin/Themes'
import {apiFetch} from './Utils/Api'
import {Part} from './Components/Part'
import {Play} from './Components/Game/Play'
import {UserType} from './Types/User'
import {Results} from './Components/Game/Results'
import {GameHistory} from './Components/GameHistory'
import {NotFound} from './Components/404'
import { Profile } from "./Components/Profile"
import { ManageAccounts } from "./Components/Admin/ManageAccounts"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const App = () => {
  const [user, setUser] = useState<null | UserType>(null);
  const [loading, setLoading] = useState(true);
  const [alertDisconnect, setAlertDisconnect] = useState(false)
  useEffect(() => {
    (async() => {
      try {
        const user = await apiFetch('/api/user', {
          method: 'GET'
        })
        setUser(user);
      } catch(e) {
        setUser(null)
      }
      setLoading(false)
    })()
  }, [])

  const toggleUser = (user?: UserType) => {
    if(user === undefined) {
      setUser(null)
    } else {
      setUser(user)
    }
  }

  const value = useMemo(() => {
    return {
      user,
      alertDisconnect,
      loading,
      toggleUser
    }
  }, [user, toggleUser])

return loading ? <UserLoader/> :
<>
  <Router>
  <userContext.Provider value={value}>
  <ToastContainer autoClose={2500}/>
  <PrivateRoute path="/play/:id" component={Play} navigation="none"/>
  <PrivateRoute path="/part" exact component={Part} admin={false} navigation="public"/>
  <Route path="/404" component={NotFound}/>
  <Route exact path="/">
  <Redirect to="/part" />
  </Route>
  <PrivateRoute path="/questions" component={Questions} admin={true} navigation="admin"/>
  <PrivateRoute path="/themes" component={Themes} admin={true} navigation="admin"/>
  <PrivateRoute path="/manageaccounts" component={ManageAccounts} admin={true} navigation="admin"/>
  <PrivateRoute path="/test" component={Test} admin={true} navigation="admin"/>
  <Route path="/login">{user ? <Redirect to="/part"/> : <Login onConnect={toggleUser}/>}</Route>
  <Route path="/register">{user ? <Redirect to="/part"/> : <Register onConnect={toggleUser}/>}</Route>
  <PrivateRoute path="/results/:id" exact component={Results} admin={false} navigation="public"/>
  <PrivateRoute path="/gamehistory" exact component={GameHistory} admin={false} navigation="public"/>
  <PrivateRoute path="/profile" exact component={Profile} admin={false} navigation="public"/>
  </userContext.Provider>
</Router>
</>
}
