import { HatimType } from "backend/types/HatimType";
import { YeniYillikHatimParams } from "backend/types/params/YeniYillikHatimParams";
import { BaseResponse } from "backend/types/responses/BaseResponse";
import { YeniYillikHatimResponse } from "backend/types/responses/YeniYillikHatimResponse";


export interface IDatabase{
    countNumberOfCuzsV3(hatimsData: HatimType[]): number;
    hatimSiraBelirle(no: number):Promise<BaseResponse<any>>;
    
    extractKey():Promise<BaseResponse<string>>;
    
      /**
       * Api functions
       */
    
    hatimGetir():Promise<any>;
    
    hatimBasligiGetir(hatimKey:string):Promise<BaseResponse<string>>;
    
    yeniHatim(baslik:string, bitisTarihi:string, mevcutHatim:boolean,
         isRamazan:boolean, description:string, makeNewHatim:boolean, hatimCount:number,
          isMonths3: {eachday1part: boolean}, okumaTakibi?: boolean):Promise<BaseResponse<string>>;

    yeniYillikHatim(args:YeniYillikHatimParams):Promise<BaseResponse<YeniYillikHatimResponse>>;
    
    cuzAl(isim:string, no:number, subKey:string, alindi:boolean, makeNewHatim:boolean):Promise<BaseResponse<any>>;
    
    cuzIsimDegistir(isim:string, no:number, subKey:string):Promise<BaseResponse<any>>;
    
    cuzIptal(no:number, subKey:string):Promise<BaseResponse<any>>;
    
    cuzBitti(hatimKey:string):Promise<BaseResponse<any>>;
    
    ziyaretSayisiGetir():Promise<BaseResponse<number>>;
    
    ziyaretSayisiArtir():Promise<BaseResponse<void>>;
    
    countNumberOfCuzs(allHatimler:HatimType[]):BaseResponse<number>;
    
    hatimDegistir(baslik:string, bitisTarihi:string, description:string, subKey:string):Promise<BaseResponse<number>>;
    
    deleteHatim():Promise<BaseResponse<number>>;
    
    hatimListener(callback:Promise<BaseResponse<any>>):Promise<BaseResponse<any>>;
    
    stopMakingNewKhatm():Promise<number>;

    markChart(params: {subKey: string, partNo: number, itemNo:number, value:boolean}): Promise<BaseResponse<string>>;

    fetchChart(params: {subKey: string, partNo: number}): Promise<BaseResponse<any>>;

}