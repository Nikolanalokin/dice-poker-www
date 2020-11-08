import { createBrowserHistory } from 'history'
import { observable, reaction, makeAutoObservable, makeObservable, autorun, action } from 'mobx'

class RouteStore {
  history
  location
  
  constructor () {
    makeObservable(this, {
      location: observable,
      _updateLocation: action
    })
  }

  _updateLocation (newState) {
    this.location = newState
  }
  
  push (location, state) {
    this.history.push(location, state)
  }
  replace (location, state) {
    this.history.replace(location, state)
  }
  go (n) {
    this.history.go(n)
  }
  back () {
    this.history.goBack()
  }
  forward () {
    this.history.goForward()
  }
}

function syncHistoryWithStore (history, store) {
  // Initialise store
  store.history = history

  // Handle update from history object
  const handleLocationChange = (location) => {
    store._updateLocation(location)
  }

  const unsubscribeFromHistory = history.listen(handleLocationChange)
  handleLocationChange(history.location)

  const subscribe = (listener) => {
    const onStoreChange = () => {
      const rawLocation = { ...store.location }
      listener(rawLocation, history.action)
    }

    // Listen for changes to location state in store
    const unsubscribeFromStore = observe(store, 'location', onStoreChange)

    listener(store.location, history.action)

    return unsubscribeFromStore
  }

  history.subscribe = subscribe
  history.unsubscribe = unsubscribeFromHistory

  return history
}

const browserHistory = createBrowserHistory({
  basename: BASE_URL
})

export const routeStore = new RouteStore(browserHistory)

const history = syncHistoryWithStore(browserHistory, routeStore)

console.log('routeStore:', routeStore)
console.log('history:', history)

// autorun(() => {
//   console.log('current pathname:', routeStore.location.pathname);
// })

reaction(
  () => routeStore.location.pathname,
  (pathname) => {
    console.log('current pathname:', pathname);
  }
)

export default history