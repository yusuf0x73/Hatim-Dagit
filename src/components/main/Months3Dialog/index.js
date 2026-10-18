//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React, {useState, useContext} from 'react'
import {DialogBox, DialogContainer, DialogHeader, DialogIcon, DialogText, OptionContainer,
        Option, OptionTitle, OptionText, OptionMeta, PeriodNote, BackLink, ModeRow, ModeOption} from './styles'
import {DialogTextSpan, DialogTextArea, DialogInputBox, FieldRow} from '../Question/QuestionElements'
import { PrimaryButton } from 'theme';
import Counter from '../Counter';
import close from '../../../icons/close.svg';
import Language from '../../../strings';
import { Checkbox } from "@mantine/core";
import { getMonths3Date } from "../../../common";
import {DatabaseContext} from '../../../backend'
import { PLANS, NEW_PLAN_IDS, periodEndDate, toDate, isRotating } from 'plans';
import { rememberCreated } from 'localStorage/myKhatms';

const OPTION_IDS = ['eachday1part', ...NEW_PLAN_IDS];

const OPTION_META = {
  eachday1part: '30 cüz · her gün sıradaki cüz',
  tenPagesThenJuz: '60 parça (yarım cüz)',
  fivePagesThenTenPages: '120 parça (hizb, 5 sayfa)',
  samePage: '604 sayfa',
  sameSurah: '114 sûre',
};

const OPTION_DESCRIPTION = {
  eachday1part: 'Aldığınız cüzden başlayarak her gün bir sonraki cüzü okursunuz.',
};

const formatLong = date => date.toLocaleDateString('tr-TR', {day: 'numeric', month: 'long', year: 'numeric'});

const Months3Dialog = ({months3DialogVisible, setMonths3DialogVisible, setHatimKey, setYazilar, setHideDialogBox}) => {

  // "options" -> seçenek listesi, yoksa seçilen planın id'si
  const [type, setType] = useState("options")

  const [hatimKonu, setHatimKonu] = useState('')
  const [hatimDescription, setHatimDescription] = useState('')
  const [hatimCount, setHatimCount] = useState(1);
  const [makeNewHatim, setMakeNewHatim] = useState(false)
  // Yeni hatimler hep "sabit" başlar; kaydı olmayan eski hatimler planın varsayılanıyla okunur
  const [rotating, setRotating] = useState(false)

  const database = useContext(DatabaseContext)

  const period = getMonths3Date();
  const periodText = `${formatLong(toDate(period.startingDate))} – ${formatLong(periodEndDate(period))}`;

  const close3Months = () => {
    setMonths3DialogVisible(false);
    setType("options");
    setRotating(false);
  }

  const startCreating = () => {
    setMonths3DialogVisible(false);
    setYazilar({
      baslik:Language["/"].Button.Final.Before.Header,
      link:Language["/"].Button.Final.Before.LinkReady,
      cevap:Language["/"].Button.Final.Before.Button
    })
    setHideDialogBox(true);
  }

  const linkReady = (route, key) => setYazilar({
    baslik:Language["/"].Button.Final.After.Header,
    link: `https://hatimdagit.com/${route}/` + key,
    cevap:Language["/"].Button.Final.After.Button
  })

  // Eski "günde 1 cüz" hatmi: 30 cüzlük klasik yapı
  const createEachDay1Part = async () => {
    // Hatim duası tarihi: üç ayların son günü (Ramazan'ın sonu)
    const {startingDate, monthDays} = period;
    let _date = new Date(startingDate);
    _date.setDate(_date.getDate() + monthDays.reduce((a,b)=>a+b));
    let _dateString =  _date.getFullYear() + "-" + ("0"+(_date.getMonth()+1)).slice(-2) + "-" + ("0" + _date.getDate()).slice(-2)

    let _hatimKey = await database.yeniHatim(hatimKonu, _dateString, false, false,
                                            hatimDescription, makeNewHatim, hatimCount, {eachday1part: true});
    setHatimKey(_hatimKey);
    linkReady("ucaylarhergun1cuz", _hatimKey);
  }

  // Yeni planlar: sayfa / sûre / parça dağıtımı
  const createPlan = async planId => {
    const result = await database.yeniUcAylarHatim({
      header: hatimKonu,
      description: hatimDescription,
      plan: planId,
      rotating: isRotating(planId, rotating),
      slots: PLANS[planId].slots,
      startingDate: period.startingDate,
      monthDays: period.monthDays,
    });
    if(result.data === undefined) throw result.error;

    rememberCreated({key: result.data.hatimKey, type: 'ucaylar', route: `/ucaylar/${result.data.hatimKey}`,
                     title: hatimKonu || PLANS[planId].title, plan: planId, period, rotating: isRotating(planId, rotating)});
    setHatimKey(result.data.hatimKey);
    linkReady("ucaylar", result.data.hatimKey);
  }

  const create = async () => {
    const planId = type;
    startCreating();
    setType("options");
    setRotating(false);
    try {
      if(planId === 'eachday1part') await createEachDay1Part();
      else await createPlan(planId);
    } catch (error) {
      console.log(`Months3Dialog: ${error}`);
      setYazilar(prev => ({...prev, error: true}));
    }
  }

  return (
    <DialogBox visibility={months3DialogVisible}>

        <DialogIcon src={close} onClick={close3Months} />

        <DialogContainer>

            <DialogHeader>
                <DialogText>
                    {type === "options" ? Language["/"].Button.Header.Text3MonthProgram : PLANS[type].title}
                </DialogText>
            </DialogHeader>

            <PeriodNote>{periodText}</PeriodNote>

            { type=="options" &&
                <OptionContainer>
                    {OPTION_IDS.map(planId => (
                        <Option key={planId} id={planId} onClick={()=>setType(planId)}>
                            <OptionTitle>{PLANS[planId].title}</OptionTitle>
                            <OptionMeta>{OPTION_META[planId]}</OptionMeta>
                        </Option>
                    ))}
                </OptionContainer>
            }

            {type!="options" &&
            <>
                        <BackLink onClick={()=>setType("options")}>‹ Diğer seçenekler</BackLink>

                        <OptionText>{PLANS[type].description || OPTION_DESCRIPTION[type]}</OptionText>

                        {/* Dönerli: her gün sıradaki yer; sabit: her gün aynı yer */}
                        {PLANS[type].rotatingText &&
                            <ModeRow role="radiogroup">
                                {[false, true].map(value => (
                                    <ModeOption key={String(value)} type="button" role="radio" id={value ? 'rotating' : 'fixed'}
                                                aria-checked={isRotating(type, rotating) === value}
                                                active={isRotating(type, rotating) === value}
                                                onClick={() => setRotating(value)}>
                                        <strong>{value ? 'Dönerli' : 'Sabit'}</strong>
                                        <span>{value ? PLANS[type].rotatingText : PLANS[type].fixedText}</span>
                                    </ModeOption>
                                ))}
                            </ModeRow>}

                        <FieldRow>
                            <DialogTextSpan>{Language["/"].Button.Header.InputSpan[0]}</DialogTextSpan>
                            <DialogInputBox value={hatimKonu} placeholder={Language["/"].Button.Header.Input[0]} onChange = {(event)=>{
                                setHatimKonu(event.target.value);
                            }}/>
                        </FieldRow>

                        <FieldRow>
                            <DialogTextSpan>{Language["/"].Button.Header.InputSpan[1]}</DialogTextSpan>
                            <DialogTextArea value={hatimDescription} rows="2" placeholder={Language["/"].Button.Header.Input[1]} onChange = {(event)=>{
                                setHatimDescription(event.target.value);
                            }}/>
                        </FieldRow>

                        {/* Parça sayısı sabit olan yeni planlarda hatim sayısı ve otomatik hatim yok */}
                        {type === 'eachday1part' && <>
                            { makeNewHatim == false && <FieldRow>
                                <DialogTextSpan>{Language["/"].Button.Header.InputSpan[3]}</DialogTextSpan>
                                <Counter hatimCount={hatimCount} setHatimCount={setHatimCount} />
                            </FieldRow>}

                            <Checkbox size="md" styles={{ label: {fontSize: '0.95rem', lineHeight: 1.4}}} checked={makeNewHatim}
                            onChange={(event) => {
                                                    setMakeNewHatim(event.currentTarget.checked)
                                                    setHatimCount(1)
                                                    }} label={Language["/"].Button.Header.InputSpan[4]} />
                        </>}

                        <PrimaryButton onClick={create}>{Language["/"].Button.Header.Button}</PrimaryButton>
            </>
            }
        </DialogContainer>
    </DialogBox>
  )
}

export default Months3Dialog
