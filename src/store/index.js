import { routeStore } from '../history'
import GameStore from './gameStore'
import UserStore from './userStore'
import ChatStore from './chatStore'

class RootStore {
  constructor () {
    this.gameStore = new GameStore(this)
    this.userStore = new UserStore(this)
    this.chatStore = new ChatStore(this)

    this.routeStore = routeStore
  }
}

const rootStore = new RootStore()

export const gameStore = rootStore.gameStore
export const userStore = rootStore.userStore
export const chatStore = rootStore.chatStore

export default rootStore