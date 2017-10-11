'use strict'

const assert = require('assert')
const fetch = require('node-fetch')
const {parse: parseCookies} = require('cookie')

const baseUrl = 'http://localhost:8000'

// Returns something falsy if not found
const getInputByName = (htmlSource, name) =>
  // Here is how NOT to parse HTML:
  htmlSource
    .split('<')
    .find(tag => (
      tag.startsWith('input') &&
      (tag.includes('name="' + name) || tag.includes("name='" + name))
    ))

// Returns something falsy if no input with the given name is found
const getInputValue = (htmlSource, name) => {
  const input = getInputByName(htmlSource, name)
  if (!input) {
    return undefined
  }

  const match = input.match(/value=["']([^"']*)["']/)
  if (match) {
    return match[1]
  }
}

const getCsrfTokens = async path => {
  const response = await fetch(baseUrl + path)
  assert(response.status === 200)
  const html = await response.text()
  const input = getInputValue(html, 'csrfmiddlewaretoken')

  const cookies = parseCookies(response.headers.get('set-cookie'))
  const cookie = cookies.csrftoken

  return {input, cookie}
}

const getSessionid = async (username, password) => {
  const csrf = await getCsrfTokens('/membres/connexion/')

  const body =
    `username=${encodeURIComponent(username)}&` +
    `password=${encodeURIComponent(password)}&` +
    `csrfmiddlewaretoken=${csrf.input}&` +
    'remember=off'

    const response = await fetch(baseUrl + '/membres/connexion/', {
      method: 'POST',
      headers: {
        cookie: `csrftoken=${csrf.cookie}`,
        referer: baseUrl + '/membres/connexion/',
        origin: baseUrl + '/membres/connexion/',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body,
      redirect: 'manual',
    })

  assert(response.status === 302)

  // `getAll()` is replaced by `get()` in newer versions
  const setCookies = response.headers.getAll('set-cookie')
  const cookies = {}
  for (const setCookie of setCookies) {
    Object.assign(
      cookies,
      parseCookies(setCookie)
    )
  }

  return cookies.sessionid
}

module.exports = getSessionid
