'use strict'

const {parse: parseCookies} = require('cookie')
const WebSocket = require('ws')

const listenToRedis = require('./redis')
const settings = require('./settings')
const fetchUser = require('./fetch-user')


const redis = listenToRedis({onNotification, onLogOut})

// Maps each user ID to a list of sockets (one user can have many
// opened sockets)
const userIdsToSockets = {}

function registerSocket(userId, newSocket) {
  userId = ~~userId
  const sockets = userIdsToSockets[userId] || []
  userIdsToSockets[userId] = sockets.concat([newSocket])
}

function unregisterSocket(userId, socket) {
  userId = ~~userId
  const sockets = userIdsToSockets[userId]
  const newSockets = sockets.filter(s => s !== socket)
  if (newSockets) {
    userIdsToSockets[userId] = newSockets
  } else {
    delete userIdsToSockets[userId]
  }
}

function getSocketsForUser(userId) {
  return userIdsToSockets[userId] || []
}

function verifyWebSocketHandshake({origin, req, secure}, cb) {
  const {sessionid} = parseCookies(req.headers.cookie || '')

  if (!sessionid) {
    cb(false)
    return
  }

  fetchUser(sessionid)
    .then(user => {
      req.user = user
      cb(true)
    })
    .catch(error => {
      if (error.code !== fetchUser.ERROR_CODES.UNAUTHORIZED) {
        console.error(error)
      }

      cb(false)
    })
}


const server = new WebSocket.Server({
  host: settings.NOTIFIER.host,
  port: settings.NOTIFIER.port,
  verifyClient: verifyWebSocketHandshake,
})

console.log(`Listening on ${settings.NOTIFIER.host}:${settings.NOTIFIER.port}…`)

server.on('connection', (socket, req) => {
  socket.isAlive = true

  const {user} = req
  socket.user = user
  registerSocket(user.id, socket)

  socket.on('pong', () => {
    socket.isAlive = true
  })

  socket.on('close', () => {
    unregisterSocket(user.id, socket)
  })
})

function onNotification(notification) {
  const sockets = getSocketsForUser(notification.receiver.id)
  for (const socket of sockets) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(notification))
    }
  }
}

function onLogOut(user) {
  const sockets = getSocketsForUser(user.id)
  for (const socket of sockets) {
    socket.close()
  }
}


const pingInterval = setInterval(() => {
  for (const socket of server.clients) {
    if (socket.isAlive === false) {
      return socket.terminate()
    }

    socket.isAlive = false
    socket.ping('', false, true)
  }
}, 30000)


const stop = () => {
  server.close()
  redis.quit()
  clearInterval(pingInterval)
}

process.on('SIGINT', stop)
process.on('SIGTERM', stop)
process.on('SIGQUIT', stop)
