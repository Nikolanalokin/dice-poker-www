import React from 'react'
import { observer } from 'mobx-react-lite'

import { chatStore } from '../../store'
import ChatMessage from './ChatMessage'
import FormChatInputMessage from './FormChatInputMessage'

const Chat = observer(() => {
  return (
    <div className="chat-container">
      <div className="chat-messages-wrap">
        {
          chatStore.messages.map(v => (
            <ChatMessage key={v.id} sender={v.sender} message={v.message} />
          ))
        }
      </div>
      <div className="chat-input-wrap">
        <FormChatInputMessage />
      </div>
    </div>
  )
})

export default Chat