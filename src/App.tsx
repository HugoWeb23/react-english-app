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

export const App = () => {
  const [user, setUser] = useState<null | UserType>(null);
  const [loading, setLoading] = useState(true);
  const [alertDisconnect, setAlertDisconnect] = useState(false)
  console.log(user)
  useEffect(() => {
    (async() => {
      const user = await apiFetch('/api/user', {
        method: 'GET'
      })
      setUser(user);
      setLoading(false)
    })()
  }, [])

  const toggleUser = (user: UserType) => {
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
  <ToastAlert/>
  <Switch>
  <Route path="/play" component={Play}/>
  <Route path="/*" component={Navigation}/>
  </Switch>
  <div className="container-md">
  <PrivateRoute path="/part" exact component={Part}/>
  <PrivateRoute path="/questions" component={Questions}/>
  <PrivateRoute path="/themes" component={Themes}/>
  <PrivateRoute path="/test" component={Test}/>
  <Route path="/login">{user ? <Redirect to="/questions"/> : <Login onConnect={toggleUser}/>}</Route>
  <Route path="/register">{user ? <Redirect to="/questions"/> : <Register onConnect={toggleUser}/>}</Route>
  <Route path="/results/:id" exact component={Results}/>
  <Route path="/gamehistory" exact component={GameHistory}/>
  </div>
  </userContext.Provider>
</Router>
</>
}
