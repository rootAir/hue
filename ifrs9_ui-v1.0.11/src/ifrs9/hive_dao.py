#!/usr/bin/env python

from beeswax.server import dbms
from django.utils.translation import ugettext as _
from desktop.lib.exceptions_renderable import PopupException

import logging
LOG = logging.getLogger(__name__)


class HIVEdao(object):

    def __init__(self):
        pass

    def get_partitions(self, pUser, pDbName, pTableName):
        try:
            db = dbms.get(pUser)
            table_obj = db.get_table(pDbName, pTableName)
            partitions = [part.values[0]
                          for part in db.get_partitions(pDbName, table_obj)]
            LOG.debug('Partitions found in table %s: %s' %
                      (pTableName, partitions))
            return partitions
        except Exception, e:
            LOG.error(str(e))
            raise PopupException(
                _("Hive server could not be contacted: %s") % str(e))
