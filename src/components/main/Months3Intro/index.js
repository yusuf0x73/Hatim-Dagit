//                                     BİSMİLLAHİRRAHMANİRRAHİM

/*
  Uygulamaya girince bir kez çıkan "3 aylar hatmi" tanıtımı.
  Her üç aylar dönemi için cihazda bir kez gösterilir; dönem bitince gösterilmez. Yalnızca Türkçe arayüzde.
*/

import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {MoonStars, Refresh, CalendarEvent, Printer, Book, Users} from 'tabler-icons-react';
import detectLanguage, {getMonths3Date} from 'common';
import {periodEndDate, toDate} from 'plans';
import {Sheet} from 'components/khatmKit';
import {SheetTitle, SheetText, ButtonStack, MainButton, SecondaryButton, IconBubble} from 'components/khatmKit/styles';

const seenKey = period => `hd.months3Intro.${period.startingDate}`;

const formatLong = date => date.toLocaleDateString ('tr-TR', {day: 'numeric', month: 'long'});

const FEATURES = [
  [Book, "Recep–Şaban'da günde 10 sayfa, Ramazan'da günde 1 cüz",
    "Recep–Şaban'da bir hatim, Ramazan'da kalınan yerden bir hatim daha. Günde 5 / 10 sayfalık plan da var."],
  [Refresh, 'Dönerli okuma, tam hatim',
    'Her gün sıradaki sayfalara geçilir; her kişi kendi hatmini tamamlar, eksik sayfalar son iki güne eklenir.'],
  [CalendarEvent, 'Gün gün çizelge',
    'Her gün ne okunacağı hazır; "Okudum" işaretleri çevrimiçi, hatimdeki herkes görür.'],
  [Printer, 'Kâğıda da basılır',
    'A4 sayfaya 6 kişinin çizelgesi; herkesinkini ya da seçtiğiniz kişileri yazdırın.'],
  [Users, 'Her gün 1 sayfa / 1 sûre',
    'Sayfalar ya da sûreler dağıtılır; bütün parçalar alınınca her gün bir hatim tamamlanır.'],
];

const Months3Intro = ({onCreate}) => {
  const [visible, setVisible] = useState (false);
  const [period, setPeriod] = useState (null);

  useEffect (() => {
    if (detectLanguage () !== 'tr') return;
    try {
      const current = getMonths3Date ();
      if (!current || periodEndDate (current) < new Date ()) return;
      // hd.months3Intro.off: hiç gösterme (testler)
      if (localStorage.getItem (seenKey (current)) || localStorage.getItem ('hd.months3Intro.off')) return;
      setPeriod (current);
      // Sayfa yerleşsin, sonra açılsın
      const timer = setTimeout (() => setVisible (true), 700);
      return () => clearTimeout (timer);
    } catch (error) {
      return undefined;
    }
  }, []);

  const close = () => {
    if (period) localStorage.setItem (seenKey (period), '1');
    setVisible (false);
  };

  return (
    <Sheet visible={visible} onClose={close}>
      <IconBubble><MoonStars size={30} /></IconBubble>
      <SheetTitle id="months3IntroTitle">Üç aylar hatmi hazır</SheetTitle>
      {period &&
        <SheetText>
          Recep ayının ilk günü: {formatLong (toDate (period.startingDate))}. Çevrenizdekilerle üç aylar hatmi yapın.
        </SheetText>}
      <List>
        {FEATURES.map (([Icon, title, text]) => (
          <li key={title}>
            <span className="icon"><Icon size={20} /></span>
            <span>
              <b>{title}</b>
              <small>{text}</small>
            </span>
          </li>
        ))}
      </List>
      <ButtonStack>
        <MainButton type="button" id="months3IntroCreate" onClick={() => { close (); onCreate && onCreate (); }}>
          Üç aylar hatmi oluştur
        </MainButton>
        <SecondaryButton type="button" id="months3IntroClose" onClick={close}>Daha sonra</SecondaryButton>
      </ButtonStack>
    </Sheet>
  );
};

export default Months3Intro;

const List = styled.ul`
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;

  li {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }

  .icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: var(--gold-100);
    color: var(--gold-600);
  }

  b {
    display: block;
    font-size: 0.98rem;
  }

  small {
    display: block;
    margin-top: 2px;
    color: var(--muted);
    font-size: 0.86rem;
    line-height: 1.4;
  }
`;
