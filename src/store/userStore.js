import { makeAutoObservable, runInAction } from 'mobx'

import socket from '../services/socket'

export default class UserStore {
  rootStore = undefined
  user = {}

  constructor (rootStore) {
    makeAutoObservable(this, { rootStore: false })

    this.rootStore = rootStore

    socket.on('get user', (data) => {
      console.log('[socket:on:get user]', data)
      this.setUser(data)
    })
  }

  setUser (value) {
    console.log('setUserData', ...arguments)
    this.user = value || {}
  }
}