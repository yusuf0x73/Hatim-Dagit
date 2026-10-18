//                                     BİSMİLLAHİRRAHMANİRRAHİM

import {db} from 'backend';
import {getTicks, setTicks} from 'localStorage/myKhatms';

/**
 * Bir parçanın çizelgesini veritabanından okur / yazar (hatim/<key>/<subKey>/charts/<no>/<gün>).
 * Bağlantı yoksa son bilinen yerel kopya gösterilir.
 */
export const chartStore = ({hatimKey, subKey, partNo}) => ({
  load: async () => {
    const result = await db.fetchChartAt ({hatimKey, subKey, partNo});
    if (result.error != undefined) return getTicks (hatimKey, partNo);
    setTicks (hatimKey, partNo, result.data);
    return result.data;
  },
  save: async (day, value) => {
    const result = await db.markChartAt ({hatimKey, subKey, partNo, itemNo: day, value});
    if (result.error != undefined) return false;
    const current = getTicks (hatimKey, partNo).filter (d => d !== day);
    setTicks (hatimKey, partNo, value ? [...current, day] : current);
    return true;
  },
});
