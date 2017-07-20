# -*- coding: utf-8 -*-

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
from django import forms
from django.utils import translation
from models import *

# from django.utils.translation import ugettext_lazy
from django.utils.translation import ugettext

class AltaAnalisisFilterFormClient (forms.Form):
    cliente = forms.CharField(required=False, label=u"ID Cliente", widget=forms.TextInput(attrs={u'class':u'validate', u'id':u'ifrs9_idCliente'}))

class AltaAnalisisFilterFormContrat (forms.Form):
    contrato = forms.CharField(required=False, label=u"ID Contrato", widget=forms.TextInput(attrs={u'class':u'validate', u'id':u'ifrs9_idContrato'}))

class DatosAltaGenericAnalisisForm(forms.Form):
    stages = Stage_enum.objects.all().order_by('stage_id')
    STAGE_CHOICES = []
    for item in stages:
        STAGE_CHOICES.append(tuple([unicode(item.stage_id), unicode(item.descripcion)]))

    environment = forms.CharField(required=True, widget=forms.HiddenInput(attrs={u"id":u"environmentaltaajustegeneric"}))
    tipo_ajuste = forms.CharField(required=True, widget=forms.HiddenInput(attrs={u"id":u"tipoajuste"}))
    moneda = forms.CharField(required=True, widget=forms.HiddenInput(attrs={u"id":u"moneda"}))
    flagclientecontrato = forms.CharField(required=True, widget=forms.HiddenInput(attrs={u"id":u"flagclientecontratoaltaajustegeneric"}))
    importe = forms.CharField(label=u'Importe', widget=forms.TextInput(attrs={u"class":u"validate form-field-execution form-all-field", u"id":u"ifrs9_importe", u"onblur":u"checkSpecialFields()"}), required=False)
    importe_hidden = forms.CharField(widget=forms.HiddenInput(attrs={u"id":u"ifrs9_hiddenImporte"}), required=False)
    porcentaje_importe= forms.CharField(label=u'% Importe', widget=forms.TextInput(attrs={u"class":u"validate form-field-execution form-all-field", u"id":u"ifrs9_porcImporte", u"onblur":u"checkSpecialFields()"}), required=False)
    porcentaje_importe_hidden= forms.CharField(widget=forms.HiddenInput(attrs={u"id":u"ifrs9_hiddenPorcImporte"}), required=False)
    stage = forms.ChoiceField(choices=STAGE_CHOICES, label="Stage", required=True, widget=forms.Select(attrs={u"class":u"form-field-execution form-all-field first-input", u"id":u"select_stage"}))
    fecha_inicio = forms.CharField(required=True, label=u"Fecha Inicio", widget=forms.TextInput(attrs={u"class": u"datepicker picker__input form-field-desc form-all-field", u"id": u"ifrs9_dateInicio", u"onblur":u"checkFields();checkSpecialFields"}))
    fecha_fin = forms.CharField(required=True, label=u"Fecha Fin", widget=forms.TextInput(attrs={u"class": u"datepicker picker__input form-field-desc form-all-field", u"id": u"ifrs9_dateFin", u"onblur":u"checkFields();checkSpecialFields"}))
    comentarios = forms.CharField(required=True, label=u"Comentarios", widget=forms.Textarea(attrs={u"id":u"ifrs9_comentarios", u"class":u"materialize-textarea form-field-desc form-all-field length_comment_check", u"length":u"250", u"onblur":u"checkFields();commentLength();checkSpecialFields();", u"onpaste":u"checkFields();commentLength()"}))

# class AltaExclusionManualClienteDatosForm(forms.Form):
#     fecha_inicio = forms.DateField(label=u"Fecha Inicio", widget=forms.TextInput(attrs={u"class": u"datepicker picker__input form-field-desc", u"id": u"ifrs9_dateInicio", u"readonly": u"true"}))
#     fecha_fin = forms.DateField(label=u"Fecha Fin",widget=forms.TextInput(attrs={u"class": u"datepicker picker__input form-field-desc", u"id": u"ifrs9_dateFin", u"readonly": u"true"}))
#     comentarios = forms.CharField(label=u"Comentarios", widget=forms.Textarea(attrs={u"id":u"come", u"class": u"materialize-textarea", u"length": "120"}))

class BuscarAjustes(forms.Form):
    def __init__(self, *args, **kwargs):
        lan = kwargs.pop('lan')
        finalidad = kwargs.pop('finalidad')
        translation.activate(lan)
        super(BuscarAjustes, self).__init__(*args, **kwargs)
        CHOICES_FINALIDAD = []
        finalidad_list = Finalidad.objects.filter(id__lte=finalidad).order_by('id')
        for item in finalidad_list:
            CHOICES_FINALIDAD.append(tuple([unicode(item.id), ugettext(unicode(item.descripcion))]))

        tipo_ajuste_enum = Tipoajuste_enum.objects.all().order_by('tipo_id')
        CHOICES_TIPO_AJUSTE = []
        for item in tipo_ajuste_enum:
            CHOICES_TIPO_AJUSTE.append(tuple([unicode(item.tipo_id), ugettext(unicode(item.nombre))]))

        self.fields['finalidad'] = forms.ChoiceField(choices=CHOICES_FINALIDAD, label=u"Finalidad", widget=forms.Select(attrs={u"data-placeholder":u"Análisis", u"id":u"ifrs9_buscarAjustesFinalidad", u"class":u"initialized"}))
        self.fields['tipo_ajuste'] = forms.ChoiceField(choices=CHOICES_TIPO_AJUSTE, label=u"Tipo de ajuste", widget=forms.Select(attrs={u"id":u"ifrs9_buscarAjustesTipoAjuste", u"tabindex":u"1", u"class":u"initialized"}))

    # tipo_busqueda = forms.ChoiceField(choices=CHOICES_TIPO_BUSQUEDA, label=u"Tipo de búsqueda", required=True,  widget=forms.Select(attrs={u"data-placeholder":u"Todo", u"id":u"ifrs9_buscarAjustesTipoBusqueda", u"tabindex":u"1", u"class":u"initialized"}))
    fecha_inicio = forms.CharField(required=False, label=u"Fecha Inicio", widget=forms.TextInput(attrs={"class": "datepicker picker__input form-field-desc", u'id': u'ifrs9_dateAjusteInicio'}))
    fecha_fin = forms.CharField(required=False, label=u"Fecha Fin",widget=forms.TextInput(attrs={"class": "datepicker picker__input form-field-desc", u'id': u'ifrs9_dateAjusteFin'}))
    # total = forms.BooleanField(label=u"Total", widget=forms.CheckboxInput(attrs={u"id": u"ifrs9_checkBusqFiltro"}))
    usuario_alta = forms.CharField(required=False, label=u"Usuario Alta", widget=forms.TextInput(attrs={u"class":u"validate", u"id": u"ifrs9_usuario"}))
    environment = forms.CharField(required=True, widget=forms.HiddenInput(attrs={u"id":u"buscarAjustesEnvironment"}))
    id_cliente = forms.CharField(required=False, label=u"ID Cliente", widget=forms.TextInput(attrs={u"class":u"validate form-field-execution", u"id": u"ifrs9_idClienteBusqAjuste", u"onkeyup":u"checkFields()"}))
    id_contrato = forms.CharField(required=False, label=u"ID Contrato", widget=forms.TextInput(attrs={u"class":u"validate form-field-execution", u"id": u"ifrs9_idContratoBusqAjuste", u"onkeyup":u"checkFields()"}))

class BuscarExclusiones(forms.Form):
    def __init__(self, *args, **kwargs):
        lan = kwargs.pop('lan')
        finalidad = kwargs.pop('finalidad')
        translation.activate(lan)
        super(BuscarExclusiones, self).__init__(*args, **kwargs)
        finalidad_list = Finalidad.objects.filter(id__lte=finalidad).order_by('id')
        CHOICES_FINALIDAD = []
        for item in finalidad_list:
            CHOICES_FINALIDAD.append(tuple([unicode(item.id), ugettext(unicode(item.descripcion))]))

        tipo_ajuste_enum = Tipoexclusion_enum.objects.all().order_by('tipo_id')
        CHOICES_TIPO_AJUSTE = []
        for item in tipo_ajuste_enum:
            CHOICES_TIPO_AJUSTE.append(tuple([unicode(item.tipo_id), ugettext(unicode(item.nombre))]))

        self.fields['finalidad'] = forms.ChoiceField(choices=CHOICES_FINALIDAD, label=u"Finalidad", widget=forms.Select(attrs={u"data-placeholder":u"Análisis", u"id":u"ifrs9_buscarAjustesFinalidad", u"class":u"initialized"}))
        self.fields['tipo_ajuste'] = forms.ChoiceField(choices=CHOICES_TIPO_AJUSTE, label=u"Tipo de ajuste", widget=forms.Select(attrs={u"id":u"ifrs9_buscarAjustesTipoAjuste", u"tabindex":u"1", u"class":u"initialized"}))

    # tipo_busqueda = forms.ChoiceField(choices=CHOICES_TIPO_BUSQUEDA, label=u"Tipo de búsqueda", required=True,  widget=forms.Select(attrs={u"data-placeholder":u"Todo", u"id":u"ifrs9_buscarAjustesTipoBusqueda", u"tabindex":u"1", u"class":u"initialized"}))
    fecha_inicio = forms.CharField(required=False, label=u"Fecha Inicio", widget=forms.TextInput(attrs={"class": "datepicker picker__input", u'id': u'ifrs9_dateExclusionInicio' }))
    fecha_fin = forms.CharField(required=False, label=u"Fecha Fin",widget=forms.TextInput(attrs={"class": "datepicker picker__input", u'id': u'ifrs9_dateExclusionFin'}))
    # total = forms.BooleanField(label=u"Total", widget=forms.CheckboxInput(attrs={u"id": u"ifrs9_checkBusqFiltro"}))
    usuario_alta = forms.CharField(required=False, label="Usuario Alta", widget=forms.TextInput(attrs={u"class":u"validate", u"id": u"ifrs9_usuario"}))
    environment = forms.CharField(required=True, widget=forms.HiddenInput(attrs={u"id":u"buscarAjustesEnvironment"}))
    id_cliente = forms.CharField(required=False, label=u"ID Cliente", widget=forms.TextInput(attrs={u"class":u"validate", u"id": u"ifrs9_idClienteBusqExclusion", u"onkeyup":u"checkFields()"}))
    id_contrato = forms.CharField(required=False, label=u"ID Contrato", widget=forms.TextInput(attrs={u"class":u"validate", u"id": u"ifrs9_idContratoBusqExclusion", u"onkeyup":u"checkFields()"}))


class ImportReglasParams(forms.Form):
    environment = forms.CharField(widget=forms.HiddenInput(attrs={u"id":u"importReglasParamsEnvironment"}))

class EjecucionConsultaFiltro(forms.Form):
    def __init__(self, *args, **kwargs):
        lan = kwargs.pop('lan')
        translation.activate(lan)
        super(EjecucionConsultaFiltro, self).__init__(*args, **kwargs)
        estado = Estado_enum.objects.all().order_by('id')
        CHOICES = []
        for item in estado:
            CHOICES.append(tuple([unicode(item.id), ugettext(unicode(item.descripcion))]))

        self.fields['estado'] = forms.ChoiceField(choices=CHOICES, label=u"Estado", required=False, widget=forms.Select(attrs={'class':'select-dropdown', 'readonly': 'true', 'data-activates':'select-options-099a2bd7-0290-b466-d824-76e75ad9cab6 tau', u'id':u'ifrs9_selectEstado'}))

    environment = forms.CharField(widget=forms.HiddenInput(attrs={u"id":u"importReglasParamsEnvironment"}))
    fecha_inicio = forms.CharField(label=u"Fecha Inicio",required=False, widget=forms.TextInput(attrs={u"class": u"datepicker picker__input", u'id': u'ifrs9_dateInicio'}))
    fecha_fin = forms.CharField(label=u"Fecha Fin",required=False, widget=forms.TextInput(attrs={u"class": u"datepicker picker__input", u'id': u'ifrs9_dateFin'}))
    usuario = forms.CharField(label=u"Usuario", max_length = 30, required=False, widget=forms.TextInput(attrs={u'class': u'validate', u'id': u'ifrs9_inputUsuario'}))


class FiltroBuscarAjustesContrato(forms.Form):
    def __init__(self, *args, **kwargs):
        lan = kwargs.pop('lan')
        translation.activate(lan)
        super(FiltroBuscarAjustesContrato, self).__init__(*args, **kwargs)
        CHOICES_DATO_IMPACTADO = (('0',ugettext(unicode('Todos'))),
            ('1',ugettext(unicode('Importe'))),
            ('2','% ' + ugettext(unicode('Importe'))),
            ('3',u'Stage'),
            ('4',u'% LGD'),
        )

        self.fields['dato_impactado'] = forms.ChoiceField(choices=CHOICES_DATO_IMPACTADO, label=u"Dato Impactado en Ajuste", required=True, widget=forms.Select(attrs={u'id':u'ifrs9_selectImpactado'}))

    environment = forms.CharField(widget=forms.HiddenInput(attrs={u"id":u"search_adjustments_by_contract_finalidad"}))
    id_cliente = forms.CharField(required=False,label=u"ID Cliente", widget=forms.TextInput(attrs={u"class":u"form-field-special validate", u"id":u"ifrs9_idCliente", u"onblur":u"checkFields()"}))
    id_contrato = forms.CharField(required=False,label=u"ID Contrato", widget=forms.TextInput(attrs={u"class":u"form-field-special validate", u"id":u"ifrs9_idContrato", u"onblur":u"checkFields()"}))
    fecha_inicio = forms.CharField(required=False,label=u"Fecha Inicio", widget=forms.TextInput(attrs={u"class": u"datepicker picker__input form-field-desc", u'id': u'ifrs9_dateAjusteInicio', u"onblur":u"checkFields()"}))
    fecha_fin = forms.CharField(required=False,label=u"Fecha Fin",widget=forms.TextInput(attrs={u"class": u"datepicker picker__input form-field-desc", u'id': u'ifrs9_dateAjusteFin', u"onblur":u"checkFields()"}))

class FiltroBuscarExclusionesContrato(forms.Form):
    environment = forms.CharField(widget=forms.HiddenInput(attrs={u"id":u"search_exclusions_by_contract_finalidad"}))
    id_cliente = forms.CharField(required=False, label=u"ID Cliente", widget=forms.TextInput(attrs={u"id":u"ifrs9_idCliente", u"onblur":u"checkFields()", u"class":u"validate"}))
    id_contrato = forms.CharField(required=False, label=u"ID Contrato", widget=forms.TextInput(attrs={u"id":u"ifrs9_idContrato", u"onblur":u"checkFields()", u"class":u"validate"}))
    fecha_inicio = forms.CharField(required=False, label=u"Fecha Inicio", widget=forms.TextInput(attrs={u"class": u"datepicker picker__input form-field-desc", u"readonly": u"true", u'id': u'ifrs9_dateExclusionInicio', u"onblur":u"checkFields()" }))
    fecha_fin = forms.CharField(required=False, label=u"Fecha Fin", widget=forms.TextInput(attrs={u"class": u"datepicker picker__input form-field-desc", u"readonly": u"true", u'id': u'ifrs9_dateExclusionFin', u"onblur":u"checkFields()"}))

class ConsultaPorContratoFiltro(forms.Form):
    id_contrato = forms.CharField(label=u"ID Contrato", widget=forms.TextInput(attrs={u"id":u"ifrs9_idContrato", u"class":u"search-table validate"}))
    environment = forms.CharField(widget=forms.HiddenInput(attrs={u"id":u"search_by_contract_finalidad"}))


class ConsultaPorClienteFiltro(forms.Form):
    id_cliente = forms.CharField(label=u"ID Cliente", widget=forms.TextInput(attrs={u"id":u"ifrs9_idCliente", u"class":u"search-table validate"}))
    environment = forms.CharField(widget=forms.HiddenInput(attrs={u"id":u"search_by_customer_finalidad"}))

#class AltaEjecucionAnalisis(forms.Form):


# Búsqueda de Exclusiones
# class BuscarExclusionesFiltro(forms.Form):
#     CHOICES_FINALIDAD = (('0', u'N/A'),
#         ('1', u'Real'),
#         ('2', u'Trabajo'),
#     )
#     CHOICES_TIPO_BUSQUEDA = (('0', u'Todo'),
#         ('1', u'Cliente'),
#         ('2', u'Contrato'),
#     )
#     CHOICES_TIPO_AJUSTE = (('0', u'Masivo Contrato'),
#         ('1', u'Masivo Cliente'),
#         ('2', u'Contrato'),
#         ('3', u'Cliente'),
#     )
#     finalidad = forms.ChoiceField(choices=CHOICES_FINALIDAD, label=u"Finalidad", required=True)
#     tipo_busqueda = forms.ChoiceField(choices=CHOICES_TIPO_BUSQUEDA, label=u"Tipo de búsqueda", required=True)
#     tipo_ajuste = forms.ChoiceField(choices=CHOICES_TIPO_AJUSTE, label=u"Tipo de ajuste", required=True)
#     fecha_inicio = forms.DateField(label=u"Fecha Inicio", widget=forms.TextInput(attrs={u"class": u"datepicker picker__input", u"placeholder": u"Fecha Inicio" }))
#     fecha_fin = forms.DateField(label=u"Fecha Fin",widget=forms.TextInput(attrs={u"class": u"datepicker picker__input", u"placeholder": u"Fecha Fin"}))
#     total = forms.BooleanField(label=u"Total")
#     usuario_alta = forms.CharField(label=u"Usuario Alta", widget=forms.TextInput(attrs={u"id":u"usuario", "class":u"validate"}))

class AltaExclusionManualContratoFiltro(forms.Form):
    environment = forms.CharField(widget=forms.HiddenInput(attrs={u"id":u"altaExclusionManualContratoFiltroEnvironment"}))
    id_contrato = forms.CharField(label=u"ID Contrato", widget=forms.TextInput(attrs={u"id": u"idContrato", "class": u"validate"}))

class AltaExclusionGenericDatos(forms.Form):
    environment = forms.CharField(required=True, widget=forms.HiddenInput(attrs={u"id":u"environmentaltaexclusiongeneric"}))
    tipo_exclusion = forms.CharField(required=True, widget=forms.HiddenInput(attrs={u"id":u"tipoexclusion"}))
    flagclientecontrato = forms.CharField(required=True, widget=forms.HiddenInput(attrs={u"id":u"flagclientecontratoaltaexclusiongeneric"}))

    fecha_inicio = forms.CharField(label=u"Fecha Inicio", widget=forms.TextInput(attrs={u"id":u"ifrs9_dateInicio",u"class": u"datepicker picker__input form-field-desc", u"onblur":u"checkFields()"}))
    fecha_fin = forms.CharField(label=u"Fecha Fin",widget=forms.TextInput(attrs={u"id":u"ifrs9_dateFin",u"class": u"datepicker picker__input form-field-desc", u"onblur":u"checkFields()"}))
    comentarios = forms.CharField(label=u"Comentarios", widget=forms.Textarea(attrs={u"id":u"ifrs9_comentarios", u"class": u"materialize-textarea form-field-desc", u"length": "250", u"onblur":u"checkFields();commentLength()", u"onpaste":u"checkFields();commentLength()"}))
