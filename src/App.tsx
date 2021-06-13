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
import {ToastAlert} from './UI/Toast'
import {Part} from './Components/Part'
import {Play} from './Components/Game/Play'
import {UserType} from './Types/User'
import {Results} from './Components/Game/Results'
import {GameHistory} from './Components/GameHistory'
import {NotFound} from './Components/404'

export const App = () => {
  const [user, setUser] = useState<null | UserType>(null);
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

  const toggleUser = (user?: UserType) => {
    if(user === undefined) {
      setUser(null)
    } else {
      setUser(user)
    }
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

  const LoginRouter = () => {
    if(!user) {
     return <Login onConnect={toggleUser}/>
    } else if(user.admin === false) {
      return <Redirect to="/part"/>
    } else if(user.admin === true) {
      return <Redirect to="/questions"/>
    }
  }

return loading ? <UserLoader/> :
<>
  <Router>
  <userContext.Provider value={value}>
  <ToastAlert/>
  <Switch>
  <Route path="/play/:id" component={Play}/>
  <PrivateRoute path="/part" exact component={Part} admin={false}/>
  <Route path="/404" component={NotFound}/>
  <Route path="/*" component={Navigation}/>
  </Switch>
  <div className="container-md">
  <Switch>
  <Route exact path="/">
  <Redirect to="/part" />
  </Route>
  <PrivateRoute path="/questions" component={Questions} admin={true}/>
  <PrivateRoute path="/themes" component={Themes} admin={true}/>
  <PrivateRoute path="/test" component={Test} admin={true}/>
  <Route path="/login">
    {LoginRouter}
  </Route>
  <Route path="/register">{user ? <Redirect to="/part"/> : <Register onConnect={toggleUser}/>}</Route>
  <PrivateRoute path="/results/:id" exact component={Results} admin={false}/>
  <PrivateRoute path="/gamehistory" exact component={GameHistory} admin={false}/>
  </Switch>
  </div>
  </userContext.Provider>
</Router>
</>
}
