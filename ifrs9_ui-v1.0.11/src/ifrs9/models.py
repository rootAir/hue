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
from django.db import models
from django.contrib.auth.models import User
from datetime import date, time, datetime
import logging

LOG = logging.getLogger(__name__)


def userAsDict(pUser):
    return {
        "id": pUser.id,
        "username": pUser.username
    }


class Auditoria(models.Model):
    usuarioalta = models.ForeignKey(User, related_name='%(class)s_dados_alta')
    fechaalta = models.DateTimeField(auto_now_add=True)
    usuarioultimaactualizacion = models.ForeignKey(
        User, related_name='%(class)s_modificados')
    fechaultimaactualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def as_dict(self):
        return {
            "usuarioalta": userAsDict(self.usuarioalta),
            "fechaalta": self.fechaalta.replace(microsecond=0).isoformat(),
            "usuarioultimaactualizacion": userAsDict(self.usuarioultimaactualizacion),
            "fechaultimaactualizacion": self.fechaultimaactualizacion.replace(microsecond=0).isoformat()
        }


class Finalidad(models.Model):
    id = models.IntegerField(primary_key=True)
    descripcion = models.CharField(max_length=50)
    entidad = models.ForeignKey('Entidad')

    class Meta:
        unique_together = ('descripcion', 'entidad')

    def as_dict(self):
        return {
            "id": self.id,
            "descripcion": self.descripcion,
            "entidad": self.entidad.as_dict()
        }


class Tipoajuste_enum(models.Model):
    tipo_id = models.CharField(max_length=2, primary_key=True)
    nombre = models.CharField(max_length=50)

    def as_dict(self):
        return {
            "tipo_id": self.tipo_id,
            "nombre": self.nombre
        }


class Tipoexclusion_enum(models.Model):
    tipo_id = models.CharField(max_length=2, primary_key=True)
    nombre = models.CharField(max_length=50)

    def as_dict(self):
        return {
            "tipo_id": self.tipo_id,
            "nombre": self.nombre
        }


class TipoProyecto_enum(models.Model):
    id = models.IntegerField(primary_key=True)
    descripcion = models.CharField(max_length=50)

    def as_dict(self):
        return {
            "id": self.id,
            "descripcion": self.descripcion
        }


class Stage_enum(models.Model):
    stage_id = models.CharField(max_length=2, primary_key=True)
    descripcion = models.CharField(max_length=50)

    def as_dict(self):
        return {
            "stage_id": self.stage_id,
            "descripcion": self.descripcion
        }


class Moneda_enum(models.Model):
    moneda_id = models.CharField(max_length=3, primary_key=True)
    descripcion = models.CharField(max_length=50)

    def as_dict(self):
        return {
            "moneda_id": self.moneda_id,
            "descripcion": self.descripcion
        }


class Entidad(models.Model):
    entidad_id = models.CharField(max_length=4, primary_key=True)
    descripcion = models.CharField(max_length=50)
    usuarios = models.ManyToManyField(
        User, related_name='entidad', through='EntidadUsuario')
    moneda = models.ForeignKey(Moneda_enum)

    def as_dict(self):
        return {
            "entidad_id": self.entidad_id,
            "descripcion": self.descripcion,
            "usuarios": [userAsDict(obj) for obj in self.usuarios.all()],
            "moneda": self.moneda.as_dict()
        }


class Estado_enum(models.Model):
    id = models.IntegerField(primary_key=True)
    descripcion = models.CharField(max_length=50)

    def as_dict(self):
        return {
            "id": self.id,
            "descripcion": self.descripcion
        }


class Ajuste(Auditoria):
    fechaini = models.DateField()
    fechafin = models.DateField()
    comentario = models.CharField(max_length=250)
    finalidadorigen = models.ForeignKey(
        Finalidad, related_name='ajustes_origen', null=True)
    tipo = models.ForeignKey(Tipoajuste_enum)
    finalidad = models.ForeignKey(Finalidad, related_name='ajustes')
    importeajustado = models.DecimalField(
        max_digits=15, decimal_places=2, null=True)
    moneda = models.ForeignKey(Moneda_enum)
    porcentajeimporteajustado = models.DecimalField(
        max_digits=5, decimal_places=2, null=True)
    lgdajustada = models.DecimalField(
        max_digits=5, decimal_places=2, null=True)
    stageajustado = models.ForeignKey(Stage_enum, null=True)
    flagclientecontrato = models.CharField(max_length=1)
    entidad = models.ForeignKey(Entidad)
    operacion_id = models.CharField(max_length=15)
    ajusteorigen = models.IntegerField()

    def as_dict(self):
        if self.stageajustado == None:
            result_stageajustado = ""
        else:
            result_stageajustado = self.stageajustado.as_dict()

        if self.porcentajeimporteajustado == None:
            result_porcentajeimporteajustado = ""
        else:
            result_porcentajeimporteajustado = self.porcentajeimporteajustado

        if self.lgdajustada == None:
            result_lgdajustada = ""
        else:
            result_lgdajustada = self.lgdajustada

        if self.importeajustado == None:
            result_importeajustado = ""
        else:
            result_importeajustado = self.importeajustado

        if self.ajusteorigen == None:
            result_ajusteorigen = 0
        else:
            result_ajusteorigen = self.ajusteorigen

        return {
            "id_ajuste": self.pk,
            "fechaini": datetime.combine(self.fechaini, time(0, 0, 0)).isoformat(),
            "fechafin": datetime.combine(self.fechafin, time(23, 59, 59)).isoformat(),
            "comentario": self.comentario,
            "finalidadorigen": self.finalidadorigen.as_dict(),
            "tipo": self.tipo.as_dict(),
            "finalidad": self.finalidad.as_dict(),
            "importeajustado": str(result_importeajustado),
            "moneda": self.moneda.as_dict(),
            "porcentajeimporteajustado": str(result_porcentajeimporteajustado),
            "lgdajustada": str(result_lgdajustada),
            "stageajustado": result_stageajustado,
            "flagclientecontrato": self.flagclientecontrato,
            "entidad": self.entidad.as_dict(),
            "operacion_id": self.operacion_id,
            "usuarioalta": userAsDict(self.usuarioalta),
            "fechaalta": self.fechaalta.replace(microsecond=0).isoformat(),
            "usuarioultimaactualizacion": userAsDict(self.usuarioultimaactualizacion),
            "fechaultimaactualizacion": self.fechaultimaactualizacion.isoformat(),
            "ajusteorigen": result_ajusteorigen,
            "first_name": self.usuarioalta.first_name,
            "last_name": self.usuarioalta.last_name
        }


class Exclusion(Auditoria):
    fechaini = models.DateField()
    fechafin = models.DateField()
    comentario = models.CharField(max_length=250)
    finalidadorigen = models.ForeignKey(
        Finalidad, related_name='exclusiones_origen', null=True)
    tipo = models.ForeignKey(Tipoexclusion_enum)
    finalidad = models.ForeignKey(Finalidad, related_name='exclusiones')
    flagclientecontrato = models.CharField(max_length=1)
    entidad = models.ForeignKey(Entidad)
    operacion_id = models.CharField(max_length=15)
    exclusionorigen = models.IntegerField()

    def as_dict(self):
        if self.exclusionorigen == None:
            result_exclusionorigen = 0
        else:
            result_exclusionorigen = self.exclusionorigen
        return {
            "id_exclusion": self.pk,
            "fechaini": datetime.combine(self.fechaini, time(0, 0, 0)).isoformat(),
            "fechafin": datetime.combine(self.fechafin, time(23, 59, 59)).isoformat(),
            "comentario": self.comentario,
            "finalidadorigen": self.finalidadorigen.as_dict(),
            "tipo": self.tipo.as_dict(),
            "finalidad": self.finalidad.as_dict(),
            "flagclientecontrato": self.flagclientecontrato,
            "entidad": self.entidad.as_dict(),
            "operacion_id": self.operacion_id,
            "usuarioalta": userAsDict(self.usuarioalta),
            "fechaalta": self.fechaalta.replace(microsecond=0).isoformat(),
            "usuarioultimaactualizacion": userAsDict(self.usuarioultimaactualizacion),
            "fechaultimaactualizacion": self.fechaultimaactualizacion.isoformat(),
            "exclusionorigen": result_exclusionorigen,
            "first_name": self.usuarioalta.first_name,
            "last_name": self.usuarioalta.last_name
        }


class Ejecucion(Auditoria):
    fechaejecucion = models.DateTimeField(null=True)
    estado = models.ForeignKey(Estado_enum)
    fichero = models.CharField(max_length=10)
    entidad = models.ForeignKey(Entidad)
    finalidad = models.ForeignKey(Finalidad)
    comentario = models.CharField(max_length=250)
    proyectos = models.ManyToManyField('Proyecto', through='EjecucionProyecto')

    def as_dict(self):
        LOG.info("fecha ejecucion ejecucion: %s" %
                 self.fechaalta.replace(microsecond=0).isoformat())
        if not self.fechaejecucion:
            fechaexec = ""
        else:
            fechaexec = self.fechaejecucion.replace(microsecond=0).isoformat()
        return {
            "ejecucion_id": self.pk,
            "fechaejecucion": fechaexec,
            "estado": self.estado.as_dict(),
            "fichero": self.fichero,
            "entidad": self.entidad.as_dict(),
            "finalidad": self.finalidad.as_dict(),
            "comentario": self.comentario,
            "usuarioalta": userAsDict(self.usuarioalta),
            "fechaalta": self.fechaalta.replace(microsecond=0).isoformat(),
            "usuarioultimaactualizacion": userAsDict(self.usuarioultimaactualizacion),
            "fechaultimaactualizacion": self.fechaultimaactualizacion.replace(microsecond=0).isoformat(),
            "proyectos": [obj.as_dict() for obj in self.proyectos.all()],
            "first_name": self.usuarioalta.first_name,
            "last_name": self.usuarioalta.last_name
        }


class Proyecto(Auditoria):
    ruta_reglas_origen = models.CharField(max_length=250)
    ruta_params_origen = models.CharField(max_length=250, null=True)
    ruta_agregados_origen = models.CharField(max_length=250, null=True)
    ruta_agregados_destino = models.CharField(max_length=250, null=True)
    tipoproyecto = models.ForeignKey(TipoProyecto_enum)
    finalidad = models.ForeignKey(Finalidad)
    entidad = models.ForeignKey(Entidad)
    indparametros = models.BooleanField(default=True)

    def as_dict(self):
        return {
            "id_project": self.pk,
            "ruta_reglas_origen": self.ruta_reglas_origen,
            "ruta_params_origen": self.ruta_params_origen,
            "ruta_agregados_origen": self.ruta_agregados_origen,
            "ruta_agregados_destino": self.ruta_agregados_destino,
            "tipoproyecto": self.tipoproyecto.as_dict(),
            "finalidad": self.finalidad.as_dict(),
            "entidad": self.entidad.as_dict(),
            "indparametros": self.indparametros,
            "usuarioalta": userAsDict(self.usuarioalta),
            "fechaalta": self.fechaalta.isoformat(),
            "usuarioultimaactualizacion": userAsDict(self.usuarioultimaactualizacion),
            "fechaultimaactualizacion": self.fechaultimaactualizacion.isoformat()
        }


class ParametrosProyecto(Auditoria):
    proyecto = models.ForeignKey(Proyecto)
    motivo = models.CharField(max_length=250)
    ruta = models.CharField(max_length=250)
    entidad = models.ForeignKey(Entidad)
    nombrefichero = models.CharField(max_length=50)

    def as_dict(self):
        return {
            "id_param": self.pk,
            "proyecto": self.proyecto.as_dict(),
            "motivo": self.motivo,
            "ruta": self.ruta,
            "entidad": self.entidad.as_dict(),
            "nombrefichero": self.nombrefichero,
            "usuarioalta": userAsDict(self.usuarioalta),
            "fechaalta": self.fechaalta.replace(microsecond=0).isoformat(),
            "usuarioultimaactualizacion": userAsDict(self.usuarioultimaactualizacion),
            "fechaultimaactualizacion": self.fechaultimaactualizacion.isoformat()
        }


class ReglasProyecto(Auditoria):
    proyecto = models.ForeignKey(Proyecto)
    motivo = models.CharField(max_length=250)
    ruta = models.CharField(max_length=250)
    entidad = models.ForeignKey(Entidad)
    nombrefichero = models.CharField(max_length=50)

    def as_dict(self):
        return {
            "id_rule": self.pk,
            "proyecto": self.proyecto.as_dict(),
            "motivo": self.motivo,
            "ruta": self.ruta,
            "entidad": self.entidad.as_dict(),
            "nombrefichero": self.nombrefichero,
            "usuarioalta": userAsDict(self.usuarioalta),
            "fechaalta": self.fechaalta.isoformat(),
            "usuarioultimaactualizacion": userAsDict(self.usuarioultimaactualizacion),
            "fechaultimaactualizacion": self.fechaultimaactualizacion.isoformat()
        }


class EjecucionProyecto(models.Model):
    ejecucion = models.ForeignKey(Ejecucion)
    proyecto = models.ForeignKey(Proyecto)
    reglas = models.ForeignKey(ReglasProyecto)
    parametros = models.ForeignKey(ParametrosProyecto, null=True)

    class Meta:
        unique_together = ("ejecucion", "proyecto")

    def as_dict(self):
        if not self.parametros:
            params = ""
        else:
            params = self.parametros.as_dict()
        return {
            "ejecucion": self.ejecucion.as_dict(),
            "proyecto": self.proyecto.as_dict(),
            "reglas": self.reglas.as_dict(),
            "parametros": params
        }


class Configuracion(models.Model):
    clave = models.CharField(max_length=30, unique=True)
    valor = models.CharField(max_length=250)

    def as_dict(self):
        return {
            "clave": self.clave,
            "valor": self.valor
        }


class EntidadUsuario(models.Model):
    entidad = models.ForeignKey(Entidad)
    usuario = models.ForeignKey(User, unique=True)

    def as_dict(self):
        return {
            "entidad": self.entidad.as_dict(),
            "usuario": userAsDict(self.usuario)
        }


class DescDimensiones(models.Model):
    cod = models.CharField(max_length=250)
    desc = models.CharField(max_length=250)
    dimension = models.CharField(max_length=250)
    cod_entidad = models.CharField(max_length=250)
    cod_parent = models.CharField(max_length=250, null=True)
    date_start = models.DateField()
    date_end = models.DateField(null=True)

    def as_dict(self):
        if self.date_end is not None:
            date_end = datetime.combine(
                self.date_end, time(23, 59, 59)).isoformat()
        else:
            date_end = ""
        return {
            "cod": self.cod,
            "desc": self.desc,
            "dimension": self.dimension,
            "cod_entidad": self.cod_entidad,
            "cod_parent": self.cod_parent,
            "date_start": datetime.combine(self.date_start, time(0, 0, 0)).isoformat(),
            "date_end": date_end
        }
