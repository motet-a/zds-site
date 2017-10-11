import json
import logging

from redis import StrictRedis
from redis.exceptions import ConnectionError

from django.conf import settings


_logger = logging.getLogger(__name__)

_redis = StrictRedis(
    host=settings.REDIS['host'],
    port=settings.REDIS['port'],
    db=settings.REDIS['db'],
)


def publish(channel, message):
    """
    ``message`` must be a JSON-serializable object.

    """
    try:
        # Publishing is thread-safe
        _redis.publish(channel.encode('utf-8'), json.dumps(message).encode('utf-8'))
    except ConnectionError:
        message = 'Redis server unavailable for real-time notifications'
        if settings.DEBUG:
            _logger.info(message)
        else:
            _logger.exception(message)
