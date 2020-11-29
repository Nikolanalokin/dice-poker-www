import React from 'react'

function ChatMessage (props) {
  return (
    <div className="chat-message">
      <span className="chat-message__sender">{ props.sender }:</span>
      <span className="chat-message__text"> { props.message }</span>
    </div>
  )
}

export default ChatMessage