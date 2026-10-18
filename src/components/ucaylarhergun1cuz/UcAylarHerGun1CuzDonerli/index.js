//                                     BİSMİLLAHİRRAHMANİRRAHİM
//                                          ALLAHU  EKBER
//                                          ELHAMDÜLİLLAH


import React, {useState, useEffect} from 'react'
import {FaBars} from 'react-icons/fa'
import {QuestionContainer, QuestionInnerContainer, QuestionItem, RespondContainer, RespondInnerContainer, ResponseItem
, ResponseLogo, ResponseText, BackButtonIcon, BackContainer, RespondOuterContainer,
DialogBox, DialogText, DialogLink, DialogIcon, DialogContainer, DialogInputBox, NavBtnLink,
LoadingContainer, LoadingItem,
CopyContainer, CopyItem, CopyIcon,
ShareContainer, ShareItem, ShareIcon,
YeniHatimWrapper, YeniHatimContainer, YeniHatimButton, YeniHatimIcon, YeniHatimText,
HideHatimIcon, ShowHatimIcon, HatimContainer, HatimIconContainer, HatimIconText, ResponseTable,
CuzlerDescription
} from './styles';
import AskDialog from "../AskDialog";
import LanguageData from '../../../strings';
import {dataFormat} from '../../../backend/datas/dataFormat';
import { removeAll, objectToArray, removeAll_v1 } from "../../../common";
import { FaGithub } from "react-icons/fa";
import backButton from '../../../icons/button.svg';
import copy from '../../../icons/copy.svg';
import share from '../../../icons/share.svg';
import close from '../../../icons/close.svg';
import {DatabaseContext, db} from '../../../backend';
import ShareBox from '../ShareBox';
import { extractKey, initializeLocalStorage } from "../../../common";
import { Language } from '@styled-icons/ionicons-outline';
import { cuzlerFunctionTriggerActions, useCuzlerFunctionTrigger } from 'features/cuzlerFunctionTrigger';
import {Modal, Center, Button} from '@mantine/core'
import { useNotification } from 'features/notification';
import { editModalCuzlerActions, useEditCuzlerModal } from 'features/editCuzlerModal';
import { cuzModalActions, useCuzModal } from 'features/cuzModal';
import { useDispatch } from 'react-redux';
import YesNoDialog from '../YesNoDialog';
import EditModalContent from "../EditModalContent";
import AlertDialogCommon from '../../common/AlertDialogCommon'
import { loggerActions, useLogger } from 'features/logger';
import CuzModal from '../CuzModal'
import CuzlerHatimCard from '../CuzlerHatimCard'
import LocDb from '@yusuf-yeniceri/easy-storage';
import { yesNoDialogAlertActions } from 'features/yesNoDialogAlert';
import { partsProcessor } from 'localStorage/parts';
import { hatimsProcessor } from 'localStorage/hatims';

// let counter = 0;+0
// let total = Language[18].cevaplar.length;


const Question = ({toggleCizelge, cizelgeId, toggleCizelgeId, changeKeyHolder}) => {
    return <DatabaseContext.Consumer>
        {
            frbs => {
                return <Constr changeKeyHolder={changeKeyHolder}  database={frbs} toggleCizelge={toggleCizelge} cizelgeId={cizelgeId} toggleCizelgeId={toggleCizelgeId}/>
            }
        }
    </DatabaseContext.Consumer>
}

const Constr = ({ toggle, database, toggleCizelge, cizelgeId, toggleCizelgeId, changeKeyHolder }) => {

    const [datas, setDatas] = useState(18);
    const [routes, setRoutes] = useState([]);
    const [hatimKey, setHatimKey] = useState("");
    const [hideDialogBox, setHideDialogBox] = useState(false);
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
    const [hideShareBox, setHideShareBox] = useState(false);
    const [hatimlerVisibilities, setHatimlerVisibilities] = useState([]);
    const [askDialogBox, setAskDialogBox] = useState(false);
    const [activeHatimSubKey, setActiveHatimSubKey] = useState(false);
    const [currentApi, setCurrentApi] = useState(2);
    const [makeNewHatimState, setMakeNewHatimState] = useState(false);
    const [initialRunDone, setInitialRunDone] = useState(false);
    const [totalPartsTaken, setTotalPartsTaken] = useState(0);
    const [makeNewHatim, setMakeNewHatim] = useState(false)


    /** redux */
    const dispatch = useDispatch();
    const {barVisible, text, icon} = useNotification();
    const editCuzlerModal = useEditCuzlerModal();
    const cuzModal = useCuzModal();
    /** redux end */

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

    const changeShareBoxVisibility = () => {
        setHideShareBox(!hideShareBox)
    }

    {/** AskDialog */}
    const [yazilar, setYazilar] = useState({baslik:LanguageData["/"].Button.Final.Before.Header, link:LanguageData["/"].Button.Final.Before.LinkReady,
     cevap: LanguageData["/"].Button.Final.Before.Button});
    const [hideNewHatimBox, setHideNewHatimBox] = useState(false);
    const [hatimKonu, setHatimKonu] = useState("");
    const [hatimBitisTarihi, setHatimBitisTarihi] = useState("");

    const changeAskDialogBox = () => {
        setAskDialogBox(!askDialogBox)
    }

    {/**AskDialog End */}

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
        let _hatimKey = await database.yeniHatim(hatimKonu, hatimBitisTarihi, true);
        dispatch(yesNoDialogAlertActions.toggleVisibility())
    }

    const noHandler = () =>  dispatch(yesNoDialogAlertActions.toggleVisibility())
    ;

    const [yesHandlerState, setYesHandlerState] = useState(()=> yesHandler)
    const [noHandlerState, setNoHandlerState] = useState(()=>noHandler)

    const toggleYesHandlerState = (payload) => {
        setYesHandlerState(()=>payload)
    }

    const toggleNoHandlerState = (payload) => {
        setNoHandlerState(()=>payload)
    }

    const takePartFunction = ({cevap, alindi, isim, Language}) => {
        if (alindi) {
            setActiveHatimSubKey(Language.subKey);
            
            if(!Array.isArray(LocDb.ref("Hatim/adminToken").get()))
                LocDb.ref("Hatim/adminToken").set([])
            let filtered = LocDb.ref("Hatim/adminToken").get().filter(x=>Object.keys(x)[0].toString() == extractKey().replace("/","").toString());
            if(filtered.length == 0){

                if(localStorage.getItem("cuz") == null) initializeLocalStorage("cuz");
                let localStorageCuzObj = JSON.parse(localStorage.getItem("cuz"));
                if(localStorageCuzObj[Language.subKey] == null)
                    localStorageCuzObj[Language.subKey] = [];
                if(!localStorageCuzObj[Language.subKey].includes(cevap)){
                    return;
                }


                setTakePart(LanguageData["/cuz"].Button.TakeCancel)
                setPartIptal(true);
                //unnecessary, please fix it
                setHatimNo(cevap);
                setUsername(isim);
                setHideDialogBox(true);
                return;
            }else{
                dispatch(cuzModalActions.changeSubKey(Language.subKey))
                dispatch(cuzModalActions.changeName(isim))
                dispatch(cuzModalActions.changeCuzNo(cevap))
                dispatch(cuzModalActions.toggleVisibility())
                return;
            }


        }

        setTakePart(LanguageData["/cuz"].Button.Take);
        setHatimNo(cevap);
        setActiveHatimSubKey(Language.subKey);
        setHideDialogBox(true);
        setUsername('');
    }

    /** YesNoDialog End */
    const initialRun = async () => {
        try {
            let result = await database.hatimGetir();
            while(result == "error"){
                result = await database.hatimGetir();
            }

            let makeNewHatimStateTemp = result.makeNewHatim;

            if(makeNewHatimStateTemp != undefined){
                setMakeNewHatimState(makeNewHatimStateTemp);
            }

            let makeNewHatimResult = result.makeNewHatim;
            if(makeNewHatimResult){
                setMakeNewHatim(makeNewHatimResult);
            }

            let allHatimler;
            if(!Array.isArray(result)){
                allHatimler = objectToArray(result);
                if(allHatimler[0].isRamazan){
                    window.location = `/ramazan/${extractKey()}`
                }
            }

            
            // setTotalPartsTaken(database.countNumberOfCuzs(allHatimler))
            setAllLanguage(allHatimler);
            setHideRespond(true);
            setLoadingVisibility(false);
            setHatimlerVisibilities((()=>{
                let newArr = [];
                for (let i = 0; i < objectToArray(result).length; i++) {
                    newArr[i] = false;
                }
                let currentIndex = getCurrentIndex(objectToArray(result));
                newArr[currentIndex] = true;
                return newArr;
            })());

            let cuzStorage = JSON.parse(localStorage.getItem("cuz"));

            if(cuzStorage == null){
                initializeLocalStorage("cuz");
            };

        } catch (error) {
            console.log(`Cuzler\\index.js: ${error}`);
            setWaitText(LanguageData["/cuz"].Before.Error)
            return;
        }
    }

    const afterRun = async () => {
        try {
            let databaseListener = database.hatimListener(snapshot => {

                let data = snapshot.val();

                if(data.delete != undefined){
                    setLoadingVisibility(true)
                    setWaitText(LanguageData["/cuz"].Before.Deleted)
                    return;
                }

                if(data.baslik != null){
                    data = [data];
                }

                let result = data;

                if(initialRunDone && (allLanguage.length < objectToArray(result).length)){
                    let newArr = [...hatimlerVisibilities];
                    let arrLength = newArr.length + 1;
                    for (let i = 0; i < arrLength; i++) {
                        newArr[i] = false;
                    }
                    newArr[newArr.length-1] = true;
                    setHatimlerVisibilities(newArr);
                }

                setAllLanguage(objectToArray(result));
                setHideRespond(true);
                setLoadingVisibility(false);
            });

        } catch (error) {
            setWaitText(LanguageData["/cuz"].Before.Error)
            return;
        }
    }

    let databaseListener = null;
    const cuzlerFunctionTrigger = useCuzlerFunctionTrigger();

    useEffect(async () => {

            setTotalPartsTaken(database.countNumberOfCuzs(allLanguage));
    
            if(!initialRunDone){
                await initialRun();
                await afterRun();
                setInitialRunDone(true);
            }
            // databaseListener = await afterRun();
            if(cuzlerFunctionTrigger.visible){
                // await afterRun();
                dispatch(cuzlerFunctionTriggerActions.toggleVisibility())
            }
      }, [hatimlerVisibilities, allLanguage]);
    

    return (
        <>
        <QuestionContainer id="questionContainer" minHeight={(window.innerHeight-80).toString() + "px"} hatimlerVisibility={hatimlerVisibilities[0]} >

        <LoadingContainer visibility={loadingVisibility}>
            <LoadingItem >{waitText}</LoadingItem>
        </LoadingContainer>

        <ShareContainer onClick={()=>{
                    changeShareBoxVisibility();
                }}>
            <ShareIcon src={share} iconSize={"30px"} ></ShareIcon>
            <ShareItem>{LanguageData['/cuz'].After.Share}</ShareItem>
        </ShareContainer>

        <CopyContainer onClick={()=>{
                   var text = window.location;
                   navigator.clipboard.writeText(text).then(function() {
                        setLinkCopiedText(LanguageData["/cuz"].After.Copy.After)
                   }, function(err) {});
                }}>
            <CopyIcon src={copy} iconSize={"30px"} ></CopyIcon>
            <CopyItem>{linkCopiedText}</CopyItem>
        </CopyContainer>

        <ShareBox hatimHeader={allLanguage[0].baslik} shareBoxVisibility={hideShareBox} changeShareBoxVisibility={changeShareBoxVisibility} />

        {/* take part simple ui */}
        <DialogBox visibility={hideDialogBox}>

                <DialogIcon id={"closeTakePart"} src={close} iconSize={"20px"} alignEnd={true} onClick={
                        ()=>{
                            setHideDialogBox(!hideDialogBox);
                        }
                    } />

                <DialogText fontSize={"20px"}>
                    {hatimNo}. {LanguageData["/cuz"].Button.Question}
                </DialogText>

                
                <DialogInputBox value={username} onChange = {(event)=>{
                    setUsername(event.target.value);
                }}>
                </DialogInputBox>

                <NavBtnLink id={"takeButton"} onClick={async ()=>{
                    setHideDialogBox(!hideDialogBox);
                    if(partIptal)
                    {
                        let cancelResult = await database.cuzIptal(hatimNo, activeHatimSubKey);
                        // İptal sunucuda başarısızsa cihazdaki kaydı silme
                        if(cancelResult.code == -1){
                            alert('Cüz iptal edilemedi! Lütfen internet bağlantınızı kontrol edip tekrar deneyin.');
                            setAllLanguage(objectToArray(await database.hatimGetir()));
                            return;
                        }
                        partsProcessor.cancelPart({key: extractKey(), subKey: activeHatimSubKey, partId: hatimNo})
                        
                        if(localStorage.getItem("cuz") == null) initializeLocalStorage("cuz");
                        let localStorageCuzObj = JSON.parse(localStorage.getItem("cuz"));
                        localStorageCuzObj[activeHatimSubKey] = localStorageCuzObj[activeHatimSubKey] || [];
                        localStorageCuzObj =  removeAll(localStorageCuzObj, hatimNo, activeHatimSubKey);
                        localStorage.setItem("cuz", JSON.stringify( localStorageCuzObj ));
                        
                        setAllLanguage(objectToArray(await database.hatimGetir()));
                        setTakePart(LanguageData["/cuz"].Button.Take)
                        setPartIptal(false);
                        return;
                    }
                    let result = await database.cuzAl(username, hatimNo, activeHatimSubKey, true, makeNewHatimState);
                    if(result.code == -1){
                        toggleAlertVisibility();
                        dispatch(loggerActions.changeErrorKey(result.errorKey))
                    }else{

                        partsProcessor.takePart({key: extractKey(), subKey: activeHatimSubKey, partId: hatimNo})
                        hatimsProcessor.setHatimTitle({key: extractKey(), title: allLanguage[0].baslik})

                        if(localStorage.getItem("cuz") == null) initializeLocalStorage("cuz");
                        let localStorageCuzObj = JSON.parse(localStorage.getItem("cuz"));
                        if(localStorageCuzObj[activeHatimSubKey] == null)
                            localStorageCuzObj[activeHatimSubKey] = [];
                        localStorageCuzObj[activeHatimSubKey].push(hatimNo);
                        localStorage.setItem("cuz",JSON.stringify(localStorageCuzObj));
                        
                        setAllLanguage(objectToArray(await database.hatimGetir()));
                    }
                }}>
                    {takePart}
                </NavBtnLink>

                

        </DialogBox>


    

        <AskDialog          buttonCallback={async ()=>{
                                let _hatimKey = await database.yeniHatim(hatimKonu, hatimBitisTarihi, true);

                                let temp = [];
                                for (let i = 0; i < hatimlerVisibilities.length; i++) {
                                    temp[i] = false;
                                }
                                setHatimlerVisibilities(temp);
                                await afterRun();
                            }}
                            buttonText={LanguageData["/"].Button.Header.Button} top={"3px"} 
                            firebase={database} setHatimKey={setHatimKey} setYazilar={setYazilar}
                                propHideDialogBox={{hideNewHatimBox, setHideNewHatimBox}}
                            askDialogBox={askDialogBox} setAskDialogBox={setAskDialogBox}
                            hatimKonu={hatimKonu} setHatimKonu={setHatimKonu} changeAskDialogBox={changeAskDialogBox}
                            hatimBitisTarihi={hatimBitisTarihi} setHatimBitisTarihi={setHatimBitisTarihi} />

        {/**Yeni Hatim ekleme */}
        <YesNoDialog yesHandler={yesHandlerState} noHandler={noHandlerState} hatimlerVisibilities={hatimlerVisibilities} toggleHatimlerVisibilities={(newState)=>{
            setHatimlerVisibilities(newState)
        }} />

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
        
        {/** Tek Cüz editleme*/}
        <Modal
            styles={{
                root: {height: '100%'},
                inner: {height: '100%'},
                body: {height: '100%'},

            }}
            opened={cuzModal.visible}
            onClose={() => dispatch(cuzModalActions.toggleVisibility())}
            title={LanguageData["/cuz"].CuzlerHatimCard.PartModal.Title}
            >
                <CuzModal />
        </Modal>

        {/* Hatimler ikonu ve yazısı */}
            { !loadingVisibility && allLanguage.map( (Language, index) => {

                // console.log(`message from: `);
                // console.log(Language);

        
        return <>
        
            { (index==0) && <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: '16px 16px 0'}}>
                {
                <CuzlerHatimCard header={Language.baslik} description={Language.description}
                                progress={totalPartsTaken/(allLanguage.length*30)*100} leftCuzs={allLanguage.length*30-totalPartsTaken}
                                duaLeftDays={Language.bitisTarihi.split("-").reverse().join("/")}
                                yesHandler={yesHandlerState} toggleYesHandler={toggleYesHandlerState}
                                noHandler={noHandlerState} toggleNoHandler={toggleNoHandlerState}

                ></CuzlerHatimCard>
                }
            </div>}

            { (hatimlerVisibilities.length > 1) && <QuestionItem fontSize={"1.6rem"}>
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
                                    }} />
                            </HatimIconContainer>
                        </>
                            :
                        <>
                            <HatimIconContainer>
                                <ShowHatimIcon onClick={()=>setHatimlerVisibilities(prevState=>{
                                    let _newState = [...prevState];
                                    _newState[index] = !hatimlerVisibilities[index];
                                    return _newState;
                                })} />
                            </HatimIconContainer>
                        </>)
                    :
                        <></>
                }
            </QuestionItem>}


            {/* Hatmin kendisi */}

        <HatimContainer className="hatimContainer" visibility={hatimlerVisibilities[index]}>

        
        <RespondContainer visibility={hideRespond}>
            <RespondOuterContainer>
            <RespondInnerContainer>
                {
                    Language[1].cevaplar.map(({cevap, alindi, isim}) => (
                        <div style={{display: 'flex', flexDirection: 'column' }}>
                        <ResponseItem bgColor={alindi} onClick={() => takePartFunction({cevap, alindi, isim, Language})}>
                            <ResponseLogo />
                            <ResponseText bgColor={alindi}>
                                {cevap}
                            </ResponseText>
                            <ResponseText color={"#FFBF17"} bgColor={alindi}>
                                {isim}
                            </ResponseText>
                        </ResponseItem>

                        <ResponseTable bgColor={alindi} onClick={()=>{
                            toggleCizelgeId(Number(cevap))
                            toggleCizelge();
                            changeKeyHolder({key: extractKey(), subKey: Language.subKey})
                        }}>
                            {LanguageData["/cuz"].CuzItem.ChartButton}

                        </ResponseTable>
                        </div>
                    ))
                }
                {
                    Language[2].cevaplar.map(({cevap, alindi, isim}) => (
                        <div>
                        <ResponseItem bgColor={alindi} onClick={() => takePartFunction({cevap, alindi, isim, Language})}>
                            <ResponseLogo />
                            <ResponseText bgColor={alindi}>
                                {cevap}
                            </ResponseText>
                            <ResponseText color={"#FFBF17"} bgColor={alindi}>
                                {isim}
                            </ResponseText>
                        </ResponseItem>

                        <ResponseTable bgColor={alindi} onClick={()=>{
                            toggleCizelgeId(Number(cevap))
                            toggleCizelge();
                            changeKeyHolder({key: extractKey(), subKey: Language.subKey})

                        }}>
                            {LanguageData["/cuz"].CuzItem.ChartButton}

                        </ResponseTable>

                        </div>
                    ))
                }
                {
                    Language[3].cevaplar.map(({cevap, alindi, isim}) => (
                        
                        <div>
                        <ResponseItem bgColor={alindi} onClick={() => takePartFunction({cevap, alindi, isim, Language})}>
                            <ResponseLogo />
                            <ResponseText bgColor={alindi}>
                                {cevap}
                            </ResponseText>
                            <ResponseText color={"#FFBF17"} bgColor={alindi}>
                                {isim}
                            </ResponseText>
                        </ResponseItem>

                        <ResponseTable bgColor={alindi} onClick={()=>{
                            toggleCizelgeId(Number(cevap))
                            toggleCizelge();
                            changeKeyHolder({key: extractKey(), subKey: Language.subKey})
                        }}>
                            {LanguageData["/cuz"].CuzItem.ChartButton}

                        </ResponseTable>

                        </div>
                    ))
                }
            </RespondInnerContainer>

            

            </RespondOuterContainer>

            
        </RespondContainer>

        </HatimContainer>
        
        </>
        })}

            {/**Yeni Hatim ekleme butonu */}
        { ( ! makeNewHatim) &&  (JSON.parse(localStorage.getItem("CuzKeyler")) ? JSON.parse(localStorage.getItem("CuzKeyler")) : [] ).includes(extractKey()) && !loadingVisibility && <YeniHatimWrapper>
            <YeniHatimContainer>
                <YeniHatimButton id="NewSubKhatm" onClick={()=>{
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
            <Button mb={"10px"} align="center" color="red" size="md" onClick={async ()=>{
                let response = await database.stopMakingNewKhatm();
                if(response == 200){
                    setMakeNewHatim(false);
                }else{
                    alert('Lütfen tekrar deneyin!')
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
