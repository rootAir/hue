    # -*- coding: utf-8 -*-#

#!/usr/bin/env python
# Licensed to Cloudera, Inc. under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  Cloudera, Inc. licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from __future__ import unicode_literals
from desktop.lib.django_util import render, RequestContext
from desktop.lib.exceptions_renderable import PopupException
from django.shortcuts import render_to_response, HttpResponse
from django.core.context_processors import csrf
from django.template.loader import render_to_string
from django.core import serializers
import json
import locale
from json import dumps, JSONEncoder
from models import *
from forms import *
from mako.template import Template
import datetime
from time import mktime
from django.utils import translation, simplejson
from django.utils.translation import ugettext_lazy
from ifrs9.ftp_dao import FTPdao
import logging
from django.forms.models import model_to_dict
from desktop.lib.django_util import JsonResponse
from ajustes_dao import *
from ajustes_utils import *
import types
import re
from ifrs9.permission_dao import get_permission_context
from django.http import Http404, HttpResponseForbidden
from hive_dao import *
from desktop.lib.exceptions_renderable import PopupException
from django.utils.translation import ugettext as _
from django.utils.translation import gettext
LOG = logging.getLogger(__name__)
from babel.numbers import format_number, format_decimal, format_percent
from dim_sub_dao import *
from license import *


# AUX FUNCTIONS


def get_user_entity_id(id_user):
    # get user entity id from the user id
    try:
        entidadusuario = EntidadUsuario.objects.get(usuario_id=id_user)
        entidad_id = entidadusuario.entidad_id
        return entidad_id
    except Exception:
        return 0


def get_user_currency(id_user):
    # get user currency from the user id
    entidadusuario = EntidadUsuario.objects.select_related(
        'entidad__entidad_id').get(usuario_id=id_user)
    return entidadusuario.entidad.moneda


def get_current_language(request):
    # get current language in the appropiate format
    current_language = translation.get_language()
    if current_language == 'pt':
        return 'pt-PT'
    elif current_language == 'es':
        return 'es-ES'
    else:
        return 'en-US'

# Sustitucion de dimensiones


def sustDimensiones(pJson, pContratoId, pEntidadId):

    auxJson = {}

    for key, subdict in pJson.iteritems():
        auxJson[key] = subdict["value"]

    dsm = DimSubManager()

    for key, subdict in pJson.iteritems():
        try:
            LOG.debug("Going to sustitue variables %s - %s" % (key, subdict))
            cod = subdict["value"]
            dimension = subdict["name"]
            # LOG.debug("cod es: %s y dimension es %s" % (cod, dimension))
            try:
                codParent = dsm.getParentDimension(dimension, auxJson)
                LOG.debug("Has the key: %s a parent %s" % (key, codParent))
                descDimensions = DescDimensiones.objects.filter(
                    cod=cod, dimension=dimension, cod_entidad=pEntidadId, cod_parent=codParent)
                dimension = dsm.extractFilteredDimension(descDimensions)

                subdict["value"] += (" - %s" % dimension.as_dict()["desc"])
            except Exception as e:
                try:
                    descDimensions = DescDimensiones.objects.filter(
                        cod=cod, dimension=dimension, cod_entidad=pEntidadId)
                    dimension = dsm.extractFilteredDimension(descDimensions)

                    subdict["value"] += (" - %s" %
                                         dimension.as_dict()["desc"])
                except Exception as e:
                    LOG.debug("Error aqui %s" % str(e))
                pass
        except Exception as e:
            pass
    return pJson

# Fin sustitucion de dimensiones


def format_currency(request, value):
    lan = get_current_language(request)

    if lan == 'en-US':
        return format_decimal(value, format='#,##0.00', locale='en_US')
    elif lan == 'es-ES':
        return format_decimal(value, format='#,##0.00', locale='es_ES')
    else:
        return format_decimal(value, format='#,##0.00', locale='pt_PT')

# END AUX FUNCTIONS


def index(request):
    mylan = get_current_language(request)
    return render('index.mako', request, {'lan': mylan})


def alta_ajustes_cliente(request):
    moneda = get_user_currency(request.user.pk)
    form_filter = AltaAnalisisFilterFormClient(auto_id=False)
    form_data = DatosAltaGenericAnalisisForm(
        auto_id=False, initial={'moneda': moneda.moneda_id})
    lan = get_current_language(request)
    NaN_msg = Configuracion.objects.get(clave='modellica.text.nan').valor
    return render_to_response('html/analisis/alta_ajustes_cliente.html', {'form_filter': form_filter, 'form_data': form_data, "moneda": moneda.descripcion, "lan": lan, "NaN_msg": NaN_msg}, RequestContext(request))


def alta_ajustes_contrato(request):
    moneda = get_user_currency(request.user.pk)
    form_filter = AltaAnalisisFilterFormContrat(auto_id=False)
    form_data = DatosAltaGenericAnalisisForm(
        auto_id=False, initial={'moneda': moneda.moneda_id})
    lan = get_current_language(request)
    NaN_msg = Configuracion.objects.get(clave='modellica.text.nan').valor
    return render_to_response('html/analisis/alta_ajustes_contrato.html', {'form_filter': form_filter, 'form_data': form_data, "moneda": moneda.descripcion, "lan": lan, "NaN_msg": NaN_msg}, RequestContext(request))


def alta_exclusiones_cliente(request):
    form_filter = AltaAnalisisFilterFormClient(auto_id=False)
    form_data = AltaExclusionGenericDatos(auto_id=False)
    return render_to_response('html/analisis/alta_exclusiones_cliente.html', {'form_filter': form_filter, 'form_data': form_data}, RequestContext(request))


def alta_exclusiones_contrato(request):
    form_filter = AltaAnalisisFilterFormClient(auto_id=False)
    form_data = AltaExclusionGenericDatos(auto_id=False)
    return render_to_response('html/analisis/alta_exclusiones_contrato.html', {'form_filter': form_filter, 'form_data': form_data}, RequestContext(request))


def alta_exclusiones(request):
    return render_to_response('html/analisis/alta_exclusiones.html', {}, RequestContext(request))


def buscar_ajustes(request):
    mylan = get_current_language(request)
    if request.method == 'POST':
        if request.is_ajax():
            environment = request.POST['environment']
            finalidad_form = request.POST['finalidad']
            form_busq_filled = BuscarAjustes(
                request.POST, lan=mylan, finalidad=finalidad_form)
            if form_busq_filled.is_valid():
                user_entity = get_user_entity_id(request.user.pk)
                # Finalidad
                if (form_busq_filled.cleaned_data['finalidad'] == "0"):
                    finalidad = None
                else:
                    finalidad_id = form_busq_filled.cleaned_data['finalidad']
                    finalidad = Finalidad.objects.get(id=finalidad_id)

                # Tipo de ajuste
                if form_busq_filled.cleaned_data['tipo_ajuste'] == "0":
                    tipoAjusteObject = None
                else:
                    tipo_ajuste = form_busq_filled.cleaned_data['tipo_ajuste']
                    tipoAjusteObject = Tipoajuste_enum.objects.get(
                        tipo_id=tipo_ajuste)

                # Fecha de inicio
                if form_busq_filled.cleaned_data['fecha_inicio'] == "":
                    fecha_inicio = None
                    s = "01-01-1970"
                    fecha_inicio = datetime.strptime(s, "%d-%m-%Y")
                else:
                    fecha_inicio = datetime.strptime(form_busq_filled.cleaned_data[
                        'fecha_inicio'], "%d-%m-%Y")

                # Fecha de Fin
                if form_busq_filled.cleaned_data['fecha_fin'] == "":
                    fecha_fin = None
                    s = "31-12-2999"
                    fecha_fin = datetime.strptime(s, "%d-%m-%Y")
                else:
                    fecha_fin = datetime.strptime(form_busq_filled.cleaned_data[
                        'fecha_fin'] + " 23:59:59", "%d-%m-%Y %H:%M:%S")

                if form_busq_filled.cleaned_data['usuario_alta'] == "":
                    usuario_alta = None
                else:
                    # usuario_alta =
                    # form_busq_filled.cleaned_data['usuario_alta']
                    try:
                        usuario_alta = User.objects.get(
                            username=form_busq_filled.cleaned_data['usuario_alta'])
                    except User.DoesNotExist, e:
                        response = HttpResponse(
                            _('Usuario no existe'), status=404)
                        response['Content-Length'] = len(response.content)
                        return response

                if form_busq_filled.cleaned_data['id_cliente'] != "":
                    operacion = form_busq_filled.cleaned_data['id_cliente']
                    myFilter = Filter()
                    cliente_existe = myFilter.getDetalleClienteId(
                        pEntidadId=user_entity, pClienteId=operacion, pUser=request.user)
                    flagClienteContrato = "0"
                    if len(cliente_existe) == 0:
                        response = HttpResponse(
                            _('ID Cliente no existe'), status=404)
                        response['Content-Length'] = len(response.content)
                        return response
                elif form_busq_filled.cleaned_data['id_contrato'] != "":
                    operacion = form_busq_filled.cleaned_data[
                        'id_contrato']
                    myFilter = Filter()
                    contrato_existe = myFilter.getDetalleContratoId(
                        pEntidadId=user_entity, pContratoId=operacion, pUser=request.user)
                    flagClienteContrato = "1"
                    if len(contrato_existe) == 0:
                        response = HttpResponse(
                            _('ID Contrato no existe'), status=404)
                        response['Content-Length'] = len(response.content)
                        return response
                else:
                    flagClienteContrato = None
                    operacion = None

                ajustes_filter = Filter()

                try:
                    results = ajustes_filter.ajustesFilter(pEntidad=user_entity, pOperacionId=operacion, pFlagContratoCliente=flagClienteContrato, pFinalidad=finalidad,
                                                           pFinalidadId=environment, pTipoAjuste=tipoAjusteObject, pFechaIni=fecha_inicio, pFechaFin=fecha_fin, pUser=usuario_alta).order_by('-fechaini')
                except Exception as e:
                    response = HttpResponse(str(e), status=401)
                    response['Content-Length'] = len(response.content)
                    return response

                ajustes_filtered = [results.as_dict() for results in results]
                if ajustes_filtered.count > 0:
                    return HttpResponse(json.dumps(ajustes_filtered), content_type="application/json")
                else:
                    return HttpResponse("0")
            else:
                return HttpResponse(form_busq_filled.errors)
    else:
        envperm = request.GET['environment']
        form_busq = BuscarAjustes(
            auto_id=False, lan=mylan, finalidad=envperm)
        return render_to_response('html/analisis/buscar_ajustes.html', {'form_busq': form_busq, 'lan': mylan, 'user': request.user, 'envperm': envperm, 'ctxperm': get_permission_context(request)}, RequestContext(request))


def buscar_exclusiones(request):
    mylan = get_current_language(request)
    if request.method == 'POST':
        if request.is_ajax():
            environment = request.POST['environment']
            finalidad_form = request.POST['finalidad']
            form_busq_filled = BuscarExclusiones(
                request.POST, lan=mylan, finalidad=finalidad_form)
            if form_busq_filled.is_valid():
                user_entity = get_user_entity_id(request.user.pk)
                if (form_busq_filled.cleaned_data['finalidad'] == "0"):
                    finalidad = None
                else:
                    finalidad_id = form_busq_filled.cleaned_data['finalidad']
                    finalidad = Finalidad.objects.get(id=finalidad_id)

                # Tipo de ajuste
                if form_busq_filled.cleaned_data['tipo_ajuste'] == "0":
                    tipoExclusionObject = None
                else:
                    tipo_ajuste = form_busq_filled.cleaned_data['tipo_ajuste']
                    tipoExclusionObject = Tipoexclusion_enum.objects.get(
                        tipo_id=tipo_ajuste)

                # Fecha de inicio
                if form_busq_filled.cleaned_data['fecha_inicio'] == "":
                    fecha_inicio = None
                    s = "01-01-1970"
                    fecha_inicio = datetime.strptime(s, "%d-%m-%Y")
                else:
                    fecha_inicio = datetime.strptime(form_busq_filled.cleaned_data[
                        'fecha_inicio'], "%d-%m-%Y")

                # Fecha de Fin
                if form_busq_filled.cleaned_data['fecha_fin'] == "":
                    fecha_fin = None
                    s = "31-12-2999"
                    fecha_fin = datetime.strptime(s, "%d-%m-%Y")
                else:
                    fecha_fin = datetime.strptime(form_busq_filled.cleaned_data[
                        'fecha_fin'] + " 23:59:59", "%d-%m-%Y %H:%M:%S")

                if form_busq_filled.cleaned_data['usuario_alta'] == "":
                    usuario_alta = None
                else:
                    try:
                        usuario_alta = User.objects.get(
                            username=form_busq_filled.cleaned_data['usuario_alta'])
                    except User.DoesNotExist, e:
                        response = HttpResponse(
                            _('Usuario no existe'), status=404)
                        response['Content-Length'] = len(response.content)
                        return response

                if form_busq_filled.cleaned_data['id_cliente'] != "":

                    operacion = form_busq_filled.cleaned_data['id_cliente']
                    flagClienteContrato = "0"
                    myFilter = Filter()
                    cliente_existe = myFilter.getDetalleClienteId(
                        pEntidadId=user_entity, pClienteId=operacion, pUser=request.user)
                    LOG.debug("cliente_existe: %s" % cliente_existe)
                    if len(cliente_existe) == 0:
                        response = HttpResponse(
                            _('ID Cliente no existe'), status=404)
                        response['Content-Length'] = len(response.content)
                        return response

                elif form_busq_filled.cleaned_data['id_contrato'] != "":
                    operacion = form_busq_filled.cleaned_data['id_contrato']
                    flagClienteContrato = "1"
                    myFilter = Filter()
                    contrato_existe = myFilter.getDetalleContratoId(
                        pEntidadId=user_entity, pContratoId=operacion, pUser=request.user)
                    if len(contrato_existe) == 0:
                        response = HttpResponse(
                            _('ID Contrato no existe'), status=404)
                        response['Content-Length'] = len(response.content)
                        return response
                else:
                    operacion = None
                    flagClienteContrato = None

                exclusiones_filter = Filter()

                try:
                    results = exclusiones_filter.exclusionesFilter(pEntidad=user_entity, pOperacionId=operacion, pFlagContratoCliente=flagClienteContrato, pFinalidad=finalidad,
                                                                   pFinalidadId=environment, pTipoExclusion=tipoExclusionObject, pFechaIni=fecha_inicio, pFechaFin=fecha_fin, pUser=usuario_alta)
                except Exception as e:
                    response = HttpResponse(str(e), status=401)
                    response['Content-Length'] = len(response.content)
                    return response

                exclusiones_filtered = [results.as_dict()
                                        for results in results]

                if exclusiones_filtered.count > 0:
                    return HttpResponse(json.dumps(exclusiones_filtered), content_type="application/json")
                else:
                    return HttpResponse("0")
            else:
                return HttpResponse(form_busq_filled.errors)
    else:
        mylan = get_current_language(request)
        envperm = request.GET['environment']
        form_busq = BuscarExclusiones(
            auto_id=False, lan=mylan, finalidad=envperm)
        return render_to_response('html/analisis/buscar_exclusiones.html', {'form_busq': form_busq, 'lan': mylan, 'user': request.user, 'envperm': envperm, 'ctxperm': get_permission_context(request)}, RequestContext(request))


def buscar_tramos_exclusiones(request):
    form_busq = FiltroBuscarExclusionesContrato(auto_id=False)
    lan = get_current_language(request)
    NaN_msg = Configuracion.objects.get(clave='modellica.text.nan').valor
    return render_to_response('html/analisis/buscar_tramos_exclusiones.html', {'form': form_busq, 'lan': lan, "NaN_msg": NaN_msg}, RequestContext(request))


def buscar_tramos(request):
    lan = get_current_language(request)
    form_busq = FiltroBuscarAjustesContrato(auto_id=False, lan=lan)
    NaN_msg = Configuracion.objects.get(clave='modellica.text.nan').valor
    return render_to_response('html/analisis/buscar_tramos.html', {'form': form_busq, 'lan': lan, "NaN_msg": NaN_msg}, RequestContext(request))


def consulta_cliente(request):
    if request.method == "POST":
        if request.is_ajax():
            id_customer = request.POST['id_cliente']
            LOG.info(id_customer)
            LOG.info(type(id_customer))
            finalidad = request.POST['environment']
            flagclientecontrato = 0
            usuario = request.user
            entidad = get_user_entity_id(usuario)
            try:
                my_filter = Filter()
                latest_execution = my_filter.getLastExecutionsOperacion(
                    pEntidadId=entidad, pFinalidadId=finalidad, pOperacionId=id_customer, pFlagClienteContrato=flagclientecontrato, pUser=usuario)
                cells = []
                info = {}
                LOG.debug(latest_execution)
                for cell in latest_execution:
                    if cell:
                        aux = {}
                        LOG.error(cell[0].value)
                        contratos = []
                        aux_cell = json.loads(cell[0].value)
                        detalle_contrato = my_filter.getDetalleContratoId(
                            pEntidadId=entidad, pContratoId=aux_cell['contract_id']['value'], pUser=usuario)[0].value
                        for contract in cell:
                            contratos.append(json.loads(contract.value))

                        # aux["contrato"] = json.loads(cell[0].value)
                        aux['results'] = contratos
                        aux["detalle"] = sustDimensiones(json.loads(
                            detalle_contrato), id_customer, entidad)
                        cells.append(aux)
                todo = {}
                todo["contratos"] = cells
                todo["cliente"] = json.loads(my_filter.getDetalleClienteId(
                    pEntidadId=entidad, pClienteId=id_customer, pUser=usuario)[0].value)
                LOG.debug("Datos ultima ejecucion: %s" % todo)
                if cells == []:
                    raise Http404(_('Cliente no encontrado'))
                return HttpResponse(json.dumps(todo), content_type="application/json")
            except PopupException, e:
                response = HttpResponse(
                    _('Conexión HBase caída') + ": %s" % str(e), status=405)
                response['Content-Length'] = len(response.content)
                return response
            except IndexError, e:
                response = HttpResponse(_('Cliente no encontrado'), status=404)
                response['Content-Length'] = len(response.content)
                return response
    else:
        form_filter = ConsultaPorClienteFiltro(auto_id=False)
        lan = get_current_language(request)
        NaN_msg = Configuracion.objects.get(clave='modellica.text.nan').valor
        return render_to_response('html/analisis/consulta_cliente.html', {'form_filter': form_filter, 'lan': lan, 'NaN_msg': NaN_msg}, RequestContext(request))


def consulta_contrato(request):
    if request.method == "POST":
        if request.is_ajax():
            form_busq = ConsultaPorContratoFiltro(request.POST)
            if form_busq.is_valid():
                id_contrato = form_busq.cleaned_data['id_contrato']
                LOG.debug(id_contrato)
                finalidad = form_busq.cleaned_data['environment']
                usuario = request.user
                entidad = get_user_entity_id(usuario)
                try:
                    my_filter = Filter()
                    latest_executions = my_filter.getLastExecutionsOperacion(
                        pEntidadId=entidad, pFinalidadId=finalidad, pOperacionId=id_contrato, pFlagClienteContrato=1, pUser=usuario)
                    jsonContracts = {}
                    jsonContracts["contracts"] = [json.loads(
                        execution.value) for execution in latest_executions[0]]
                    detalle_contrato = my_filter.getDetalleContratoId(
                        pEntidadId=entidad, pContratoId=id_contrato, pUser=usuario)[0].value
                    jsonContracts["detalle"] = sustDimensiones(
                        json.loads(detalle_contrato), id_contrato, entidad)
                    return HttpResponse(json.dumps(jsonContracts), content_type="application/json")
                except PopupException, e:
                    response = HttpResponse(
                        _('Conexión HBase caída') + ": %s" % str(e), status=405)
                    response['Content-Length'] = len(response.content)
                    return response
                except Exception, e:
                    response = HttpResponse(str(e), status=401)
                    response['Content-Length'] = len(response.content)
                    return response
            else:
                return HttpResponse(form_busq.errors)
    else:
        form_filter = ConsultaPorContratoFiltro(auto_id=False)
        lan = get_current_language(request)
        NaN_msg = Configuracion.objects.get(clave='modellica.text.nan').valor
        return render_to_response('html/analisis/consulta_contrato.html', {'form_filter': form_filter, 'lan': lan, 'NaN_msg': NaN_msg}, RequestContext(request))

# AJUSTES DE CONTRATO POR CLIENTE Y CONTRATO (MANUAL Y MASIVOS)


def detalle_ajuste_cliente(request):
    finalidad = request.POST['environment']
    finalidad_actual = request.POST['finalidad_actual']
    id_contrato = request.POST['id']
    datos_ajuste = Ajuste.objects.select_related('stageajustado__stage_id').select_related(
        'usuarioalta_id__id').get(id=id_contrato, finalidad=finalidad, tipo_id__lte=2)
    LOG.debug("DATOS AJUSTE: %s" % datos_ajuste.as_dict())

    if((datos_ajuste.importeajustado) != None):
        datos_ajuste.importeajustado = format_currency(
            request, datos_ajuste.importeajustado)

    if((datos_ajuste.porcentajeimporteajustado) != None):
        datos_ajuste.porcentajeimporteajustado = format_currency(
            request, datos_ajuste.porcentajeimporteajustado)

    detalle_aux = Filter()
    try:
        detalle = detalle_aux.getDetalle(datos_ajuste, request.user)
    except PopupException, e:
        raise HttpResponseNotAllowed(str(e))
    detalleJSON = {}
    detalleJSON["detalle"] = json.loads(detalle[0].value)
    return render_to_response('html/analisis/detalle_ajuste_cliente.html', {"ajuste": datos_ajuste, "detalle": sustDimensiones(pJson=detalleJSON["detalle"], pContratoId=datos_ajuste.operacion_id, pEntidadId=datos_ajuste.entidad.entidad_id), 'finalidad': finalidad, "finalidad_actual": finalidad_actual}, RequestContext(request))


def detalle_ajuste_contrato(request):
    finalidad = request.POST['environment']
    finalidad_actual = request.POST['finalidad_actual']
    id_contrato = request.POST['id']
    datos_ajuste = Ajuste.objects.select_related('stageajustado__stage_id').get(
        id=id_contrato, finalidad=finalidad, tipo_id__gt=2)
    LOG.debug("DATOS AJUSTE: %s" % datos_ajuste.as_dict())

    if((datos_ajuste.importeajustado) != None):
        datos_ajuste.importeajustado = format_currency(
            request, datos_ajuste.importeajustado)

    if((datos_ajuste.porcentajeimporteajustado) != None):
        datos_ajuste.porcentajeimporteajustado = format_currency(
            request, datos_ajuste.porcentajeimporteajustado)

    detalle_aux = Filter()
    try:
        detalle = detalle_aux.getDetalle(datos_ajuste, request.user)
    except PopupException, e:
        raise HttpResponseNotAllowed(str(e))
    detalleJSON = {}
    LOG.info(detalle[0].value)
    detalleJSON["detalle"] = json.loads(detalle[0].value)
    return render_to_response('html/analisis/detalle_ajuste_contrato.html', {"ajuste": datos_ajuste, "detalle": sustDimensiones(pJson=detalleJSON["detalle"], pContratoId=datos_ajuste.operacion_id, pEntidadId=datos_ajuste.entidad.entidad_id), 'finalidad': finalidad, "finalidad_actual": finalidad_actual}, RequestContext(request))


def detalle_ajuste_masivo_cliente(request):
    finalidad = request.POST['environment']
    finalidad_actual = request.POST['finalidad_actual']
    id_contrato = request.POST['id']
    datos_ajuste = Ajuste.objects.select_related('stageajustado__stage_id').select_related(
        'usuarioalta_id__id').get(id=id_contrato, finalidad=finalidad, tipo_id__lte=2)
    LOG.info(datos_ajuste.as_dict())

    if((datos_ajuste.lgdajustada) != None):
        datos_ajuste.lgdajustada = format_currency(
            request, datos_ajuste.lgdajustada)

    detalle_aux = Filter()
    try:
        detalle = detalle_aux.getDetalle(datos_ajuste, request.user)
    except PopupException, e:
        raise HttpResponseNotAllowed(str(e))
    detalleJSON = {}
    detalleJSON["detalle"] = json.loads(detalle[0].value)
    return render_to_response('html/analisis/detalle_ajuste_masivo_cliente.html', {"ajuste": datos_ajuste, "detalle": sustDimensiones(pJson=detalleJSON["detalle"], pContratoId=datos_ajuste.operacion_id, pEntidadId=datos_ajuste.entidad.entidad_id), 'finalidad': finalidad, "finalidad_actual": finalidad_actual}, RequestContext(request))


def detalle_ajuste_masivo_contrato(request):
    finalidad = request.POST['environment']
    finalidad_actual = request.POST['finalidad_actual']
    id_contrato = request.POST['id']
    datos_ajuste = Ajuste.objects.select_related('stageajustado__stage_id').get(
        id=id_contrato, finalidad=finalidad, tipo_id__gt=2)

    if((datos_ajuste.importeajustado) != None):
        datos_ajuste.importeajustado = format_currency(
            request, datos_ajuste.importeajustado)

    if((datos_ajuste.porcentajeimporteajustado) != None):
        datos_ajuste.porcentajeimporteajustado = format_currency(
            request, datos_ajuste.porcentajeimporteajustado)

    if((datos_ajuste.lgdajustada) != None):
        datos_ajuste.lgdajustada = format_currency(
            request, datos_ajuste.lgdajustada)

    detalle_aux = Filter()
    try:
        detalle = detalle_aux.getDetalle(datos_ajuste, request.user)
    except PopupException, e:
        raise HttpResponseNotAllowed(str(e))
    detalleJSON = {}
    detalleJSON["detalle"] = json.loads(detalle[0].value)
    return render_to_response('html/analisis/detalle_ajuste_masivo_contrato.html', {"ajuste": datos_ajuste, "detalle": sustDimensiones(pJson=detalleJSON["detalle"], pContratoId=datos_ajuste.operacion_id, pEntidadId=datos_ajuste.entidad.entidad_id), 'finalidad': finalidad, "finalidad_actual": finalidad_actual}, RequestContext(request))

# FIN AJUSTES CONTRATO


def detalle_ejecucion_cliente(request):
    finalidad = request.POST['environment']
    NaN_msg = Configuracion.objects.get(clave='modellica.text.nan').valor
    return render_to_response('html/analisis/detalle_ejecucion_cliente.html', {'form_filter': form_filter, 'finalidad': finalidad, "NaN_msg": NaN_msg}, RequestContext(request))


def detalle_ejecucion_contrato(request):
    finalidad = request.POST['environment']
    NaN_msg = Configuracion.objects.get(clave='modellica.text.nan').valor
    return render_to_response('html/analisis/detalle_ejecucion_contrato.html', {'form_filter': form_filter, 'finalidad': finalidad, "NaN_msg": NaN_msg}, RequestContext(request))

# DETALLE DE EXCLUSIONES A CONTRATOS


def detalle_exclusion_cliente(request):
    finalidad = request.POST['environment']
    finalidad_actual = request.POST['finalidad_actual']
    id_contrato = request.POST['id']
    LOG.debug("id_contrato: %s" % id_contrato)
    datos_exclusion = Exclusion.objects.select_related('finalidad_origen__id').select_related(
        'usuarioalta_id__id').get(id=id_contrato, finalidad=finalidad, tipo_id__lte=2)
    detalle_aux = Filter()
    try:
        detalle = detalle_aux.getDetalleExclusion(
            datos_exclusion, request.user)
    except PopupException, e:
        raise HttpResponseNotAllowed(str(e))
    detalleJSON = {}
    detalleJSON["detalle"] = json.loads(detalle[0].value)
    return render_to_response('html/analisis/detalle_exclusion_cliente.html', {'exclusion': datos_exclusion, "detalle": sustDimensiones(pJson=detalleJSON["detalle"], pContratoId=datos_exclusion.operacion_id, pEntidadId=datos_exclusion.entidad.entidad_id), 'finalidad': finalidad, "finalidad_actual": finalidad_actual}, RequestContext(request))


def detalle_exclusion_contrato(request):
    finalidad = request.POST['environment']
    finalidad_actual = request.POST['finalidad_actual']
    id_contrato = request.POST['id']
    datos_exclusion = Exclusion.objects.select_related('finalidad_origen__id').get(
        id=id_contrato, finalidad=finalidad, tipo_id__gt=2)
    detalle_aux = Filter()
    try:
        detalle = detalle_aux.getDetalleExclusion(
            datos_exclusion, request.user)
    except PopupException, e:
        raise HttpResponseNotAllowed(str(e))
    detalleJSON = {}
    detalleJSON["detalle"] = json.loads(detalle[0].value)
    return render_to_response('html/analisis/detalle_exclusion_contrato.html', {'exclusion': datos_exclusion, "detalle": sustDimensiones(pJson=detalleJSON["detalle"], pContratoId=datos_exclusion.operacion_id, pEntidadId=datos_exclusion.entidad.entidad_id), 'finalidad': finalidad, "finalidad_actual": finalidad_actual}, RequestContext(request))


def detalle_exclusion_masivo_cliente(request):
    finalidad = request.POST['environment']
    finalidad_actual = request.POST['finalidad_actual']
    id_contrato = request.POST['id']
    datos_exclusion = Exclusion.objects.select_related('finalidad_origen__id').select_related(
        'usuarioalta_id__id').get(id=id_contrato, finalidad=finalidad, tipo_id__lte=2)
    detalle_aux = Filter()
    try:
        detalle = detalle_aux.getDetalleExclusion(
            datos_exclusion, request.user)
    except PopupException, e:
        raise HttpResponseNotAllowed(str(e))
    detalleJSON = {}
    detalleJSON["detalle"] = json.loads(detalle[0].value)
    return render_to_response('html/analisis/detalle_exclusion_masivo_cliente.html', {'exclusion': datos_exclusion, "detalle": sustDimensiones(pJson=detalleJSON["detalle"], pContratoId=datos_exclusion.operacion_id, pEntidadId=datos_exclusion.entidad.entidad_id), 'finalidad': finalidad, "finalidad_actual": finalidad_actual}, RequestContext(request))


def detalle_exclusion_masivo_contrato(request):
    finalidad = request.POST['environment']
    finalidad_actual = request.POST['finalidad_actual']
    id_contrato = request.POST['id']
    datos_exclusion = Exclusion.objects.select_related('finalidad_origen__id').get(
        id=id_contrato, finalidad=finalidad, tipo_id__gt=2)
    detalle_aux = Filter()
    try:
        detalle = detalle_aux.getDetalleExclusion(
            datos_exclusion, request.user)
    except PopupException, e:
        raise HttpResponseNotAllowed(str(e))
    detalleJSON = {}
    detalleJSON["detalle"] = json.loads(detalle[0].value)
    return render_to_response('html/analisis/detalle_exclusion_masivo_contrato.html', {'exclusion': datos_exclusion, "detalle": sustDimensiones(pJson=detalleJSON["detalle"], pContratoId=datos_exclusion.operacion_id, pEntidadId=datos_exclusion.entidad.entidad_id), 'finalidad': finalidad, "finalidad_actual": finalidad_actual}, RequestContext(request))

# FIN DETALLES EXCLUSIONES A CONTRATO


def ejecutar_reglas(request):
    if request.method == "POST":
        if request.is_ajax():
            LOG.error("check")

    else:
        finalidad = request.GET['environment']
        ejecuciones = Ejecucion.objects.select_related('usuarioalta__id').filter(
            finalidad_id=finalidad).order_by('-id')[:10]
        proyectos = Proyecto.objects.filter(
            finalidad=finalidad).order_by('tipoproyecto')

        lan = get_current_language(request)
        form_filter = EjecucionConsultaFiltro(auto_id=False, lan=lan)
        comparador = 'max.executions.' + finalidad
        # LOG.info("FINALIDAD A CONSULTAR MAX EJECUCIONES: %s" % comparador)
        max_executions_environment = Configuracion.objects.get(
            clave=comparador)
        # LOG.info("NUMERO MAXIMO EJECUCIONES DE LA FINALIDAD: %s" % max_executions_environment.valor)
        # LOG.debug(serializers.serialize('json', ejecuciones))
        return render_to_response('html/analisis/ejecutar_reglas.html', {'form_filter': form_filter, 'lan': lan, 'last_ten_executions': ejecuciones, 'user': request.user, 'projects': proyectos, 'envperm': finalidad, 'ctxperm': get_permission_context(request), 'max_executions_environment': max_executions_environment.valor}, RequestContext(request))


def importar_reglas(request):
    if request.method == "POST":
        try:
            if request.is_ajax():
                num_projects = TipoProyecto_enum.objects.count()

                json_dict = json.dumps(request.POST)
                json_dict = json.loads(json_dict)
                LOG.debug(json_dict)
                usuario = User.objects.get(username=request.user)

                # control variables for rules and params successfull import
                all_params_well = True
                all_rules_well = True

                for i in range(1, num_projects + 1):
                    params_import = ParametrosProyecto()
                    filter_string = str(i)
                    sub_dict = dict(
                        (key, value) for key, value in json_dict.items() if filter_string in key)
                    LOG.info(sub_dict)
                    ruta = Configuracion.objects.get(clave='ftp.dst.path')

                    if "rules_check_" + str(i) in sub_dict:
                        rules_import = ReglasProyecto()

                        importRule = FTPdao()

                        # aux variables to simplify coding below
                        entidad_id_comp = sub_dict[
                            'entidad_id_rules_' + str(i)]
                        environment = json_dict['environment']

                        # Objects that FTPDao object will need when calling
                        # method importReglas()
                        entidad = Entidad.objects.get(
                            entidad_id=entidad_id_comp)
                        finalidad = Finalidad.objects.get(id=environment)
                        tipoProyecto = TipoProyecto_enum.objects.get(
                            id=json_dict['tipoproyecto_id_rules_' + str(i)])

                        res_import = importRule.importReglas(
                            entidad, finalidad, tipoProyecto)
                        if not isinstance(res_import, basestring):
                            rules_import.usuarioalta_id = usuario.pk
                            rules_import.usuarioultimaactualizacion_id = usuario.pk
                            rules_import.fechaalta = datetime.now()
                            rules_import.fechaultimaactualizacion = datetime.now()
                            rules_import.proyecto_id = sub_dict[
                                'project_id_rules_' + str(i)]
                            rules_import.motivo = sub_dict[
                                'rules_desc_' + str(i)]
                            rules_import.ruta = res_import[1]
                            rules_import.nombrefichero = res_import[0]
                            rules_import.entidad_id = sub_dict[
                                'entidad_id_rules_' + str(i)]
                            rules_import.save()
                            if 'tipoproyecto_id_params_' + str(i) in sub_dict:
                                tipoproyecto = sub_dict[
                                    'tipoproyecto_id_params_' + str(i)]
                        else:
                            LOG.error(res_import)
                            all_rules_well = False

                        # LOG.info("Resultado de la importación: %s" %
                        # res_import)

                    if "param_select_file_" + str(i) in sub_dict:

                        importParams = FTPdao()

                        # aux variables to simplify coding below
                        entidad_id_comp = sub_dict[
                            'entidad_id_params_' + str(i)]
                        environment = json_dict['environment']

                        # Objects that FTPDao object will need when calling
                        # method importReglas()
                        entidad = Entidad.objects.get(
                            entidad_id=entidad_id_comp)
                        finalidad = Finalidad.objects.get(id=environment)
                        tipoProyecto = TipoProyecto_enum.objects.get(
                            id=json_dict['tipoproyecto_id_params_' + str(i)])

                        res_import = importParams.importParametros(
                            entidad, finalidad, tipoProyecto, sub_dict['param_select_file_' + str(i)])

                        LOG.debug(res_import)
                        if not isinstance(res_import, basestring):
                            params_import = ParametrosProyecto()
                            params_import.usuarioalta_id = usuario.pk
                            params_import.usuarioultimaactualizacion_id = usuario.pk
                            params_import.fechaalta = datetime.now()
                            params_import.fechaultimaactualizacion = datetime.now()
                            params_import.proyecto_id = sub_dict[
                                'project_id_rules_' + str(i)]
                            params_import.motivo = sub_dict[
                                'desc_param_' + str(i)]
                            params_import.ruta = res_import[1]
                            params_import.nombrefichero = res_import[0]
                            params_import.entidad_id = sub_dict[
                                'entidad_id_params_' + str(i)]

                            params_import.save()

                        else:
                            LOG.error(res_import)
                            all_params_well = False
                if all_params_well and all_rules_well:
                    return HttpResponse("ok")
                else:
                    response = HttpResponse(
                        _('Error al importar reglas'), status=400)
                    response['Content-Length'] = len(response.content)
                    return response

        except Exception as e:
            LOG.error(str(e))
            if 'referenced before assignment' in str(e):
                response = HttpResponse(
                    _('No se ha podido conectar con el servidor FTP. Por favor, revisa tu configuración'), status=405)
                response['Content-Length'] = len(response.content)
                return response
            else:
                response = HttpResponse(
                    _('No existen ficheros en la ruta definida'), status=401)
                response['Content-Length'] = len(response.content)
                return response
            # return HttpResponse(str(e), status=401)
    else:
        envperm = request.GET['environment']
        mylan = get_current_language(request)
        form_reglas_params = ImportReglasParams(auto_id=False)
        projects = Proyecto.objects.filter(
            finalidad=envperm).order_by("tipoproyecto")
        list_projects = [project.as_dict() for project in projects]
        return render_to_response('html/analisis/importar_reglas.html', {'form': form_reglas_params, 'lan': mylan, 'projects': list_projects, 'envperm': envperm, 'ctxperm': get_permission_context(request)}, RequestContext(request))


def modal_confirmacion(request):
    lan = get_current_language(request)
    return render_to_response('html/includes/modalConfImp.html', {'lan': lan}, RequestContext(request))


def modal_confirmacion_new_execution(request):
    lan = get_current_language(request)
    return render_to_response('html/includes/modalConfNewExecution.html', {'lan': lan}, RequestContext(request))


def modal_delete(request):
    lan = get_current_language(request)
    return render_to_response('html/includes/modalDelete.html', {'lan': lan}, RequestContext(request))


def modal_existe(request):
    lan = get_current_language(request)
    return render_to_response('html/includes/modalExiste.html', {'lan': lan}, RequestContext(request))


def modal_operaciones(request):
    lan = get_current_language(request)
    return render_to_response('html/includes/modalOperaciones.html', {'lan': lan}, RequestContext(request))


def modal_parametros(request):
    lan = get_current_language(request)
    return render_to_response('html/includes/modalParametros.html', {'lan': lan}, RequestContext(request))


def modal_parametros_subida(request):
    lan = get_current_language(request)
    return render_to_response('html/includes/modalParametrosSubida.html', {'lan': lan}, RequestContext(request))


def modal_calculo_provisiones_subida(request):
    lan = get_current_language(request)
    return render_to_response('html/includes/modalCalculoProvisionesSubida.html', {'lan': lan}, RequestContext(request))


def modal_reglas(request):
    lan = get_current_language(request)
    return render_to_response('html/includes/modalReglas.html', {'lan': lan}, RequestContext(request))


def modal_settings(request):
    lan = get_current_language(request)
    return render_to_response('html/includes/modalSettings.html', {'lan': lan}, RequestContext(request))


def importar_menu(request):
    mylan = get_current_language(request)
    perms = get_permission_context(request)
    license = License()
    licenseAjustes = license.ajustes
    licenseExclusiones = license.exclusiones
    licenseConsultas = license.consultas
    licencias = {}
    licencias['ajustes'] = licenseAjustes
    licencias['exclusiones'] = licenseExclusiones
    licencias['consultas'] = licenseConsultas

    return render_to_response('html/includes/menu.html', {'lan': mylan, 'ctxperm': perms, 'licencias': licencias}, RequestContext(request))

# Retrieve FTP list


def retrieve_ftp_filelist(request):
    # This method will return a JSON object
    if request.method == "POST":
        try:
            if request.is_ajax():
                num_projects = TipoProyecto_enum.objects.count()
                id_project = request.POST['id_project']

                environment = request.POST['environment']
                tipoProyecto = Proyecto.objects.get(
                    tipoproyecto=int(id_project), finalidad=environment)
                entidad = get_user_entity_id(request.user.pk)
                finalidad = Finalidad.objects.get(
                    id=environment, entidad=entidad)

                ftp = FTPdao()
                try:
                    listParameters = ftp.listParametros(
                        pEntidad=entidad, pFinalidad=finalidad, pTipoProyecto=TipoProyecto_enum.objects.get(id=int(id_project)))
                    params = []
                    last_update = ""
                    for p in listParameters:
                        last_update = datetime.fromtimestamp(
                            p.st_mtime).strftime('%Y-%m-%d %H:%M:%S')
                        params.append((p.filename, p.st_size, last_update))
                    data = json.dumps(params)
                    return HttpResponse(data, content_type="application/json")
                except Exception as e:
                    response = HttpResponse(_('Ruta vacia'), status=404)
                    response['Content-Length'] = len(response.content)
                    return response
        except Exception as e:
            return HttpResponse(e)


def date_handler(obj):
    if hasattr(obj, 'isoformat'):
        return obj.isoformat()
    else:
        raise TypeError


def filter_executions(request):
    lan = get_current_language(request)
    if request.method == "POST":
        if request.is_ajax():
            filtro = EjecucionConsultaFiltro(request.POST, lan=lan)
            if filtro.is_valid():
                environment = request.POST['environment']
                entidad = EntidadUsuario.objects.get(
                usuario=request.user.pk)
                #entidad = Entidad.objects.get(usuarios=entidadUsuario)
                finalidad = Finalidad.objects.get(pk=environment)

                if filtro.cleaned_data['usuario'] == "":
                    usuario_filter = None
                else:
                    try:
                        usuario_filter = User.objects.get(
                            username=filtro.cleaned_data['usuario']).pk
                    except User.DoesNotExist, e:
                        response = HttpResponse(
                            _('Usuario no existe'), status=404)
                        response['Content-Length'] = len(response.content)
                        return response

                # if filtro.cleaned_data['usuario'] == '':
                #     usuario_filter = None
                # else:
                #     usuario_filter = User.objects.get(
                #         username=filtro.cleaned_data['usuario']).pk
                # Preparing date fields to perform filtering
                fecha_ini = filtro.cleaned_data['fecha_inicio']
                if fecha_ini != '':
                    fecha_ini = datetime.strptime(fecha_ini, "%d-%m-%Y")
                else:
                    fecha_ini = None
                fecha_fin = filtro.cleaned_data['fecha_fin']
                if fecha_fin != '':
                    # fecha_fin = datetime.strptime(fecha_fin, "%d-%m-%Y")
                    # Se actualiza la fecha fin a final del día para que en caso de que las dos fechas
                    # informadas sean las mismas, se obtenga ese día
                    fecha_fin = datetime.combine(datetime.strptime(
                        fecha_fin, "%d-%m-%Y"), time(23, 59, 59)).isoformat()
                else:
                    fecha_fin = None
                # LOG.info('fecha_ini: %s | fecha_fin: %s' % (fecha_ini,
                # fecha_fin))
                filtro_search = Filter()

                if filtro.cleaned_data['estado'] == '0':
                    valor_estado = None
                else:
                    valor_estado = filtro.cleaned_data['estado']

                results = filtro_search.ejecucionFilter(
                    entidad, finalidad, valor_estado, fecha_ini, fecha_fin, usuario_filter)
                # for e in results:
                #     print(e.usuarioalta.first_name)
                executions_filtered = [results.as_dict()
                                       for results in results]
                if executions_filtered.count > 0:
                    return HttpResponse(json.dumps(executions_filtered), content_type="application/json")
                else:
                    return HttpResponse("0")
            else:
                LOG.error("Error al filtrar ejecuciones")


def load_detail_execution(request):
    if request.method == "POST":
        if request.is_ajax():
            execution = Ejecucion.objects.filter(
                id=request.POST['execution_id'])
            my_execution = [myexec.as_dict() for myexec in execution]

            project_execution = EjecucionProyecto.objects.filter(
                ejecucion_id=request.POST['execution_id'])
            list_project_execution = [exec_proy.as_dict()
                                      for exec_proy in project_execution]

            result = {}
            result['execution'] = my_execution
            result['projects'] = list_project_execution

            return HttpResponse(json.dumps(result), content_type="application/json")


def get_rules_project(request):
    if request.method == "POST":
        if request.is_ajax():
            id_project = request.POST['id_project']
            environment = request.POST['environment']
            finalidad_proyecto = Proyecto.objects.get(
                finalidad=environment, id=id_project)

            reglas_proyecto = ReglasProyecto.objects.filter(
                proyecto_id=finalidad_proyecto.id).order_by('-fechaalta')
            list_rules = [reglas.as_dict() for reglas in reglas_proyecto]
            return HttpResponse(json.dumps(list_rules), content_type="application/json")


def get_params_project(request):
    if request.method == "POST":
        if request.is_ajax():
            id_project = request.POST['id_project']
            environment = request.POST['environment']
            finalidad_proyecto = Proyecto.objects.get(
                finalidad=environment, id=id_project)
            params_proyecto = ParametrosProyecto.objects.filter(
                proyecto_id=finalidad_proyecto.id).order_by('-fechaalta')

            list_params = [params.as_dict() for params in params_proyecto]
            return HttpResponse(json.dumps(list_params), content_type="application/json")


def get_operations(request):
    if request.method == "POST":
        if request.is_ajax():
            # operations = FicheroEntrada.objects.all()
            # list_operations = [operation.as_dict() for operation in operations]
            # return HttpResponse(json.dumps(list_operations),
            # content_type="application/json")
            # operations = FicheroEntrada.objects.all()
            # list_operations = [operation.as_dict() for operation in
            # operations]
            operations_dao = HIVEdao()
            user = request.user
            dbname = Configuracion.objects.get(clave='hive.dbname.input').valor
            entidad = get_user_entity_id(user)
            table_name_key = 'hive.table.input.' + entidad
            LOG.info(table_name_key)
            table_name = Configuracion.objects.get(clave=table_name_key).valor
            try:
                operations = operations_dao.get_partitions(
                    pUser=user, pDbName=dbname, pTableName=table_name)
                LOG.info("operations type %s" % type(operations))
                return HttpResponse(json.dumps(operations), content_type="application/json")
            except PopupException, e:
                response = HttpResponse(str(e), status=405)
                response["Content-Length"] = len(response.content)
                return response
            except Exception as e:
                response = HttpResponse(
                    str(e), status=404)
                response['Content-Length'] = len(response.content)
                return response
                LOG.error(str(e))


def submit_execution(request):
    # TODO add validations
    if request.method == "POST":
        environment = request.POST['new_execution_env']
        comp = 'max.executions.' + environment
        # LOG.info("FINALIDAD A CONSULTAR MAX EJECUCIONES: %s" % comp)
        mee = Configuracion.objects.get(clave=comp)
        total_planned = Ejecucion.objects.filter(
            estado=1, finalidad=environment)
        total_executing = Ejecucion.objects.filter(
            estado=2, finalidad=environment)
        total = total_planned.count() + total_executing.count()
        # LOG.debug("total_planned : %s" % total_planned)
        # LOG.debug("total_executing : %s" % total_executing)
        # LOG.debug("max_executions_environment: %s" %  mee.valor)
        # LOG.debug("total: %s" % total)
        if int(total) >= int(mee.valor):
            return HttpResponse("Maximo de ejecuciones planeadas alcanzado")

        entidad_id = get_user_entity_id(request.user.pk)
        new_execution = Ejecucion()
        new_execution.estado = Estado_enum.objects.get(pk=1)
        # new_execution.fichero = FicheroEntrada.objects.get(
        #     pk=request.POST['ops_selected_id'])
        new_execution.fichero = request.POST['ops_selected_id']
        new_execution.comentario = request.POST['desc_param_']
        new_execution.entidad = Entidad.objects.get(pk=entidad_id)
        new_execution.finalidad = Finalidad.objects.get(
            pk=request.POST['new_execution_env'])
        new_execution.usuarioalta_id = request.user.pk
        new_execution.usuarioultimaactualizacion_id = request.user.pk

        new_execution.save()

        last_execution = Ejecucion.objects.latest('pk')
        last_id = last_execution.id

        projects = Proyecto.objects.filter(
            finalidad_id=request.POST['new_execution_env'])

        for project in projects:
            current_id_project = project.id
            json_dict = json.dumps(request.POST)
            json_dict = json.loads(json_dict)
            sub_dict = dict((key, value) for key, value in json_dict.items() if str(
                current_id_project) in key)
            # for elem in sub_dict:

            ejecucion_proyecto = EjecucionProyecto()
            ejecucion_proyecto.ejecucion_id = last_id
            ejecucion_proyecto.proyecto_id = current_id_project
            ejecucion_proyecto.reglas_id = sub_dict[
                'id_rules_' + str(current_id_project)]
            LOG.debug(sub_dict)
            if 'id_params_' + str(current_id_project) in sub_dict:
                ejecucion_proyecto.parametros_id = sub_dict[
                    'id_params_' + str(current_id_project)]
            else:
                ejecucion_proyecto.parametros_id = None
            ejecucion_proyecto.save()

        return HttpResponse("ok")


def refresh_last_ten_executions(request):
    if request.method == "POST" and request.is_ajax():
        finalidad = request.POST['environment']
        ejecuciones = Ejecucion.objects.select_related('usuarioalta__id').filter(
            finalidad_id=finalidad).order_by('-id')[:10]

        last_ten_executions = [results.as_dict() for results in ejecuciones]
        if last_ten_executions.count > 0:
            return HttpResponse(json.dumps(last_ten_executions), content_type="application/json")
        else:
            return HttpResponse("0")


def comfirm_delete_ajuste(request):
    if request.method == "POST":
        if request.is_ajax():
            id_ajuste = request.POST['id']
            ajuste = Ajuste.objects.get(id=id_ajuste)
            filter_dao = Filter()
            res_borrado = filter_dao.deleteAjuste(ajuste)
            return HttpResponse(res_borrado)
            # 0 = ajuste borrado de base de datos
            # 1 actualizada fecha fin ajuste
            # 2 ajuste no se toca


def comfirm_delete_exclusion(request):
    if request.method == "POST":
        if request.is_ajax():
            id_exclusion = request.POST['id']
            exclusion = Exclusion.objects.get(id=id_exclusion)
            filter_dao = Filter()
            res_borrado = filter_dao.deleteExclusion(exclusion)
            return HttpResponse(res_borrado)
            # 0 = exclusion borrado de base de datos
            # 1 actualizada fecha fin exclusion
            # 2 exclusion no se toca


def search_adjustments_application(request):
    if request.method == "POST":
        if request.is_ajax():
            form_busq = FiltroBuscarAjustesContrato(request.POST)
            if form_busq.is_valid():

                return HttpResponse("OK")

            else:
                LOG.debug(form_busq.errors)
                return HttpResponse("KO")


def search_exclusions_application(request):
    if request.method == "POST":
        if request.is_ajax():
            form_busq = FiltroBuscarExclusionesContrato(request.POST)
            if form_busq.is_valid():

                return HttpResponse("OK")

            else:
                LOG.debug(form_busq.errors)
                return HttpResponse("KO")


def search_info_contract_for_adjustment_insert(request):
    if request.method == "POST":
        if request.is_ajax():
            id_contract = request.POST['id']
            finalidad = request.POST['environment']
            flagclientecontrato = request.POST['flagclientecontrato']
            usuario = request.user
            entidad = get_user_entity_id(usuario)

            try:
                my_filter = Filter()
                detalle_contrato = json.loads(my_filter.getDetalleContratoId(
                    pEntidadId=entidad, pContratoId=id_contract, pUser=usuario)[0].value)
                latest_execution = my_filter.getLastExecutionOperacion(
                    pEntidadId=entidad, pFinalidadId=finalidad, pOperacionId=id_contract, pFlagClienteContrato=flagclientecontrato, pUser=usuario)
                return_value = json.loads(latest_execution[0][0].value)
                return_value["currency"] = detalle_contrato["currency"]
                return HttpResponse(json.dumps(return_value))
            except PopupException, e:
                # raise HttpResponseNotAllowed(str(e))
                response = HttpResponse(str(e), status=405)
                response["Content-Length"] = len(response.content)
                return response
            except IndexError:
                raise Http404(_('Contrato no encontrado'))


def modal_confirmacion_new_adjustment_contract(request):
    lan = get_current_language(request)
    return render_to_response('html/includes/modalConfNewAdjustmentContract.html', {'lan': lan}, RequestContext(request))


def modal_confirmacion_new_adjustment_customer(request):
    lan = get_current_language(request)
    return render_to_response('html/includes/modalConfNewAdjustmentCustomer.html', {'lan': lan}, RequestContext(request))


def modal_confirmacion_new_exclusion_contract(request):
    lan = get_current_language(request)
    return render_to_response('html/includes/modalConfNewExclusionContract.html', {'lan': lan}, RequestContext(request))


def modal_confirmacion_new_exclusion_customer(request):
    lan = get_current_language(request)
    return render_to_response('html/includes/modalConfNewExclusionCustomer.html', {'lan': lan}, RequestContext(request))


def add_new_adjustment_by_contract(request):
    if request.method == "POST":
        if request.is_ajax():
            form_alta = DatosAltaGenericAnalisisForm(request.POST)
            if form_alta.is_valid():
                identificador = request.POST['id_contrato']
                entidad = Entidad.objects.get(
                    entidad_id=get_user_entity_id(request.user.pk))
                my_filter = Filter()
                if int(form_alta.cleaned_data['stage']) == 0:
                    stage = None
                else:
                    stage = Stage_enum.objects.get(
                        stage_id=form_alta.cleaned_data['stage'])

                if form_alta.cleaned_data['importe'] == "":
                    importe = None
                else:
                    importe = form_alta.cleaned_data['importe_hidden']

                if form_alta.cleaned_data['porcentaje_importe'] == "":
                    porcentaje_importe = None
                else:
                    porcentaje_importe = form_alta.cleaned_data[
                        'porcentaje_importe_hidden']

                fecha_inicio = datetime.strptime(
                    form_alta.cleaned_data['fecha_inicio'], "%d-%m-%Y")
                fecha_fin = datetime.strptime(
                    form_alta.cleaned_data['fecha_fin'], "%d-%m-%Y")
                comentario = form_alta.cleaned_data['comentarios']
                flagclientecontrato = form_alta.cleaned_data[
                    'flagclientecontrato']
                finalidad = Finalidad.objects.get(
                    id=form_alta.cleaned_data['environment'])

                detalle_contrato = my_filter.getDetalleContratoId(
                    pEntidadId=entidad.pk, pContratoId=identificador, pUser=request.user)
                detalle_contrato = json.loads(detalle_contrato[0].value)

                moneda_contrato = detalle_contrato["currency"]["value"]

                moneda = Moneda_enum.objects.get(
                    moneda_id=moneda_contrato)

                tipo_ajuste = Tipoajuste_enum.objects.get(
                    tipo_id=form_alta.cleaned_data['tipo_ajuste'])

                new_ajuste = Ajuste()
                new_ajuste.fechaini = fecha_inicio
                new_ajuste.fechafin = fecha_fin
                new_ajuste.comentario = comentario
                new_ajuste.finalidadorigen = finalidad
                new_ajuste.tipo = tipo_ajuste
                new_ajuste.finalidad = finalidad
                new_ajuste.importeajustado = importe
                new_ajuste.moneda = moneda
                new_ajuste.porcentajeimporteajustado = porcentaje_importe
                new_ajuste.lgdajustada = None
                new_ajuste.stageajustado = stage
                new_ajuste.flagclientecontrato = flagclientecontrato
                new_ajuste.entidad = entidad
                new_ajuste.operacion_id = identificador
                new_ajuste.usuarioalta_id = request.user.pk
                new_ajuste.usuarioultimaactualizacion_id = request.user.pk

                try:
                    new_ajuste.save()
                    new_ajuste.ajusteorigen = Ajuste.objects.latest('id')
                    new_ajuste.save()
                except Exception:
                    LOG.debug(Exception)
                    raise Http404(_('Error al insertar ajuste por contrato'))
                return HttpResponse("form ok")
            else:
                LOG.debug(form_alta.errors)
                return HttpResponse("form ko")


def add_new_adjustment_by_customer(request):
    if request.method == "POST":
        if request.is_ajax():
            form_alta = DatosAltaGenericAnalisisForm(request.POST)
            if form_alta.is_valid():
                if int(form_alta.cleaned_data['stage']) == 0:
                    stage = None
                else:
                    stage = Stage_enum.objects.get(
                        stage_id=form_alta.cleaned_data['stage'])

                if form_alta.cleaned_data['importe'] == "":
                    importe = None
                else:
                    importe = form_alta.cleaned_data['importe_hidden']

                if form_alta.cleaned_data['porcentaje_importe'] == "":
                    porcentaje_importe = None
                else:
                    porcentaje_importe = form_alta.cleaned_data[
                        'porcentaje_importe_hidden']

                fecha_inicio = datetime.strptime(
                    form_alta.cleaned_data['fecha_inicio'], "%d-%m-%Y")
                fecha_fin = datetime.strptime(
                    form_alta.cleaned_data['fecha_fin'], "%d-%m-%Y")
                comentario = form_alta.cleaned_data['comentarios']
                flagclientecontrato = form_alta.cleaned_data[
                    'flagclientecontrato']
                finalidad = Finalidad.objects.get(
                    id=form_alta.cleaned_data['environment'])
                moneda = Moneda_enum.objects.get(
                    moneda_id=form_alta.cleaned_data['moneda'])
                tipo_ajuste = Tipoajuste_enum.objects.get(
                    tipo_id=form_alta.cleaned_data['tipo_ajuste'])

                new_ajuste = Ajuste()
                new_ajuste.fechaini = fecha_inicio
                new_ajuste.fechafin = fecha_fin
                new_ajuste.comentario = comentario
                new_ajuste.finalidadorigen = finalidad
                new_ajuste.tipo = tipo_ajuste
                new_ajuste.finalidad = finalidad
                new_ajuste.importeajustado = importe
                new_ajuste.moneda = moneda
                new_ajuste.porcentajeimporteajustado = porcentaje_importe
                new_ajuste.lgdajustada = None
                new_ajuste.stageajustado = stage
                new_ajuste.flagclientecontrato = flagclientecontrato
                new_ajuste.entidad = Entidad.objects.get(
                    entidad_id=get_user_entity_id(request.user.pk))
                new_ajuste.operacion_id = request.POST['id_contrato']
                new_ajuste.usuarioalta_id = request.user.pk
                new_ajuste.usuarioultimaactualizacion_id = request.user.pk

                try:
                    new_ajuste.save()
                    new_ajuste.ajusteorigen = Ajuste.objects.latest('id')
                    new_ajuste.save()
                except Exception:
                    LOG.debug(Exception)
                    raise Http404(_('Error al insertar ajuste por cliente'))
                return HttpResponse("form ok")
            else:
                LOG.debug(form_alta.errors)
                return HttpResponse("form ko")


def add_new_exclusion_by_contract(request):
    if request.method == "POST":
        if request.is_ajax():
            form_alta = AltaExclusionGenericDatos(request.POST)
            if form_alta.is_valid():
                fecha_inicio = datetime.strptime(
                    form_alta.cleaned_data['fecha_inicio'], "%d-%m-%Y")
                fecha_fin = datetime.strptime(
                    form_alta.cleaned_data['fecha_fin'], "%d-%m-%Y")
                comentario = form_alta.cleaned_data['comentarios']
                finalidad = Finalidad.objects.get(
                    id=form_alta.cleaned_data['environment'])
                tipo_exclusion = Tipoexclusion_enum.objects.get(
                    tipo_id=form_alta.cleaned_data['tipo_exclusion'])
                flagclientecontrato = form_alta.cleaned_data[
                    'flagclientecontrato']

                new_exclusion = Exclusion()
                new_exclusion.fechaini = fecha_inicio
                new_exclusion.fechafin = fecha_fin
                new_exclusion.comentario = comentario
                new_exclusion.finalidadorigen = finalidad
                new_exclusion.tipo = tipo_exclusion
                new_exclusion.finalidad = finalidad
                new_exclusion.flagclientecontrato = flagclientecontrato
                new_exclusion.entidad = Entidad.objects.get(
                    entidad_id=get_user_entity_id(request.user.pk))
                new_exclusion.operacion_id = request.POST['id_contrato']
                new_exclusion.usuarioalta_id = request.user.pk
                new_exclusion.usuarioultimaactualizacion_id = request.user.pk

                try:
                    new_exclusion.save()
                    new_exclusion.exclusionorigen = Exclusion.objects.latest(
                        'id')
                    new_exclusion.save()
                except Exception as e:
                    LOG.debug(str(e))
                    raise Http404(
                        _('Error al insertar exclusión por contrato'))
                return HttpResponse("Alta exclusion ok")
            else:
                LOG.debug(form_alta.errors)
                return HttpResponse("Alta exclusion ko")


def add_new_exclusion_by_customer(request):
    if request.method == "POST":
        if request.is_ajax():
            form_alta = AltaExclusionGenericDatos(request.POST)
            if form_alta.is_valid():
                fecha_inicio = datetime.strptime(
                    form_alta.cleaned_data['fecha_inicio'], "%d-%m-%Y")
                fecha_fin = datetime.strptime(
                    form_alta.cleaned_data['fecha_fin'], "%d-%m-%Y")
                comentario = form_alta.cleaned_data['comentarios']
                finalidad = Finalidad.objects.get(
                    id=form_alta.cleaned_data['environment'])
                tipo_exclusion = Tipoexclusion_enum.objects.get(
                    tipo_id=form_alta.cleaned_data['tipo_exclusion'])
                flagclientecontrato = form_alta.cleaned_data[
                    'flagclientecontrato']

                new_exclusion = Exclusion()
                new_exclusion.fechaini = fecha_inicio
                new_exclusion.fechafin = fecha_fin
                new_exclusion.comentario = comentario
                new_exclusion.finalidadorigen = finalidad
                new_exclusion.tipo = tipo_exclusion
                new_exclusion.finalidad = finalidad
                new_exclusion.flagclientecontrato = flagclientecontrato
                new_exclusion.entidad = Entidad.objects.get(
                    entidad_id=get_user_entity_id(request.user.pk))
                new_exclusion.operacion_id = request.POST['id_contrato']
                new_exclusion.usuarioalta_id = request.user.pk
                new_exclusion.usuarioultimaactualizacion_id = request.user.pk

                try:
                    new_exclusion.save()
                    new_exclusion.exclusionorigen = Exclusion.objects.latest(
                        'id')
                    new_exclusion.save()
                except Exception:
                    LOG.debug(Exception)
                    raise Http404(_('Error al insertar exclusión por cliente'))
                return HttpResponse("Alta exclusion ok")
            else:
                LOG.debug(form_alta.errors)
                return HttpResponse("Alta exclusion ko")


def search_info_contract_for_adjustment_insert_by_client(request):
    if request.method == "POST":
        if request.is_ajax():
            id_customer = request.POST['id']
            finalidad = request.POST['environment']
            flagclientecontrato = request.POST['flagclientecontrato']
            usuario = request.user
            entidad = get_user_entity_id(usuario)

            try:
                my_filter = Filter()
                latest_execution = my_filter.getLastExecutionOperacion(
                    pEntidadId=entidad, pFinalidadId=finalidad, pOperacionId=id_customer, pFlagClienteContrato=flagclientecontrato, pUser=usuario)
                cells = []
                LOG.debug(latest_execution)
                for cell in latest_execution:
                    if cell:
                        contract_execution = json.loads(cell[0].value)
                        detalle_contrato = json.loads(my_filter.getDetalleContratoId(
                            pEntidadId=entidad, pContratoId=contract_execution["contract_id"]["value"], pUser=usuario)[0].value)
                        contract_execution[
                            "currency"] = detalle_contrato["currency"]
                        cells.append(contract_execution)

                LOG.debug("Datos ultima ejecucion: %s" % cells)
                detalle_cliente = my_filter.getDetalleClienteId(
                    pEntidadId=entidad, pClienteId=id_customer, pUser=usuario)[0].value

                detalleJSON = {}
                detalleJSON["detalle"] = json.loads(
                    detalle_cliente)
                detalleJSON['contracts'] = cells
                if cells == []:
                    raise Http404(_('Cliente no encontrado'))
                return HttpResponse(json.dumps(detalleJSON), content_type="application/json")
            except PopupException, e:
                raise HttpResponseNotAllowed(str(e))
            except IndexError:
                raise Http404(_('Cliente no encontrado'))


def get_detalle_cliente_alta_exclusion_cliente(request):
    if request.method == "POST":
        if request.is_ajax():
            customer_id = request.POST['customer_id']
            finalidad = request.POST['environment']
            usuario = request.user
            entidad = get_user_entity_id(usuario)
            my_filter = Filter()
            try:
                detalle_cliente = my_filter.getDetalleClienteId(
                    pEntidadId=entidad, pClienteId=customer_id, pUser=usuario)[0].value
                return HttpResponse(json.dumps(json.loads(detalle_cliente)), content_type="application/json")
            except IndexError as e:
                response = HttpResponse(_('Usuario no encontrado'), status=404)
                response['Content-Length'] = len(response.content)
                return response


def application_search_customer_exclusion(request):
    if request.method == "POST":
        if request.is_ajax():
            id_customer = request.POST['id']
            finalidad = request.POST['environment']
            usuario = request.user
            entidad = get_user_entity_id(usuario)

            try:
                # Fecha de inicio
                if request.POST['fechaini'] == "":
                    s = "01-01-1970"
                    fecha_inicio_formatted = datetime.strptime(s, "%d-%m-%Y")
                else:
                    fecha_inicio_formatted = datetime.strptime(
                        request.POST['fechaini'], "%d-%m-%Y")
                LOG.debug("Fecha inicio raw %s" % fecha_inicio_formatted)
                # Fecha de Fin
                if request.POST['fechafin'] == "":
                    s = "31-12-2999"
                    fecha_fin_formatted = datetime.strptime(s, "%d-%m-%Y")
                else:
                    fecha_fin_formatted = datetime.strptime(
                        request.POST['fechafin'] + " 23:59:59", "%d-%m-%Y %H:%M:%S")
                LOG.debug("Fecha fin raw %s" % fecha_fin_formatted)

                if fecha_inicio_formatted == fecha_fin_formatted:
                    fecha_fin_formatted_q = fecha_fin_formatted + \
                        timedelta(days=1)
                else:
                    fecha_fin_formatted_q = fecha_fin_formatted

                my_filter = Filter()
                usuario_consulta = my_filter.getDetalleClienteId(
                    pEntidadId=entidad, pClienteId=id_customer, pUser=usuario)

                if len(usuario_consulta) == 0:
                    raise Http404(_('Cliente no encontrado'))

                latest_execution = my_filter.getLastExecutionOperacion(
                    pEntidadId=entidad, pFinalidadId=finalidad, pOperacionId=id_customer, pFlagClienteContrato=0, pUser=usuario)
                cells = []
                LOG.debug(latest_execution)
                exclusionCliente = Exclusion.objects.filter(
                    operacion_id=id_customer, flagclientecontrato="0", finalidad=finalidad)

                exclusionCliente = exclusionCliente.filter(
                    fechaini__lte=fecha_fin_formatted_q, fechafin__gte=fecha_inicio_formatted)
                # exclusiones_contrato = exclusiones_contrato.filter(
                # fechaini__lte=fecha_fin_formatted,
                # fechafin__gte=fecha_inicio_formatted)

                LOG.debug("exclusionCliente %s" % exclusionCliente)

                for cell in latest_execution:
                    if cell:
                        ejec_contrato = json.loads(cell[0].value)
                        id_contrato = ejec_contrato["contract_id"]
                        if exclusionCliente is None or len(exclusionCliente) == 0:
                            exclusion = Exclusion.objects.filter(operacion_id=id_contrato[
                                "value"], flagclientecontrato="1", finalidad=finalidad)
                            exclusion = exclusion.filter(
                                fechaini__lte=fecha_fin_formatted_q, fechafin__gte=fecha_inicio_formatted)
                            if exclusion:
                                detalle_contrato = my_filter.getDetalleContratoId(
                                    pEntidadId=entidad, pContratoId=id_contrato['value'], pUser=usuario)[0].value
                                detalleJSON = {}
                                detalleJSON["detalle"] = json.loads(
                                    detalle_contrato)
                                # detalleJSON["no_criteria"] = '0'
                                ejec_contrato.update(sustDimensiones(
                                    pJson=detalleJSON["detalle"], pContratoId=id_contrato, pEntidadId=entidad))
                                cells.append(ejec_contrato)
                            else:
                                detalle_contrato = my_filter.getDetalleContratoId(
                                    pEntidadId=entidad, pContratoId=id_contrato['value'], pUser=usuario)[0].value
                                detalleJSON = {}
                                detalleJSON["detalle"] = json.loads(
                                    detalle_contrato)
                                no_criteria = {}
                                no_criteria["customer_id"] = detalleJSON[
                                    "detalle"]["customer_id"]["value"]
                                no_criteria["customer_name"] = detalleJSON[
                                    "detalle"]["customer_name"]["value"]
                                flag_results = {}
                                flag_results["no_criteria"] = '1'
                                flag_results['no_criteria_data'] = no_criteria

                        else:
                            detalle_contrato = my_filter.getDetalleContratoId(
                                pEntidadId=entidad, pContratoId=id_contrato['value'], pUser=usuario)[0].value
                            detalleJSON = {}
                            detalleJSON["detalle"] = json.loads(
                                detalle_contrato)
                            detalleJSON["no_criteria"] = '0'
                            ejec_contrato.update(sustDimensiones(
                                pJson=detalleJSON["detalle"], pContratoId=id_contrato, pEntidadId=entidad))
                            cells.append(ejec_contrato)

                if len(cells) == 0:
                    if 'flag_results' in locals():
                        cells.append(flag_results)
                    else:
                        flag_results = {}
                        flag_results["no_criteria"] = '0'
                        cells.append(flag_results)

                LOG.debug("Datos ultima ejecucion: %s" % cells)
                return HttpResponse(json.dumps(cells), content_type="application/json")
            except PopupException as e:
                # raise HttpResponseNotAllowed(str(e))
                response = HttpResponse(
                    _('Contratos no encontrados para este identificador de cliente') + ": %s" % e.message,  status=405)
                response['Content-Length'] = len(response.content)
                return response
            except IndexError as e:
                response = HttpResponse(
                    _('Contratos no encontrados para este identificador de cliente') + ": %s" % e.message,  status=401)
                response['Content-Length'] = len(response.content)
                return response
            except Exception as ex:
                LOG.error("El index es: %s" % id_customer)
                LOG.error("Mensaje de la exception: %s" % str(ex))
                response = HttpResponse(
                    _('Usuario no encontrado') + ": %s" % str(ex),  status=404)
                response['Content-Length'] = len(response.content)
                return response

    return 0


def application_search_customer(request):
    if request.method == "POST":
        if request.is_ajax():
            id_customer = request.POST['id']
            finalidad = request.POST['environment']
            usuario = request.user
            entidad = get_user_entity_id(usuario)
            dato_impactado = request.POST['dato_impactado']

            try:
                # Fecha de inicio
                if request.POST['fechaini'] == "":
                    s = "01-01-1970"
                    fecha_inicio_formatted = datetime.strptime(
                        s, "%d-%m-%Y").date()
                else:
                    fecha_inicio_formatted = datetime.strptime(
                        request.POST['fechaini'], "%d-%m-%Y").date()
                LOG.debug("Fecha inicio raw %s" % fecha_inicio_formatted)
                # Fecha de Fin
                if request.POST['fechafin'] == "":
                    s = "31-12-2999"
                    fecha_fin_formatted = datetime.strptime(
                        s, "%d-%m-%Y").date()
                else:
                    fecha_fin_formatted = datetime.strptime(
                        request.POST['fechafin'] + " 23:59:59", "%d-%m-%Y %H:%M:%S")
                LOG.debug("Fecha fin raw %s" % fecha_fin_formatted)

                if fecha_inicio_formatted == fecha_fin_formatted:
                    fecha_fin_formatted_q = fecha_fin_formatted + \
                        timedelta(days=1)
                else:
                    fecha_fin_formatted_q = fecha_fin_formatted

                # usuario_consulta = User.objects.get(pk=id_customer)
                my_filter = Filter()
                usuario_consulta = my_filter.getDetalleClienteId(
                    pEntidadId=entidad, pClienteId=id_customer, pUser=usuario)

                if len(usuario_consulta) == 0:
                    raise Http404(_('Cliente no encontrado'))

                latest_execution = my_filter.getLastExecutionOperacion(
                    pEntidadId=entidad, pFinalidadId=finalidad, pOperacionId=id_customer, pFlagClienteContrato=0, pUser=usuario)
                cells = []
                LOG.debug(latest_execution)
                ajusteCliente = Ajuste.objects.filter(
                    operacion_id=id_customer, flagclientecontrato="0", finalidad=finalidad)
                ajusteCliente = ajusteCliente.filter(
                    fechaini__lte=fecha_fin_formatted_q, fechafin__gte=fecha_inicio_formatted)
                LOG.debug("ajusteCliente %s" % ajusteCliente)

                if dato_impactado == "1":
                    ajusteCliente.exclude(importeajustado__isnull=True)

                if dato_impactado == "2":
                    ajusteCliente.exclude(
                        porcentajeimporteajustado__isnull=True)

                if dato_impactado == "3":
                    ajusteCliente.exclude(stageajustado__isnull=True)

                if dato_impactado == "4":
                    ajusteCliente.exclude(lgdajustada__isnull=True)

                for cell in latest_execution:
                    if cell:
                        ejec_contrato = json.loads(cell[0].value)
                        id_contrato = ejec_contrato["contract_id"]
                        if ajusteCliente is None or len(ajusteCliente) == 0:
                            ajuste = Ajuste.objects.filter(operacion_id=id_contrato[
                                "value"], flagclientecontrato="1", finalidad=finalidad)
                            ajuste = ajuste.filter(
                                fechaini__lte=fecha_fin_formatted_q, fechafin__gte=fecha_inicio_formatted)
                            if dato_impactado == "1":
                                ajuste = ajuste.exclude(
                                    importeajustado__isnull=True)

                            if dato_impactado == "2":
                                ajuste = ajuste.exclude(
                                    porcentajeimporteajustado__isnull=True)

                            if dato_impactado == "3":
                                ajuste = ajuste.exclude(
                                    stageajustado__isnull=True)

                            if dato_impactado == "4":
                                ajuste = ajuste.exclude(
                                    lgdajustada__isnull=True)

                            if ajuste:
                                detalle_contrato = my_filter.getDetalleContratoId(
                                    pEntidadId=entidad, pContratoId=id_contrato['value'], pUser=usuario)[0].value
                                detalleJSON = {}
                                detalleJSON["detalle"] = json.loads(
                                    detalle_contrato)
                                # detalleJSON["no_criteria"] = '0'
                                ejec_contrato.update(sustDimensiones(
                                    pJson=detalleJSON["detalle"], pContratoId=id_contrato, pEntidadId=entidad))
                                cells.append(ejec_contrato)
                            else:
                                detalle_contrato = my_filter.getDetalleContratoId(
                                    pEntidadId=entidad, pContratoId=id_contrato['value'], pUser=usuario)[0].value
                                detalleJSON = {}
                                detalleJSON["detalle"] = json.loads(
                                    detalle_contrato)
                                no_criteria = {}
                                no_criteria["customer_id"] = detalleJSON[
                                    "detalle"]["customer_id"]["value"]
                                no_criteria["customer_name"] = detalleJSON[
                                    "detalle"]["customer_name"]["value"]
                                flag_results = {}
                                flag_results["no_criteria"] = '1'
                                flag_results['no_criteria_data'] = no_criteria
                                # cells.append(flag_results)

                        else:
                            detalle_contrato = my_filter.getDetalleContratoId(
                                pEntidadId=entidad, pContratoId=id_contrato['value'], pUser=usuario)[0].value
                            detalleJSON = {}
                            detalleJSON["detalle"] = json.loads(
                                detalle_contrato)
                            detalleJSON["no_criteria"] = '0'
                            ejec_contrato.update(sustDimensiones(
                                pJson=detalleJSON["detalle"], pContratoId=id_contrato, pEntidadId=entidad))
                            cells.append(ejec_contrato)

                LOG.debug("Longitud de cells: %s" % len(cells))
                if len(cells) == 0:
                    if 'flag_results' in locals():
                        cells.append(flag_results)
                    else:
                        flag_results = {}
                        flag_results["no_criteria"] = '0'
                        cells.append(flag_results)

                LOG.debug("Datos ultima ejecucion: %s" % cells)
                return HttpResponse(json.dumps(cells), content_type="application/json")
            except PopupException as e:
                raise HttpResponseNotAllowed(str(e))
            except IndexError as e:
                response = HttpResponse(
                    _('Contratos no encontrados para este identificador de cliente') + ": %s" % e.message,  status=401)
                response['Content-Length'] = len(response.content)
                return response
            except Exception as ex:
                LOG.error("El index es: %s" % id_customer)
                LOG.error("Mensaje de la exception: %s" % str(ex))
                response = HttpResponse(
                    _('Usuario no encontrado') + ": %s" % str(ex),  status=404)
                response['Content-Length'] = len(response.content)
                return response

    return 0


def application_search_contract(request):
    if request.method == "POST":
        if request.is_ajax():
            id_contrato = request.POST['id']
            finalidad = request.POST['environment']
            usuario = request.user
            entidad = get_user_entity_id(usuario)
            dato_impactado = request.POST['dato_impactado']

            # Fecha de inicio
            if request.POST['fecha_inicio'] == "":
                s = "01-01-1970"
                fecha_inicio_formatted = datetime.strptime(
                    s, "%d-%m-%Y").date()
            else:
                fecha_inicio_formatted = datetime.strptime(
                    request.POST['fecha_inicio'], "%d-%m-%Y").date()
            # Fecha de Fin
            if request.POST['fecha_fin'] == "":
                s = "31-12-2999"
                fecha_fin_formatted = datetime.strptime(s, "%d-%m-%Y").date()
            else:
                fecha_fin_formatted = datetime.strptime(
                    request.POST['fecha_fin'], "%d-%m-%Y").date()

            if fecha_inicio_formatted == fecha_fin_formatted:
                fecha_fin_formatted_q = fecha_fin_formatted + timedelta(days=1)
            else:
                fecha_fin_formatted_q = fecha_fin_formatted
            try:
                my_filter = Filter()
                tramosContrato = {}
                latest_execution = my_filter.getLastExecutionOperacion(
                    pEntidadId=entidad, pFinalidadId=finalidad, pOperacionId=id_contrato, pFlagClienteContrato=1, pUser=usuario)
                LOG.debug("Datos latest_execution: %s" % latest_execution)

                ajuste = json.loads(latest_execution[0][0].value)
                tramosContrato["ajuste"] = ajuste
                detalle_contrato = my_filter.getDetalleContratoId(
                    pEntidadId=entidad, pContratoId=id_contrato, pUser=usuario)[0].value
                # LOG.debug("Datos detalle_contrato: %s" % detalle_contrato)
                detalleJSON = {}
                detalleJSON["detalle"] = json.loads(detalle_contrato)
                tramosContrato["detalle"] = sustDimensiones(
                    pJson=detalleJSON["detalle"], pContratoId=id_contrato, pEntidadId=entidad)
                id_cliente = tramosContrato["detalle"]["customer_id"]["value"]

                ajustes_cliente = Ajuste.objects.filter(finalidad=finalidad)
                ajustes_contrato = Ajuste.objects.filter(finalidad=finalidad)
                ajustes_cliente = ajustes_cliente.filter(
                    fechaini__lte=fecha_fin_formatted_q, fechafin__gte=fecha_inicio_formatted)
                ajustes_contrato = ajustes_contrato.filter(
                    fechaini__lte=fecha_fin_formatted_q, fechafin__gte=fecha_inicio_formatted)

                if dato_impactado == "1":
                    ajustes_cliente = ajustes_cliente.exclude(
                        importeajustado__isnull=True)
                    ajustes_contrato = ajustes_contrato.exclude(
                        importeajustado__isnull=True)

                if dato_impactado == "2":
                    ajustes_cliente = ajustes_cliente.exclude(
                        porcentajeimporteajustado__isnull=True)
                    ajustes_contrato = ajustes_contrato.exclude(
                        porcentajeimporteajustado__isnull=True)

                if dato_impactado == "3":
                    ajustes_cliente = ajustes_cliente.exclude(
                        stageajustado__isnull=True)
                    ajustes_contrato = ajustes_contrato.exclude(
                        stageajustado__isnull=True)

                if dato_impactado == "4":
                    ajustes_cliente = ajustes_cliente.exclude(
                        lgdajustada__isnull=True)
                    ajustes_contrato = ajustes_contrato.exclude(
                        lgdajustada__isnull=True)

                ajustes_cliente = ajustes_cliente.filter(
                    flagclientecontrato="0", operacion_id=id_cliente)
                ajustes_contrato = ajustes_contrato.filter(
                    flagclientecontrato="1", operacion_id=id_contrato)
                ajustes_filtered = [results for results in ajustes_contrato]
                ajustes_filtered += [results for results in ajustes_cliente]
                LOG.debug("Ajustes de contrato y cliente: %s" %
                          json.dumps([ajuste.as_dict() for ajuste in ajustes_filtered]))

                ajusteUtils = AjustesUtils()
                tramos = ajusteUtils.getAjustesPrioritariosDateInterval(
                    pAjustes=ajustes_filtered, pStartDate=fecha_inicio_formatted, pEndDate=fecha_fin_formatted)
                # LOG.debug("Tramos de contrato y cliente: %s" %
                #           [tramo[2] ? tramo[2].as_dict() : "" for tramo in tramos])

                ajustesTramos = []

                for tramo in tramos:
                    fechaIni = tramo[0]
                    fechaFin = tramo[1]
                    ajusteImporte = tramo[2]
                    ajusteStage = tramo[3]
                    ajustelgd = tramo[4]
                    ajuste = {}
                    ajuste["fechaIni"] = fechaIni.strftime("%Y-%m-%d %H:%M:%S")
                    ajuste["fechaFin"] = fechaFin.strftime("%Y-%m-%d %H:%M:%S")
                    if ajusteImporte and (dato_impactado == "1" or dato_impactado == "2" or dato_impactado == "0"):
                        ajuste["importe"] = ajusteImporte.as_dict()
                    else:
                        ajuste["importe"] = {}
                    if ajusteStage and (dato_impactado == "3" or dato_impactado == "0"):
                        ajuste["stage"] = ajusteStage.as_dict()
                    else:
                        ajuste["stage"] = {}
                    if ajustelgd and (dato_impactado == "4" or dato_impactado == "0"):
                        ajuste["lgd"] = ajustelgd.as_dict()
                    else:
                        ajuste["lgd"] = {}
                    ajustesTramos.append(ajuste)
                tramosContrato["tramos"] = ajustesTramos
                LOG.debug("Datos tramosContrato: %s" % tramosContrato)
                return HttpResponse(json.dumps(tramosContrato), content_type="application/json")
            except PopupException, e:
                raise HttpResponseNotAllowed(str(e))
            except IndexError, e:
                response = HttpResponse(
                    _('Id de contrato no encontrado') + ": %s" % str(e),  status=401)
                response['Content-Length'] = len(response.content)
                return response

    return 0


def buscar_tramos_contrato(request):
    if request.method == "POST":
        if request.is_ajax():
            lan = get_current_language(request)
            form_busqueda = FiltroBuscarAjustesContrato(request.POST, lan=lan)
            if form_busqueda.is_valid():
                id_contrato = form_busqueda.cleaned_data['id_contrato']
                id_customer = form_busqueda.cleaned_data['id_cliente']
                finalidad = form_busqueda.cleaned_data['environment']
                dato_impactado = form_busqueda.cleaned_data['dato_impactado']

                # Fecha de inicio
                if form_busqueda.cleaned_data['fecha_inicio'] == "":
                    s = "01-01-1970"
                    fecha_inicio_formatted = datetime.strptime(
                        s, "%d-%m-%Y").date()
                else:
                    fecha_inicio_formatted = datetime.strptime(
                        form_busqueda.cleaned_data['fecha_inicio'], "%d-%m-%Y").date()
                # Fecha de Fin
                if form_busqueda.cleaned_data['fecha_fin'] == "":
                    s = "31-12-2999"
                    fecha_fin_formatted = datetime.strptime(
                        s, "%d-%m-%Y").date()
                else:
                    fecha_fin_formatted = datetime.strptime(
                        form_busqueda.cleaned_data['fecha_fin'], "%d-%m-%Y").date()

                if fecha_inicio_formatted == fecha_fin_formatted:
                    fecha_fin_formatted_q = fecha_fin_formatted + \
                        timedelta(days=1)
                else:
                    fecha_fin_formatted_q = fecha_fin_formatted

                usuario = request.user
                entidad = get_user_entity_id(usuario)
                LOG.info("El formulario ha validado correctamente")
                ajustes_cliente = Ajuste.objects.filter(finalidad=finalidad)
                ajustes_contrato = Ajuste.objects.filter(finalidad=finalidad)

                ajustes_cliente = ajustes_cliente.filter(
                    fechaini__lte=fecha_fin_formatted_q, fechafin__gte=fecha_inicio_formatted)
                ajustes_contrato = ajustes_contrato.filter(
                    fechaini__lte=fecha_fin_formatted_q, fechafin__gte=fecha_inicio_formatted)

                if dato_impactado == "1":
                    ajustes_contrato = ajustes_contrato.exclude(
                        importeajustado__isnull=True)
                    ajustes_cliente = ajustes_cliente.exclude(
                        importeajustado__isnull=True)

                if dato_impactado == "2":
                    ajustes_contrato = ajustes_contrato.exclude(
                        porcentajeimporteajustado__isnull=True)
                    ajustes_cliente = ajustes_cliente.exclude(
                        porcentajeimporteajustado__isnull=True)

                if dato_impactado == "3":
                    ajustes_contrato = ajustes_contrato.exclude(
                        stageajustado__isnull=True)
                    ajustes_cliente = ajustes_cliente.exclude(
                        stageajustado__isnull=True)

                if dato_impactado == "4":
                    ajustes_contrato = ajustes_contrato.exclude(
                        lgdajustada__isnull=True)
                    ajustes_cliente = ajustes_cliente.exclude(
                        lgdajustada__isnull=True)

                ajustes_cliente = ajustes_cliente.filter(
                    flagclientecontrato="0", operacion_id=id_customer)
                ajustes_contrato = ajustes_contrato.filter(
                    flagclientecontrato="1", operacion_id=id_contrato)
                ajustes_filtered = [results for results in ajustes_contrato]
                ajustes_filtered += [results for results in ajustes_cliente]
                LOG.debug("Ajsutes de contrato y cliente: %s" %
                          json.dumps([ajuste.as_dict() for ajuste in ajustes_filtered]))

                LOG.debug(ajustes_filtered)
                ajusteUtils = AjustesUtils()
                tramos = ajusteUtils.getAjustesPrioritariosDateInterval(
                    pAjustes=ajustes_filtered, pStartDate=fecha_inicio_formatted, pEndDate=fecha_fin_formatted)
                LOG.debug("Tramos de contrato y cliente: %s" %
                          [(tramo[2].as_dict() if tramo[2] else "") for tramo in tramos])
                ajustesTramos = []
                for tramo in tramos:
                    fechaIni = tramo[0]
                    fechaFin = tramo[1]
                    ajusteImporte = tramo[2]
                    ajusteStage = tramo[3]
                    ajustelgd = tramo[4]
                    ajuste = {}
                    ajuste["fechaIni"] = fechaIni.strftime("%Y-%m-%d %H:%M:%S")
                    ajuste["fechaFin"] = fechaFin.strftime("%Y-%m-%d %H:%M:%S")
                    if ajusteImporte and (dato_impactado == "1" or dato_impactado == "2" or dato_impactado == "0"):
                        ajuste["importe"] = ajusteImporte.as_dict()
                    else:
                        ajuste["importe"] = {}
                    if ajusteStage and (dato_impactado == "3" or dato_impactado == "0"):
                        ajuste["stage"] = ajusteStage.as_dict()
                    else:
                        ajuste["stage"] = {}
                    if ajustelgd and (dato_impactado == "4" or dato_impactado == "0"):
                        ajuste["lgd"] = ajustelgd.as_dict()
                    else:
                        ajuste["lgd"] = {}
                    ajustesTramos.append(ajuste)
                LOG.debug(ajustesTramos)
                return HttpResponse(json.dumps(ajustesTramos), content_type="application/json")
            else:
                Http404(_('No se pudo obtener la información'))
                LOG.error(form_busqueda.errors)


def buscar_tramos_exclusion_contrato(request):
    if request.method == "POST":
        if request.is_ajax():
            lan = get_current_language(request)
            form_busqueda = FiltroBuscarExclusionesContrato(request.POST)
            if form_busqueda.is_valid():
                id_contrato = form_busqueda.cleaned_data['id_contrato']
                id_customer = form_busqueda.cleaned_data['id_cliente']
                finalidad = form_busqueda.cleaned_data['environment']
                # Fecha de inicio
                if form_busqueda.cleaned_data['fecha_inicio'] == "":
                    s = "01-01-1970"
                    fecha_inicio_formatted = datetime.strptime(
                        s, "%d-%m-%Y").date()
                else:
                    fecha_inicio_formatted = datetime.strptime(
                        form_busqueda.cleaned_data['fecha_inicio'], "%d-%m-%Y").date()
                LOG.debug("Fecha inicio raw %s" % fecha_inicio_formatted)
                # Fecha de Fin
                if form_busqueda.cleaned_data['fecha_fin'] == "":
                    s = "31-12-2999"
                    fecha_fin_formatted = datetime.strptime(
                        s, "%d-%m-%Y").date()
                else:
                    fecha_fin_formatted = datetime.strptime(
                        form_busqueda.cleaned_data['fecha_fin'], "%d-%m-%Y").date()
                LOG.debug("Fecha fin raw %s" % fecha_fin_formatted)

                if fecha_inicio_formatted == fecha_fin_formatted:
                    fecha_fin_formatted_q = fecha_fin_formatted + \
                        timedelta(days=1)
                else:
                    fecha_fin_formatted_q = fecha_fin_formatted

                usuario = request.user
                entidad = get_user_entity_id(usuario)
                LOG.info("El formulario ha validado correctamente")
                exclusiones_cliente = Exclusion.objects.filter(
                    finalidad=finalidad)
                exclusiones_contrato = Exclusion.objects.filter(
                    finalidad=finalidad)

                exclusiones_cliente = exclusiones_cliente.filter(
                    fechaini__lte=fecha_fin_formatted, fechafin__gte=fecha_inicio_formatted)
                exclusiones_contrato = exclusiones_contrato.filter(
                    fechaini__lte=fecha_fin_formatted, fechafin__gte=fecha_inicio_formatted)

                exclusiones_cliente = exclusiones_cliente.filter(
                    flagclientecontrato="0", operacion_id=id_customer)
                exclusiones_contrato = exclusiones_contrato.filter(
                    flagclientecontrato="1", operacion_id=id_contrato)
                exclusiones_filtered = [results.as_dict()
                                        for results in exclusiones_contrato]
                exclusiones_filtered += [results.as_dict()
                                         for results in exclusiones_cliente]
                LOG.debug(exclusiones_filtered)
                return HttpResponse(json.dumps(exclusiones_filtered), content_type="application/json")
            else:
                response = HttpResponse(
                    _('No se pudo obtener la información'), status=401)
                response['Content-Length'] = len(response.content)
                return response


def application_search_contract_exclusion(request):
    if request.method == "POST":
        if request.is_ajax():
            id_contrato = request.POST['id']
            finalidad = request.POST['environment']
            usuario = request.user
            entidad = get_user_entity_id(usuario)

            if request.POST['fecha_inicio'] == "":
                s = "01-01-1970"
                fecha_inicio_formatted = datetime.strptime(s, "%d-%m-%Y")
            else:
                fecha_inicio_formatted = datetime.strptime(
                    request.POST['fecha_inicio'], "%d-%m-%Y")
            LOG.debug("Fecha inicio raw %s" % fecha_inicio_formatted)
            # Fecha de Fin
            if request.POST['fecha_fin'] == "":
                s = "31-12-2999"
                fecha_fin_formatted = datetime.strptime(s, "%d-%m-%Y")
            else:
                fecha_fin_formatted = datetime.strptime(
                    request.POST['fecha_fin'] + " 23:59:59", "%d-%m-%Y %H:%M:%S")
            LOG.debug("Fecha fin raw %s" % fecha_fin_formatted)

            try:
                my_filter = Filter()
                tramosContrato = {}
                latest_execution = my_filter.getLastExecutionOperacion(
                    pEntidadId=entidad, pFinalidadId=finalidad, pOperacionId=id_contrato, pFlagClienteContrato=1, pUser=usuario)
                ajuste = json.loads(latest_execution[0][0].value)
                tramosContrato["ajuste"] = ajuste
                detalle_contrato = my_filter.getDetalleContratoId(
                    pEntidadId=entidad, pContratoId=id_contrato, pUser=usuario)[0].value
                detalleJSON = {}
                detalleJSON["detalle"] = json.loads(detalle_contrato)
                tramosContrato["detalle"] = sustDimensiones(
                    pJson=detalleJSON["detalle"], pContratoId=id_contrato, pEntidadId=entidad)
                id_cliente = tramosContrato["detalle"]["customer_id"]["value"]
                exclusiones_cliente = Exclusion.objects.filter(
                    finalidad=finalidad)
                exclusiones_contrato = Exclusion.objects.filter(
                    finalidad=finalidad)

                exclusiones_cliente = exclusiones_cliente.filter(
                    fechaini__lte=fecha_fin_formatted, fechafin__gte=fecha_inicio_formatted)
                exclusiones_contrato = exclusiones_contrato.filter(
                    fechaini__lte=fecha_fin_formatted, fechafin__gte=fecha_inicio_formatted)

                exclusiones_cliente = exclusiones_cliente.filter(
                    flagclientecontrato="0", operacion_id=id_cliente)
                exclusiones_contrato = exclusiones_contrato.filter(
                    flagclientecontrato="1", operacion_id=id_contrato)
                exclusiones_filtered = [results.as_dict()
                                        for results in exclusiones_contrato]
                exclusiones_filtered += [results.as_dict()
                                         for results in exclusiones_cliente]
                tramosContrato["tramos"] = exclusiones_filtered
                LOG.debug(exclusiones_filtered)
                return HttpResponse(json.dumps(tramosContrato), content_type="application/json")
            except PopupException, e:
                raise HttpResponseNotAllowed(str(e))
            except IndexError:
                response = HttpResponse(
                    _('Contrato no encontrado'), status=401)
                response['Content-Length'] = len(response.content)
                return response

# PROMOCION Y TRASPASO DE EXCLUSIONES Y AJUSTE

# GESTION DE LOS MODALES DE PROMOCION Y TRASPASO


def modal_conf_promotion(request):
    lan = get_current_language(request)
    finalidad = request.GET['environment']
    return render_to_response('html/includes/modalConfPromotion.html', {"lan": lan, "finalidad": finalidad}, RequestContext(request))


def modal_conf_traspaso(request):
    lan = get_current_language(request)
    finalidad = request.GET['environment']
    return render_to_response('html/includes/modalConfTraspaso.html', {"lan": lan, "finalidad": finalidad}, RequestContext(request))


def modal_conf_promotion_exclusion(request):
    lan = get_current_language(request)
    finalidad = request.GET['environment']
    return render_to_response('html/includes/modalConfPromotionExclusion.html', {"lan": lan, "finalidad": finalidad}, RequestContext(request))


def modal_conf_traspaso_exclusion(request):
    lan = get_current_language(request)
    finalidad = request.GET['environment']
    return render_to_response('html/includes/modalConfTraspasoExclusion.html', {"lan": lan, "finalidad": finalidad}, RequestContext(request))

# FIN DE LA GESTION DE MODALES


def promocionar_ajuste(request):
    if request.method == "POST":
        if request.is_ajax():
            id_ajuste = request.POST['id_ajuste']
            ajuste = Ajuste.objects.get(id=int(id_ajuste))
            id_finalidad = request.POST['environment']
            finalidad = Finalidad.objects.get(id=int(id_finalidad))
            my_filter = Filter()
            try:
                result = my_filter.promocionarAjuste(
                    pAjuste=ajuste, pFinalidadDestino=finalidad)
                LOG.info("Has promocionado un Ajuste")
                return HttpResponse("ok")
            except Exception as e:
                response = HttpResponse(e, status=401)
                response['Content-Length'] = len(response.content)
                return response


def traspasar_ajuste(request):
    if request.method == "POST":
        if request.is_ajax():
            id_ajuste = request.POST['id_ajuste']
            ajuste = Ajuste.objects.get(id=int(id_ajuste))
            id_finalidad = request.POST['environment']
            finalidad_destino = request.POST['finalidad_destino']
            finalidad = Finalidad.objects.get(id=int(finalidad_destino))
            my_filter = Filter()
            try:
                result = my_filter.desPromocionarAjuste(
                    pAjuste=ajuste, pFinalidadDestino=finalidad)
                LOG.info("Has traspasado un Ajuste")
                return HttpResponse("ok")
            except Exception as e:
                response = HttpResponse(e, status=401)
                response['Content-Length'] = len(response.content)
                return response


def promocionar_exclusion(request):
    if request.method == "POST":
        if request.is_ajax():
            id_exclusion = request.POST['id_exclusion']
            LOG.info("ID Exclusion: %s" % id_exclusion)
            exclusion = Exclusion.objects.get(id=int(id_exclusion))
            id_finalidad = request.POST['environment']
            finalidad = Finalidad.objects.get(id=int(id_finalidad))
            my_filter = Filter()
            try:
                result = my_filter.promocionarExclusion(
                    pExclusion=exclusion, pFinalidadDestino=finalidad)
                LOG.info("Has promocionado una Exclusión")
                return HttpResponse("ok")
            except Exception as e:
                response = HttpResponse(e, status=401)
                response['Content-Length'] = len(response.content)
                return response


def traspasar_exclusion(request):
    if request.method == "POST":
        if request.is_ajax():
            id_exclusion = request.POST['id_exclusion']
            exclusion = Exclusion.objects.get(id=int(id_exclusion))
            id_finalidad = request.POST['finalidad_destino']
            finalidad = Finalidad.objects.get(id=int(id_finalidad))
            my_filter = Filter()
            try:
                result = my_filter.desPromocionarExclusion(
                    pExclusion=exclusion, pFinalidadDestino=finalidad)
                LOG.info("Has traspasa una Exclusión")
                return HttpResponse("ok")
            except Exception as e:
                response = HttpResponse(e, status=401)
                response['Content-Length'] = len(response.content)
                return response


def detalle_consulta_contrato(request):
    if request.method == "POST":
        if request.is_ajax():
            id_contrato = request.POST['id_contrato']
            finalidad = request.POST['environment']
            info_execution = request.POST['info_execution']
            info_execution = json.loads(info_execution)
            detalle = request.POST['detalle']
            detalle = json.loads(detalle)
            id_customer = request.POST['id_customer']
            usuario = request.user
            entidad = get_user_entity_id(usuario)
            NaN_msg = Configuracion.objects.get(
                clave='modellica.text.nan').valor

            LOG.info("datos ejecucion: %s " % info_execution)

            LOG.info("datos detalle: %s " % detalle)

            if(((info_execution["importe"]["value"]) != "") and ((info_execution["importe"]["value"]) != "NaN")):
                info_execution["importe"]["value"] = format_currency(
                    request, float(info_execution["importe"]["value"]))

            if((info_execution["importe"]["value"]) == "NaN"):
                info_execution["importe"]["value"] = "----"

            if(((info_execution["importe"]["ajuste"]) != "") and ((info_execution["importe"]["ajuste"]) != "NaN")):
                info_execution["importe"]["ajuste"] = format_currency(
                    request, float(info_execution["importe"]["ajuste"]))

            if((info_execution["importe"]["ajuste"]) == "NaN"):
                info_execution["importe"][
                    "ajuste"] = info_execution["importe"]["value"]

            if(((info_execution["lgd"]["value"]) != "") and ((info_execution["lgd"]["value"]) != "NaN")):
                info_execution["lgd"]["value"] = format_currency(
                    request, float(info_execution["lgd"]["value"]))

            if((info_execution["lgd"]["value"]) == "NaN"):
                info_execution["lgd"]["value"] = "----"

            if(((info_execution["lgd"]["ajuste"]) != "") and ((info_execution["lgd"]["ajuste"]) != "NaN")):
                info_execution["lgd"]["ajuste"] = format_currency(
                    request, float(info_execution["lgd"]["ajuste"]))

            if((info_execution["lgd"]["ajuste"]) == "NaN"):
                info_execution["lgd"][
                    "ajuste"] = info_execution["lgd"]["value"]

            try:
                my_filter = Filter()
                info_cliente = json.loads(my_filter.getDetalleClienteId(
                    pEntidadId=entidad, pClienteId=id_customer, pUser=usuario)[0].value)
                feve_status_date = info_cliente[
                    "feve_status_date"]["value"]
                feve_level_date = info_cliente[
                    "feve_level_date"]["value"]
                if(((info_cliente["feve_status_date"]["value"]) != "") and ((info_cliente["feve_status_date"]["value"]) != "NaN") and ((info_cliente["feve_status_date"]["value"]) is not None) and ((info_cliente["feve_status_date"]["value"]) != "NA")):
                    info_cliente[
                        "feve_status_date"]["value"] = datetime.strptime(feve_status_date, '%Y-%m-%d').strftime('%d-%m-%Y')
                else:
                    info_cliente["feve_status_date"]["value"] = "----"
            
                if(((info_cliente["feve_level_date"]["value"]) != "") and ((info_cliente["feve_level_date"]["value"]) != "NaN") and ((info_cliente["feve_level_date"]["value"]) is not None) and ((info_cliente["feve_level_date"]["value"]) != "NA")):           
                    info_cliente[
                       "feve_level_date"]["value"] = datetime.strptime(feve_level_date, '%Y-%m-%d').strftime('%d-%m-%Y')
                else:
                    info_cliente["feve_level_date"]["value"] = "----"

                LOG.info("datos cliente: %s " % info_cliente)
                return render_to_response('html/analisis/detalle_ejecucion_contrato.html', {"datos": info_execution, "detalle": detalle, "info_cliente": info_cliente, "finalidad": finalidad, "NaN_msg": NaN_msg}, RequestContext(request))
            except Exception as e:
                response = HttpResponse(
                    _('No se han encontrado datos de cliente') + ": %s " % str(e), status=404)
                response['Content-Length'] = len(response.content)
                return response


def detalle_consulta_cliente(request):
    if request.method == "POST":
        if request.is_ajax():
            finalidad = request.POST['environment']
            info_cliente = request.POST['customer']
            detalle = request.POST['detalle']
            info_execution = request.POST['info_execution']
            NaN_msg = Configuracion.objects.get(
                clave='modellica.text.nan').valor

            info_execution = json.loads(info_execution)
            detalle = json.loads(detalle)
            info_cliente = json.loads(info_cliente)
            feve_status_date = info_cliente[
                "feve_status_date"]["value"]
            feve_level_date = info_cliente[
                "feve_level_date"]["value"]
                
            if(((info_cliente["feve_status_date"]["value"]) != "") and ((info_cliente["feve_status_date"]["value"]) != "NaN") and ((info_cliente["feve_status_date"]["value"]) is not None) and ((info_cliente["feve_status_date"]["value"]) != "NA")):
                info_cliente[
                    "feve_status_date"]["value"] = datetime.strptime(feve_status_date, '%Y-%m-%d').strftime('%d-%m-%Y')
            else:
                info_cliente["feve_status_date"]["value"] = "----"
            
            if(((info_cliente["feve_level_date"]["value"]) != "") and ((info_cliente["feve_level_date"]["value"]) != "NaN") and ((info_cliente["feve_level_date"]["value"]) is not None) and ((info_cliente["feve_level_date"]["value"]) != "NA")):
                info_cliente[
                    "feve_level_date"]["value"] = datetime.strptime(feve_level_date, '%Y-%m-%d').strftime('%d-%m-%Y')
            else:
                info_cliente["feve_level_date"]["value"] = "----"

            if(((info_execution["importe"]["value"]) != "") and ((info_execution["importe"]["value"]) != "NaN")):
                info_execution["importe"]["value"] = format_currency(
                    request, float(info_execution["importe"]["value"]))

            if((info_execution["importe"]["value"]) == "NaN"):
                info_execution["importe"]["value"] = "----"

            if(((info_execution["importe"]["ajuste"]) != "") and ((info_execution["importe"]["ajuste"]) != "NaN")):
                info_execution["importe"]["ajuste"] = format_currency(
                    request, float(info_execution["importe"]["ajuste"]))

            if((info_execution["importe"]["ajuste"]) == "NaN"):
                info_execution["importe"][
                    "ajuste"] = info_execution["importe"]["value"]

            if(((info_execution["lgd"]["value"]) != "") and ((info_execution["lgd"]["value"]) != "NaN")):
                info_execution["lgd"]["value"] = format_currency(
                    request, float(info_execution["lgd"]["value"]))

            if((info_execution["lgd"]["value"]) == "NaN"):
                info_execution["lgd"]["value"] = "----"

            if(((info_execution["lgd"]["ajuste"]) != "") and ((info_execution["lgd"]["ajuste"]) != "NaN")):
                info_execution["lgd"]["ajuste"] = format_currency(
                    request, float(info_execution["lgd"]["ajuste"]))

            if((info_execution["lgd"]["ajuste"]) == "NaN"):
                info_execution["lgd"][
                    "ajuste"] = info_execution["lgd"]["value"]

            return render_to_response('html/analisis/detalle_ejecucion_cliente.html', {"datos": info_execution, "detalle": detalle, "info_cliente": info_cliente, "finalidad": finalidad, "NaN_msg": NaN_msg}, RequestContext(request))


def check_user_has_entity(request):
    if request.method == "POST":
        if request.is_ajax():
            usuario_id = request.user.pk
            user_entity = get_user_entity_id(usuario_id)
            if user_entity != 0:
                return HttpResponse('ok')  # User already has an entity
            else:
                # Si el número de entidades es == 1. Se al asigno al usuario_id
                num_entidades = Entidad.objects.all()
                if len(num_entidades) > 1:
                    response = HttpResponse(
                        _("El número de entidades en el sistema es mayor que 1. La asignación se debe realizar manualmente. Contacte con su administrador"), status=405)
                    response["Content-Length"] = len(response.content)
                    return response
                else:
                    LOG.debug(num_entidades)
                    entidad_usuario = EntidadUsuario()
                    entidad_usuario.entidad = num_entidades[0]
                    entidad_usuario.usuario = request.user
                    entidad_usuario.save()
                    return HttpResponse(_('Se le ha asignado al usuario') + str(request.user) + " " + _("con ID") + str(request.user.pk) + " " + _("la entidad") + str(num_entidades[0].descripcion) + " " + _("con ID") + str(num_entidades[0].entidad_id))
                # Si hay más de una entidad, devolver un error. Se debe hacer
                # manualmente


def getNanModellica(request):
    if request.method == "POST":
        if request.is_ajax():
            NaN_msg = Configuracion.objects.get(
                clave='modellica.text.nan').valor
            LOG.debug("NANANANANANANANANA %s" % NaN_msg)
            return HttpResponse(NaN_msg)
