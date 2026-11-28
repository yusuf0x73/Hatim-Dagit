//                                     BİSMİLLAHİRRAHMANİRRAHİM

/*
  Kâğıtla dağıtım için A4 çizelgeler. Her kişiye kare bir kart:
  Gün | Recep | Şaban | Ramazan yan yana, 1–30. günler alt alta; satıra 3, sayfaya 6 kart.
  "Sayfalar" sütununda doğrudan 1–10, 11–20 gibi sayfalar yazar; yanında işaret kutusu.
  Bir A4 sayfaya PER_PAGE kart sığar (dikey, yan yana; ekran görüntüsüyle ölçüldü). Kartlar makasla kolay kesilir.
*/

import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import styled, {createGlobalStyle} from 'styled-components';
import {Printer, Users} from 'tabler-icons-react';
import {Sheet} from 'components/khatmKit';
import {SheetTitle, SheetText, ButtonStack, SecondaryButton, MainButton} from 'components/khatmKit/styles';
import {buildSchedule, isRotating, toDate, periodEndDate, MONTH_NAMES} from 'plans';
import {tx, LOCALE} from 'strings/tx';

export const PER_PAGE = 6;

const chunk = (list, size) => Array.from ({length: Math.ceil (list.length / size)}, (_, i) => list.slice (i * size, (i + 1) * size));

const shortDate = date => date.toLocaleDateString (LOCALE, {day: 'numeric', month: 'short'});
const longDate = date => date.toLocaleDateString (LOCALE, {day: 'numeric', month: 'long', year: 'numeric'});


const legendOf = (planId, rotating) => {
  const base = tx ('Sayfa numaraları Diyanet mushafına göredir. Okuduğunuz günün kutusunu işaretleyin.',
                   'Page numbers follow the Diyanet mushaf. Tick the box for each day you read.',
                   'أرقام الصفحات حسب مصحف ديانت. ضع علامة في مربع اليوم الذي قرأت فيه.');
  if (planId === 'eachday1part' && !rotating) return `${tx ('Her gün aldığınız cüzü okursunuz.', 'You read the juz you took every day.', 'تقرأ الجزء الذي أخذته كل يوم.')} ${base}`;
  if (planId === 'eachday1part') return `${tx ('Her ay aldığınız cüzden başlanır, her gün bir sonraki cüz okunur; her ay bir hatim biter. Ay 29 gün çekerse son gün iki cüz okunur.',
    'Each month you start from the juz you took and read the next juz every day; a khatm is completed each month. If the month has 29 days, two juz are read on the last day.',
    'في كل شهر تبدأ من الجزء الذي أخذته وتقرأ الجزء التالي كل يوم؛ فتُختم ختمة كل شهر. وإن كان الشهر ٢٩ يومًا يُقرأ جزءان في اليوم الأخير.')} ${base}`;
  if (!rotating) return base;
  if (planId === 'tenPagesThenJuz') return `${tx ("Recep–Şaban'da günde 10 sayfa ile bir hatim, Ramazan'da kalınan yerden günde 20 sayfa ile bir hatim daha biter; gün yetmezse son iki günde fazlası okunur.",
    "One khatm with 10 pages a day in Rajab–Sha'ban, and another in Ramadan from where you left off with 20 pages a day; if there are not enough days, the extra is read on the last two days.",
    'ختمة بعشر صفحات يوميًا في رجب وشعبان، وختمة أخرى في رمضان من حيث توقفت بعشرين صفحة يوميًا؛ وإن لم تكفِ الأيام يُقرأ الزائد في آخر يومين.')} ${base}`;
  if (planId === 'fivePagesThenTenPages') return `${tx ("Recep–Şaban'da günde 5, Ramazan'da kalınan yerden günde 10 sayfa okunur; üç ayda tam bir hatim biter, gün yetmezse son iki günde fazlası okunur.",
    "5 pages a day in Rajab–Sha'ban, then 10 pages a day in Ramadan from where you left off; a full khatm over the three months. If there are not enough days, the extra is read on the last two days.",
    'خمس صفحات يوميًا في رجب وشعبان، ثم عشر صفحات يوميًا في رمضان من حيث توقفت؛ فتُختم ختمة كاملة في الأشهر الثلاثة. وإن لم تكفِ الأيام يُقرأ الزائد في آخر يومين.')} ${base}`;
  return base;
};

// chooser: birden fazla hatim varsa pencerenin üstünde hangisinin yazdırılacağı; khatmLabel: sayfa başlığında hatim numarası
const PrintSheets = ({khatm, plan, onDone, chooser, khatmLabel}) => {
  const [who, setWho] = useState (null); // 'taken' | 'all' | 'picked'
  const [picking, setPicking] = useState (false);
  const [picked, setPicked] = useState ([]); // seçilen isimler
  const [query, setQuery] = useState ('');
  const {parts, period} = khatm;
  const takenSlots = Object.keys (parts).filter (no => parts[no].isTaken).map (Number).sort ((a, b) => a - b);
  const allSlots = Array.from ({length: plan.slots}, (_, i) => i + 1);

  // Alanlar isme göre: bir kişi birden fazla parça almış olabilir
  const people = [];
  takenSlots.forEach (no => {
    const name = (parts[no].name || '').trim () || tx ('İsimsiz', 'No name', 'بلا اسم');
    const person = people.find (p => p.name === name);
    if (person) person.slots.push (no);
    else people.push ({name, slots: [no]});
  });
  const pickedSlots = people.filter (p => picked.includes (p.name)).flatMap (p => p.slots).sort ((a, b) => a - b);
  const visiblePeople = people.filter (p => p.name.toLocaleLowerCase ('tr-TR').includes (query.trim ().toLocaleLowerCase ('tr-TR')));
  const toggle = name => setPicked (list => (list.includes (name) ? list.filter (n => n !== name) : [...list, name]));

  useEffect (() => {
    if (!who) return undefined;
    const done = () => { setWho (null); setPicking (false); onDone (); };
    window.addEventListener ('afterprint', done);
    const timer = setTimeout (() => window.print (), 300);
    return () => { clearTimeout (timer); window.removeEventListener ('afterprint', done); };
  }, [who]);

  const slots = who === 'all' ? allSlots : who === 'picked' ? pickedSlots : takenSlots;
  const pagesOf = count => Math.ceil (count / PER_PAGE);
  const rotating = isRotating (khatm.plan, khatm.rotating);
  const pages = chunk (slots, PER_PAGE);
  const link = window.location.href.split ('?')[0];

  return (
    <>
      <Sheet visible={!who} onClose={onDone}>
        <SheetTitle><Printer size={26} style={{verticalAlign: 'middle'}} /> {tx ('Çizelgeleri yazdır', 'Print the charts', 'اطبع الجداول')}</SheetTitle>
        <SheetText>
          {tx (`Her kişiye Recep, Şaban ve Ramazan'ı bir arada gösteren kare bir kart; A4 sayfaya ${PER_PAGE} kart sığar ve makasla kolayca kesilir. Boş parçaların isim yeri açık basılır, elle yazılabilir.`,
               `A square card for each person showing Rajab, Sha'ban and Ramadan together; ${PER_PAGE} cards fit on an A4 page and are easy to cut out. Free parts are printed with a blank name field to fill in by hand.`,
               `بطاقة مربعة لكل شخص تعرض رجب وشعبان ورمضان معًا؛ تتسع صفحة A4 لـ${PER_PAGE} بطاقات ويسهل قصّها. تُطبع الأقسام المتاحة بخانة اسم فارغة لتُكتب باليد.`)}
        </SheetText>
        {chooser}
        {!picking ? (
          <ButtonStack>
            <SectionLabel>{tx ('Alınanlar', 'Taken', 'المأخوذة')}</SectionLabel>
            <MainButton type="button" id="printTaken" disabled={takenSlots.length === 0} onClick={() => setWho ('taken')}>
              {tx (`Herkesinkini yazdır (${takenSlots.length} kart, ${pagesOf (takenSlots.length)} sayfa)`,
                   `Print everyone's (${takenSlots.length} cards, ${pagesOf (takenSlots.length)} pages)`,
                   `اطبع جداول الجميع (${takenSlots.length} بطاقة، ${pagesOf (takenSlots.length)} صفحة)`)}
            </MainButton>
            <SecondaryButton type="button" id="printPick" disabled={takenSlots.length === 0} onClick={() => setPicking (true)}>
              <Users size={20} /> {tx ('Kişi seçerek yazdır', 'Choose people to print', 'اختر أشخاصًا للطباعة')}
            </SecondaryButton>
            <SectionLabel>{tx ('Kâğıtla dağıtım', 'Paper distribution', 'التوزيع الورقي')}</SectionLabel>
            <SecondaryButton type="button" id="printAll" onClick={() => setWho ('all')}>
              {tx (`Hepsi, boşlar dahil (${plan.slots} ${plan.unit}, ${pagesOf (plan.slots)} sayfa)`,
                   `All, including free ones (${plan.slots} ${plan.unitsAcc}, ${pagesOf (plan.slots)} pages)`,
                   `الكل، مع المتاحة (${plan.slots} ${plan.unit}، ${pagesOf (plan.slots)} صفحة)`)}
            </SecondaryButton>
          </ButtonStack>
        ) : (
          <>
            {people.length > 6 &&
              <Search value={query} placeholder={tx ('İsim ara', 'Search names', 'ابحث عن اسم')} onChange={event => setQuery (event.target.value)} />}
            <PickTools>
              <button type="button" onClick={() => setPicked (people.map (p => p.name))}>{tx ('Hepsini seç', 'Select all', 'تحديد الكل')}</button>
              <button type="button" onClick={() => setPicked ([])}>{tx ('Temizle', 'Clear', 'مسح')}</button>
            </PickTools>
            <PeopleList>
              {visiblePeople.map (person => (
                <PersonRow key={person.name} data-person={person.name}>
                  <input type="checkbox" checked={picked.includes (person.name)} onChange={() => toggle (person.name)} />
                  <span>
                    <b>{person.name}</b>
                    <small>{person.slots.map (no => plan.slotLabel (no).title).join (', ')}</small>
                  </span>
                </PersonRow>
              ))}
            </PeopleList>
            <ButtonStack>
              <MainButton type="button" id="printPicked" disabled={pickedSlots.length === 0} onClick={() => setWho ('picked')}>
                {tx (`Seçilenleri yazdır (${picked.length} kişi, ${pickedSlots.length} kart, ${pagesOf (pickedSlots.length)} sayfa)`,
                     `Print selected (${picked.length} people, ${pickedSlots.length} cards, ${pagesOf (pickedSlots.length)} pages)`,
                     `اطبع المحدد (${picked.length} أشخاص، ${pickedSlots.length} بطاقة، ${pagesOf (pickedSlots.length)} صفحة)`)}
              </MainButton>
              <SecondaryButton type="button" onClick={() => setPicking (false)}>{tx ('‹ Geri', '‹ Back', '› رجوع')}</SecondaryButton>
            </ButtonStack>
          </>
        )}
      </Sheet>

      {who && ReactDOM.createPortal (
        <PrintRoot className="hd-print">
          <PrintStyle />
          {pages.map ((pageSlots, pageIndex) => (
            <PrintPage key={pageIndex}>
              <PageHead>
                <div>
                  <h1>{khatm.header || plan.title}</h1>
                  <p>{khatmLabel ? `${khatmLabel} · ` : ''}{plan.title}{plan.rotatingText ? ` · ${rotating ? tx ('Dönerli', 'Rotating', 'دوّارة') : tx ('Sabit', 'Fixed', 'ثابتة')}` : ''} · {longDate (toDate (period.startingDate))} – {longDate (periodEndDate (period))}</p>
                </div>
                <span>{pageIndex + 1} / {pages.length}</span>
              </PageHead>
              <Legend>{legendOf (khatm.plan, rotating)}</Legend>
              <Cards>
                {pageSlots.map (no => <PersonCard key={no} no={no} khatm={khatm} plan={plan} />)}
              </Cards>
              <PageFoot>{link}</PageFoot>
            </PrintPage>
          ))}
        </PrintRoot>,
        document.body
      )}
    </>
  );
};

// Bir günün hücreleri: okunacak sayfalar · işaret kutusu (gün yoksa gri)
const DayCells = ({day}) => {
  if (!day) return <><td className="none pages" /><td className="none box" /></>;
  const text = day.pages || day.subtitle;
  return <><td className={`pages${text.length > 9 ? ' long' : ''}`}>{text}</td><td className="box" /></>;
};

const MONTHS = MONTH_NAMES;

const PersonCard = ({no, khatm, plan}) => {
  const days = buildSchedule (khatm.plan, no, khatm.period, khatm.rotating);
  const part = khatm.parts[no] || {};
  const months = [0, 1, 2].map (index => days.filter (day => day.monthIndex === index));
  const label = plan.slotLabel (no);

  return (
    <Card data-print-slot={no}>
      <CardHead>
        <b>{label.title}</b>
        <Name>{tx ('İsim', 'Name', 'الاسم')}: {part.isTaken && part.name ? <b>{part.name}</b> : <i />}</Name>
      </CardHead>
      <Table>
        <colgroup>
          <col className="no" />
          {months.map ((_, i) => <React.Fragment key={i}><col /><col className="box" /></React.Fragment>)}
        </colgroup>
        <thead>
          <tr className="month">
            <th className="no">{tx ('Gün', 'Day', 'اليوم')}</th>
            {months.map ((list, i) => (
              <th key={i} colSpan={2}>{MONTHS[i]} <small>{list.length ? shortDate (list[0].date) : ''}</small></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from ({length: 30}, (_, row) => (
            <tr key={row}>
              <td className="no">{row + 1}</td>
              {months.map ((list, i) => <DayCells key={i} day={list[row]} />)}
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

export default PrintSheets;

const SectionLabel = styled.div`
  margin-top: 6px;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
`;

const Search = styled.input`
  width: 100%;
  margin-top: 14px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1.5px solid var(--line);
  font-size: 1rem;
`;

const PickTools = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;

  button {
    padding: 6px 12px;
    border-radius: 999px;
    border: 1.5px solid var(--line);
    background: var(--surface);
    color: var(--emerald-700);
    font-weight: 800;
    cursor: pointer;
  }
`;

const PeopleList = styled.div`
  margin-top: 10px;
  max-height: 45vh;
  overflow-y: auto;
  border: 1px solid var(--line);
  border-radius: 14px;
`;

const PersonRow = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--line);
  cursor: pointer;

  &:last-child { border-bottom: 0; }

  input { width: 22px; height: 22px; accent-color: var(--emerald-700); flex-shrink: 0; }
  span { display: flex; flex-direction: column; min-width: 0; }
  small { color: var(--muted); font-weight: 700; font-size: 0.8rem; }
`;

// Yazdırırken yalnızca çizelgeler basılır
const PrintStyle = createGlobalStyle`
  @media print {
    @page { size: A4 portrait; margin: 8mm; }
    html, body { background: #fff !important; }
    body > *:not(.hd-print) { display: none !important; }
    .hd-print { display: block !important; }
  }
`;

const PrintRoot = styled.div`
  display: none;
  color: #000;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
`;

const PrintPage = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2.5mm;
  height: 276mm;
  overflow: hidden;
  break-after: page;
  page-break-after: always;

  &:last-child { break-after: auto; page-break-after: auto; }
`;

const PageHead = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 4mm;
  padding-bottom: 1.5mm;
  border-bottom: 0.4mm solid #0f5c45;

  h1 { margin: 0; font-size: 13pt; color: #0f5c45; }
  p { margin: 0.5mm 0 0; font-size: 8pt; color: #444; }
  span { font-size: 8pt; color: #444; white-space: nowrap; }
`;

const Legend = styled.p`
  margin: 0;
  font-size: 7.5pt;
  line-height: 1.35;
  color: #333;
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 3mm 2.5mm;
  align-items: start;
`;

const PageFoot = styled.footer`
  margin-top: auto;
  font-size: 7pt;
  color: #666;
  text-align: center;
`;

const Card = styled.div`
  break-inside: avoid;
  page-break-inside: avoid;
  border: 1px dashed #8a7d5f;
  border-radius: 2mm;
  padding: 1.2mm;
`;

const CardHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1.5mm;
  margin-bottom: 1mm;
  min-width: 0;

  > b { font-size: 8pt; color: #0f5c45; white-space: nowrap; }
`;

const Name = styled.span`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 0.8mm;
  font-size: 6.5pt;
  white-space: nowrap;
  overflow: hidden;

  i {
    flex: 1;
    border-bottom: 1px dotted #555;
  }
`;

// Çizgiler ve yükseklikler piksel: kesirli mm değerleri bazı çizgileri kalın basıyordu
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  col.no { width: 3.6mm; }
  col.box { width: 3.4mm; }

  th, td {
    border: 1px solid #c9bfa9;
    line-height: 1;
    padding: 0 0.4mm;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
  }

  tr.month th {
    height: 15px;
    background: #0f5c45;
    color: #fff;
    font-size: 6.5pt;
    font-weight: 800;
    text-align: left;
    padding-left: 0.8mm;

    small { font-weight: 400; font-size: 5pt; opacity: 0.9; }
  }

  tr.month th.no { font-size: 4.5pt; padding: 0; text-align: center; }

  td {
    height: 13px;
    font-size: 6pt;
  }

  td.no { color: #666; font-size: 5pt; padding: 0; background: #f6f1e6; }
  td.pages { font-weight: 700; text-align: left; letter-spacing: -0.15pt; border-left: 2px solid #0f5c45; }
  td.pages.long { font-size: 4.8pt; letter-spacing: -0.2pt; }
  td.none { background: #eee; }
  td.box { padding: 0; }
`;
