from zds.utils.context_processor import get_git_version

from .abstract_base import *

# Always use `secrets[key]` instead of `secrets.get(key)` in this file
# because we really want to raise an error if a secret is not defined.

DEBUG = False

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'zdsdb',
        'USER': 'zds',
        'PASSWORD': secrets['DEFAULT_DATABASE_PASSWORD'],
        'HOST': 'localhost',
        'PORT': '',
        'CONN_MAX_AGE': 600,
        'OPTIONS': {
            'charset': 'utf8mb4',
            'init_command': 'SET sql_mode=\'STRICT_TRANS_TABLES\'',
        },
    }
}

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
        'LOCATION': '127.0.0.1:11211',
    }
}

# Sentry (+ raven, the Python Client)
# https://docs.getsentry.com/hosted/clients/python/integrations/django/
RAVEN_CONFIG = {
    'dsn': secrets['RAVEN_CONFIG_DSN'],
    'release': get_git_version()['name'],
}

# TODO
