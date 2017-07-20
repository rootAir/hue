#!/usr/bin/env python

import time
import os
import errno
import shutil

import paramiko
import fnmatch
from ifrs9.models import Configuracion, Proyecto, TipoProyecto_enum, Finalidad, Entidad

import logging
LOG = logging.getLogger(__name__)


class FTPdao(object):

    def __init__(self):

        self.srcHostname = Configuracion.objects.get(
            clave='ftp.src.hostname').valor
        self.srcPort = int(Configuracion.objects.get(
            clave='ftp.src.port').valor)
        self.srcUsername = Configuracion.objects.get(
            clave='ftp.src.username').valor
        self.srcPassword = Configuracion.objects.get(
            clave='ftp.src.password').valor
        self.dstHostname = Configuracion.objects.get(
            clave='ftp.dst.hostname').valor
        self.dstPath = Configuracion.objects.get(clave='ftp.dst.path').valor

    def listParametros(self, pEntidad, pFinalidad, pTipoProyecto):

        ruta_params_origen = Proyecto.objects.get(
            tipoproyecto=pTipoProyecto, finalidad=pFinalidad, entidad=pEntidad).ruta_params_origen

        try:
            transport, sftp = self.__openSFTPClient__(
                self.srcHostname, self.srcPort, self.srcUsername, self.srcPassword)
            listdir = sftp.listdir_attr(ruta_params_origen)
            return_listdir = []
            filetype_extension = Configuracion.objects.get(
                clave="ftp.filetype.filter").valor
            for p in listdir:
                if fnmatch.fnmatch(p.filename, str(filetype_extension)):
                    return_listdir.append(p)
            LOG.info('File params list successfully retrieved from %s' %
                     ruta_params_origen)

            return return_listdir

        except Exception as e:
            exit = "Failed to connect FTP %s:%d with user: %s -- Exception - %s : %s" % (
                self.srcHostname, self.srcPort, self.srcUsername, e.__class__, e)
            LOG.error(exit)
            raise
        #   return exit

        finally:
            self.__closeSFTPClient__(transport, sftp)

    def importReglas(self, pEntidad, pFinalidad, pTipoProyecto):

        ruta_reglas_origen = Proyecto.objects.get(
            tipoproyecto=pTipoProyecto, finalidad=pFinalidad, entidad=pEntidad).ruta_reglas_origen

        try:
            splitReglas = ruta_reglas_origen.split('/')
            filename = splitReglas[(len(splitReglas) - 1)]

            transport, sftp = self.__openSFTPClient__(
                self.srcHostname, self.srcPort, self.srcUsername, self.srcPassword)
            ruta_reglas_destino = '%s/%s/%s/reglas' % (
                self.dstPath, pEntidad.entidad_id, pFinalidad.id)

            if self.dstHostname == "localhost":
                self.__mkdirIntermediate__(ruta_reglas_destino)
                ruta_reglas_destino += '/%d-%s' % (int(time.time()), filename)
                sftp.get(ruta_reglas_origen, ruta_reglas_destino)
            else:
                ruta_reglas_destino = self.copyFileToRemote(
                    sftp, transport, ruta_reglas_origen, filename, ruta_reglas_destino)

            LOG.info('File rules imported successfully from %s to %s' %
                     (ruta_reglas_origen, ruta_reglas_destino))
            return (filename, ruta_reglas_destino)

        except Exception as e:
            exit = "Failed to connect FTP %s:%d with user: %s -- Exception - %s : %s" % (
                self.srcHostname, self.srcPort, self.srcUsername, e.__class__, e)
            raise
        #   return exit

        finally:
            self.__closeSFTPClient__(transport, sftp)

    def importParametros(self, pEntidad, pFinalidad, pTipoProyecto, pParametros):

        LOG.info('importParams start')
        ruta_params_origen = Proyecto.objects.get(
            tipoproyecto=pTipoProyecto, finalidad=pFinalidad, entidad=pEntidad).ruta_params_origen
        ruta_params_origen += '/%s' % pParametros

        try:
            splitParams = ruta_params_origen.split('/')
            filename = splitParams[(len(splitParams) - 1)]

            transport, sftp = self.__openSFTPClient__(
                self.srcHostname, self.srcPort, self.srcUsername, self.srcPassword)
            ruta_params_destino = '%s/%s/%s/parametros' % (
                self.dstPath, pEntidad.entidad_id, pFinalidad.id)

            if self.dstHostname == "localhost":
                self.__mkdirIntermediate__(ruta_params_destino)
                ruta_params_destino += '/%d-%s' % (
                    int(time.time()), pParametros)
                LOG.info('origen %s destino %s' %
                         (ruta_params_origen, ruta_params_destino))
                sftp.get(ruta_params_origen, ruta_params_destino)
            else:
                ruta_params_destino = self.copyFileToRemote(
                    sftp, transport, ruta_params_origen, filename, ruta_params_destino)

            LOG.info('File params imported successfully from %s to %s' %
                     (ruta_params_origen, ruta_params_destino))
            return (pParametros, ruta_params_destino)

        except Exception as e:
            exit = "Failed to connect FTP %s:%d with user: %s -- Exception - %s : %s" % (
                self.srcHostname, self.srcPort, self.srcUsername, e.__class__, e)
            raise
        #   return exit

        finally:
            self.__closeSFTPClient__(transport, sftp)

    def copyFileToRemote(self, pSrcSFTP, pSrcTransport, pSrcPath, pSrcFilename, pDstPath):

        dstPort = int(Configuracion.objects.get(clave='ftp.dst.port').valor)
        dstUsername = Configuracion.objects.get(clave='ftp.dst.username').valor
        dstPassword = Configuracion.objects.get(clave='ftp.dst.password').valor
        localPathPrefix = Configuracion.objects.get(
            clave='ftp.local.path').valor

        local_path = '%s%d' % (localPathPrefix, int(time.time()))
        self.__mkdirIntermediate__(local_path)
        local_file_path = '%s/%s' % (local_path, pSrcFilename)
        pSrcSFTP.get(pSrcPath, local_file_path)

        try:
            dstTransport, dstSftp = self.__openSFTPClient__(
                self.dstHostname, dstPort, dstUsername, dstPassword)
            self.__mkdirRemoteIntermediate__(dstSftp, pDstPath)
            dst_path = '%s/%d-%s' % (pDstPath, int(time.time()), pSrcFilename)
            dstSftp.put(local_file_path, dst_path)
            return dst_path

        finally:
            self.__closeSFTPClient__(dstTransport, dstSftp)
            shutil.rmtree(local_path)

    def __openSFTPClient__(self, pHostname, pPort, pUser, pPass):
        transport = paramiko.Transport(pHostname, pPort)
        transport.connect(username=pUser, password=pPass)
        sftp = paramiko.SFTPClient.from_transport(transport)
        return transport, sftp

    def __closeSFTPClient__(self, pPransport, pSFTPClient):
        try:
            pSFTPClient.close()
            pTransport.close()
        except:
            pass

    def __mkdirIntermediate__(self, pPath):
        try:
            os.makedirs(pPath)
        except OSError as e:
            if e.errno == errno.EEXIST and os.path.isdir(pPath):
                pass
            else:
                raise

    def __mkdirRemoteIntermediate__(self, pSftp, pPath):
        path_iter = ''
        for element in pPath.split('/'):
            try:
                path_iter += '%s/' % (element)
                pSftp.mkdir(path_iter)
            except:
                pass
