import React from 'react'
import { observer } from "mobx-react-lite"

import { gameStore, userStore } from '../../store'

import Header from '../layout/Header'
import Dice from '../dice/Dice'
import Table from '../game-table/Table'
import Chat from '../chat/Chat'

const RoomPage = observer(() => {
  return gameStore.roomData && (
    <div className="page">
      <Header
        left={<button className="button button--flat" onClick={() => gameStore.leaveRoom()}>Покинуть комнату</button>}
        title="Игра"
        right={userStore.user.name} />

      <main className="main">
        <div className="room-info-container">
          <div className="list">
            <div className="item">
              <span>Название комнаты: <b>{gameStore.roomData.name}</b></span>
            </div>
            <div className="item">
              <span>Игроки ({gameStore.roomData.users.length}): <b>{
                gameStore.roomData.users.map((v, i) => (
                  <span key={v.id}>{v.name + (i < gameStore.roomData.users.length - 1 ? ', ' : '')}</span>
                ))
              }</b></span>
            </div>
          </div>
        </div>
        {
          !gameStore.roomData.started
          ? <button className="button button--primary button--block" onClick={() => gameStore.startGame()}>Начать игру</button>
          : <div className="game-container">
            <div className="board-container">
              <div className="board-container__wrap">
                {
                  gameStore.roomData.finished
                  ? <span className="board-container__text">Игра окончена, победитель: <b className="c-primary">{gameStore.roomData.users.find(v => v.id == gameStore.roomData.winnerUserId).name}</b></span>
                  : gameStore.isMyShot
                  ? <span className="board-container__text c-primary">Ваш ход</span>
                  : <span className="board-container__text">Бросает {gameStore.currentUser ? <b>{gameStore.currentUser.name}</b> : ''}</span>
                }
              </div>
            </div>
            {
              !gameStore.roomData.finished && <div className="shot-container">
                <div className="shot-title">Бросок: <b>{gameStore.serial}</b></div>
                {
                  gameStore.isMyShot && <button className="button button--flat" onClick={() => gameStore.makeShot()} disabled={gameStore.serial === 3}>{
                    !gameStore.shotData || gameStore.shotData.filter(v => v.selected).length > 0 ? 'Сделать бросок' : 'Перебросить всё'
                  }</button>
                }
              </div>
            }
            {
              gameStore.hasData && !gameStore.roomData.finished && <div className="dice-container">
                <div className="dice-container__title">Бросок</div>
                <div className="dice-container__block">
                  {
                    gameStore.shotData.filter(v => !v.selected).map(v => (
                      <Dice key={v.index} value={v.value} selectable={gameStore.isMyShot && gameStore.serial !== 3} onClick={() => gameStore.toggleHoldDice(v.index)} />
                    ))
                  }
                </div>
                <div className="dice-container__title">Переброс</div>
                <div className="dice-container__block">
                  {
                    gameStore.shotData.filter(v => v.selected).map(v => (
                      <Dice key={v.index} value={v.value} selectable={gameStore.isMyShot && gameStore.serial !== 3} onClick={() => gameStore.toggleHoldDice(v.index)} />
                    ))
                  }
                </div>
              </div>
            }
            { gameStore.tableData && <Table /> }
            <Chat />
          </div>
        }
      </main>
    </div>
  )
})

export default RoomPage