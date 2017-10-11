
import json

from django.conf import settings
from django.core.management import BaseCommand


class Command(BaseCommand):
    help = """
    Print the JSON-encoded settings to stdout.

    Used by services written in other langages in order to avoid to
    duplicate the configuration.
    """

    def handle(self, *args, **options):
        # Names starting with `_` are private, ignore them
        keys = [key for key in dir(settings) if not key.startswith('_')]
        settings_dict = {key: getattr(settings, key) for key in keys}
        # We don't care about unserializable data, discard it
        print(json.dumps(settings_dict, default=lambda _: None))
