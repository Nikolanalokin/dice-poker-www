import React from 'react'
import { render } from 'react-dom'
import App from './components/App'
import store from './store'
import './services/socket'

import './scss/index.scss'

render(<App store={store} />, document.getElementById('root'))