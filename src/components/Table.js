import React from 'react'
import { observer } from "mobx-react"

import ClickableCell from './ClickableCell'

import { TABLE_FIELDS } from '../data/constants'

const Table = observer(({ store }) => {
  console.log(store.allCombos)
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
        store.tableData.map(tableColumn => {
          let isPlayingColumn = store.currentUser.name == tableColumn.userName
          return (
            <div className="col" key={tableColumn.userName}>
              <div className="cell bold">{tableColumn.userName.slice(0, 2)}</div>
              {
                TABLE_FIELDS.map(v => {
                  let highlight = store.isMyShot && isPlayingColumn && tableColumn.table.points[v.name] === null && store.allCombos[v.name] !== undefined
                  let disabled = !store.isMyShot || !isPlayingColumn || v.name == 'school_sum' || v.name == 'total' || tableColumn.table.points[v.name] !== null
                  let value = ''
                  if (isPlayingColumn) {
                    if (tableColumn.table.points[v.name] !== null) value = tableColumn.table.points[v.name]
                    else if (store.allCombos[v.name] !== null) value = store.allCombos[v.name]
                  } else {
                    if (tableColumn.table.points[v.name] !== null) value = tableColumn.table.points[v.name]
                  }
                  // console.log('cell:', isPlayingColumn, store.isMyShot, disabled, value);
                  return (
                    <ClickableCell
                      key={v.name}
                      highlight={highlight}
                      disabled={disabled}
                      onClick={() => { store.putPoint(v.name) }}>
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