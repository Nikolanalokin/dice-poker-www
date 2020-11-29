import React from 'react'
import { observer } from "mobx-react-lite"

const NotFoundPage = observer(() => 
  (
    <div className="page">
      <header className="header"></header>
      <main className="main">
        Страница не найдена
      </main>
    </div>
  )
)

export default NotFoundPage