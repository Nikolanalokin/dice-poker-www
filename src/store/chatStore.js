import { makeAutoObservable, runInAction } from 'mobx'

import socket from '../services/socket'

export default class ChatStore {
  rootStore = undefined
  messages = []

  constructor (rootStore) {
    makeAutoObservable(this, { rootStore: false })

    this.rootStore = rootStore

    socket.on('chat:received message', (data) => {
      this.addMessage(data)
    })
  }

  sendMessage (text) {
    socket.emit('chat:send message', {
      sender: this.rootStore.userStore.user.name,
      message: text
    }, (res) => {
      let response = JSON.parse(res)
      console.log('[socket:emit:chat:send message]', response)
    })
  }

  addMessage (data) {
    this.messages.push(data)
  }

  clearMessages () {
    this.messages = []
  }
}