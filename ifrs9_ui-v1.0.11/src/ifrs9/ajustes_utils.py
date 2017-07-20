from sortedcontainers import SortedList
from ifrs9.models import Ajuste
from datetime import date, timedelta
from operator import itemgetter, attrgetter

import logging
LOG = logging.getLogger(__name__)
ONEDAY = timedelta(days=1)


class AjustesUtils(object):

    def getAjustesPrioritariosDateInterval(self, pAjustes, pStartDate, pEndDate):
        """Calculates a date partition for pAjustes and then prioritizes the
        adjustments that exist within pAjustes.
        First, calculates how dates should be partitioned between pStartDate and
        pEndDate according to how pAjustes span in time. Then iterates over the
        partitioned dates and, for each of them, calculates the highest priority
        Adjustment for Amount, Stage and LGD.
        Returns a list of 4-item tuples: date, Amount adj, Stage adg and LGD adg.
        """
        if pAjustes and len(pAjustes) > 0:
            pAjustes.sort(key=attrgetter("fechaini"))
        dates = self.partitionDates(pStartDate, pEndDate, pAjustes)
        dateAndLists = list()
        for i in range(len(dates)):
            if i < len(dates) - 1:
                period_end = dates[i + 1] - ONEDAY
            else:
                period_end = pEndDate

            period_adj = self.getAjustesPrioritariosDate(pAjustes, dates[i], period_end)

            if i == 0:
                dateAndLists.append(period_adj)
            else:
                self.unifyTramos(dateAndLists, period_adj)

        return dateAndLists

    def unifyTramos(self, pList, pTramo):
        """Unifies all periods calculated before making sure that no adjustment is
        present in two different periods for the same adjustment parameter.
        Output is a list of tuples with the same structure as those output by 
        getAjustesPrioritariosDate
        """
        i = len(pList) - 1
        new_tramos = list()
        while i >= 0:
            if pList[i][1] == pTramo[0] - ONEDAY:
                new_tramo = (pList[i][0], pTramo[1], None, None, None)
                new_tramo_notempty = False

                if pList[i][2] != None and pList[i][2] is pTramo[2]:
                    new_tramo = (new_tramo[0], new_tramo[1], pList[i][2], new_tramo[3], new_tramo[4])
                    pList[i] = (pList[i][0], pList[i][1], None, pList[i][3], pList[i][4])
                    pTramo = (pTramo[0], pTramo[1], None, pTramo[3], pTramo[4])
                    new_tramo_notempty = True

                if pList[i][3] != None and pList[i][3] is pTramo[3]:
                    new_tramo = (new_tramo[0], new_tramo[1], new_tramo[2], pList[i][3], new_tramo[4])
                    pList[i] = (pList[i][0], pList[i][1], pList[i][2], None, pList[i][4])
                    pTramo = (pTramo[0], pTramo[1], pTramo[2], None, pTramo[4])
                    new_tramo_notempty = True

                if pList[i][4] != None and pList[i][4] is pTramo[4]:
                    new_tramo = (new_tramo[0], new_tramo[1], new_tramo[2], new_tramo[3], pList[i][4])
                    pList[i] = (pList[i][0], pList[i][1], pList[i][2], pList[i][3], None)
                    pTramo = (pTramo[0], pTramo[1], pTramo[2], pTramo[3], None)
                    new_tramo_notempty = True

                if pList[i][2] == None and pList[i][3] == None and pList[i][4] == None:
                    del pList[i]
                if new_tramo_notempty:
                    new_tramos.append(new_tramo)

                i -= 1

            else:
                i = -1

        if pTramo[2] != None or pTramo[3] != None or pTramo[4] != None:
            pList.append(pTramo)

        for tramo in new_tramos:
            pList.append(tramo)

    def getAjustesPrioritariosDate(self, pAjustes, pStartDate, pEndDate):
        """Calculates the highest priority adjustment for each of the three kinds
        and the pDate given.
        First iterates over pAjustes to find which adjustments apply on the given
        pDate, then gets the top priority adjustment for each of the three kinds
        and returns all four variables in a tuple.
        Returns the highest priority adjustments in the shape of a 4-way tuple:
        (pDate, AmountAdj, StageAdj, LGDAdj)
        """
        lAmt = list()
        lStg = list()
        lLgd = list()
        for a in pAjustes:
            if a.fechaini <= pStartDate and a.fechafin >= pStartDate:
                if a.importeajustado != None or a.porcentajeimporteajustado != None:
                    lAmt.append(a)
                if a.stageajustado != None:
                    lStg.append(a)
                if a.lgdajustada != None:
                    lLgd.append(a)

        if len(lAmt) > 0:
            lAmt.sort(key=attrgetter('fechaalta'), reverse=True)
            lAmt.sort(key=attrgetter('tipo.tipo_id'))
            imp = lAmt[0]
        else:
            imp = None

        if len(lStg) > 0:
            lStg.sort(key=attrgetter('fechaalta'), reverse=True)
            stg = lStg[0]
        else:
            stg = None

        if len(lLgd) > 0:
            lLgd.sort(key=attrgetter('fechaalta'), reverse=True)
            lgd = lLgd[0]
        else:
            lgd = None

        return (pStartDate, pEndDate, imp, stg, lgd)

    def partitionDates(self, pStartDate, pEndDate, pAjustes):
        """Partitions the time period between pStartDate and pEndDate into non
        overlapping periods according to the adjustments in pAjustes.
        Given a start and end date and a list of adjustments ordered by fechaini,
        computes a new, ordered list of dates spanning across the same period.
        These dates indicate the start of each partition of the time period in
        which it has to be divided to compute adjustment priority. I.e, for all
        days between each date and the day before the following date returned,
        the same adjustments are valid.
        Returns a list of date objects, each of them indicating the start of a
        subperiod inside the main period between pStartDate and pEndDate.
        """
        partition = []
        ends = SortedList()
        if len(pAjustes) > 0:
            ends.add(pAjustes[0].fechafin)
        d = pStartDate
        i = 0

        flag = pStartDate == pEndDate

        while ((d < pEndDate and flag == False) or (d <= pEndDate and flag == True)):
            if len(partition) == 0 or d > partition[len(partition) - 1]:
                partition.append(d)
            if pAjustes and len(pAjustes) > i:
                if len(ends) == 0 or pAjustes[i].fechaini <= ends[0]:
                    d = pAjustes[i].fechaini
                    ends.add(pAjustes[i].fechafin)
                    i += 1
                    # (i, d) = self.processAjuste(i, pAjustes, ends)
                else:
                    d = ends.pop(0) + ONEDAY
            elif len(ends) > 0:
                d = ends.pop(0) + ONEDAY
            else:
                d = pEndDate

        return partition
