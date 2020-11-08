// import { hot } from 'react-hot-loader/root'
import React from 'react'
import { observer } from "mobx-react"
import { Router, Switch, Route } from 'react-router-dom'

import history from '../history'

import HomePage from './HomePage'
import RoomPage from './RoomPage'
import ProfilePage from './ProfilePage'
import NotFoundPage from './NotFoundPage'

const App = observer(props => {
  return (
    <Router history={history} >
      <Switch>
        <Route exact path="/">
          <HomePage store={props.store} />
        </Route>

        <Route path="/profile">
          <ProfilePage store={props.store} />
        </Route>

        <Route path="/room/:id">
          <RoomPage store={props.store} />
        </Route>

        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </Router>
  )
})

// const App = observer(({ store }) => {
//   return (
//     <Switch>
//       <Route path="/profile" render={() => <ProfilePage />} />
//       <Route path="/room/:id" render={() => <RoomPage />} />
//       <Route path="/" render={() => <HomePage />} />
//     </Switch>
//   )
// })

// function App () {
//   return (
//     <Router history={history}>
//       <Switch>
//         <Route path="/profile">
//           <ProfilePage />
//         </Route>
//         <Route path="/room/:id">
//           <RoomPage />
//         </Route>
//         <Route path="/">
//           <HomePage />
//         </Route>
//       </Switch>
//     </Router>
//   )
// }

export default App