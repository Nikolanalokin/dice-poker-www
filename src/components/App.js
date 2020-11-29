// import { hot } from 'react-hot-loader/root'
import React from 'react'
import { observer } from "mobx-react-lite"
import { Router, Switch, Route } from 'react-router-dom'

import history from '../history'

import HomePage from './pages/HomePage'
import RoomPage from './pages/RoomPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

const App = observer(() => {
  return (
    <Router history={history} >
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>

        <Route path="/profile">
          <ProfilePage />
        </Route>

        <Route path="/room/:id">
          <RoomPage />
        </Route>

        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </Router>
  )
})

export default App