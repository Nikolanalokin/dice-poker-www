import React from 'react'
import { observer } from "mobx-react"

import store from '../store'

import Header from './Header'
import Dice from './Dice'
import Table from './Table'

const RoomPage = observer(() => {
  return store.roomData && (
    <div className="page">
      <Header
        left={<button className="button button--flat" onClick={() => store.leaveRoom()}>Покинуть комнату</button>}
        title="Игра"
        right={store.userData.name} />

      <main className="main">
        <div className="room-info-container">
          <div className="list">
            <div className="item">
              <span>Название комнаты: <b>{store.roomData.name}</b></span>
            </div>
            <div className="item">
              <span>Игроки ({store.roomData.users.length}): <b>{
                store.roomData.users.map((v, i) => (
                  <span key={v.id}>{v.name + (i < store.roomData.users.length - 1 ? ', ' : '')}</span>
                ))
              }</b></span>
            </div>
          </div>
        </div>
        {
          !store.roomData.started 
          ? <button className="button button--primary button--block" onClick={() => store.startGame()}>Начать игру</button>
          : <div className="game-container">
            <div className="board-container">
              <div className="board-container__wrap">
                {
                  store.roomData.finished
                  ? <span className="board-container__text">Игра окончена, победитель: <b className="c-primary">{store.roomData.users.find(v => v.id == store.roomData.winnerUserId).name}</b></span>
                  : store.isMyShot
                  ? <span className="board-container__text c-primary">Ваш ход</span>
                  : <span className="board-container__text">Бросает {store.currentUser ? <b>{store.currentUser.name}</b> : ''}</span>
                }
              </div>
            </div>
            {
              !store.roomData.finished && <div className="shot-container">
                <div className="shot-title">Бросок: <b>{store.serial}</b></div>
                {
                  store.isMyShot && <button className="button button--flat" onClick={() => store.makeShot()} disabled={store.serial === 3}>{
                    !store.shotData || store.shotData.filter(v => v.selected).length > 0 ? 'Сделать бросок' : 'Перебросить всё'
                  }</button>
                }
              </div>
            }
            {
              store.hasData && !store.roomData.finished && <div className="dice-container">
                <div className="dice-container__title">Бросок</div>
                <div className="dice-container__block">
                  {
                    store.shotData.filter(v => !v.selected).map(v => (
                      <Dice key={v.index} value={v.value} selectable={store.isMyShot && store.serial !== 3} onClick={() => store.toggleHoldDice(v.index)} />
                    ))
                  }
                </div>
                <div className="dice-container__title">Переброс</div>
                <div className="dice-container__block">
                  {
                    store.shotData.filter(v => v.selected).map(v => (
                      <Dice key={v.index} value={v.value} selectable={store.isMyShot && store.serial !== 3} onClick={() => store.toggleHoldDice(v.index)} />
                    ))
                  }
                </div>
              </div>
            }
            { store.tableData && <Table store={store} /> }
          </div>
        }
      </main>
    </div>
  )
})

export default RoomPage