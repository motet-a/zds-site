'use strict'

const assert = require('assert')

const settings = require('./settings')

// `onNotification` is called every time a notification is received.
//
// Returns a redis client instance.
function listenToRedis({onNotification, onLogOut}) {
  const channelsToCallbacks = {
    'user-notification': onNotification,
    'user-logged-out': onLogOut,
  }

  const redis = require('redis').createClient(settings.REDIS)

  redis.on('message', (channel, messageString) => {
    const callback = channelsToCallbacks[channel]
    if (!callback) {
      throw new Error()
    }
    callback(JSON.parse(messageString))
  })

  redis.on('error', error => {
    console.error('Redis error:', error)
  })

  redis.on('connect', () => {
    console.log('Connected to Redis.')
  })

  redis.on('ready', () => {
    console.log('Ready to receive Redis messages.')
  })

  redis.subscribe('user-notification', 'user-logged-out')

  return redis
}

module.exports = listenToRedis
