import { makeAutoObservable, makeObservable, observable, action, computed, runInAction } from 'mobx'

import socket from '../services/socket'

export default class GameStore {
  rootStore = undefined
  rooms = []
  userData = {}
  roomData
  shotData
  comboData
  tableData
  serial = 0

  get hasData () {
    return this.shotData && this.comboData
  }

  get allCombos () {
    if (!this.hasData) return {}
    let obj = {}
    this.comboData.forEach(v => {
      obj[v.name] = v.points
    })
    return obj
  }

  get currentUser () {
    return this.roomData && this.roomData.users[this.roomData.currentUserIndex]
  }

  get isMyShot () {
    return this.currentUser && this.currentUser.id === this.rootStore.userStore.user.id
  }

  constructor (rootStore) {
    makeAutoObservable(this, { rootStore: false })

    this.rootStore = rootStore

    socket.on('disconnect', () => {
      console.log('[socket:on:disconnect]')
      this.rootStore.routeStore.replace('/')
      this.clearGame()
    })
    
    socket.on('get rooms', (rooms) => {
      console.log('[socket:on:get rooms]', rooms)
      this.setRooms(rooms)
    })
    socket.on('started', (room, table) => {
      console.log('[socket:on:started]', room, table)
      this.setCurrentRoom(room)
      this.setTableData(table)
    })
    socket.on('made shot', (data) => {
      console.log('[socket:on:made shot]', data)
      this.setShotData(data)
    })
    socket.on('selected dice', (shotData) => {
      console.log('[socket:on:selected dice]', shotData)
      this.setDiceSelectedState(shotData)
    })
    socket.on('put point', (table) => {
      console.log('[socket:on:put point]', table)
      this.setTableData(table)
      this.setShotData(null)
    })

    socket.on('joined room', (room) => {
      console.log('[socket:on:joined room]', room)
      this.setCurrentRoom(room)
    })
    socket.on('left room', (room) => {
      console.log('[socket:on:left room]', room)
      this.setCurrentRoom(room)
    })
    socket.on('end', (room, table) => {
      console.log('[socket:on:end]', table)
      this.setCurrentRoom(room)
      this.setTableData(table)
    })
    socket.on('update room', (room) => {
      console.log('[socket:on:update room]', room)
      this.setCurrentRoom(room)
    })
  }

  setRooms (value) {
    console.log('setRooms', ...arguments)
    this.rooms = value || []
  }

  setCurrentRoom (value) {
    console.log('setCurrentRoom', ...arguments)
    this.roomData = value
  }

  setShotData (data) {
    console.log('setShotData', ...arguments)
    this.shotData = data && data.shotData || null
    this.comboData = data && data.comboData || null
    this.serial = data && data.serial || 0
  }

  setTableData (data) {
    console.log('setTableData', ...arguments)
    this.tableData = data
  }

  setDiceSelectedState (data) {
    console.log('setDiceSelectedState', ...arguments)
    this.shotData = data
  }

  createRoom (name) {
    console.log('createRoom', ...arguments)
    socket.emit('create room', name, (res) => {
      let { ok, data } = JSON.parse(res)
      console.log('[socket:emit:create room]', data)
    })
  }

  joinRoom (id) {
    console.log('joinRoom', ...arguments)
    socket.emit('join room', id, (res) => {
      let response = JSON.parse(res)
      console.log('[socket:emit:join room]', response)
      if (response.ok) {
        this.setCurrentRoom(response.data)
        this.rootStore.routeStore.push(`/room/${response.data.id}`)
      }
    })
  }

  leaveRoom () {
    console.log('leaveRoom')
    socket.emit('leave room', (res) => {
      let { ok } = JSON.parse(res)
      console.log('[socket:emit:leave room]', ok)
      if (ok) {
        this.rootStore.routeStore.replace('/')
        this.clearGame()
      }
    })
  }

  clearGame () {
    this.setCurrentRoom(null)
    this.setShotData(null)
    this.setTableData(null)
    this.rootStore.chatStore.clearMessages(null)
  }

  startGame () {
    console.log('startGame')
    socket.emit('start', (res) => {
      let { ok } = JSON.parse(res)
      console.log('[socket:emit:start]', ok)
    })
  }

  makeShot () {
    console.log('makeShot')
    socket.emit('make shot', (res) => {
      let response = JSON.parse(res)
      console.log('[socket:emit:make shot]', response)
    })
  }
  
  toggleHoldDice (i) {
    if (this.serial < 3) {
      this.shotData[i].selected = !this.shotData[i].selected
      socket.emit('select dice', this.shotData, (res) => {
        let response = JSON.parse(res)
        console.log('[socket:emit:select dice]', response)
      })
    }
  }

  putPoint (name) {
    console.log('putPoint', ...arguments)
    socket.emit('put point', name, (res) => {
      let response = JSON.parse(res)
      console.log('[socket:emit:put point]', response)
    })
  }
}