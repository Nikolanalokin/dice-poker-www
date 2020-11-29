import React from 'react'

import dice_1 from '../../assets/img/dice_1.svg'
import dice_2 from '../../assets/img/dice_2.svg'
import dice_3 from '../../assets/img/dice_3.svg'
import dice_4 from '../../assets/img/dice_4.svg'
import dice_5 from '../../assets/img/dice_5.svg'
import dice_6 from '../../assets/img/dice_6.svg'

const IMGS = {
  dice_1,
  dice_2,
  dice_3,
  dice_4,
  dice_5,
  dice_6
}

function Dice (props) {
  return (
    <button className={'dice' + (props.selected ? ' selected' : '') + (props.selectable ? ' selectable' : '')} onClick={props.onClick} disabled={!props.selectable}>
      <img src={IMGS[`dice_${props.value}`]} />
    </button>
  )
}

export default Dice