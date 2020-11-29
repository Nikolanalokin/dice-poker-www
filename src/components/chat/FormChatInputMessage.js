import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'

import { chatStore } from '../../store'

const FormChatInputMessage = observer(() => {
  const [value, setValue] = useState('')

  let handleSubmit = (event) => {
    chatStore.sendMessage(value)
    setValue('')
    event.preventDefault()
  }
  let handleChange = (event) => {
    setValue(event.target.value)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="input">
        <input className="input-native" type="text" placeholder="Введите сообщение" value={value} onChange={handleChange} />
      </div>
      {/* <button className="button button--primary" type="submit">Отправить</button> */}
    </form>
  )
})

export default FormChatInputMessage