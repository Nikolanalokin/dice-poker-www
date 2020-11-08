import React from 'react'
import { observer } from "mobx-react"

import {
  Link
} from "react-router-dom"

import store from '../store'

import Header from './Header'
import FormCreateRoom from './FormCreateRoom'

const HomePage = observer(() => {

  let getStatus = (room) => {
    if (room.finished) return 'закончилась'
    else if (room.started) return 'началась'
    else if (room.filled) return 'заполнена'
    else return 'ожидает игроков'
  }

  return (
    <div className="page">
      <Header
        title="Dice Poker"
        right={<Link to="/profile" className="button button--flat">Профиль: {store.userData.name}</Link>} />

      <main className="main">
        <FormCreateRoom createRoom={store.createRoom} />
        {
          store.rooms.length > 0 && <div className="block">
            <div className="room-list">
              {
                store.rooms.map(v => (
                  <div className="room-list-item" key={v.id} onClick={() => store.joinRoom(v.id)}>
                    <div className="room-list-item__meta">Название: <b>{v.name}</b></div>
                    <div className="room-list-item__meta">Игроков: <b>{v.users.length}/{v.maxUsers}</b></div>
                    <div className="room-list-item__meta">Статус: <b>{getStatus(v)}</b></div>
                  </div>
                ))
              }
            </div>
          </div>
        }
      </main>
    </div>
  )
})

export default HomePage