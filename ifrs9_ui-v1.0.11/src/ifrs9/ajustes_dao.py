#!/usr/bin/env python

from datetime import datetime, timedelta
from django.utils.translation import ugettext as _
import copy

import logging
LOG = logging.getLogger(__name__)

from ifrs9.models import *
from ifrs9.hbase_dao import *


class DateError(Exception):
    pass


class DuplicatedPromotionError(DateError):
    pass


class PromotionError(DateError):
    pass


class MajorMinorFinalityError(DateError):
    pass


class Filter(object):

    def ejecucionFilter(self, pEntidad, pFinalidad, pEstado=None, pFechaIni=None, pFechaFin=None, pUser=None):

        ejecuciones = Ejecucion.objects.select_related('usuarioalta__id').filter(
            entidad=pEntidad, finalidad=pFinalidad).order_by('-id')

        if pEstado:
            ejecuciones = ejecuciones.select_related(
                'usuarioalta__id').filter(estado=pEstado).order_by('-id')
        if pFechaIni:
            ejecuciones = ejecuciones.select_related('usuarioalta__id').filter(
                fechaalta__gte=pFechaIni).order_by('-id')
        if pFechaFin:
            ejecuciones = ejecuciones.select_related('usuarioalta__id').filter(
                fechaalta__lte=pFechaFin).order_by('-id')
        if pUser:
            ejecuciones = ejecuciones.select_related(
                'usuarioalta__id').filter(usuarioalta=pUser).order_by('-id')

        return ejecuciones

    def ajustesFilter(self, pEntidad, pOperacionId=None, pFlagContratoCliente=None, pFinalidad=None, pFinalidadId=None, pTipoAjuste=None, pFechaIni=None, pFechaFin=None, pUser=None, pOrder=None):

        ajustes = Ajuste.objects.select_related(
            'usuarioalta__id').filter(entidad=pEntidad).order_by('-id')

        if pFinalidad:
            ajustes = ajustes.select_related('usuarioalta__id').filter(
                finalidad=pFinalidad).order_by('-id')
        else:
            if pFinalidadId:
                ajustes = ajustes.select_related('usuarioalta__id').filter(
                    finalidad__lte=pFinalidadId).order_by('-id')
        if pTipoAjuste:
            ajustes = ajustes.select_related('usuarioalta__id').filter(
                tipo=pTipoAjuste).order_by('-id')
        if pFechaIni:
            ajustes = ajustes.select_related('usuarioalta__id').filter(
                fechafin__gte=pFechaIni).order_by('-id')
        if pFechaFin:
            ajustes = ajustes.select_related('usuarioalta__id').filter(
                fechaini__lte=pFechaFin).order_by('-id')
        if pUser:
            ajustes = ajustes.select_related('usuarioalta__id').filter(
                usuarioalta=pUser).order_by('-id')
        if pOrder:
            ajustes = ajustes.select_related(
                'usuarioalta__id').order_by(pOrder)
        if pFlagContratoCliente is not None and pOperacionId is not None:
            ajustes = ajustes.select_related('usuarioalta__id').filter(
                flagclientecontrato=pFlagContratoCliente, operacion_id=pOperacionId).order_by('-id')

        return ajustes

    def exclusionesFilter(self, pEntidad, pOperacionId=None, pFlagContratoCliente=None, pFinalidad=None, pFinalidadId=None, pTipoExclusion=None, pFechaIni=None, pFechaFin=None, pUser=None):

        exclusiones = Exclusion.objects.select_related(
            'usuarioalta__id').filter(entidad=pEntidad).order_by('-id')

        if pFinalidad:
            exclusiones = exclusiones.select_related(
                'usuarioalta__id').filter(finalidad=pFinalidad).order_by('-id')
        else:
            if pFinalidadId:
                exclusiones = exclusiones.select_related('usuarioalta__id').filter(
                    finalidad__lte=pFinalidadId).order_by('-id')
        if pTipoExclusion:
            exclusiones = exclusiones.select_related(
                'usuarioalta__id').filter(tipo=pTipoExclusion).order_by('-id')
        if pFechaIni:
            exclusiones = exclusiones.select_related('usuarioalta__id').filter(
                fechafin__gte=pFechaIni).order_by('-id')
        if pFechaFin:
            exclusiones = exclusiones.select_related('usuarioalta__id').filter(
                fechaini__lte=pFechaFin).order_by('-id')
        if pOperacionId:
            exclusiones = exclusiones.select_related('usuarioalta__id').filter(
                operacion_id=pOperacionId).order_by('-id')
        if pUser:
            exclusiones = exclusiones.select_related(
                'usuarioalta__id').filter(usuarioalta=pUser).order_by('-id')
        if pFlagContratoCliente is not None and pOperacionId is not None:
            exclusiones = exclusiones.select_related('usuarioalta__id').filter(
                flagclientecontrato=pFlagContratoCliente, operacion_id=pOperacionId).order_by('-id')

        return exclusiones

    def getDetalle(self, pAjuste, pUser):

        entidad = pAjuste.entidad
        operacionId = pAjuste.operacion_id
        hbaseConst = HBaseConst()
        if int(pAjuste.tipo.tipo_id) > 2:
            tablename = hbaseConst.TablaContrato(pEntidadId=entidad.entidad_id)
            qualifier = hbaseConst.QualifierDetalleContrato()
        else:
            tablename = hbaseConst.TablaCliente(pEntidadId=entidad.entidad_id)
            qualifier = hbaseConst.QualifierDetalleCliente()

        family = hbaseConst.FamilyDetalle()

        hbaseDao = HBaseDao(pUser)
        detalle = hbaseDao.getRowWithColumn(
            pTablename=tablename, pRow=operacionId, pFamily=family, pQualifier=qualifier)

        return detalle

    def getDetalleContratoId(self, pEntidadId, pContratoId, pUser):

        hbaseConst = HBaseConst()
        tablename = hbaseConst.TablaContrato(pEntidadId=pEntidadId)
        qualifier = hbaseConst.QualifierDetalleContrato()

        family = hbaseConst.FamilyDetalle()

        hbaseDao = HBaseDao(pUser)
        detalle = hbaseDao.getRowWithColumn(
            pTablename=tablename, pRow=pContratoId, pFamily=family, pQualifier=qualifier)

        return detalle

    def getDetalleClienteId(self, pEntidadId, pClienteId, pUser):

        hbaseConst = HBaseConst()
        tablename = hbaseConst.TablaCliente(pEntidadId=pEntidadId)
        qualifier = hbaseConst.QualifierDetalleCliente()

        family = hbaseConst.FamilyDetalle()

        hbaseDao = HBaseDao(pUser)
        detalle = hbaseDao.getRowWithColumn(
            pTablename=tablename, pRow=pClienteId, pFamily=family, pQualifier=qualifier)

        return detalle

    def getDetalleExclusion(self, pExclusion, pUser):

        entidad = pExclusion.entidad
        operacionId = pExclusion.operacion_id
        hbaseConst = HBaseConst()
        if int(pExclusion.tipo.tipo_id) > 2:
            tablename = hbaseConst.TablaContrato(pEntidadId=entidad.entidad_id)
            qualifier = hbaseConst.QualifierDetalleContrato()
        else:
            tablename = hbaseConst.TablaCliente(pEntidadId=entidad.entidad_id)
            qualifier = hbaseConst.QualifierDetalleCliente()

        family = hbaseConst.FamilyDetalle()

        hbaseDao = HBaseDao(pUser)
        detalle = hbaseDao.getRowWithColumn(
            pTablename=tablename, pRow=operacionId, pFamily=family, pQualifier=qualifier)

        return detalle

    def getLastExecution(self, pAjuste, pUser):

        entidad = pAjuste.entidad
        finalidad = pAjuste.finalidad
        operacionId = pAjuste.operacion_id
        hbaseConst = HBaseConst()

        if finalidad.id == 3:
            contratoTablename = hbaseConst.TablaContratoCR(
                pEntidadId=entidad.entidad_id)
            family = hbaseConst.FamilyDiario()
        else:
            contratoTablename = hbaseConst.TablaContrato(
                pEntidadId=entidad.entidad_id)
            if finalidad.id == 1:
                family = hbaseConst.FamilyAnalisis()
            else:
                family = hbaseConst.FamilyPrePro()
        qualifier = hbaseConst.QualifierHist()

        hbaseDao = HBaseDao(pUser)
        contratos = []
        if int(pAjuste.tipo.tipo_id) <= 2:
            clienteTablename = hbaseConst.TablaCliente(
                pEntidadId=entidad.entidad_id)
            cells = hbaseDao.getRow(
                pTablename=clienteTablename, pRow=operacionId)
            for cell in cells:
                for key, value in cell.columns.iteritems():
                    contratos.append(value.value)
        else:
            contratos.append(operacionId)

        lastExecutions = []
        for contrato in contratos:
            lastExecution = hbaseDao.getRowWithColumn(
                pTablename=contratoTablename, pRow=contrato, pFamily=family, pQualifier=qualifier)
            lastExecutions.append(lastExecution)

        return lastExecutions

    def getLastExecutionOperacion(self, pEntidadId, pFinalidadId, pOperacionId, pFlagClienteContrato, pUser):

        hbaseConst = HBaseConst()

        if int(pFinalidadId) == 3:
            contratoTablename = hbaseConst.TablaContratoCR(
                pEntidadId=pEntidadId)
            family = hbaseConst.FamilyDiario()
        else:
            contratoTablename = hbaseConst.TablaContrato(pEntidadId=pEntidadId)
            if int(pFinalidadId) == 1:
                family = hbaseConst.FamilyAnalisis()
            else:
                family = hbaseConst.FamilyPrePro()
        qualifier = hbaseConst.QualifierHist()

        hbaseDao = HBaseDao(pUser)
        contratos = []
        if int(pFlagClienteContrato) == 0:
            clienteTablename = hbaseConst.TablaCliente(pEntidadId=pEntidadId)
            cells = hbaseDao.getRow(
                pTablename=clienteTablename, pRow=pOperacionId)
            for cell in cells:
                for key, value in cell.columns.iteritems():
                    contratos.append(value.value)
        else:
            contratos.append(pOperacionId)

        lastExecutions = []
        for contrato in contratos:
            lastExecution = hbaseDao.getRowWithColumn(
                pTablename=contratoTablename, pRow=contrato, pFamily=family, pQualifier=qualifier)
            lastExecutions.append(lastExecution)

        return lastExecutions

    def getLastExecutionsOperacion(self, pEntidadId, pFinalidadId, pOperacionId, pFlagClienteContrato, pUser):

        hbaseConst = HBaseConst()

        if int(pFinalidadId) == 3:
            contratoTablename = hbaseConst.TablaContratoCR(
                pEntidadId=pEntidadId)
            family = hbaseConst.FamilyDiario()
        else:
            contratoTablename = hbaseConst.TablaContrato(pEntidadId=pEntidadId)
            if int(pFinalidadId) == 1:
                family = hbaseConst.FamilyAnalisis()
            else:
                family = hbaseConst.FamilyPrePro()
        qualifier = hbaseConst.QualifierHist()

        hbaseDao = HBaseDao(pUser)
        contratos = []
        if int(pFlagClienteContrato) == 0:
            clienteTablename = hbaseConst.TablaCliente(pEntidadId=pEntidadId)
            cells = hbaseDao.getRow(
                pTablename=clienteTablename, pRow=pOperacionId)
            for cell in cells:
                for key, value in cell.columns.iteritems():
                    contratos.append(value.value)
        else:
            contratos.append(pOperacionId)

        lastExecutions = []
        for contrato in contratos:
            lastExecution = hbaseDao.getRowVersions(
                pTablename=contratoTablename, pRow=contrato, pFamily=family, pQualifier=qualifier)
            lastExecutions.append(lastExecution)
        return lastExecutions

    def deleteAjuste(self, pAjuste):

        if pAjuste.finalidad.id < 3:
            # try:
            #     ajustesHijos = Ajuste.objects.filter(ajusteorigen=pAjuste)
            #     for ajusteHijo in ajustesHijos:
            #         ajusteHijo.ajusteorigen = None
            #         ajusteHijo.save()
            # except Exception:
            #     pass
            pAjuste.delete()
            return 0
        fechaIni = pAjuste.fechaini
        if fechaIni >= datetime.now().date():
            pAjuste.delete()
            return 0
        else:
            fechaFin = pAjuste.fechafin
            if fechaFin > datetime.now().date():
                pAjuste.fechafin = (datetime.now() - timedelta(days=1)).date()
                pAjuste.save()
                return 1
            else:
                return 2

    def deleteExclusion(self, pExclusion):

        if pExclusion.finalidad.id < 3:
            # try:
            #     exclusionesHijos = Exclusion.objects.filter(
            #         exclusionorigen=pExclusion)
            #     for exclusionHijo in exclusionesHijos:
            #         exclusionHijo.exclusionorigen = None
            #         exclusionHijo.save()
            # except Exception:
            #     pass
            pExclusion.delete()
            return 0

        if pExclusion.finalidad.id < 3:
            pExclusion.delete()
            return 0
        fechaIni = pExclusion.fechaini
        if fechaIni >= datetime.now().date():
            pExclusion.delete()
            return 0
        else:
            fechaFin = pExclusion.fechafin
            if fechaFin > datetime.now().date():
                pExclusion.fechafin = (
                    datetime.now() - timedelta(days=1)).date()
                pExclusion.save()
                return 1
            else:
                return 2

    def promocionarAjuste(self, pAjuste, pFinalidadDestino):

        if  pFinalidadDestino.id == 3:
            try:
                ajustePadre = Ajuste.objects.get(
                    id=pAjuste.ajusteorigen, fechafin__gte=datetime.now().date(), finalidad=pFinalidadDestino)
            except Exception, e:
                LOG.debug("Ajuste padre finalidad 3: %s " %e)
                ajustePadre = None
                pass
            try:
                ajusteHijo = Ajuste.objects.get(
                    ajusteorigen=pAjuste.ajusteorigen, fechafin__gte=datetime.now().date(), finalidad=pFinalidadDestino)
                LOG.debug(ajusteHijo)
            except Exception, e:
                LOG.debug("Ajuste hijo finalidad 3: %s" % e)
                ajusteHijo = None
                pass
        else:
            try:
                ajustePadre = Ajuste.objects.get(
                    id=pAjuste.ajusteorigen, finalidad=pFinalidadDestino)
            except Exception, e:
                LOG.debug("Ajuste padre otra finalidad: %s " %e)
                ajustePadre = None
                pass
            try:
                ajusteHijo = Ajuste.objects.get(ajusteorigen=pAjuste.ajusteorigen, finalidad=pFinalidadDestino)
            except Exception, e:
                LOG.debug("Ajuste hijo otra finalidad: %s" % e)
                ajusteHijo = None
                pass

        if ajusteHijo != None or ajustePadre != None:
            raise DuplicatedPromotionError(
                _("No se puede copiar porque ya existe en la finalidad destino"))

        if pAjuste.finalidad.id < pFinalidadDestino.id:
            tipoAjuste = pAjuste.tipo
            if ((int(tipoAjuste.tipo_id) == 1) or (int(tipoAjuste.tipo_id) == 3)):
                fechaFin = pAjuste.fechafin
                if int(pFinalidadDestino.id) < 3 or fechaFin > datetime.now().date():
                    nuevoAjuste = copy.deepcopy(pAjuste)
                    nuevoAjuste.id = None
                    if int(pFinalidadDestino.id) == 3 and pAjuste.fechaini <= datetime.now().date():
                        nuevoAjuste.fechaini = datetime.now().date()
                    nuevoAjuste.finalidad = pFinalidadDestino
                    if pAjuste.ajusteorigen:
                        nuevoAjuste.ajusteorigen = pAjuste.ajusteorigen
                    else:
                        nuevoAjuste.ajusteorigen = pAjuste.pk
                    nuevoAjuste.save()
                    return 0
                else:
                    raise DateError(_("La fecha de fin debe ser mayor a hoy"))
            else:
                raise PromotionError(_("El ajuste no es promocionable"))
        else:
            raise MajorMinorFinalityError('La finalidad destino (%d - %s) es menor o igual a la finalidad origen (%d - %s)' % (
                pFinalidadDestino.id, pFinalidadDestino.descripcion, pAjuste.finalidad.id, pAjuste.finalidad.descripcion))

    def promocionarExclusion(self, pExclusion, pFinalidadDestino):

        if pFinalidadDestino.id == 3:
            try:
                exclusionPadre = Exclusion.objects.get(
                    id=pExclusion.exclusionorigen, fechafin__gte=datetime.now().date(), finalidad=pFinalidadDestino)
            except Exception, e:
                LOG.debug(e)
                exclusionPadre = None
                pass
            try:
                exclusionHijo = Exclusion.objects.get(
                    exclusionorigen=pExclusion.exclusionorigen, fechafin__gte=datetime.now().date(), finalidad=pFinalidadDestino)
            except Exception, e:
                exclusionHijo = None
                pass
        else:
            try:
                exclusionPadre = Exclusion.objects.get(
                    id=pExclusion.exclusionorigen, finalidad=pFinalidadDestino)
            except Exception, e:
                LOG.debug(e)
                exclusionPadre = None
                pass
            try:
                exclusionHijo = Exclusion.objects.get(
                    exclusionorigen=pExclusion.exclusionorigen, finalidad=pFinalidadDestino)
            except Exception, e:
                exclusionHijo = None
                pass

        if exclusionHijo != None or exclusionPadre != None:
            raise DuplicatedPromotionError(
                _("No se puede copiar porque ya existe en la finalidad destino"))

        if pExclusion.finalidad.id < pFinalidadDestino.id:
            tipoExclusion = pExclusion.tipo
            if ((int(tipoExclusion.tipo_id) == 1) or (int(tipoExclusion.tipo_id) == 3)):
                fechaFin = pExclusion.fechafin
                if int(pFinalidadDestino.id) < 3 or fechaFin > datetime.now().date():
                    nuevaExclusion = copy.copy(pExclusion)
                    nuevaExclusion.id = None
                    if int(pFinalidadDestino.id) == 3 and pExclusion.fechaini <= datetime.now().date():
                        nuevaExclusion.fechaini = datetime.now().date()
                    nuevaExclusion.finalidad = pFinalidadDestino
                    if pExclusion.exclusionorigen:
                        nuevaExclusion.exclusionorigen = pExclusion.exclusionorigen
                    else:
                        nuevaExclusion.exclusionorigen = pExclusion.pk
                    nuevaExclusion.save()
                    return 0
                else:
                    raise DateError(_("La fecha de fin debe ser mayor a hoy"))
            else:
                raise PromotionError(_("La exclusion no es promocionable"))
        else:
            raise MajorMinorFinalityError('La finalidad destino (%d - %s) es menor o igual a la finalidad origen (%d - %s)' % (
                pFinalidadDestino.id, pFinalidadDestino.descripcion, pExclusion.finalidad.id, pExclusion.finalidad.descripcion))

    def desPromocionarAjuste(self, pAjuste, pFinalidadDestino):

        try:
            ajustePadre = Ajuste.objects.get(
                id=pAjuste.ajusteorigen, finalidad=pFinalidadDestino)
        except Exception, e:
            LOG.debug(e)
            ajustePadre = None
        try:
            ajusteHijo = Ajuste.objects.get(
                ajusteorigen=pAjuste.ajusteorigen, finalidad=pFinalidadDestino)
        except Exception, e:
            LOG.debug(e)
            ajusteHijo = None
        if ajustePadre != None or ajusteHijo != None:
            raise DuplicatedPromotionError(
                _("No se puede copiar porque ya existe en la finalidad destino"))

        if ((pAjuste.finalidad.id > pFinalidadDestino.id) and (pFinalidadDestino.id > 0)):
            # fechaFin = pAjuste.fechafin
            # if fechaFin > datetime.now().date():
            nuevoAjuste = copy.copy(pAjuste)
            nuevoAjuste.id = None
            nuevoAjuste.finalidad = pFinalidadDestino
            if pAjuste.ajusteorigen:
                nuevoAjuste.ajusteorigen = pAjuste.ajusteorigen
            else:
                nuevoAjuste.ajusteorigen = pAjuste.id
            nuevoAjuste.save()
            return 0
            # else:
            #     raise DateError('La fecha de fin debe ser mayor de hoy')
        else:
            raise MajorMinorFinalityError('La finalidad destino (%d - %s) es mayor o igual a la finalidad origen (%d - %s)' % (
                pAjuste.finalidad.id, pAjuste.finalidad.descripcion, pFinalidadDestino.id, pFinalidadDestino.descripcion))

    def desPromocionarExclusion(self, pExclusion, pFinalidadDestino):

        try:
            exclusionPadre = Exclusion.objects.get(
                id=pExclusion.exclusionorigen, finalidad=pFinalidadDestino)
        except Exception, e:
            LOG.debug(e)
            exclusionPadre = None
        try:
            exclusionHijo = Exclusion.objects.get(
                exclusionorigen=pExclusion.exclusionorigen, finalidad=pFinalidadDestino)
        except Exception, e:
            exclusionHijo = None
        if exclusionHijo != None or exclusionPadre != None:
            raise DuplicatedPromotionError(
                _("No se puede copiar porque ya existe en la finalidad destino"))

        if ((pExclusion.finalidad.id > pFinalidadDestino.id) and (pFinalidadDestino.id > 0)):
            nuevaExclusion = copy.copy(pExclusion)
            nuevaExclusion.id = None
            nuevaExclusion.finalidad = pFinalidadDestino
            if pExclusion.exclusionorigen:
                nuevaExclusion.exclusionorigen = pExclusion.exclusionorigen
            else:
                nuevaExclusion.exclusionorigen = pExclusion.pk
            nuevaExclusion.save()
            return 0
        else:
            raise MajorMinorFinalityError('La finalidad destino (%d - %s) es mayor o igual a la finalidad origen (%d - %s)' % (
                pExclusion.finalidad.id, pExclusion.finalidad.descripcion, pFinalidadDestino.id, pFinalidadDestino.descripcion))
