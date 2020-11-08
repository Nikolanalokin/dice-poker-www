import React from 'react'
import { render } from 'react-dom'
import App from './components/App'
import store from './store'

import { routeStore } from './history'

let stores = { store, routeStore }

import './scss/index.scss'

render(<App {...stores} />, document.getElementById('root'))