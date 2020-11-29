import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'

import { gameStore } from '../../store'

const FormCreateRoom = observer(() => {
  const [value, setValue] = useState('')

  let handleSubmit = (event) => {
    gameStore.createRoom(value)
    setValue('')
    event.preventDefault()
  }
  let handleChange = (event) => {
    setValue(event.target.value)
  }

  return (
    <form className="form-create-room" onSubmit={handleSubmit}>
      <div className="input">
        <div className="input-label">Название комнаты</div>
        <input className="input-native" type="text" placeholder="Введите название" value={value} onChange={handleChange} />
      </div>
      <button className="button button--primary" type="submit">Создать комнату</button>
    </form>
  )
})

export default FormCreateRoom