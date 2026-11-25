//                                     BİSMİLLAHİRRAHMANİRRAHİM

/*
  Uygulamaya girince çıkan "3 aylar hatmi" tanıtımı; bütün sayfalarda (App içinde).
  Her üç aylar dönemi için cihazda en fazla MAX_SHOWS kez, oturum başına bir kez gösterilir; dönem bitince gösterilmez. Türkçe, İngilizce ve Arapça.
*/

import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components';
import {MoonStars, Refresh, CalendarEvent, Printer, Book, Users} from 'tabler-icons-react';
import detectLanguage, {getMonths3Date} from 'common';
import {periodEndDate, toDate} from 'plans';
import {Sheet} from 'components/khatmKit';
import {SheetTitle, SheetText, ButtonStack, MainButton, SecondaryButton, IconBubble} from 'components/khatmKit/styles';

const seenKey = period => `hd.months3Intro.${period.startingDate}`;
const SESSION_KEY = 'hd.months3Intro.session';
const MAX_SHOWS = 2;

// Eski sürümde "1" yazılıyordu (bir kez görüldü)
const shownCount = period => Number (localStorage.getItem (seenKey (period))) || 0;

const LOCALES = {tr: 'tr-TR', en: 'en-GB', ar: 'ar-EG'};

const TEXT = {
  tr: {
    title: 'Üç aylar hatmi hazır',
    intro: date => `Recep ayının ilk günü: ${date}. Çevrenizdekilerle üç aylar hatmi yapın.`,
    create: 'Üç aylar hatmi oluştur',
    later: 'Daha sonra',
    features: [
      ["Recep–Şaban'da günde 10 sayfa, Ramazan'da günde 1 cüz",
        "Recep–Şaban'da bir hatim, Ramazan'da kalınan yerden bir hatim daha. Günde 5 / 10 sayfalık plan da var."],
      ['Dönerli okuma, tam hatim',
        'Her gün sıradaki sayfalara geçilir; her kişi kendi hatmini tamamlar, eksik sayfalar son iki güne eklenir.'],
      ['Gün gün çizelge',
        'Her gün ne okunacağı hazır; "Okudum" işaretleri çevrimiçi, hatimdeki herkes görür.'],
      ['Kâğıda da basılır',
        'A4 sayfaya 6 kişinin çizelgesi; herkesinkini ya da seçtiğiniz kişileri yazdırın.'],
      ['Her gün 1 sayfa / 1 sûre',
        'Sayfalar ya da sûreler dağıtılır; bütün parçalar alınınca her gün bir hatim tamamlanır.'],
    ],
  },
  en: {
    title: 'The three holy months khatm is ready',
    intro: date => `First day of Rajab: ${date}. Do a three months khatm with the people around you.`,
    create: 'Create a three months khatm',
    later: 'Later',
    features: [
      ['10 pages a day in Rajab–Sha\'ban, 1 juz a day in Ramadan',
        'One khatm in Rajab–Sha\'ban, then another in Ramadan from where you left off. A 5 / 10 pages a day plan is also available.'],
      ['Rotating reading, a full khatm',
        'Each day you move on to the next pages; everyone completes their own khatm, and missing pages are added to the last two days.'],
      ['Day-by-day chart',
        'What to read each day is ready; "Read" marks are online and everyone in the khatm sees them.'],
      ['Printable too',
        '6 people\'s charts on one A4 page; print everyone\'s or only the people you choose.'],
      ['1 page / 1 surah a day',
        'Pages or surahs are shared out; once all parts are taken, a khatm is completed every day.'],
    ],
  },
  ar: {
    title: 'ختمة الأشهر الثلاثة جاهزة',
    intro: date => `أول يوم من رجب: ${date}. اختموا ختمة الأشهر الثلاثة مع من حولكم.`,
    create: 'إنشاء ختمة الأشهر الثلاثة',
    later: 'لاحقًا',
    features: [
      ['١٠ صفحات يوميًا في رجب وشعبان، وجزء يوميًا في رمضان',
        'ختمة في رجب وشعبان، ثم ختمة أخرى في رمضان من حيث توقفتم. وتوجد أيضًا خطة ٥ / ١٠ صفحات يوميًا.'],
      ['قراءة دوّارة، ختمة كاملة',
        'كل يوم تنتقلون إلى الصفحات التالية؛ كل شخص يُتمّ ختمته، وتُضاف الصفحات الناقصة إلى آخر يومين.'],
      ['جدول يومًا بيوم',
        'ما يُقرأ كل يوم جاهز؛ علامات "قرأت" متاحة على الإنترنت ويراها كل من في الختمة.'],
      ['قابل للطباعة أيضًا',
        'جداول ٦ أشخاص في صفحة A4 واحدة؛ اطبعوا جداول الجميع أو الأشخاص الذين تختارونهم.'],
      ['صفحة / سورة واحدة يوميًا',
        'تُوزَّع الصفحات أو السور؛ وعند أخذ كل الأجزاء تُختَم ختمة كاملة كل يوم.'],
    ],
  },
};

const ICONS = [Book, Refresh, CalendarEvent, Printer, Users];

const Months3Intro = () => {
  const history = useHistory ();
  const [visible, setVisible] = useState (false);
  const [period, setPeriod] = useState (null);
  const [language] = useState (() => (TEXT[detectLanguage ()] ? detectLanguage () : 'tr'));
  const text = TEXT[language];

  useEffect (() => {
    try {
      const current = getMonths3Date ();
      if (!current || periodEndDate (current) < new Date ()) return;
      // hd.months3Intro.off: hiç gösterme (testler)
      if (localStorage.getItem ('hd.months3Intro.off')) return;
      if (shownCount (current) >= MAX_SHOWS || sessionStorage.getItem (SESSION_KEY)) return;
      setPeriod (current);
      // Sayfa yerleşsin, sonra açılsın; açıldığı an sayılır
      const timer = setTimeout (() => {
        localStorage.setItem (seenKey (current), String (shownCount (current) + 1));
        sessionStorage.setItem (SESSION_KEY, '1');
        setVisible (true);
      }, 700);
      return () => clearTimeout (timer);
    } catch (error) {
      return undefined;
    }
  }, []);

  const close = () => setVisible (false);

  // Hatim oluşturmaya geçen kişiye bir daha gösterme; ana sayfada plan penceresi açılır
  const create = () => {
    if (period) localStorage.setItem (seenKey (period), String (MAX_SHOWS));
    setVisible (false);
    history.push ('/', {openMonths3: Date.now ()});
  };

  return (
    <Sheet visible={visible} onClose={close}>
      <div dir={language === 'ar' ? 'rtl' : undefined}>
        <IconBubble><MoonStars size={30} /></IconBubble>
        <SheetTitle id="months3IntroTitle">{text.title}</SheetTitle>
        {period &&
          <SheetText>
            {text.intro (toDate (period.startingDate).toLocaleDateString (LOCALES[language], {day: 'numeric', month: 'long'}))}
          </SheetText>}
        <List>
          {text.features.map (([title, body], i) => {
            const Icon = ICONS[i];
            return (
              <li key={title}>
                <span className="icon"><Icon size={20} /></span>
                <span>
                  <b>{title}</b>
                  <small>{body}</small>
                </span>
              </li>
            );
          })}
        </List>
        <ButtonStack>
          <MainButton type="button" id="months3IntroCreate" onClick={create}>
            {text.create}
          </MainButton>
          <SecondaryButton type="button" id="months3IntroClose" onClick={close}>{text.later}</SecondaryButton>
        </ButtonStack>
      </div>
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
