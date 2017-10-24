from .abstract_base import *
from .abtsract_test import *

# Unlike docker_dev.py, we don't change the database location here.
# We don't care if the database file is outside of the volume, we
# don't care about persistence.

ZDS_APP['site']['secure_url'] = u'http://127.0.0.1:8000'
