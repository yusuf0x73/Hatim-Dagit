//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React, {useMemo, useState} from 'react';
import {Book, CalendarEvent, Check, Copy, ExternalLink, Trash, Plus} from 'tabler-icons-react';
import Language from 'strings';
import {getMonths3Date} from 'common';
import {PLANS, buildSchedule, todayIndex, toDate, formatDate} from 'plans';
import {showNotification} from '@mantine/notifications';
import {listKhatms, hideKhatm, getTicks, KHATM_TYPES} from 'localStorage/myKhatms';
import {ChartSheet, ConfirmSheet, chartStore} from 'components/khatmKit';
import {TodayCard, TodayBody, TodayKicker, TodayTitle, TodaySub, SmallButton} from 'components/ucaylar/styles';
import {
  Container, Header, HeaderTitle, HeaderText, Content, SectionLabel, Tabs, Tab, Card, CardTop, TypeChip, CardTitle,
  Chips, Chip, CardActions, CardButton, IconButton, Empty, EmptyText, Note,
} from './styles';

const texts = Language.MyKhatms;
const SOON_DAYS = 7;

// Plan çizelgesi olan parçalar için bugünkü okuma (dönem başlamadıysa ilk gün)
const readingItems = entries =>
  entries.flatMap(entry => {
    if (!entry.plan || !PLANS[entry.plan] || entry.parts.length === 0) return [];
    const period = entry.period || getMonths3Date();
    const index = todayIndex(period);
    const daysToStart = Math.round((toDate(period.startingDate) - new Date().setHours(0, 0, 0, 0)) / 86400000);
    // Bitmiş dönemler hiç, başlamamış olanlar sadece son 7 günde gösterilir
    if (index == null && (daysToStart <= 0 || daysToStart > SOON_DAYS)) return [];
    return entry.parts.map(part => ({
      entry, part, period, index,
      daysToStart,
      reading: buildSchedule(entry.plan, part.no, period, entry.rotating)[index != null ? index : 0],
    }));
  });

// Plan çizelgesi (çevrimiçi): ana sayfada ve Hatimlerim'de aynı pencere
const PlanChartSheet = ({entry, part, onClose}) => {
  const store = chartStore({hatimKey: entry.key, subKey: part.subKey, partNo: part.no});
  const days = buildSchedule(entry.plan, part.no, entry.period || getMonths3Date(), entry.rotating).map(day => ({
    index: day.index, group: day.month, title: day.title, subtitle: day.subtitle, isToday: day.isToday,
    label: `${day.month} ${day.dayInMonth} · ${formatDate(day.date)}`,
  }));
  return <ChartSheet visible onClose={onClose}
                     title={part.label || PLANS[entry.plan].slotLabel(part.no).title} subtitle={entry.title}
                     days={days} canEdit load={() => store.load()} save={(day, value) => store.save(day, value)} />;
};

/**
 * "Bugün okuyacaklarım" kartları; ana sayfada ve Hatimlerim'de kullanılır.
 * Karta dokununca o parçanın çizelgesi açılır.
 */
export const TodayReadings = ({entries}) => {
  const [, setVersion] = useState(0);
  const [chart, setChart] = useState(null);
  const items = readingItems(entries);
  if (items.length === 0) return null;

  return (
    <>
      <SectionLabel>{texts.Today}</SectionLabel>
      {items.map(({entry, part, index, daysToStart, reading}) => {
        const done = index != null && getTicks(entry.key, part.no).includes(index);
        return (
          <TodayCard key={`${entry.key}/${part.no}`} done={done} data-today={`${entry.key}/${part.no}`}
                     style={{cursor: 'pointer'}} onClick={() => setChart({entry, part})}>
            <TodayBody>
              <TodayKicker>{entry.title}</TodayKicker>
              <TodayTitle>{reading.title}</TodayTitle>
              <TodaySub>
                {index != null ? reading.subtitle : `${daysToStart} gün sonra · ${formatDate(reading.date)}: ${reading.subtitle}`}
              </TodaySub>
            </TodayBody>
            {index != null &&
              <SmallButton filled={done} onClick={async event => {
                event.stopPropagation();
                // Çizelgeye çevrimiçi işlenir; hatimdeki herkes görür
                const ok = await chartStore({hatimKey: entry.key, subKey: part.subKey, partNo: part.no}).save(index, !done);
                if (!ok) showNotification({color: 'red', message: Language.Kit.ChartSaveFailed});
                setVersion(v => v + 1);
              }}>
                <Check size={18} /> {done ? texts.ReadDone : texts.Read}
              </SmallButton>}
            <SmallButton aria-label={texts.Chart} onClick={event => { event.stopPropagation(); setChart({entry, part}); }}>
              <CalendarEvent size={18} />
            </SmallButton>
          </TodayCard>
        );
      })}
      {chart && <PlanChartSheet entry={chart.entry} part={chart.part} onClose={() => { setChart(null); setVersion(v => v + 1); }} />}
    </>
  );
};

const MyKhatms = () => {
  const [tab, setTab] = useState('taken');
  const [version, setVersion] = useState(0);
  const [copiedKey, setCopiedKey] = useState(null);
  const [chart, setChart] = useState(null);

  const entries = useMemo(() => listKhatms(), [version]);
  const taken = entries.filter(entry => entry.parts.length > 0);
  const created = entries.filter(entry => entry.created);
  const list = tab === 'taken' ? taken : created;

  const [removing, setRemoving] = useState(null);

  const remove = () => {
    hideKhatm(removing);
    setRemoving(null);
    setVersion(v => v + 1);
  };

  // Yeni planlarda çizelge burada açılır; eski 3 aylar çizelgesi kendi sayfasında
  const openChart = (entry, part) => {
    if (entry.plan && PLANS[entry.plan]) setChart({entry, part});
    else window.location.href = entry.route;
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>{texts.Title}</HeaderTitle>
        <HeaderText>{texts.Subtitle}</HeaderText>
      </Header>

      <Content>
        <TodayReadings entries={entries} onOpenChart={openChart} />

        <Tabs role='tablist'>
          <Tab role='tab' active={tab === 'taken'} onClick={() => setTab('taken')}>
            {texts.Taken} <span>{taken.length}</span>
          </Tab>
          <Tab role='tab' active={tab === 'created'} onClick={() => setTab('created')}>
            {texts.Created} <span>{created.length}</span>
          </Tab>
        </Tabs>

        {list.length === 0 && <Empty>
          <Book size={36} strokeWidth={1.5} />
          <EmptyText>{tab === 'taken' ? texts.EmptyTaken : texts.EmptyCreated}</EmptyText>
          <CardButton primary onClick={() => { window.location.href = '/'; }}>
            <Plus size={18} /> {texts.CreateButton}
          </CardButton>
        </Empty>}

        {list.map(entry => {
          const link = `https://hatimdagit.com${entry.route}`;
          const hasChart = entry.plan && PLANS[entry.plan] && entry.parts.length > 0;
          return (
            <Card key={entry.key}>
              <CardTop>
                <TypeChip>{KHATM_TYPES[entry.type] || KHATM_TYPES.cuz}</TypeChip>
                <IconButton aria-label={texts.Remove} title={texts.Remove} onClick={() => setRemoving(entry.key)}>
                  <Trash size={18} />
                </IconButton>
              </CardTop>
              <CardTitle>{entry.title || KHATM_TYPES[entry.type] || 'Hatim'}</CardTitle>

              {tab === 'taken' && <Chips>
                {entry.parts.slice(0, 8).map(part => (
                  <Chip key={`${part.subKey}/${part.no}`}>{part.label || `${part.no}. cüz`}</Chip>
                ))}
                {entry.parts.length > 8 && <Chip muted>+{entry.parts.length - 8}</Chip>}
              </Chips>}

              <CardActions>
                <CardButton primary onClick={() => { window.location.href = entry.route; }}>
                  <ExternalLink size={18} /> {texts.Open}
                </CardButton>
                {tab === 'taken' && hasChart &&
                  <CardButton onClick={() => setChart({entry, part: entry.parts[0]})}>
                    <CalendarEvent size={18} /> {texts.Chart}
                  </CardButton>}
                {tab === 'created' &&
                  <CardButton onClick={() => navigator.clipboard.writeText(link).then(() => setCopiedKey(entry.key), () => {})}>
                    {copiedKey === entry.key ? <Check size={18} /> : <Copy size={18} />}
                    {copiedKey === entry.key ? texts.Copied : texts.CopyLink}
                  </CardButton>}
              </CardActions>
            </Card>
          );
        })}

        <Note>{texts.DeviceNote}</Note>
      </Content>

      {chart && <PlanChartSheet entry={chart.entry} part={chart.part} onClose={() => { setChart(null); setVersion(v => v + 1); }} />}

      <ConfirmSheet visible={removing != null} danger icon="delete" title={texts.RemoveConfirm}
                    confirmLabel={texts.Remove} onConfirm={remove} onCancel={() => setRemoving(null)} />
    </Container>
  );
};

export default MyKhatms;
