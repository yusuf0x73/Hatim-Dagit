//                                     BİSMİLLAHİRRAHMANİRRAHİM
//                                          ALLAHU  EKBER
//                                          ELHAMDÜLİLLAH


import { AppPromoBanner } from 'components/common/AppDownload';
import React, {useState, useEffect} from 'react'
import {QuestionContainer, Hero, Bismillah, HeroTitle, HeroText, Content, PrimaryAction, ActionIcon, ActionBody, ActionTitle,
    ActionDesc, ActionArrow, SectionLabel, OptionList, OptionRow, TitleLine, NewFeatureTag, Steps, Step, StepNum, StepTitle,
    StepText, Quote} from './QuestionElements';
import Language from '../../../strings/index';
import {DatabaseContext} from '../../../backend';
import AskDialog from '../AskDialog';
import YearlyKhatmDialog from  './YearlyKhatmDialog';
import Months3Dialog from '../Months3Dialog';
import LinkReadySheet from '../LinkReadySheet';
import {TodayReadings} from 'components/myKhatms';
import {listKhatms} from 'localStorage/myKhatms';
import {Book, CalendarEvent, MoonStars, Moon, Heart, ChevronRight, Bookmarks, Adjustments} from 'tabler-icons-react';
import OzelDialog from '../OzelDialog';

const Constr = ({toggle}) => {
    return <DatabaseContext.Consumer>
                    {
                        firebase => {

                        return <Question toggle={toggle} firebase={firebase}></Question>

                    }
                }
            </DatabaseContext.Consumer>
}

const Question = ({ firebase, toggle }) => {

    const [datas, setDatas] = useState(-1);
    const [routes, setRoutes] = useState([]);
    const [hatimKey, setHatimKey] = useState("");
    const [hideDialogBox, setHideDialogBox] = useState(false);
    // 'surah' | 'program' | null
    const [ozelMode, setOzelMode] = useState(null);
    const [askDialogBox, setAskDialogBox] = useState(false);
    const [yazilar, setYazilar] = useState({baslik:Language["/"].Button.Final.Before.Header, link:Language["/"].Button.Final.Before.LinkReady,
     cevap: Language["/"].Button.Final.Before.Button});
    const [hatimKonu, setHatimKonu] = useState("");
    const [hatimBitisTarihi, setHatimBitisTarihi] = useState("");
    const [hideMevcutHatimler, setHideMevcutHatimler] = useState(false);
    const [mevcutHatimler, setMevcutHatimler] = useState([]);
    const [mevcutHatimlerBaslik, setMevcutHatimlerBaslik] = useState([]);
    const [mevcutHatimlerVisible, setMevcutHatimlerVisible] = useState(false);
    const [ramazan, setRamazan] = useState(false)
    const [hatimDescription, setHatimDescription] = useState("")
    const [hatimCount, setHatimCount] = useState(1)
    const [months3DialogVisible, setMonths3DialogVisible] = useState(false)
    const [yearBasedKhatmDialogVisible, setYearBasedKhatmDialogVisible] = useState(false)
    
    const changeAskDialogBox = () => {
        setAskDialogBox(!askDialogBox)
    }

    // const [scrollNav, setScrollNav] = useState(false);
    // const [width, setWidth] = useState(window.innerWidth);

    // const changeNav = () => {
    //     if(window.scrollY >= 80){
    //         setScrollNav(true);
    //     }else{
    //         setScrollNav(false);
    //     }
    // }

    // const handleWindowSizeChange = () => {
    //     setWidth(window.innerWidth);
    // }

    useEffect(async () => {
        // window.addEventListener('scroll', changeNav)
        // window.addEventListener('resize', handleWindowSizeChange);
        // console.log(isMobile)

        let localStorageCuzKeylerArr = JSON.parse(localStorage.getItem("CuzKeyler"));
        if(localStorageCuzKeylerArr == null || localStorageCuzKeylerArr.length == 0) return;
        setHideMevcutHatimler(!hideMevcutHatimler);
        setMevcutHatimler(localStorageCuzKeylerArr)

        let localStorageCuzKeylerBaslikArr = JSON.parse(localStorage.getItem("CuzKeylerBaslik"));
        if(localStorageCuzKeylerBaslikArr == null || localStorageCuzKeylerBaslikArr.length == 0) return;
        setMevcutHatimlerBaslik(localStorageCuzKeylerBaslikArr)

        console.log("YAZILAR DEĞİŞTİ:", yazilar);
        return () => {
            // window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, [yazilar]);

// let isMobile = (width <= 768);

    const home = Language.Home;

    const otherTypes = [
        {id: "yearBased", icon: CalendarEvent, title: Language["/"].Button.YearBased, desc: home.YearBasedDesc,
            onClick: () => setYearBasedKhatmDialogVisible(true)},
        {id: "months3", icon: MoonStars, title: Language["/"].Button.Aylar3, desc: home.Months3Desc,
            tag: Language["/"].Button.NewTag, onClick: () => setMonths3DialogVisible(true)},
        {id: "newDonerliRamazanKhatm", icon: Moon, title: Language["/"].Button.Ramazan, desc: home.RamazanDesc,
            onClick: () => { setRamazan(true); setAskDialogBox(true); }},
        {id: "surahKhatm", icon: Bookmarks, title: home.SurahKhatm, desc: home.SurahKhatmDesc, tag: Language["/"].Button.NewTag,
            onClick: () => setOzelMode('surah')},
        {id: "customKhatm", icon: Adjustments, title: home.CustomKhatm, desc: home.CustomKhatmDesc, tag: Language["/"].Button.NewTag,
            onClick: () => setOzelMode('program')},
        {id: "evradEzkar", icon: Heart, title: Language["/"].Button.EvradEzkar, desc: home.EvradEzkarDesc,
            onClick: () => { window.location.href = "https://virdzikir.hatimdagit.com" }},
    ];

    return (
        <>
        <QuestionContainer >
            {/** Hatim oluşturuldu, link hazır (hızlı, Ramazan ve 3 aylar ortak) */}
            <LinkReadySheet
                visible={hideDialogBox}
                link={yazilar.link.startsWith("http") ? yazilar.link : null}
                error={yazilar.error}
                onClose={() => {
                    setYazilar({baslik:Language["/"].Button.Final.Before.Header, link:Language["/"].Button.Final.Before.LinkReady, cevap: Language["/"].Button.Final.Before.Button});
                    setHideDialogBox(false);
                }}
            />

            <AskDialog firebase={firebase} setHatimKey={setHatimKey} setYazilar={setYazilar}
                                 propHideDialogBox={{hideDialogBox, setHideDialogBox}}
                                askDialogBox={askDialogBox} setAskDialogBox={setAskDialogBox}
                                hatimKonu={hatimKonu} setHatimKonu={setHatimKonu} changeAskDialogBox={changeAskDialogBox}
                                hatimBitisTarihi={hatimBitisTarihi} setHatimBitisTarihi={setHatimBitisTarihi}
                                isRamazan={ramazan} setHatimDescription={setHatimDescription} hatimDescription={hatimDescription}
                                hatimCount={hatimCount} setHatimCount={setHatimCount} />

            <OzelDialog mode={ozelMode || 'program'} visible={ozelMode != null} onClose={() => setOzelMode(null)} />

            <Months3Dialog months3DialogVisible={months3DialogVisible} setMonths3DialogVisible={setMonths3DialogVisible}
                            setHatimKey={setHatimKey} setYazilar={setYazilar} setHideDialogBox={setHideDialogBox} />

            <YearlyKhatmDialog  visible={yearBasedKhatmDialogVisible} setVisible={setYearBasedKhatmDialogVisible} />

            <Hero>
                <Bismillah>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Bismillah>
                <HeroTitle>{home.Title}</HeroTitle>
                <HeroText>{home.Subtitle}</HeroText>
            </Hero>

            <Content>
                {/* Üç aylar planı olanlara her gün ne okuyacakları en üstte hatırlatılır */}
                <TodayReadings entries={listKhatms()} compact />

                <PrimaryAction id={"newKhatm"} onClick={ ()=>{
                    setRamazan(false);
                    setAskDialogBox(true)
                }}>
                    <ActionIcon><Book size={30} strokeWidth={1.8} /></ActionIcon>
                    <ActionBody>
                        <ActionTitle large>{Language["/"].Button.Main}</ActionTitle>
                        <ActionDesc>{home.QuickDesc}</ActionDesc>
                    </ActionBody>
                    <ActionArrow><ChevronRight size={26} /></ActionArrow>
                </PrimaryAction>

                <div style={{marginTop: 18}}><AppPromoBanner /></div>

                <SectionLabel>{home.OtherTypes}</SectionLabel>

                <OptionList>
                    {otherTypes.map(({id, icon: Icon, title, desc, tag, onClick}) => (
                        <OptionRow key={id} id={id} onClick={onClick}>
                            <ActionIcon light><Icon size={26} strokeWidth={1.8} /></ActionIcon>
                            <ActionBody>
                                <TitleLine>
                                    <ActionTitle>{title}</ActionTitle>
                                    {tag && <NewFeatureTag>{tag}</NewFeatureTag>}
                                </TitleLine>
                                <ActionDesc light>{desc}</ActionDesc>
                            </ActionBody>
                            <ActionArrow light><ChevronRight size={22} /></ActionArrow>
                        </OptionRow>
                    ))}
                </OptionList>

                <SectionLabel>{home.StepsTitle}</SectionLabel>

                <Steps>
                    {home.Steps.map(([title, text], index) => (
                        <Step key={index}>
                            <StepNum>{index + 1}</StepNum>
                            <div>
                                <StepTitle>{title}</StepTitle>
                                <StepText>{text}</StepText>
                            </div>
                        </Step>
                    ))}
                </Steps>

                <Quote>
                    <blockquote>“{home.Hadith}”</blockquote>
                    <figcaption>{home.HadithSource}</figcaption>
                </Quote>
            </Content>

        </QuestionContainer>
        </>
    )
};

export default Constr
