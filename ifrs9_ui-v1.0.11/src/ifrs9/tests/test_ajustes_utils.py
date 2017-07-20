from ifrs9.ajustes_utils import AjustesUtils
from ifrs9.models import Ajuste, Tipoajuste_enum, Stage_enum
from datetime import date
from django.utils import unittest
from django.test.utils import setup_test_environment
setup_test_environment()

################################################################################
# Abstract class for reusable variables initialization
class AbstractTest(unittest.TestCase):
    def setUp(self):
        self.au = AjustesUtils()
        self.jan1 = date(2017, 01, 01)
        self.jan15 = date(2017, 01, 15)
        self.jan16 = date(2017, 01, 16)
        self.jan30 = date(2017, 01, 30)
        self.jan31 = date(2017, 01, 31)
        self.feb1 = date(2017, 02, 01)
        self.feb2 = date(2017, 02, 02)
        self.feb15 = date(2017, 02, 15)
        self.feb16 = date(2017, 02, 16)
        self.feb17 = date(2017, 02, 17)
        self.feb28 = date(2017, 02, 28)
        self.tipoCliente = Tipoajuste_enum()
        self.tipoCliente.tipo_id = '1'
        self.tipoCliente.nombre = 'Ajuste cliente manual'
        self.tipoContrato = Tipoajuste_enum()
        self.tipoContrato.tipo_id = '3'
        self.tipoContrato.nombre = 'Ajuste caontrato manual'
        self.stage2 = Stage_enum()
        self.stage2.stage_id = '2'
        self.stage2.descripcion = 'Stage 2'
        self.stage3 = Stage_enum()
        self.stage3.stage_id = '3'
        self.stage3.descripcion = 'Stage 3'

################################################################################
# Test classes for date partitioning method testing
class PartitionDatesEmptyTest(AbstractTest):
    def runTest(self):
        self.assertEquals([self.jan1], self.au.partitionDates(self.jan1, self.jan30, []))

class PartitionDatesOneAdjTest(AbstractTest):
    def runTest(self):
        a1 = Ajuste()
        a1.fechaini = self.jan1
        a1.fechafin = self.jan15
        result = [self.jan1, self.jan16]
        self.assertEquals(result, self.au.partitionDates(self.jan1, self.jan30, [a1]))

class PartitionDatesTwoAdjTest(AbstractTest):
    def runTest(self):
        a1 = Ajuste()
        a1.fechaini = self.jan1
        a1.fechafin = self.jan15
        a2 = Ajuste()
        a2.fechaini = self.jan15
        a2.fechafin = self.jan30
        result = [self.jan1, self.jan15, self.jan16]
        self.assertEquals(result, self.au.partitionDates(self.jan1, self.jan30, [a1, a2]))

class PartitionDatesThreeAdjTest(AbstractTest):
    def runTest(self):
        a1 = Ajuste()
        a1.fechaini = self.jan15
        a1.fechafin = self.feb16
        a2 = Ajuste()
        a2.fechaini = self.jan16
        a2.fechafin = self.jan30
        a3 = Ajuste()
        a3.fechaini = self.jan31
        a3.fechafin = self.feb1
        result = [self.jan1, self.jan15, self.jan16, self.jan31, self.feb2, self.feb17]
        self.assertEquals(result, self.au.partitionDates(self.jan1, self.feb28, [a1, a2, a3]))

################################################################################
# Test classes for adjustment priotity method testing
class AdjPriorityNoAdjTest(AbstractTest):
    def runTest(self):
        a1 = Ajuste()
        a1.fechaalta = self.jan1
        a1.tipo = self.tipoContrato
        a1.fechaini = self.jan1
        a1.fechafin = self.jan15
        a1.importeajustado = 100
        self.assertEquals((self.jan30, self.feb2, None, None, None), self.au.getAjustesPrioritariosDate([a1], self.jan30, self.feb2))

# Amount adjustments
class AdjPriorityImporteOneAdjTest(AbstractTest):
    def runTest(self):
        a1 = Ajuste()
        a1.fechaalta = self.jan1
        a1.tipo = self.tipoContrato
        a1.fechaini = self.jan1
        a1.fechafin = self.jan30
        a1.importeajustado = 100
        self.assertEquals((self.jan15, self.jan30, a1, None, None), self.au.getAjustesPrioritariosDate([a1], self.jan15, self.jan30))

class AdjPriorityImporteTwoAdjFAltaTest(AbstractTest):
    def runTest(self):
        a1 = Ajuste()
        a1.fechaalta = self.jan1
        a1.tipo = self.tipoCliente
        a1.fechaini = self.jan1
        a1.fechafin = self.jan30
        a1.importeajustado = 100
        a2 = Ajuste()
        a2.fechaalta = self.jan15
        a2.tipo = self.tipoCliente
        a2.fechaini = self.jan1
        a2.fechafin = self.jan30
        a2.importeajustado = 200
        self.assertEquals((self.jan30, self.jan30, a2, None, None), self.au.getAjustesPrioritariosDate([a1, a2], self.jan30, self.jan30))

class AdjPriorityImporteTwoAdjTipoTest(AbstractTest):
    def runTest(self):
        a1 = Ajuste()
        a1.fechaalta = self.jan1
        a1.tipo = self.tipoContrato
        a1.fechaini = self.jan1
        a1.fechafin = self.jan30
        a1.importeajustado = 100
        a2 = Ajuste()
        a2.fechaalta = self.jan1
        a2.tipo = self.tipoCliente
        a2.fechaini = self.jan1
        a2.fechafin = self.jan30
        a2.porcentajeimporteajustado = 20
        self.assertEquals((self.jan15, self.jan30, a2, None, None), self.au.getAjustesPrioritariosDate([a1, a2], self.jan15, self.jan30))

# Stage adjustments
class AdjPriorityStageOneAdjTest(AbstractTest):
    def runTest(self):
        a1 = Ajuste()
        a1.fechaalta = self.jan1
        a1.tipo = self.tipoContrato
        a1.fechaini = self.jan1
        a1.fechafin = self.jan30
        a1.stageajustado = self.stage2
        self.assertEquals((self.jan15, self.jan30, None, a1, None), self.au.getAjustesPrioritariosDate([a1], self.jan15, self.jan30))

class AdjPriorityStageTwoAdjTest(AbstractTest):
    def runTest(self):
        a1 = Ajuste()
        a1.fechaalta = self.jan15
        a1.tipo = self.tipoContrato
        a1.fechaini = self.jan1
        a1.fechafin = self.jan30
        a1.stageajustado = self.stage2
        a2 = Ajuste()
        a2.fechaalta = self.jan1
        a2.tipo = self.tipoCliente
        a2.fechaini = self.jan1
        a2.fechafin = self.jan30
        a2.stageajustado = self.stage3
        self.assertEquals((self.jan15, self.jan30, None, a1, None), self.au.getAjustesPrioritariosDate([a1, a2], self.jan15, self.jan30))

# LGD adjustments
class AdjPriorityLgdOneAdjTest(AbstractTest):
    def runTest(self):
        a1 = Ajuste()
        a1.fechaalta = self.jan1
        a1.tipo = self.tipoCliente
        a1.fechaini = self.jan1
        a1.fechafin = self.jan30
        a1.lgdajustada = 20
        self.assertEquals((self.jan15, self.jan30, None, None, a1), self.au.getAjustesPrioritariosDate([a1], self.jan15, self.jan30))

class AdjPriorityLgdTwoAdjTest(AbstractTest):
    def runTest(self):
        a1 = Ajuste()
        a1.fechaalta = self.jan1
        a1.tipo = self.tipoCliente
        a1.fechaini = self.jan1
        a1.fechafin = self.jan30
        a1.lgdajustada = 20
        a2 = Ajuste()
        a2.fechaalta = self.jan15
        a2.tipo = self.tipoCliente
        a2.fechaini = self.jan1
        a2.fechafin = self.jan30
        a2.lgdajustada = 25
        self.assertEquals((self.jan15, self.jan30, None, None, a2), self.au.getAjustesPrioritariosDate([a1, a2], self.jan15, self.jan30))

# Mixed adjustments
class AdjMixedImporteStageOneAdjTest(AbstractTest):
    def runTest(self):
        a1 = Ajuste()
        a1.fechaalta = self.jan1
        a1.tipo = self.tipoContrato
        a1.fechaini = self.jan1
        a1.fechafin = self.jan30
        a1.importeajustado = 240
        a1.stageajustado = self.stage2
        self.assertEquals((self.jan15, self.jan30, a1, a1, None), self.au.getAjustesPrioritariosDate([a1], self.jan15, self.jan30))

class AdjMixedImporteStageTwoAdjTest(AbstractTest):
    def runTest(self):
        a1 = Ajuste()
        a1.fechaalta = self.jan1
        a1.tipo = self.tipoCliente
        a1.fechaini = self.jan1
        a1.fechafin = self.jan30
        a1.importeajustado = 240
        a1.stageajustado = self.stage2
        a2 = Ajuste()
        a2.fechaalta = self.jan15
        a2.tipo = self.tipoContrato
        a2.fechaini = self.jan1
        a2.fechafin = self.jan30
        a2.porcentajeimporteajustado = 15
        a2.stageajustado = self.stage3
        self.assertEquals((self.jan15, self.jan30, a1, a2, None), self.au.getAjustesPrioritariosDate([a1, a2], self.jan15, self.jan30))

class AdjMixedImporteStageLgdTwoAdjTest(AbstractTest):
    def runTest(self):
        a1 = Ajuste()
        a1.fechaalta = self.jan1
        a1.tipo = self.tipoCliente
        a1.fechaini = self.jan1
        a1.fechafin = self.jan30
        a1.importeajustado = 240
        a1.stageajustado = self.stage2
        a2 = Ajuste()
        a2.fechaalta = self.jan15
        a2.tipo = self.tipoContrato
        a2.fechaini = self.jan1
        a2.fechafin = self.jan30
        a2.lgdajustada = 15
        self.assertEquals((self.jan15, self.jan30, a1, a1, a2), self.au.getAjustesPrioritariosDate([a1, a2], self.jan15, self.jan30))

class AdjMixedImporteStageLgdThreeAdjTest(AbstractTest):
    def runTest(self):
        a1 = Ajuste()
        a1.fechaalta = self.jan15
        a1.tipo = self.tipoCliente
        a1.fechaini = self.jan1
        a1.fechafin = self.jan30
        a1.importeajustado = 240
        a1.stageajustado = self.stage2
        a2 = Ajuste()
        a2.fechaalta = self.jan1
        a2.tipo = self.tipoContrato
        a2.fechaini = self.jan1
        a2.fechafin = self.jan30
        a2.importeajustado = 200
        a2.stageajustado = self.stage3
        a3 = Ajuste()
        a3.fechaalta = self.jan1
        a3.tipo = self.tipoCliente
        a3.fechaini = self.jan1
        a3.fechafin = self.jan30
        a3.lgdajustada = 20
        self.assertEquals((self.jan15, self.jan30, a1, a1, a3), self.au.getAjustesPrioritariosDate([a1, a2, a3], self.jan15, self.jan30))

################################################################################
# Test classes for full time period priority calculation method testing
class Example1DDSTest(AbstractTest):
    def runTest(self):
        a1 = Ajuste()
        a1.fechaalta = self.jan1
        a1.tipo = self.tipoContrato
        a1.fechaini = self.jan1
        a1.fechafin = self.feb28
        a1.importeajustado = 1000
        a1.stageajustado = self.stage2
        a2 = Ajuste()
        a2.fechaalta = self.jan15
        a2.tipo = self.tipoContrato
        a2.fechaini = self.feb1
        a2.fechafin = self.feb28
        a2.porcentajeimporteajustado = 20
        
        periodo1 = (self.jan1, self.jan31, a1, None, None)
        periodo2 = (self.feb1, self.feb28, a2, None, None)
        periodo3 = (self.jan1, self.feb28, None, a1, None)
        self.assertEquals([periodo1, periodo2, periodo3], self.au.getAjustesPrioritariosDateInterval([a1, a2], self.jan1, self.feb28))

class Example2DDSTest(AbstractTest):
    def runTest(self):
        a1 = Ajuste()
        a1.fechaalta = self.jan1
        a1.tipo = self.tipoContrato
        a1.fechaini = self.jan1
        a1.fechafin = self.feb28
        a1.importeajustado = 1000
        a2 = Ajuste()
        a2.fechaalta = self.jan15
        a2.tipo = self.tipoContrato
        a2.fechaini = self.jan1
        a2.fechafin = self.feb28
        a2.porcentajeimporteajustado = 20

        periodo1 = (self.jan1, self.feb28, a2, None, None)
        self.assertEquals([periodo1], self.au.getAjustesPrioritariosDateInterval([a1, a2], self.jan1, self.feb28))

class Example3DDSTest(AbstractTest):
    def runTest(self):
        a1 = Ajuste()
        a1.fechaalta = self.jan1
        a1.tipo = self.tipoCliente
        a1.fechaini = self.jan1
        a1.fechafin = self.feb28
        a1.importeajustado = 1000
        a1.stageajustado = self.stage2
        a2 = Ajuste()
        a2.fechaalta = self.jan15
        a2.tipo = self.tipoContrato
        a2.fechaini = self.jan1
        a2.fechafin = self.feb28
        a2.porcentajeimporteajustado = 20
        a2.stageajustado = self.stage3

        periodo1 = (self.jan1, self.feb28, a1, a2, None)
        self.assertEquals([periodo1], self.au.getAjustesPrioritariosDateInterval([a1, a2], self.jan1, self.feb28))

class Example4DDSTest(AbstractTest):
    def runTest(self):
        a1 = Ajuste()
        a1.fechaalta = self.jan1
        a1.tipo = self.tipoCliente
        a1.fechaini = self.jan1
        a1.fechafin = self.feb28
        a1.lgdajustada = 30
        a2 = Ajuste()
        a2.fechaalta = self.jan15
        a2.tipo = self.tipoContrato
        a2.fechaini = self.feb1
        a2.fechafin = self.feb28
        a2.porcentajeimporteajustado = 20
        a2.stageajustado = self.stage2
        a3 = Ajuste()
        a3.fechaalta = self.feb1
        a3.tipo = self.tipoContrato
        a3.fechaini = self.feb16
        a3.fechafin = self.feb28
        a3.importeajustado = 500

        periodo1 = (self.feb1, self.feb15, a2, None, None)
        periodo2 = (self.feb16, self.feb28, a3, None, None)
        periodo3 = (self.jan1, self.feb28, None, None, a1)
        periodo4 = (self.feb1, self.feb28, None, a2, None)
        self.assertEquals([periodo1, periodo2, periodo3, periodo4], self.au.getAjustesPrioritariosDateInterval([a1, a2, a3], self.jan1, self.feb28))

class ComplexExampleTest(AbstractTest):
    def runTest(self):
        a1 = Ajuste()
        a1.fechaalta = self.jan30
        a1.tipo = self.tipoContrato
        a1.fechaini = self.jan15
        a1.fechafin = self.feb16
        a1.importeajustado = 500
        a1.stageajustado = self.stage3
        a2 = Ajuste()
        a2.fechaalta = self.jan1
        a2.tipo = self.tipoCliente
        a2.fechaini = self.jan15
        a2.fechafin = self.jan31
        a2.lgdajustada = 30
        a3 = Ajuste()
        a3.fechaalta = self.jan16
        a3.tipo = self.tipoCliente
        a3.fechaini = self.jan16
        a3.fechafin = self.feb1
        a3.importeajustado = 150
        a3.stageajustado = self.stage2
        a4 = Ajuste()
        a4.fechaalta = self.jan15
        a4.tipo = self.tipoCliente
        a4.fechaini = self.feb1
        a4.fechafin = self.feb16
        a4.porcentajeimporteajustado = 20

        p1 = (self.jan15, self.jan15, a1, None, None)
        p2 = (self.jan15, self.jan31, None, None, a2)
        p3 = (self.jan16, self.feb1, a3, None, None)
        p4 = (self.feb2, self.feb16, a4, None, None)
        p5 = (self.jan15, self.feb16, None, a1, None)

        self.assertEquals([p1, p2, p3, p4, p5], self.au.getAjustesPrioritariosDateInterval([a1, a2, a3, a4], self.jan15, self.feb28))
