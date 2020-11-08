import { makeAutoObservable, makeObservable, observable, action, computed, runInAction } from 'mobx'
import io from 'socket.io-client'

import { routeStore } from '../history'

class Store {
  _socket
  router
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
    return this.currentUser && this.currentUser.id === this.userData.id
  }

  constructor (routeStore) {
    // makeObservable(this, {
    //   rooms: observable,
    //   shotData: observable,
    //   comboData: observable,
    //   serial: observable,
    //   tableData: observable,
    //   setRooms: action,
    //   createRoom: action,
    //   setShotData: action,
    //   toggleHoldDice: action,
    //   setDiceSelectedState: action,
    //   setTableData: action,
    //   hasData: computed,
    //   allCombos: computed,
    // })
    makeAutoObservable(this)

    this.router = routeStore

    this._socket = io('localhost:3000')
    this._socket.on('connect', () => {
      console.log('[socket:on:connect]')
    })
    this._socket.on('disconnect', () => {
      console.log('[socket:on:disconnect]')
      this.router.replace('/')
      this.setCurrentRoom(null)
      this.setShotData(null)
      this.setTableData(null)
    })
    
    this._socket.on('get user', (user) => {
      console.log('[socket:on:get user]', user)
      this.setUserData(user)
    })
    this._socket.on('get rooms', (rooms) => {
      console.log('[socket:on:get rooms]', rooms)
      this.setRooms(rooms)
    })
    this._socket.on('started', (room, table) => {
      console.log('[socket:on:started]', room, table)
      this.setCurrentRoom(room)
      this.setTableData(table)
    })
    this._socket.on('made shot', (data) => {
      console.log('[socket:on:made shot]', data)
      this.setShotData(data)
    })
    this._socket.on('selected dice', (shotData) => {
      console.log('[socket:on:selected dice]', shotData)
      this.setDiceSelectedState(shotData)
    })
    this._socket.on('put point', (table) => {
      console.log('[socket:on:put point]', table)
      this.setTableData(table)
      this.setShotData(null)
    })

    this._socket.on('joined room', (room) => {
      console.log('[socket:on:joined room]', room)
      this.setCurrentRoom(room)
    })
    this._socket.on('left room', (room) => {
      console.log('[socket:on:left room]', room)
      this.setCurrentRoom(room)
    })
    this._socket.on('end', (room, table) => {
      console.log('[socket:on:end]', table)
      this.setCurrentRoom(room)
      this.setTableData(table)
    })
    this._socket.on('update room', (room) => {
      console.log('[socket:on:update room]', room)
      this.setCurrentRoom(room)
    })
  }

  setUserData (value) {
    console.log('setUserData', ...arguments)
    this.userData = value || {}
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
    this._socket.emit('create room', name, (res) => {
      let { ok, data } = JSON.parse(res)
      console.log('[socket:emit:create room]', data)
    })
  }

  joinRoom (id) {
    console.log('joinRoom', ...arguments)
    this._socket.emit('join room', id, (res) => {
      let response = JSON.parse(res)
      console.log('[socket:emit:join room]', response)
      if (response.ok) {
        this.setCurrentRoom(response.data)
        this.router.push(`/room/${response.data.id}`)
      }
    })
  }

  leaveRoom () {
    console.log('leaveRoom')
    this._socket.emit('leave room', (res) => {
      let { ok } = JSON.parse(res)
      console.log('[socket:emit:leave room]', ok)
      if (ok) {
        this.router.replace('/')
        this.setCurrentRoom(null)
        this.setShotData(null)
        this.setTableData(null)
      }
    })
  }

  startGame () {
    console.log('startGame')
    this._socket.emit('start', (res) => {
      let { ok } = JSON.parse(res)
      console.log('[socket:emit:start]', ok)
    })
  }

  makeShot () {
    console.log('makeShot')
    this._socket.emit('make shot', (res) => {
      let response = JSON.parse(res)
      console.log('[socket:emit:make shot]', response)
    })
  }
  
  toggleHoldDice (i) {
    if (this.serial < 3) {
      this.shotData[i].selected = !this.shotData[i].selected
      this._socket.emit('select dice', this.shotData, (res) => {
        let response = JSON.parse(res)
        console.log('[socket:emit:select dice]', response)
      })
    }
  }

  putPoint (name) {
    console.log('putPoint', ...arguments)
    this._socket.emit('put point', name, (res) => {
      let response = JSON.parse(res)
      console.log('[socket:emit:put point]', response)
    })
  }
}

const store = new Store(routeStore)

export default store