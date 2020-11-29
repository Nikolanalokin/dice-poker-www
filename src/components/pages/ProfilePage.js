import React from 'react'
import { observer } from "mobx-react-lite"

import { Link } from "react-router-dom"

import Header from '../layout/Header'

const ProfilePage = observer(() => {
  return (
    <div className="page">
      <Header
        left={<Link to="/" exact className="button button--flat">Назад</Link>}
        title="Профиль" />
      
      <main className="main">
        
      </main>
    </div>
  )
})

export default ProfilePage