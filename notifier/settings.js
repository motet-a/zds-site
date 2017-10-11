'use strict'

const djangoSettings = require('./django-settings')

// These ones are used in Docker containers, when the Django settings
// are not available.
const fallbackDevelopmentSettings = {
  NOTIFIER: {
    host: process.env.ZDS_NOTIFIER_ADDRESS || '0.0.0.0',
    port: process.env.ZDS_NOTIFIER_PORT || 27274,
  },

  ZDS_APP: {
    site: {
      url: process.env.ZDS_SITE_URL || 'http://back:8000',
    },
  },

  REDIS: {
    host: 'localhost',
    port: 6379,
    db: 0,
  },
}

module.exports = djangoSettings() || fallbackDevelopmentSettings
