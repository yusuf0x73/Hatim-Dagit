//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Book, Check, ChevronRight} from 'tabler-icons-react';
import Language from 'strings';
import Sheet from './Sheet';
import Celebrate from './Celebrate';
import {RateSheet, shouldAskRating} from './RatePrompt';
import {SheetTitle, SheetText, ButtonStack, SecondaryButton, IconBubble, ReadButton, ReadBanner} from './styles';

// "2. cüzü aldınız" (Türkçe başlıkta "cüz" → "cüzü"; diğer etiketler olduğu gibi)
export const takenTitle = label => {
  const n = /aldınız/.test (Language.Kit.TakenTitle) ? String (label).replace (/ cüz$/, ' cüzü') : label;
  return Language.Kit.TakenTitle.replace ('{n}', n);
};

// read: {start, end} sayfa aralığı; yoksa okuyucu kalınan sayfadan açılır
export const readUrl = read => (read ? `/oku?bas=${read.start}&bit=${read.end}` : '/oku');

/** Parçayı Kur'an okuyucuda açan altın düğme */
export const ReadQuranButton = ({read, ...rest}) => {
  const history = useHistory ();
  return (
    <ReadButton type="button" onClick={() => history.push (readUrl (read))} {...rest}>
      <Book size={20} /> {Language.Kit.ReadQuran}
    </ReadButton>
  );
};

/** Hatim sayfalarında genel giriş: Kur'an-ı Kerîm'i oku */
export const ReadQuranBanner = ({read}) => {
  const history = useHistory ();
  return (
    <ReadBanner type="button" id="readQuranBanner" onClick={() => history.push (readUrl (read))}>
      <span className="ar">القرآن</span>
      <span className="txt">
        <b>{Language.Kit.ReadQuranAll}</b>
        <small>{Language.Kit.ReadQuranSub}</small>
      </span>
      <span className="go"><ChevronRight size={22} /></span>
    </ReadBanner>
  );
};

/**
 * Parça alınır alınmaz: tebrik patlaması; Android'de önce "puan verin" (RatePrompt), ardından "aldınız" + hemen oku
 */
export const TakenSheet = ({taken, onClose}) => {
  const [step, setStep] = useState (null); // 'rate' | 'taken'

  useEffect (() => {
    setStep (taken ? (shouldAskRating () ? 'rate' : 'taken') : null);
  }, [taken]);

  return (
  <>
  {taken && <Celebrate fire={taken} />}
  <RateSheet visible={!!taken && step === 'rate'} onDone={() => setStep ('taken')} />
  <Sheet visible={!!taken && step === 'taken'} onClose={onClose}>
    <IconBubble><Check size={30} /></IconBubble>
    <SheetTitle>{taken ? taken.title : ''}</SheetTitle>
    {taken && taken.text && <SheetText>{taken.text}</SheetText>}
    <ButtonStack>
      {taken && taken.read && <ReadQuranButton read={taken.read} id="takenRead" />}
      <SecondaryButton type="button" onClick={onClose}>{Language.Kit.Close}</SecondaryButton>
    </ButtonStack>
  </Sheet>
  </>
  );
};
