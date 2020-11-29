import io from 'socket.io-client'

const socket = io(PRODUCTION ? WS_URL : 'localhost:3000')

socket.on('connect', () => {
  console.log('[socket:on:connect]')
})

export default socket