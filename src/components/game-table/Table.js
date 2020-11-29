import React from 'react'
import { observer } from "mobx-react-lite"

import ClickableCell from './ClickableCell'

import { TABLE_FIELDS } from '../../data/constants'

import { gameStore } from '../../store'

const Table = observer(() => {
  console.log(gameStore.allCombos)
  return (
    <div className="game-table">
      <div className="col">
        <div className="cell"></div>
        {
          TABLE_FIELDS.map(v => (
            <div className="cell bold" key={v.name}>{ v.ru }</div>
          ))
        }
      </div>
      {
        gameStore.tableData.map(tableColumn => {
          let isPlayingColumn = gameStore.currentUser.name == tableColumn.userName
          return (
            <div className="col" key={tableColumn.userName}>
              <div className="cell bold">{tableColumn.userName.slice(0, 2)}</div>
              {
                TABLE_FIELDS.map(v => {
                  let highlight = gameStore.isMyShot && isPlayingColumn && tableColumn.table.points[v.name] === null && gameStore.allCombos[v.name] !== undefined
                  let disabled = !gameStore.isMyShot || !isPlayingColumn || v.name == 'school_sum' || v.name == 'total' || tableColumn.table.points[v.name] !== null
                  let value = ''
                  if (isPlayingColumn) {
                    if (tableColumn.table.points[v.name] !== null) value = tableColumn.table.points[v.name]
                    else if (gameStore.allCombos[v.name] !== null) value = gameStore.allCombos[v.name]
                  } else {
                    if (tableColumn.table.points[v.name] !== null) value = tableColumn.table.points[v.name]
                  }
                  // console.log('cell:', isPlayingColumn, gameStore.isMyShot, disabled, value);
                  return (
                    <ClickableCell
                      key={v.name}
                      highlight={highlight}
                      disabled={disabled}
                      onClick={() => { gameStore.putPoint(v.name) }}>
                        { value }
                    </ClickableCell>
                  )
                })
              }
            </div>
          )
        })
      }
    </div>
  )
})

export default Table