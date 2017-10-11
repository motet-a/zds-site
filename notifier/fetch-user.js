'use strict'

const fetch = require('node-fetch')

const settings = require('./settings')

const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
}

// Fetch information about someone.
//
// `sessionId` is the `sessionid` cookie, sent by the browser to
// the web server for every single request on the website.
//
// On success, resolves an object describing the user who owns the given
// sessionId.
async function fetchUser(sessionId, cb) {
  const response = await fetch(
    settings.ZDS_APP.site.url + '/api/membres/mon-profil/',
    {
      headers: {
        cookie: `sessionid=${sessionId}`,
      },
    },
  )

  const {status} = response

  if (status === 401 || status === 403) {
    const error = new Error('Unauthorized')
    error.code = ERROR_CODES.UNAUTHORIZED
    throw error
  }

  if (status !== 200) {
    throw new Error(`Unexpected status code (${status})`)
  }

  return await response.json()
}

fetchUser.ERROR_CODES = ERROR_CODES

module.exports = fetchUser
