'use strict'

const path = require('path')
const {execFileSync} = require('child_process')

// Returns the Django settings.
// Returns `null` if Python is not available.
module.exports = () => {
  const settingsModuleName = 'zds.settings'

  console.log(`Using ${settingsModuleName}`)

  const managePyPath = path.join(__dirname, '..', 'manage.py')
  const args = [
    managePyPath,
    'settings_to_json',
    '--settings', settingsModuleName,
  ]

  try {
    return JSON.parse(execFileSync('python', args))
  } catch (error) {
    if (error.code === 'ENOENT') {
      const message = `Cannot use the Django settings because python is not available.`
      if (process.env.NODE_ENV !== 'production') {
        console.log(message)
        return null
      }

      console.error(message + ' This should NOT happen in production.')
      throw error
    }

    throw error
  }
}
