//                                    BİSMİLLAHİRRAHMANİRRAHİM

export class Database {
  constructor (_api) {
    this.logger = _api.logger;
    this.api = _api;
  }

  /**
   * Api helpers Biiznillah
   */

  hatimSiraBelirle = no => {
    return this.api.hatimSiraBelirle ();
  };

  extractKey = () => {
    return this.api.extractKey ();
  };

  /**
   * Api functions
   */

  hatimGetir = async () => {
    return await this.api.hatimGetir ();
  };

  hatimBasligiGetir = async hatimKey => {
    return await this.api.hatimBasligiGetir (hatimKey);
  };

  yeniHatim = async (
    baslik,
    bitisTarihi,
    mevcutHatim = false,
    isRamazan = false,
    description = '',
    makeNewHatim = false,
    hatimCount = 1,
    isMonths3 = {eachday1part: false}
  ) => {
    return await this.api.yeniHatim (
      baslik,
      bitisTarihi,
      mevcutHatim,
      isRamazan,
      description,
      makeNewHatim,
      hatimCount,
      isMonths3
    );
  };

  yeniYillikHatim = async params => {
    return await this.api.yeniYillikHatim (params);
  };

  cuzAl = async (
    isim,
    no,
    subKey,
    alindi = true,
    makeNewHatim = false,
    writeTotalReadParts
  ) => {
    return await this.api.cuzAl (
      isim,
      no,
      subKey,
      alindi,
      makeNewHatim,
      writeTotalReadParts
    );
  };

  cuzIsimDegistir = async (isim, no, subKey) => {
    return await this.api.cuzIsimDegistir (isim, no, subKey);
  };

  cuzIptal = async (no, subKey) => {
    return await this.api.cuzIptal (no, subKey);
  };

  cuzIptalTasarruflu = async (no, subKey, full = false) => {
    return await this.api.cuzIptalTasarruflu (no, subKey, full);
  };

  cuzAlV3 = async (isim, no, subKey, alindi = true, makeNewHatim = false) => {
    return await this.api.cuzAlV3 (isim, no, subKey, alindi, makeNewHatim);
  };

  cuzIsimDegistirV3 = async (isim, no, subKey) => {
    return await this.api.cuzIsimDegistirV3 (isim, no, subKey);
  };

  cuzIptalV3 = async (no, subKey) => {
    return await this.api.cuzIptalV3 (no, subKey);
  };

  cuzBitti = async hatimKey => {
    await this.api.cuzBitti (hatimKey);
  };

  ziyaretSayisiGetir = async () => {
    return await this.api.ziyaretSayisiGetir ();
  };

  ziyaretSayisiArtir = async () => {
    await this.api.ziyaretSayisiArtir ();
  };

  countNumberOfCuzs = allHatimler => {
    return this.api.countNumberOfCuzs (allHatimler);
  };

  countNumberOfCuzsV3 = allHatimler => {
    return this.api.countNumberOfCuzsV3 (allHatimler);
  };

  getTotalReadParts = async () => {
    return await this.api.getTotalReadParts ();
  };

  hatimDegistir = async (baslik, bitisTarihi, description, subKey) => {
    return await this.api.hatimDegistir (
      baslik,
      bitisTarihi,
      description,
      subKey
    );
  };

  hatimDegistirV3 = async (baslik, bitisTarihi, description, subKey) => {
    return await this.api.hatimDegistirV3 (
      baslik,
      bitisTarihi,
      description,
      subKey
    );
  };

  yillikHatimDegistirV3 = async (baslik, bitisTarihi, description, subKey) => {
    return await this.api.yillikHatimDegistirV3 (
      baslik,
      bitisTarihi,
      description,
      subKey
    );
  };

  deleteHatim = async () => {
    return await this.api.deleteHatim ();
  };

  deleteHatimV3 = async () => {
    return await this.api.deleteHatimV3 ();
  };

  hatimListener = callback => {
    return this.api.hatimListener (callback);
  };

  stopMakingNewKhatm = async () => {
    return await this.api.stopMakingNewKhatm ();
  };

  yeniOzelHatim = async params => {
    return await this.api.yeniOzelHatim (params);
  };

  yeniOzelAltHatim = async params => {
    return await this.api.yeniOzelAltHatim (params);
  };

  ozelHatimDegistir = async params => {
    return await this.api.ozelHatimDegistir (params);
  };

  yeniUcAylarHatim = async params => {
    return await this.api.yeniUcAylarHatim (params);
  };

  listenHatim = (hatimKey, onData, onError) => {
    return this.api.listenHatim (hatimKey, onData, onError);
  };

  fetchChartAt = async params => {
    return await this.api.fetchChartAt (params);
  };

  markChartAt = async params => {
    return await this.api.markChartAt (params);
  };

  setReaction = async params => {
    return await this.api.setReaction (params);
  };

  markChart = async params => {
    return await this.api.markChart (params);
  };

  fetchChart = async params => {
    return await this.api.fetchChart (params);
  };

  setActiveKhatmKey = async params => {
    return await this.api.setActiveKhatm (params);
  };

  getActiveKhatmKey = async () => {
    return await this.api.getActiveKhatmKey ();
  };

  altHatimGetir = async ({altHatimKey}) => {
    return await this.api.altHatimGetir ({altHatimKey});
  };

  tasarrufluHatimGetir = async () => {
    return await this.api.tasarrufluHatimGetir ();
  };

  getKhatmSubKeys = async () => {
    return await this.api.getKhatmSubKeys ();
  };

  getTitleAndDescription = async ({subKey}) => {
    return await this.api.getTitleAndDescription ({subKey});
  };

  partRead = async ({subKey, partNo}) => {
    return await this.api.partRead ({subKey, partNo});
  };

  partNotRead = async ({subKey, partNo}) => {
    return await this.api.partNotRead ({subKey, partNo});
  };

  deleteSubKhatm = async ({subKey}) => {
    return await this.api.deleteSubKhatm ({subKey});
  };
}

export default Database;
