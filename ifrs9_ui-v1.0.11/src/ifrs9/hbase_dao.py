#!/usr/bin/env python

from django.utils.translation import ugettext as _
from desktop.lib.exceptions_renderable import PopupException

from hbase.api import HbaseApi

from ifrs9.models import Configuracion

import logging
LOG = logging.getLogger(__name__)

class HBaseConst(object):

  def __init__(self):

    self.contrato = Configuracion.objects.get(clave='hbase.contrato').valor
    self.contratoCR = Configuracion.objects.get(clave='hbase.contrato_cr').valor
    self.cliente = Configuracion.objects.get(clave='hbase.cliente').valor

  def TablaContrato(self, pEntidadId):
    return '%s%s' % (self.contrato, pEntidadId)

  def TablaContratoCR(self, pEntidadId):
    return '%s%s' % (self.contratoCR, pEntidadId)

  def TablaCliente(self, pEntidadId):
    return '%s%s' % (self.cliente, pEntidadId)

  def FamilyDetalle(self):
    return 'detalle'

  def FamilyAnalisis(self):
    return 'hist_analisis'

  def FamilyPrePro(self):
    return 'hist_prepro'

  def FamilyDiario(self):
    return 'hist_diario'

  def FamilyMensual(self):
    return 'hist_mensual'

  def FamilyAnual(self):
    return 'hist_anual'

  def FamilyContratos(self):
    return 'contratos'

  def QualifierDetalleContrato(self):
    return 'detalle_contrato'

  def QualifierHist(self):
    return 'ajuste_hist'

  def QualifierDetalleCliente(self):
    return 'detalle_cliente'

class HBaseDao(object):

  def __init__(self, pUser):

    self.api = HbaseApi(pUser)
    try:
      self.clusters = self.api.getClusters()
    except Exception, e:
      if 'Could not connect to' in e.message:
        raise PopupException(_("HBase DAO Thrift 1 server cannot be contacted: %s") % e.message)
      else:
        error_msg = e.message.split('\n', 1)[0]
        raise PopupException(_("HBase DAO Error: %s") % error_msg)
    self.user = pUser

  def getRow(self, pTablename, pRow):

    cellData = []
    for cluster in self.clusters:
      name = cluster["name"]
      try:
        client = self.api.connectCluster(name)
        cellData = client.getRow(tableName=pTablename, row=pRow, attributes=None, doas=self.user.username)
        break
      except Exception, e:
        if 'Could not connect to' in e.message:
          raise PopupException(_("HBase DAO Thrift 1 server cannot be contacted: %s") % e.message)
        else:
          error_msg = e.message.split('\n', 1)[0]
          raise PopupException(_("HBase DAO Error: %s") % error_msg)
    #   except:
    #     LOG.exception('Failed to get the cluster %s' % name)
    return cellData

  def getRowWithColumn(self, pTablename, pRow, pFamily, pQualifier=None):

    if pQualifier:
      column = "%s:%s" % (pFamily, pQualifier)
    else:
      column = pFamily

    cellValue = ""
    for cluster in self.clusters:
      name = cluster["name"]
      try:
        client = self.api.connectCluster(name)
        cellValue = client.get(tableName=pTablename, row=pRow, column=column, attributes=None, doas=self.user.username)
        break
      except Exception, e:
        if 'Could not connect to' in e.message:
          raise PopupException(_("HBase DAO Thrift 1 server cannot be contacted: %s") % e.message)
        else:
          error_msg = e.message.split('\n', 1)[0]
          raise PopupException(_("HBase DAO Error: %s") % error_msg)
    return cellValue

  def getRowVersions(self, pTablename, pRow, pFamily, pQualifier, pStartVersion=None, pEndVersion=None):

    if (pStartVersion is None) or (pStartVersion == ''):
      pStartVersion = 0
    else:
      pStartVersion = int(pStartVersion)

    if (pEndVersion is None) or (pEndVersion == ''):
      pEndVersion = 1000
    else:
      pEndVersion = int(pEndVersion)

    column = "%s:%s" % (pFamily, pQualifier)

    cellDataVersions = []
    for cluster in self.clusters:
      name = cluster["name"]
      try:
        client = self.api.connectCluster(name)
        cellDataVersions = client.getVer(tableName=pTablename, row=pRow, column=column, numVersions=pEndVersion, attributes=None, doas=self.user.username)
        break
      except Exception, e:
        if 'Could not connect to' in e.message:
          raise PopupException(_("HBase DAO Thrift 1 server cannot be contacted: %s") % e.message)
        else:
          error_msg = e.message.split('\n', 1)[0]
          raise PopupException(_("HBase DAO Error: %s") % error_msg)

    i = 0
    output_versions = []
    for version in cellDataVersions:
      if (pStartVersion <= i) and (pEndVersion >= i):
        output_versions.append(version)
      i = i + 1
    return output_versions
