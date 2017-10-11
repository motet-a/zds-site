'use strict'

// This integration test file is only intented to run in the CI.

const assert = require('assert')
const WebSocket = require('ws')

const getSessionid = require('./get-session-id')

const redis = require('redis').createClient()

const createClient = sessionid => {
  let received = []

  const socket = new WebSocket('ws://localhost:27274/', {
    headers: {
      Cookie: `sessionid=${sessionid}`,
    },
  })

  socket.on('message', message => {
    received.push(JSON.parse(message))
  })

  socket.on('close', (code, reason) => {
    received.push(['close', code])
  })

  return {
    received: () => received.slice(),
    socket,
  }
}

// Must match /fixtures/users.yaml
const user = {
  id: 1,
  username: 'admin',
  password: 'admin',
}

const testUnauthorizedClient = () => new Promise((resolve, reject) => {
  const {socket} = createClient('badsessionid')

  socket.on('error', error => {
    assert(error.message === 'unexpected server response (401)')
    resolve()
  })

  socket.on('open', () => {
    reject(new Error('The socket should be closed'))
  })
})

const main = async () => {
  await testUnauthorizedClient()

  const sessionid = await getSessionid(user.username, user.password)

  const client = createClient(sessionid)
  client.socket.on('open', () => {
    redis.publish(
      'user-notification',
      JSON.stringify({
        title: 'a',
        receiver: user,
      }),
    )

    for (let i = 0; i < 100; i++) {
      redis.publish(
        'user-notification',
        JSON.stringify({
          title: 'b' + i,
          receiver: {id: 123},
        }),
      )
    }

    redis.publish(
      'user-notification',
      JSON.stringify({
        title: 'c',
        receiver: user,
      }),
    )

    redis.publish(
      'user-logged-out',
      JSON.stringify(user),
    )

    redis.publish(
      'user-notification',
      JSON.stringify({
        title: 'd',
        receiver: user,
      }),
    )

    setTimeout(verifyReceivedNotifications, 1000)
  })

  client.socket.on('error', error => {
    console.error(error)
    process.exit(1)
  })

  function verifyReceivedNotifications() {
    console.log(client.received())

    assert.deepStrictEqual(
      client.received(),
      [
        {
          title: 'a',
          receiver: user,
        },

        {
          title: 'c',
          receiver: user,
        },

        ['close', 1000], // the WebSocket is closed on logout
      ],
    )
    process.exit(0)
  }
}

main().catch(console.error)
