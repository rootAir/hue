#!/usr/bin/env python

from models import *
import logging

LOG = logging.getLogger(__name__)


class DimSubManager(object):

    def __init__(self):
        pass

    def getParentDimension(self, dimension, pJson):
        # LOG.debug("La dimension introducida es: %s" % dimension)
        parent = Configuracion.objects.get(
            clave='dim.parent.%s' % dimension).valor
        # LOG.debug(
        #     "el valor de parent en getParentDimension antes del NONE: %s" % parent)
        if (parent != None):
            # Extract from the json the parent value for that dimension
            parent = pJson[parent]
        return parent

    def extractFilteredDimension(self, dimensions):
        # returns the correct dimension
        if dimensions:
            if dimensions[0].date_end is not None:
                descDimensions = dimensions.filter(
                    date_start__lte=datetime.now(),
                    date_end__gte=datetime.now())
            else:
                descDimensions = dimensions.filter(
                    date_start__lte=datetime.now())

        return dimensions[0]
