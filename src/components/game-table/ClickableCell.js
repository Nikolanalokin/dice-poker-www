import React from 'react'

function ClickableCell (props) {
  return (
    <button className={'clickable-cell' + (props.highlight ? ' is-highlight' : '')} disabled={props.disabled} onClick={props.onClick}>{ props.children }</button>
  )
}

export default ClickableCell