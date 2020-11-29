import React from 'react'

function Cell (props) {
  return (
    <div className={'cell' + (props.bold ? ' bold' : '')}>{ props.children }</div>
  )
}

export default Cell