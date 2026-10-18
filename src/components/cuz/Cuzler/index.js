//                                     BİSMİLLAHİRRAHMANİRRAHİM
//                                          ALLAHU  EKBER
//                                          ELHAMDÜLİLLAH


import React, {useState, useEffect, useContext} from 'react'
import { useSelector, useDispatch } from "react-redux";
import {FaBars} from 'react-icons/fa'
import {QuestionContainer, QuestionInnerContainer, QuestionItem, RespondContainer, RespondInnerContainer, ResponseItem
, ResponseLogo, ResponseText, BackButtonIcon, BackContainer, RespondOuterContainer,
DialogBox, DialogText, DialogLink, DialogIcon, DialogContainer, DialogInputBox, NavBtnLink,
LoadingContainer, LoadingItem,
CopyContainer, CopyItem, CopyIcon,
ShareContainer, ShareItem, ShareIcon,
YeniHatimWrapper, YeniHatimContainer, YeniHatimButton, YeniHatimIcon, YeniHatimText,
HideHatimIcon, ShowHatimIcon, HatimContainer, HatimIconContainer, HatimIconText, CuzlerDescription, CuzlerFinishDate,
IsReadItem, IsReadText, ResponseItemContainer, RefreshKhatmsContainer, RefreshKhatmsIcon, RefreshKhatmsItem,
DeleteHatimIcon, DeleteHatimIconContainer,
HatimIconTemplate, ResponseName, MineBadge, ActionBar, GridToolbar, GridHint, Legend, LegendItem, CardWrapper,
SkeletonPage, SkeletonCard, SkeletonGrid, SkeletonTile, RetryButton
} from './QuestionElements';
import { Check } from 'tabler-icons-react';
import { rememberPart, forgetPart, rememberTitle } from 'localStorage/myKhatms';
import { ShareActions, PartSheet, fmt, hasSecret, failMessage, takeFailMessage, isLocalAdmin, ReactionChips, ReactionPicker, ReactSheet, ReadQuranBanner, TakenSheet, takenTitle } from 'components/khatmKit';
import AskDialog from "../AskDialog";
import LanguageData from '../../../strings';
import {dataFormat} from '../../../backend/datas/dataFormat';
import { removeAll, objectToArray, removeAll_v1, isKhatmFull, hatimSiraBelirle, setLanguage, isAdmin } from "../../../common";
import { FaGithub } from "react-icons/fa";
import backButton from '../../../icons/button.svg';
import close from '../../../icons/close.svg';
import {DatabaseContext} from '../../../backend';
import ShareBox from '../ShareBox';
import { extractKey, initializeLocalStorage, withTimeout } from "../../../common";
import { Language } from '@styled-icons/ionicons-outline';
import { RefreshCircle } from '@styled-icons/ionicons-outline';
import AlertDialog from '../AlertDialog';
import StatsRing from '../RingProgress';
import CuzlerHatimCard from '../CuzlerHatimCard';
import YesNoDialog from "../YesNoDialog";
import { useNotification, notificationActions } from '../../../features/notification';
import { showNotification } from '@mantine/notifications';
import { editModalCuzlerActions, useEditCuzlerModal } from '../../../features/editCuzlerModal';
import { Text, Modal, Button, Center } from '@mantine/core';
import EditModalContent from "../EditModalContent";
import { cuzlerFunctionTriggerActions, useCuzlerFunctionTrigger } from '../../../features/cuzlerFunctionTrigger';
import { yesNoDialogAlertActions } from '../../../features/yesNoDialogAlert';
import {loggerActions, useLogger} from '../../../features/logger'
import LocDb from "@yusuf-yeniceri/easy-storage";
import AlertDialogCommon from '../../common/AlertDialogCommon'
import Logger from '../../../backend/APIs/firebase_api/logger';
import { alertDialogActions } from '../../../features/alertDialog';
import { loadingOverlayActions } from 'features/loadingOverlay';
import { isReadDialogAlertActions } from 'features/isReadDialogAlert';
import IsReadDialog from '../IsReadDialog/isReadDialog'
import {juzRange} from 'plans/quran';



const Question = ({ toggle }) => {

    const database = useContext(DatabaseContext)
    const [datas, setDatas] = useState(18);
    const [routes, setRoutes] = useState([]);
    const [hatimKey, setHatimKey] = useState("");
    const [hideDialogBox, setHideDialogBox] = useState(false);
    const [justTaken, setJustTaken] = useState (null); // az önce alınan cüz: {title, text, read}
    const [linkKopyala, setLinkKopyala] = useState(LanguageData["/cuz"].After.Copy.Before)
    const [username, setUsername] = useState("");
    const [hatimNo, setHatimNo] = useState("");
    const [allLanguage, setAllLanguage] = useState([dataFormat]);
    const [hideRespond, setHideRespond] = useState(false);
    const [loadingVisibility, setLoadingVisibility] = useState(true);
    const [linkCopiedText, setLinkCopiedText] = useState(LanguageData["/cuz"].After.Copy.Before);
    const [waitText, setWaitText] = useState(LanguageData["/cuz"].Before.Wait);
    const [takePart, setTakePart] = useState(LanguageData["/cuz"].Button.Take);
    const [partIptal, setPartIptal] = useState(false);
    // Cihazda kaydı olmayan ama secret'ı bulunan cüz: sunucu sahibini doğrularsa değiştirilebilir
    const [partClaim, setPartClaim] = useState(false);
    const [partAdmin, setPartAdmin] = useState(false);
    // Başkasının cüzüne bırakılacak tebrik
    const [reactTarget, setReactTarget] = useState(null);
    const [hideShareBox, setHideShareBox] = useState(false);
    const [hatimlerVisibilities, setHatimlerVisibilities] = useState([]);
    const [askDialogBox, setAskDialogBox] = useState(false);
    const [activeHatimSubKey, setActiveHatimSubKey] = useState(false);
    const [activeHatimSubKeyFull, setActiveHatimSubKeyFull] = useState(false);

    const [initialRunDone, setInitialRunDone] = useState(false);
    const [makeNewHatimState, setMakeNewHatimState] = useState(false);
    const [makeNewHatim, setMakeNewHatim] = useState(false);
    const [currentKhatmSubKey, setCurrentKhatmSubKey] = useState(undefined);
    const [khatmSubKeys, setKhatmSubKeys] = useState([])
    const [khatmsFetched, setKhatmsFetched] = useState([])
    const [isRefreshKhatmClickable, setIsRefreshKhatmClickable] = useState(true);
    const [loadError, setLoadError] = useState(false);

    /** redux */
    const dispatch = useDispatch();
    const {barVisible, text, icon} = useNotification();
    const editCuzlerModal = useEditCuzlerModal();
    /** redux end */



    {/** AskDialog */}
    const [yazilar, setYazilar] = useState({baslik:LanguageData["/"].Button.Final.Before.Header, link:LanguageData["/"].Button.Final.Before.LinkReady,
     cevap: LanguageData["/"].Button.Final.Before.Button});
    const [hideNewHatimBox, setHideNewHatimBox] = useState(false);
    const [hatimKonu, setHatimKonu] = useState("");
    const [hatimBitisTarihi, setHatimBitisTarihi] = useState("");
    const [totalPartsTaken, setTotalPartsTaken] = useState(0);

    const changeAskDialogBox = () => {
        setAskDialogBox(!askDialogBox)
    }
    /**AskDialog End */


    const changeShareBoxVisibility = () => {
        setHideShareBox(!hideShareBox)
    }


    /** AlertDialog */
    const [alertVisible, setAlertVisible] = useState(false)
    const toggleAlertVisibility = () => {
        setAlertVisible(!alertVisible)
    }
    /** AlertDialog End */

    /** AlertDialogCommon */
    const {errorKey} = useLogger();
    const yesClick = () => {
        dispatch(alertDialogActions.toggleVisibility())
        window.location.href = `mailto:hep.beraber.okuyalim@gmail.com?subject=Hata var, hata kodu:${errorKey}`;
    }

    const noClick = async () => {
        let errorRef = errorKey
        await database.logger.deleteLog(errorRef);
        dispatch(alertDialogActions.toggleVisibility())
        setAlertVisible(false);
    }
    /** AlertDialogCommon End */


    /** YesNoDialog */
    const yesHandler = async () => {
        dispatch (loadingOverlayActions.toggleVisibility ());
        let _hatimKey = await database.yeniHatim(hatimKonu, hatimBitisTarihi, true);
        await addNewKhatm()
        dispatch(yesNoDialogAlertActions.toggleVisibility())
        dispatch (loadingOverlayActions.toggleVisibility ());
        let newArr = [...hatimlerVisibilities, false];
        setHatimlerVisibilities (newArr);
    }

    /** Delete a sub Khatm yesHandler */
    const yesHandlerForASubKhatm = async ({_subKey, _index}) => {
        dispatch(loadingOverlayActions.toggleVisibility());

        await database.deleteSubKhatm({subKey: _subKey});

        let newSubKhatms = allLanguage.filter(_language => _language.subKey != _subKey);
        setAllLanguage(newSubKhatms);

        dispatch(loadingOverlayActions.toggleVisibility());
        dispatch(yesNoDialogAlertActions.toggleVisibility());
        let newArr = [...hatimlerVisibilities]
        newArr.splice(_index, 1);
        setHatimlerVisibilities(newArr);
    }

    const noHandler = () =>  dispatch(yesNoDialogAlertActions.toggleVisibility())
    ;

    const [yesHandlerState, setYesHandlerState] = useState(()=> yesHandler)
    const [yesHandlerStateParameters, setYesHandlerStateParameters] = useState(null);
    const [noHandlerState, setNoHandlerState] = useState(()=>noHandler)

    const toggleYesHandlerState = (payload) => {
        setYesHandlerState(()=>payload)
    }

    const toggleNoHandlerState = (payload) => {
        setNoHandlerState(()=>payload)
    }
    /** YesNoDialog End */


    /** CuzlerHatimCard */

    const [cuzlerHatimCardTitle, setCuzlerHatimCardTitle] = useState("")
    const [cuzlerHatimCardDescription, setCuzlerHatimCardDescription] = useState("")
    const [cuzlerHatimCardDate, setCuzlerHatimCardDate] = useState("")


    /** CuzlerHatimCard End */



    /** current index for Hatimler visibilities */
    const getCurrentIndex = (allLanguage) => {
        let currentIndex = 0;
        for (let i = 0; i < allLanguage.length; i++) {

            let totalCevap = allLanguage[i][1].cevaplar.filter((cevap)=>cevap.alindi).length +
            allLanguage[i][2].cevaplar.filter((cevap)=>cevap.alindi).length +
            allLanguage[i][3].cevaplar.filter((cevap)=>cevap.alindi).length;

            if(totalCevap != 30){
                currentIndex = i;
                break;
            }
        }

        return currentIndex;
    }
    /** current index end */


    const LOAD_TIMEOUT = 10000;
    const LOAD_ATTEMPTS = 3;

    const initialRun = async () => {
        try {

            let hatimKeyLength = extractKey().length;

            if(hatimKeyLength < 20){
                setWaitText(LanguageData["/cuz"].Before.WrongLength)
                return;
            }

            // Eskiden veri gelene kadar sonsuz döngüde bekliyordu; artık sınırlı deneme + zaman aşımı var
            let result;
            for (let attempt = 0; attempt < LOAD_ATTEMPTS; attempt++) {
                if(!navigator.onLine) break;
                try {
                    result = await withTimeout(database.tasarrufluHatimGetir(), LOAD_TIMEOUT);
                } catch (error) {
                    // Zaman aşımı: Firebase isteği zaten beklemede, tekrar denemek sadece süreyi uzatır
                    result = undefined;
                    break;
                }

                if(result != undefined && result.versionError == true){
                    window.location.href = window.location.href.replace('cuz','cuzv2');
                    return;
                }

                if(result != undefined && result.data != undefined) break;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            if(result == undefined || result.data == undefined){
                setLoadError(true);
                setWaitText(LanguageData.CuzGrid.LoadError);
                return;
            }

            result = result.data

            if(result.delete != undefined){
                setLoadingVisibility(true)
                setWaitText(LanguageData["/cuz"].Before.Deleted)
                return;
            }

            const {title, description, date} = await withTimeout(
                database.getTitleAndDescription({subKey: Object.values(result.khatmSubKeys)[0]}), LOAD_TIMEOUT);

            setCuzlerHatimCardTitle(title)
            rememberTitle(extractKey(), title)
            setCuzlerHatimCardDescription(description)
            setCuzlerHatimCardDate(date)

            // console.log(result.khatmSubKeys)
            setKhatmSubKeys(result.khatmSubKeys);
            setCurrentKhatmSubKey(result.activeSubKhatmKey)

            let makeNewHatimStateTemp = result.makeNewHatim;

            if(makeNewHatimStateTemp != undefined){
                setMakeNewHatimState(makeNewHatimStateTemp);
            }

            const makeNewHatimActiveResult = result.makeNewHatim;
            if(makeNewHatimActiveResult){
                setMakeNewHatim(makeNewHatimActiveResult);
            }

            let allHatimler = result.khatms;
            if(!Array.isArray(result)){
                // allHatimler = objectToArray(result);
                
                if(allHatimler[0].isRamazan){
                    window.location = `/ramazan/${extractKey()}`
                }

                if(allHatimler[0].isMonths3 != undefined ){

                    if(allHatimler[0].isMonths3.eachday1part ?? false){
                        window.location = `/ucaylarhergun1cuz/${extractKey()}`
                    }
                }

                setKhatmsFetched(allHatimler.filter(hatim => hatim.baslik != "ayarlanmadı").map(hatim => hatim.subKey))
                console.log(allHatimler.filter(hatim => hatim.baslik != "ayarlanmadı").map(hatim=>hatim.subKey))
            }

            
            // setTotalPartsTaken(database.countNumberOfCuzs(allHatimler))
            setAllLanguage(allHatimler);
            setHideRespond(true);
            setLoadingVisibility(false);
            setHatimlerVisibilities((()=>{
                let newArr = [];
                for (let i = 0; i < Object.keys(result.khatmSubKeys).length; i++) {
                    newArr[i] = false;
                }
                let currentIndex = Object.values(result.khatmSubKeys).indexOf(result.activeSubKhatmKey);
                newArr[currentIndex] = true;
                return newArr;
            })());

            let cuzStorage = JSON.parse(localStorage.getItem("cuz"));

            if(cuzStorage == null){
                initializeLocalStorage("cuz");
            };

        } catch (error) {
            console.log(`Cuzler\\index.js: ${error}`);
            setLoadError(true);
            setWaitText(LanguageData.CuzGrid.LoadError)
            return;
        }
    }

    const retryInitialRun = async () => {
        setLoadError(false);
        setWaitText(LanguageData["/cuz"].Before.Wait);
        await initialRun();
    }

    // İnternet geri geldiğinde kendiliğinden tekrar dene
    useEffect(() => {
        if(!loadError) return;
        window.addEventListener('online', retryInitialRun);
        return () => window.removeEventListener('online', retryInitialRun);
    }, [loadError]);

    const addNewKhatm = async () => {
        try {
            let result = await withTimeout(database.tasarrufluHatimGetir(), LOAD_TIMEOUT);
            for (let attempt = 1; attempt < LOAD_ATTEMPTS && result.error != undefined; attempt++) {
                result = await withTimeout(database.tasarrufluHatimGetir(), LOAD_TIMEOUT);
            }

            result = result.data
            
            setAllLanguage(result.khatms);

        }catch(error){
            console.log(`Cuzler\\index.js:addNewKhatm: ${error}`);
            setWaitText(LanguageData["/cuz"].Before.Error)
            return;
        }
    }

    const updateKhatms = async () => {
        let altHatimResult = await database.altHatimGetir({altHatimKey: activeHatimSubKey})
            if(altHatimResult.error == undefined){
                setAllLanguage(prevState => {
                    let _newState = [...prevState];
                    let index = allLanguage.findIndex(item => item.subKey == activeHatimSubKey);
                    _newState[index] = altHatimResult.data;
                    console.log(_newState)
                    return _newState;
                })
            }else{
                showNotification({color: 'red', message: LanguageData.CuzGrid.LoadError})
            }
    }

    const refreshKhatms = async () => {
        khatmsFetched.map(async (khatmSubKey) => {
            let altHatimResult = await database.altHatimGetir({altHatimKey: khatmSubKey})
            if(altHatimResult.error == undefined){
                setAllLanguage(prevState => {
                    let _newState = [...prevState];
                    let index = allLanguage.findIndex(item => item.subKey == khatmSubKey);
                    _newState[index] = altHatimResult.data;
                    console.log(_newState)
                    return _newState;
                })
            }else{
                console.log('Güncel veriler çekilemedi!')
            }
        })
        
    }

    // Bu tarayıcıdan alınan cüzleri "Sizin" diye işaretlemek için
    const isMyPart = (subKey, cevap) => {
        try {
            const localStorageCuzObj = JSON.parse(localStorage.getItem("cuz")) || {};
            return (localStorageCuzObj[subKey] || []).includes(cevap);
        } catch (error) {
            return false;
        }
    }

    const cuzlerFunctionTrigger = useCuzlerFunctionTrigger();
    let databaseListener = null;

    // Alınan cüz sayısı: açılışta ve her cüz alma / bırakmadan sonra (eskiden her açıp kapamada tekrar çekiliyordu)
    useEffect(() => {
        database.getTotalReadParts().then(totalReadParts => {
            if (totalReadParts.error == undefined){
                setTotalPartsTaken(totalReadParts.data);
            }
        });
    }, [allLanguage]);

    useEffect(async () => {

        if(!initialRunDone){
            await initialRun();
            setInitialRunDone(true);
        }
        if(cuzlerFunctionTrigger.visible){
            await updateKhatms();
            dispatch(cuzlerFunctionTriggerActions.toggleVisibility())
        }
      }, [cuzlerFunctionTrigger.visible, hatimlerVisibilities, allLanguage, currentKhatmSubKey]);

    // Cüz alma ya da (bu cihazdan alınmışsa) bırakma
    const submitPart = async (name) => {
                    dispatch (loadingOverlayActions.toggleVisibility ());
                    setHideDialogBox(false);
                    if(partIptal)
                    {
                        let cancelResult = await database.cuzIptalTasarruflu(hatimNo, activeHatimSubKey, activeHatimSubKeyFull);
                        // İptal sunucuda başarısızsa cihazdaki kaydı silme
                        if(cancelResult != undefined && cancelResult.code == -1){
                            dispatch (loadingOverlayActions.toggleVisibility ());
                            showNotification({color: 'red', message: failMessage(cancelResult.status, LanguageData.Kit.ReleaseFailed)});
                            return;
                        }

                        if(localStorage.getItem("cuz") == null) initializeLocalStorage("cuz");
                        let localStorageCuzObj = JSON.parse(localStorage.getItem("cuz"));
                        localStorageCuzObj[activeHatimSubKey] = localStorageCuzObj[activeHatimSubKey] || [];
                        localStorageCuzObj =  removeAll(localStorageCuzObj, hatimNo, activeHatimSubKey);
                        localStorage.setItem("cuz", JSON.stringify( localStorageCuzObj ));
                        forgetPart({key: extractKey(), subKey: activeHatimSubKey, no: hatimNo});

                        
                        // setTotalPartsTaken(database.countNumberOfCuzs(tempAllLanguages))
                        setTakePart(LanguageData["/cuz"].Button.Take)
                        setPartIptal(false);
                        dispatch (loadingOverlayActions.toggleVisibility ());
                    }else{
                        let result = await database.cuzAl(name, hatimNo, activeHatimSubKey, true, makeNewHatimState, true);
                        if(result.code == -1 && (result.status == 409 || result.status == 401)){
                            dispatch (loadingOverlayActions.toggleVisibility ());
                            showNotification({color: 'red', message: takeFailMessage(result.status)});
                        }else if(result.code == -1){
                            dispatch (loadingOverlayActions.toggleVisibility ());

                            toggleAlertVisibility();
                            dispatch(loggerActions.changeErrorKey(result.errorKey))
                        }else{

                            if(localStorage.getItem("cuz") == null) initializeLocalStorage("cuz");
                            let localStorageCuzObj = JSON.parse(localStorage.getItem("cuz"));
                            if(localStorageCuzObj[activeHatimSubKey] == null)
                                localStorageCuzObj[activeHatimSubKey] = [];
                            localStorageCuzObj[activeHatimSubKey].push(hatimNo);
                            localStorage.setItem("cuz",JSON.stringify(localStorageCuzObj));
                            rememberPart({key: extractKey(), type: 'cuz', route: `/cuz/${extractKey()}`, title: cuzlerHatimCardTitle,
                                          subKey: activeHatimSubKey, no: hatimNo, label: `${hatimNo}. cüz`});
                            dispatch (loadingOverlayActions.toggleVisibility ());
                            setJustTaken({title: takenTitle(`${hatimNo}. cüz`), text: LanguageData.CuzGrid.ReadHint,
                                      read: juzRange(Number(hatimNo))})
                            // setTotalPartsTaken(database.countNumberOfCuzs(tempAllLanguages))
                        }
                    }




                    let altHatimResult = await database.altHatimGetir({altHatimKey: activeHatimSubKey})
                    if(altHatimResult.error == undefined){
                        setAllLanguage(prevState => {
                            let _newState = [...prevState];
                            let index = allLanguage.findIndex(item => item.subKey == activeHatimSubKey);
                            _newState[index] = altHatimResult.data;
                            console.log(_newState)
                            return _newState;
                        })
                        const {sira, subSira} = hatimSiraBelirle(hatimNo)
                        if (!partIptal && (altHatimResult.data[sira]['cevaplar'][subSira]['isim'] != name)){
                            toggleAlertVisibility();
                            // dispatch(loggerActions.changeErrorKey(result.errorKey))
                        }else if(partIptal && (altHatimResult.data[sira]['cevaplar'][subSira]['isim'] != '')){
                            showNotification({color: 'red', message: LanguageData.Kit.ReleaseFailed})
                        }
                    }else{
                        showNotification({color: 'red', message: LanguageData.CuzGrid.LoadError})
                    }
    }

    const chartsOfSub = subKey => (allLanguage.find(item => item.subKey == subKey) || {}).charts;

    // Tebrikten sonra kartlardaki emojiler güncellensin
    const refreshSub = async subKey => {
        const result = await database.altHatimGetir({altHatimKey: subKey});
        if(result.error == undefined){
            setAllLanguage(prevState => prevState.map(item => item.subKey == subKey ? result.data : item));
        }
    }

    // Cüzün sahibi ismini değiştirir; sunucu cihazdaki secret ile sahibini doğrular
    const renamePart = async (name) => {
        dispatch (loadingOverlayActions.toggleVisibility ());
        setHideDialogBox(false);
        const result = await database.cuzIsimDegistir(name, hatimNo, activeHatimSubKey);
        dispatch (loadingOverlayActions.toggleVisibility ());
        if(result == undefined || result.code == -1){
            showNotification({color: 'red', message: failMessage(result && result.status, LanguageData.Kit.ChartSaveFailed)});
            return;
        }
        if(partClaim && !partAdmin){
            if(localStorage.getItem("cuz") == null) initializeLocalStorage("cuz");
            let localStorageCuzObj = JSON.parse(localStorage.getItem("cuz"));
            localStorageCuzObj[activeHatimSubKey] = [...(localStorageCuzObj[activeHatimSubKey] || []), hatimNo];
            localStorage.setItem("cuz", JSON.stringify(localStorageCuzObj));
            rememberPart({key: extractKey(), type: 'cuz', route: `/cuz/${extractKey()}`, title: cuzlerHatimCardTitle,
                          subKey: activeHatimSubKey, no: hatimNo, label: `${hatimNo}. cüz`});
        }
        setPartIptal(false);
        setPartClaim(false);
        let altHatimResult = await database.altHatimGetir({altHatimKey: activeHatimSubKey})
        if(altHatimResult.error == undefined){
            setAllLanguage(prevState => prevState.map(item => item.subKey == activeHatimSubKey ? altHatimResult.data : item));
        }
    }

    return (
        <>
        <QuestionContainer id="questionContainer" minHeight={(window.innerHeight-80).toString() + "px"} hatimlerVisibility={hatimlerVisibilities[0]} >

        {/** Hatim editleme*/}
            <Modal
            styles={{
                root: {height: '100%'},
                inner: {height: '100%'},
                body: {height: '100%'},

            }}
            opened={editCuzlerModal.visible}
            onClose={() => dispatch(editModalCuzlerActions.toggleVisibility())}
            title={LanguageData["/cuz"].CuzlerHatimCard.Modal.Title}
            >
                <EditModalContent subKey={allLanguage[0].subKey}></EditModalContent>
            </Modal>



        {/**Yeni Hatim ekleme */}
        <YesNoDialog yesHandler={yesHandlerState} noHandler={noHandlerState} yesHandlerParameters={yesHandlerStateParameters} hatimlerVisibilities={hatimlerVisibilities} toggleHatimlerVisibilities={(newState)=>{
            setHatimlerVisibilities(newState)
        }} />

        {/** Cüz alınamazsa*/}
        <AlertDialog text={LanguageData["/cuz"].AlertDialog.Title} textButton={LanguageData["/cuz"].AlertDialog.Button}
         alertVisible={alertVisible} toggleAlertVisibility={toggleAlertVisibility}>
        </AlertDialog>

        {/** Cüz okundu mu diye sor*/}
        <IsReadDialog />
        

        {/** Yüklenirken sayfanın iskeleti görünür, üstünde yarı saydam bir bilgi kutusu durur */}
        {loadingVisibility && <>
            <SkeletonPage aria-hidden="true">
                <SkeletonCard />
                <SkeletonGrid>
                    {Array.from({length: 30}, (_, i) => <SkeletonTile key={i} />)}
                </SkeletonGrid>
            </SkeletonPage>
            <LoadingContainer visibility={true} spinner={waitText === LanguageData["/cuz"].Before.Wait}>
                <LoadingItem>{waitText}</LoadingItem>
                {loadError && <RetryButton onClick={retryInitialRun}>
                    <RefreshCircle height="20px" width="20px" />
                    {LanguageData.CuzGrid.Retry}
                </RetryButton>}
            </LoadingContainer>
        </>}


        {!loadingVisibility && <ReadQuranBanner />}
        <TakenSheet taken={justTaken} onClose={() => setJustTaken(null)} />

        {!loadingVisibility && <ShareActions title={cuzlerHatimCardTitle} />}


        {/** Cüz alma / bırakma */}
        <PartSheet visible={hideDialogBox} onClose={() => setHideDialogBox(false)}
                   mode={partIptal ? (partAdmin ? 'admin' : partClaim ? 'other' : 'mine') : 'take'} badge={hatimNo} label={`${hatimNo}. cüz`} holder={username}
                   read={Number(hatimNo) >= 1 && Number(hatimNo) <= 30 ? juzRange(Number(hatimNo)) : undefined}
                   onTake={submitPart} onRename={partIptal ? renamePart : undefined} onRelease={() => submitPart(username)}
                   extra={partIptal && <ReactionPicker hatimKey={extractKey().replace("/", "")} subKey={activeHatimSubKey} no={hatimNo}
                                                       charts={chartsOfSub(activeHatimSubKey)} />} />

        <ReactSheet target={reactTarget} hatimKey={extractKey().replace("/", "")}
                    charts={reactTarget ? chartsOfSub(reactTarget.subKey) : undefined}
                    onClose={() => { refreshSub(reactTarget.subKey); setReactTarget(null); }} />



        {/* Hatimler ikonu ve yazısı */}
        { !loadingVisibility && allLanguage.map( (Language, index) => {

                // console.log(`message from: `);
                // console.log(Language);


        return <>

{ (index==0) && <CardWrapper>
            {
            <CuzlerHatimCard header={cuzlerHatimCardTitle} description={cuzlerHatimCardDescription}
                            progress={totalPartsTaken/(allLanguage.length*30)*100} leftCuzs={allLanguage.length*30-totalPartsTaken}
                            duaLeftDays={cuzlerHatimCardDate.split("-").reverse().join("/")}
                            yesHandler={yesHandlerState} toggleYesHandler={toggleYesHandlerState}
                            noHandler={noHandlerState} toggleNoHandler={toggleNoHandlerState}
                            setYesHandlerStateParameters={setYesHandlerStateParameters}
                            myParts={allLanguage.flatMap((khatm, khatmIndex) =>
                                [...khatm[1].cevaplar, ...khatm[2].cevaplar, ...khatm[3].cevaplar]
                                    .filter(({cevap, alindi}) => alindi && isMyPart(khatm.subKey, cevap))
                                    .map(({cevap}) => allLanguage.length > 1 ? `${khatmIndex + 1}. hatim · ${cevap}. cüz` : `${cevap}. cüz`))}

            ></CuzlerHatimCard>

            }
        </CardWrapper>}
        {(index==0) && <GridToolbar>
            <Legend>
                <LegendItem kind="free">{LanguageData.CuzGrid.Available}</LegendItem>
                <LegendItem kind="taken">{LanguageData.CuzGrid.Taken}</LegendItem>
                <LegendItem kind="read">{LanguageData.CuzGrid.Read}</LegendItem>
            </Legend>
            <RefreshKhatmsContainer onClick={async ()=>{
                    if(isRefreshKhatmClickable == false){
                        showNotification({message: LanguageData.CuzGrid.RefreshWait})
                        return;
                    }

                    dispatch(loadingOverlayActions.toggleVisibility());

                    let totalReadParts = await database.getTotalReadParts();
                    if (totalReadParts.error == undefined){
                        setTotalPartsTaken(totalReadParts.data);
                    }
                    await refreshKhatms();
                    
                    dispatch(loadingOverlayActions.toggleVisibility());
                    setIsRefreshKhatmClickable(false);
                    setTimeout(()=>{
                        setIsRefreshKhatmClickable(true)
                    }, 20000);
                    }}>
                <RefreshCircle height="20px" width="20px" />
                <RefreshKhatmsItem>{LanguageData.CuzGrid.Refresh}</RefreshKhatmsItem>
            </RefreshKhatmsContainer>
        </GridToolbar>}
        {(index==0) && <GridHint>{LanguageData.CuzGrid.Hint}</GridHint>}


        {  (hatimlerVisibilities.length > 1) && <QuestionItem fontSize={"1.6rem"}>
                
                <HatimIconTemplate>
                    { isAdmin() ? <DeleteHatimIconContainer>
                        <DeleteHatimIcon onClick={async ()=>{
                            toggleYesHandlerState(yesHandlerForASubKhatm)
                            setYesHandlerStateParameters({_subKey: Language.subKey, _index:index})
                            dispatch(yesNoDialogAlertActions.changeText("Bu Hatmi silmek istediğinize emin misiniz?"))
                            dispatch(yesNoDialogAlertActions.toggleVisibility())
                            }}>Sil</DeleteHatimIcon>
                    </DeleteHatimIconContainer> : <div></div>}
                

                    {index+1}. hatim
                {
                    hatimlerVisibilities.length > 1 ?
                        (hatimlerVisibilities[index]
                            ?
                        <>
                            <HatimIconContainer>
                                <HideHatimIcon onClick={()=>{
                                        setHatimlerVisibilities(prevState=>{
                                        let _newState = [...prevState];
                                        _newState[index] = !hatimlerVisibilities[index];
                                        return _newState;
                                        });
                                    }}>Gizle</HideHatimIcon>
                            </HatimIconContainer>
                        </>
                            :
                        <>
                            <HatimIconContainer>
                                <ShowHatimIcon onClick={async ()=>{
                                     setHatimlerVisibilities(prevState=>{
                                        let _newState = [...prevState];
                                        _newState[index] = !hatimlerVisibilities[index];
                                        return _newState;
                                    })
                                    if(khatmsFetched.indexOf(Language.subKey) == -1){
                                        dispatch(loadingOverlayActions.toggleVisibility());
                                        let altHatimResult = await database.altHatimGetir({altHatimKey: Language.subKey})
                                        if(altHatimResult.error == undefined){
                                            setAllLanguage(prevState => {
                                                let _newState = [...prevState];
                                                _newState[index] = altHatimResult.data;
                                                console.log(_newState)
                                                return _newState;
                                            })
                                            setKhatmsFetched(prevState => {
                                                let _newState = [...prevState];
                                                _newState.push(Language.subKey);
                                                return _newState;
                                            })
                                            console.log(altHatimResult.data)
                                        }
                                        dispatch(loadingOverlayActions.toggleVisibility());
                                        //alt hatim getir
                                    }
                                   
                                }}>Göster</ShowHatimIcon>
                            </HatimIconContainer>
                        </>)
                    :
                        <></>
                }

                </HatimIconTemplate>
            </QuestionItem>}

            {/* Hatmin kendisi */}

        <HatimContainer className="hatimContainer"  visibility={hatimlerVisibilities[index]} >

        <RespondContainer visibility={hideRespond}>
            <RespondOuterContainer>
            <RespondInnerContainer>
                {
                    [...Language[1].cevaplar, ...Language[2].cevaplar, ...Language[3].cevaplar].map(({cevap, alindi, isim, isRead}) => {
                        const mine = isMyPart(Language.subKey, cevap);
                        return (
                        <ResponseItemContainer key={cevap} taken={alindi} read={isRead} mine={mine}>
                            <ResponseItem bgColor={alindi} data-sub={Language.subKey} data-part={cevap} onClick={()=>{

                                if (alindi) {
                                    setActiveHatimSubKey(Language.subKey);
                                    setActiveHatimSubKeyFull(isKhatmFull(Language));
                                    if(localStorage.getItem("cuz") == null) initializeLocalStorage("cuz");
                                    let localStorageCuzObj = JSON.parse(localStorage.getItem("cuz"));
                                    const claim = !(localStorageCuzObj[Language.subKey] || []).includes(cevap);
                                    const admin = claim && isLocalAdmin(extractKey().replace("/", ""));
                                    // Cihazda kaydı yoksa: hatmi oluşturan herkesinkini, secret'ı olan kendisininkini değiştirebilir
                                    if(claim && !admin && !hasSecret({hatimKey: extractKey().replace("/", ""), subKey: Language.subKey, legacy: true})){
                                        // Başkasının cüzü: kimin aldığı ve tebrik
                                        setReactTarget({subKey: Language.subKey, no: cevap, badge: cevap, label: `${cevap}. cüz`, holder: isim});
                                        return;
                                    }
                                    setPartAdmin(admin);

                                    setTakePart(LanguageData["/cuz"].Button.TakeCancel)
                                    setPartIptal(true);
                                    setPartClaim(claim);
                                    setHatimNo(cevap);
                                    setUsername(isim);
                                    setHideDialogBox(true);
                                    return;
                                }

                                setTakePart(LanguageData["/cuz"].Button.Take);
                                setPartIptal(false);
                                setPartClaim(false);
                                setPartAdmin(false);
                                setHatimNo(cevap);
                                setActiveHatimSubKey(Language.subKey);
                                setHideDialogBox(true);
                                setUsername('');
                            }}>
                                {mine && <MineBadge>{LanguageData.CuzGrid.Mine}</MineBadge>}
                                <ResponseText>
                                    {cevap}
                                </ResponseText>
                                <ResponseName taken={alindi}>
                                    {alindi ? isim : LanguageData.CuzGrid.Available}
                                </ResponseName>
                                {alindi && <ReactionChips charts={Language.charts} no={cevap} />}
                            </ResponseItem>

                            {alindi && <IsReadItem bgColor={isRead} onClick={()=>{
                                    if(isRead){
                                        return;
                                    }
                                    setActiveHatimSubKey(Language.subKey);
                                    dispatch(isReadDialogAlertActions.changeIsRead(isRead))
                                    dispatch(isReadDialogAlertActions.changePartNo(cevap))
                                    dispatch(isReadDialogAlertActions.changeSubKey(Language.subKey))

                                    dispatch(isReadDialogAlertActions.toggleVisibility())
                            }}>
                                {isRead && <Check size={14} strokeWidth={3} />}
                                <IsReadText>{isRead ? LanguageData.IsReadDialog.Read : LanguageData.IsReadDialog.NotRead}</IsReadText>
                            </IsReadItem>}
                        </ResponseItemContainer>
                    )})
                }
            </RespondInnerContainer>

            </RespondOuterContainer>

        </RespondContainer>

        </HatimContainer>

        </>
        })}


        {/**Yeni Hatim ekleme butonu */}
        { (! makeNewHatim) && (JSON.parse(localStorage.getItem("CuzKeyler")) ? JSON.parse(localStorage.getItem("CuzKeyler")) : [] ).includes(extractKey()) && !loadingVisibility && <YeniHatimWrapper>
            <YeniHatimContainer>
                <YeniHatimButton id="NewSubKhatm" onClick={()=>{
                    toggleYesHandlerState(yesHandler);
                    setYesHandlerStateParameters(null);
                    dispatch(yesNoDialogAlertActions.changeText(LanguageData["/cuz"].AddKhatmAlert.Question))
                    dispatch(yesNoDialogAlertActions.toggleVisibility())
                }}>
                    <YeniHatimIcon />
                    <YeniHatimText>{LanguageData["/cuz"].NewSubKhatm}</YeniHatimText>
                </YeniHatimButton>
            </YeniHatimContainer>
        </YeniHatimWrapper>}

        {makeNewHatim && (JSON.parse(localStorage.getItem("CuzKeyler")) ? JSON.parse(localStorage.getItem("CuzKeyler")) : [] ).includes(extractKey()) &&
        <Center>
            <Button align="center" color="red" size="md" onClick={async ()=>{
                let response = await database.stopMakingNewKhatm();
                if(response == 200){
                    setMakeNewHatim(false);
                }else{
                    showNotification({color: 'red', message: LanguageData.Kit.ChartSaveFailed})
                }
            }}>{LanguageData.AutomaticKhatm}</Button>
        </Center>}

        
        {/** Cüz alınamadığı durumda user agent bildirgesi inşaAllah */}
        <AlertDialogCommon text={LanguageData.AlertDialog.Text} yesClick={yesClick} noClick={noClick} />
        

        </QuestionContainer>
        </>
    )
};

export default Question
