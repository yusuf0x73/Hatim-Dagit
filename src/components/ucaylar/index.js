//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React, {useContext, useEffect, useMemo, useState} from 'react';
import {X, HandClick, CalendarEvent, Check} from 'tabler-icons-react';
import {showNotification} from '@mantine/notifications';
import {DatabaseContext} from 'backend';
import {extractKey} from 'common';
import {PLANS, MONTH_GENITIVE, buildSchedule, isRotating, todayIndex, periodEndDate, formatDate, toDate} from 'plans';
import {SURAHS, juzRange} from 'plans/quran';
import {listKhatms, rememberPart, forgetPart, getTicks} from 'localStorage/myKhatms';
import LanguageData from 'strings';
import {ShareActions, ChartSheet, chartStore, useLiveKhatm, KhatmStatus, hasSecret, failMessage, takeFailMessage, isLocalAdmin, ReactionChips, ReactionPicker} from 'components/khatmKit';
import {
  Page, Wrap, HeroCard, HeroHead, PlanChip, HeroTitle, HeroText, HeroBody, StatRow, StatLabel, StatValue, Bar,
  Badges, Badge, SectionTitle, TodayCard, TodayBody, TodayKicker, TodayTitle, TodaySub, SmallButton, Toolbar,
  SearchInput, FilterRow, FilterChip, LuckyButton, GroupList, Group, GroupHead, GroupNo, GroupInfo, GroupTitle,
  MiniBar, TileGrid, Tile, Row, RowStatus, ListCard, Empty, Sheet, SheetClose, SheetTitle, SheetSub, InfoBox,
  NameInput, ActionButton, GhostButton, ErrorText,
} from './styles';

// Türkçe karakterleri sadeleştirerek arama ("yasin" -> "Yâsîn")
const normalize = text =>
  text.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[̀-ͯ']/g, '').replace(/ı/g, 'i');

const formatLong = date => date.toLocaleDateString('tr-TR', {day: 'numeric', month: 'long', year: 'numeric'});

// Firebase 1..N anahtarlarını diziye çevirebilir; her durumda {no: part} haritası üret
const normalizeParts = parts => {
  const map = {};
  Object.entries(parts || {}).forEach(([no, part]) => {
    if (part) map[no] = part;
  });
  return map;
};

// Sayfa ve parça planlarında parçaları cüzlere göre grupla
const groupsForPlan = (planId, slots) => {
  if (planId === 'samePage') {
    return Array.from({length: 30}, (_, i) => {
      const {start, end} = juzRange(i + 1);
      return {juz: i + 1, slots: Array.from({length: end - start + 1}, (_, k) => start + k)};
    });
  }
  const perJuz = slots / 30;
  return Array.from({length: 30}, (_, i) => ({
    juz: i + 1,
    slots: Array.from({length: perJuz}, (_, k) => i * perJuz + k + 1),
  }));
};

const UcAylar = () => {
  const database = useContext(DatabaseContext);
  const key = extractKey().replace('/', '');

  // Hatim canlı dinlenir: biri parça aldığında sayfa kendiliğinden güncellenir
  const live = useLiveKhatm(key);
  const khatm = useMemo(() => {
    const data = live.data;
    if (!data) return null;
    const subKey = Object.keys(data).find(k => data[k] && typeof data[k] === 'object' && data[k].parts);
    if (!subKey || !PLANS[data.plan]) return null;
    return {
      header: data.header,
      description: data.description,
      plan: data.plan,
      rotating: data.rotating,
      period: {startingDate: data.startingDate, monthDays: data.monthDays},
      subKey,
      parts: normalizeParts(data[subKey].parts),
      charts: data[subKey].charts,
    };
  }, [live.data]);
  const status = live.status === 'ready' && !khatm ? 'missing' : live.status;

  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [openGroups, setOpenGroups] = useState([]);
  const [highlight, setHighlight] = useState(null);

  const [selected, setSelected] = useState(null);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');

  const [chartSlot, setChartSlot] = useState(null);
  const [mineVersion, setMineVersion] = useState(0);

  const plan = khatm ? PLANS[khatm.plan] : null;

  const mySlots = useMemo(() => {
    const entry = listKhatms().find(e => e.key === key);
    return entry && khatm ? entry.parts.filter(p => p.subKey === khatm.subKey).map(p => String(p.no)) : [];
  }, [khatm, mineVersion]);

  if (status !== 'ready') {
    return <Page><KhatmStatus status={status} retry={live.retry} tiles={12} /></Page>;
  }

  const {parts, period} = khatm;
  const rotating = isRotating(khatm.plan, khatm.rotating);
  const takenCount = Object.values(parts).filter(p => p.isTaken).length;
  const percent = Math.round((takenCount / plan.slots) * 100);
  const dayIndex = todayIndex(period);
  const daysToStart = Math.round((toDate(period.startingDate) - new Date().setHours(0, 0, 0, 0)) / 86400000);
  const ended = dayIndex == null && daysToStart <= 0;

  const isTaken = no => parts[no] && parts[no].isTaken;
  const isMine = no => mySlots.includes(String(no));
  const passesFilter = no =>
    filter === 'all' || (filter === 'free' && !isTaken(no)) || (filter === 'mine' && isMine(no));

  const openSlot = no => {
    setSelected(String(no));
    setName(isTaken(no) ? (parts[no].name || '') : (localStorage.getItem('hd.lastName') || ''));
    setActionError('');
  };

  // Sıradaki (ilk) boş parçayı açar; hatim baştan sona sırayla dolar
  const pickNextFree = () => {
    const next = Array.from({length: plan.slots}, (_, i) => i + 1).find(no => !isTaken(no));
    if (next) openSlot(next);
  };

  const takeSelected = async () => {
    if (!name.trim()) {
      setActionError('Lütfen isminizi yazın.');
      return;
    }
    setBusy(true);
    setActionError('');
    localStorage.setItem('hd.lastName', name.trim());
    const result = await database.cuzAlV3(name.trim(), selected, khatm.subKey, true, false);
    if (result && result.data == 200) {
      rememberPart({
        key, type: 'ucaylar', route: `/ucaylar/${key}`, title: khatm.header || plan.title,
        subKey: khatm.subKey, no: selected, label: plan.slotLabel(selected).title, plan: khatm.plan, period, rotating: khatm.rotating,
      });
      setMineVersion(v => v + 1);
      setSelected(null);
    } else {
      setActionError(takeFailMessage(result && result.code));
    }
    setBusy(false);
  };

  const releaseSelected = async () => {
    setBusy(true);
    setActionError('');
    const result = await database.cuzIptalV3(selected, khatm.subKey);
    if (result && result.data == 200) {
      forgetPart({key, subKey: khatm.subKey, no: selected});
      setMineVersion(v => v + 1);
      setSelected(null);
    } else {
      setActionError(failMessage(result && result.code, 'Bırakılamadı. Lütfen tekrar deneyin.'));
    }
    setBusy(false);
  };

  // İsim değiştirme; cihazda kaydı olmayan ama secret'ı tutan parça da "Benimkiler"e geri gelir
  const renameSelected = async () => {
    if (!name.trim()) {
      setActionError('Lütfen isminizi yazın.');
      return;
    }
    setBusy(true);
    setActionError('');
    const result = await database.cuzIsimDegistirV3(name.trim(), selected, khatm.subKey);
    if (result && result.data == 200) {
      localStorage.setItem('hd.lastName', name.trim());
      if (!isMine(selected) && !isAdmin) {
        rememberPart({
          key, type: 'ucaylar', route: `/ucaylar/${key}`, title: khatm.header || plan.title,
          subKey: khatm.subKey, no: selected, label: plan.slotLabel(selected).title, plan: khatm.plan, period, rotating: khatm.rotating,
        });
      }
      setMineVersion(v => v + 1);
      setSelected(null);
    } else {
      setActionError(failMessage(result && result.code, 'Kaydedilemedi. Lütfen tekrar deneyin.'));
    }
    setBusy(false);
  };

  // Hatmi oluşturan herkesin parçasında; secret'ı olan da kendi parçasında isim değiştirip bırakabilir
  const isAdmin = isLocalAdmin(key);
  const canClaim = isAdmin || hasSecret({hatimKey: key, subKey: khatm.subKey});

  // "Okudum": çizelgeye çevrimiçi işlenir, hatimdeki herkes görür
  const markToday = async (no, value) => {
    const ok = await chartStore({hatimKey: key, subKey: khatm.subKey, partNo: no}).save(dayIndex, value);
    if (!ok) showNotification({color: 'red', message: LanguageData.Kit.ChartSaveFailed});
    setMineVersion(v => v + 1);
  };

  const chartDays = chartSlot == null ? [] : buildSchedule(khatm.plan, chartSlot, period, khatm.rotating).map(day => ({
    index: day.index,
    group: day.month,
    label: `${day.month} ${day.dayInMonth} · ${formatDate(day.date)}`,
    title: day.title,
    subtitle: day.subtitle,
    isToday: day.isToday,
  }));
  const chartData = chartSlot == null ? null : chartStore({hatimKey: key, subKey: khatm.subKey, partNo: chartSlot});

  // Arama: sayfa/parça numarası ya da sûre adı
  const searchTerm = query.trim();
  const searchNumber = /^\d+$/.test(searchTerm) ? Number(searchTerm) : null;

  const jumpTo = no => {
    setHighlight(String(no));
    const group = groupsForPlan(khatm.plan, plan.slots).find(g => g.slots.includes(no));
    if (group) setOpenGroups(current => (current.includes(group.juz) ? current : [...current, group.juz]));
  };

  const renderTile = no => {
    const part = parts[no] || {};
    const label = khatm.plan === 'samePage' ? String(no) : plan.slotLabel(no).title.split('·')[1];
    return (
      <Tile key={no} taken={part.isTaken} mine={isMine(no)} highlight={highlight === String(no)}
            data-part={no} onClick={() => openSlot(no)}>
        <strong>{label}</strong>
        <span>{part.isTaken ? part.name || '—' : 'Boş'}</span>
        {part.isTaken && <ReactionChips charts={khatm.charts} no={no} />}
      </Tile>
    );
  };

  const renderGroups = () => {
    const groups = groupsForPlan(khatm.plan, plan.slots)
      .map(group => ({...group, visible: group.slots.filter(passesFilter)}))
      .filter(group => group.visible.length > 0)
      .filter(group => searchNumber == null || khatm.plan === 'samePage' || group.juz === searchNumber);

    if (groups.length === 0) return <Empty>Gösterilecek {plan.unit} yok.</Empty>;

    const collapsible = khatm.plan === 'samePage';
    return (
      <GroupList>
        {groups.map(group => {
          const {start, end} = juzRange(group.juz);
          const free = group.slots.filter(no => !isTaken(no)).length;
          const open = !collapsible || openGroups.includes(group.juz) || filter !== 'all';
          return (
            <Group key={group.juz} mine={group.slots.some(isMine)}>
              <GroupHead static={!collapsible} onClick={() => collapsible && setOpenGroups(current =>
                current.includes(group.juz) ? current.filter(j => j !== group.juz) : [...current, group.juz])}>
                <GroupNo>{group.juz}</GroupNo>
                <GroupInfo>
                  <GroupTitle>
                    <span>{group.juz}. cüz</span>
                    <small>{start}–{end} · {free} boş</small>
                  </GroupTitle>
                  {collapsible && <MiniBar aria-hidden='true'>
                    {group.slots.map(no => <i key={no} className={isMine(no) ? 'mine' : isTaken(no) ? 'taken' : ''} />)}
                  </MiniBar>}
                </GroupInfo>
              </GroupHead>
              {open && <TileGrid cols={collapsible ? 4 : group.slots.length} wideCols={collapsible ? 7 : group.slots.length}>
                {group.visible.map(renderTile)}
              </TileGrid>}
            </Group>
          );
        })}
      </GroupList>
    );
  };

  const renderSurahs = () => {
    const rows = SURAHS.filter(surah => passesFilter(surah.number)).filter(surah =>
      !searchTerm || (searchNumber != null ? surah.number === searchNumber : normalize(surah.name).includes(normalize(searchTerm))));
    if (rows.length === 0) return <Empty>Gösterilecek sûre yok.</Empty>;
    return (
      <ListCard>
        {rows.map(surah => {
          const part = parts[surah.number] || {};
          return (
            <Row key={surah.number} mine={isMine(surah.number)} data-part={surah.number} onClick={() => openSlot(surah.number)}>
              <GroupNo>{surah.number}</GroupNo>
              <GroupInfo>
                <strong>{surah.name}</strong>
                <small style={{color: 'var(--muted)', fontWeight: 700}}>{surah.ayahs} âyet · {surah.page}. sayfa</small>
              </GroupInfo>
              <RowStatus taken={part.isTaken}>
                {part.isTaken ? part.name || 'Alındı' : 'Boş'}
                {part.isTaken && <ReactionChips charts={khatm.charts} no={surah.number} />}
              </RowStatus>
            </Row>
          );
        })}
      </ListCard>
    );
  };

  const reading = no => {
    const schedule = buildSchedule(khatm.plan, no, period, khatm.rotating);
    return dayIndex != null ? schedule[dayIndex] : schedule[0];
  };

  const selectedLabel = selected ? plan.slotLabel(selected) : null;
  const selectedPart = selected ? parts[selected] || {} : {};

  return (
    <Page>
      <Wrap>
        <HeroCard>
          <HeroHead>
            <PlanChip>{plan.title}{plan.rotatingText ? ` · ${rotating ? 'Dönerli' : 'Sabit'}` : ''}</PlanChip>
            <HeroTitle>{khatm.header || '3 Aylar Hatmi'}</HeroTitle>
            {khatm.description && <HeroText>{khatm.description}</HeroText>}
          </HeroHead>
          <HeroBody>
            <StatRow>
              <StatLabel>Alınan {plan.unit}: {takenCount} / {plan.slots}</StatLabel>
              <StatValue>%{percent}</StatValue>
            </StatRow>
            <Bar><span style={{width: `${percent}%`}} /></Bar>
            <Badges>
              <Badge>{formatLong(toDate(period.startingDate))} – {formatLong(periodEndDate(period))}</Badge>
              <Badge gold>
                {dayIndex != null
                  ? `Bugün ${MONTH_GENITIVE[buildSchedule(khatm.plan, 1, period)[dayIndex].monthIndex]} ${buildSchedule(khatm.plan, 1, period)[dayIndex].dayInMonth}. günü`
                  : ended ? 'Üç aylar tamamlandı' : `Üç aylara ${daysToStart} gün var`}
              </Badge>
            </Badges>
          </HeroBody>
        </HeroCard>

        {mySlots.length > 0 && <>
          <SectionTitle>{dayIndex != null ? 'Bugün okuyacaklarım' : 'Aldıklarım'}</SectionTitle>
          {mySlots.map(no => {
            const today = reading(no);
            const done = dayIndex != null && getTicks(key, no).includes(dayIndex);
            return (
              <TodayCard key={no} done={done} data-mine={no} style={{cursor: 'pointer'}} onClick={() => setChartSlot(no)}>
                <TodayBody>
                  <TodayKicker>{!rotating ? 'Her gün' : `Aldığınız: ${plan.slotLabel(no).title}`}</TodayKicker>
                  <TodayTitle>{today.title}</TodayTitle>
                  <TodaySub>{dayIndex != null ? today.subtitle : `İlk gün (${formatDate(today.date)}): ${today.subtitle}`}</TodaySub>
                </TodayBody>
                {dayIndex != null &&
                  <SmallButton filled={done} onClick={event => { event.stopPropagation(); markToday(no, !done); }}>
                    <Check size={18} /> {done ? 'Okundu' : 'Okudum'}
                  </SmallButton>}
                <SmallButton aria-label='Çizelge' onClick={event => { event.stopPropagation(); setChartSlot(no); }}>
                  <CalendarEvent size={18} />
                </SmallButton>
              </TodayCard>
            );
          })}
        </>}

        <SectionTitle>{plan.unit === 'sûre' ? 'Sûreler' : plan.unit === 'sayfa' ? 'Sayfalar' : 'Parçalar'}</SectionTitle>

        <Toolbar>
          {takenCount < plan.slots &&
            <LuckyButton id="nextFree" onClick={pickNextFree}><HandClick size={22} /> Sıradaki boş {plan.unitAcc} bana verin</LuckyButton>}
          <SearchInput
            value={query}
            inputMode={khatm.plan === 'sameSurah' ? 'text' : 'numeric'}
            placeholder={khatm.plan === 'sameSurah' ? 'Sûre ara (ör. Yâsîn, 67)' : khatm.plan === 'samePage' ? 'Sayfa numarası (1–604)' : 'Cüz numarası (1–30)'}
            onChange={event => {
              setQuery(event.target.value);
              const n = Number(event.target.value);
              if (khatm.plan === 'samePage' && n >= 1 && n <= 604) jumpTo(n);
            }}
          />
          <FilterRow>
            {[['all', 'Tümü'], ['free', 'Boş olanlar'], ['mine', 'Benimkiler']].map(([id, text]) => (
              <FilterChip key={id} active={filter === id} onClick={() => setFilter(id)}>{text}</FilterChip>
            ))}
          </FilterRow>
        </Toolbar>

        {khatm.plan === 'sameSurah' ? renderSurahs() : renderGroups()}
      </Wrap>

      {/* Parça alma / bırakma */}
      {selected && <Sheet role='dialog' aria-modal='true'>
        <SheetClose aria-label='Kapat' onClick={() => setSelected(null)}><X size={22} /></SheetClose>
        <SheetTitle>{selectedLabel.title}</SheetTitle>
        <SheetSub>{selectedLabel.subtitle}</SheetSub>

        {isMine(selected) ? <>
          <InfoBox>Bu {plan.unit} sizde. Bugünkü okumanız: <b>{reading(selected).title}</b> ({reading(selected).subtitle})</InfoBox>
          <ActionButton onClick={() => { setChartSlot(selected); setSelected(null); }}>
            <CalendarEvent size={20} /> Çizelgeyi aç
          </ActionButton>
          <NameInput id="partName" value={name} placeholder={LanguageData['/cuz'].CuzlerHatimCard.PartModal.Name}
                     onChange={event => setName(event.target.value)} />
          <GhostButton id="renameButton" disabled={busy} onClick={renameSelected}>{LanguageData.Kit.RenameButton}</GhostButton>
          <GhostButton danger id="releaseButton" disabled={busy} onClick={releaseSelected}>{busy ? 'Lütfen bekleyin…' : 'Bırak'}</GhostButton>
        </> : selectedPart.isTaken ? <>
          <InfoBox><b>{selectedPart.name || 'Bir kardeşimiz'}</b> bu {plan.unitAcc} aldı. Boş bir {plan.unit} seçebilirsiniz.</InfoBox>
          <ActionButton id="otherChart" onClick={() => { setChartSlot(selected); setSelected(null); }}>
            <CalendarEvent size={20} /> {LanguageData.Kit.ShowChart}
          </ActionButton>
          <GhostButton onClick={() => { setSelected(null); pickNextFree(); }}><HandClick size={20} /> Sıradaki boş {plan.unitAcc} bana verin</GhostButton>
          {canClaim && <>
            {!isAdmin && <InfoBox>{LanguageData.Kit.OtherHint}</InfoBox>}
            <NameInput id="partName" value={name} placeholder={LanguageData['/cuz'].CuzlerHatimCard.PartModal.Name}
                       onChange={event => setName(event.target.value)} />
            <GhostButton id="renameButton" disabled={busy} onClick={renameSelected}>{LanguageData.Kit.RenameButton}</GhostButton>
            <GhostButton danger id="releaseButton" disabled={busy} onClick={releaseSelected}>{busy ? 'Lütfen bekleyin…' : 'Bırak'}</GhostButton>
          </>}
        </> : <>
          <InfoBox>
            {(rotating ? plan.rotatingText : plan.fixedText) || `Üç ay boyunca her gün bu ${plan.unitAcc} okuyacaksınız.`}
            {rotating && ' Gün gün ne okuyacağınızı çizelgede görebilirsiniz.'}
          </InfoBox>
          <NameInput id="partName" value={name} placeholder={LanguageData['/cuz'].CuzlerHatimCard.PartModal.Name}
                     onChange={event => setName(event.target.value)} autoFocus />
          <ActionButton id="takeButton" disabled={busy} onClick={takeSelected}>{busy ? 'Lütfen bekleyin…' : plan.takeText}</ActionButton>
        </>}

        {selectedPart.isTaken && <ReactionPicker hatimKey={key} subKey={khatm.subKey} no={selected} charts={khatm.charts} />}

        {actionError && <ErrorText>{actionError}</ErrorText>}
      </Sheet>}

      <ChartSheet visible={chartSlot != null} onClose={() => { setChartSlot(null); setMineVersion(v => v + 1); }}
                  title={chartSlot != null ? plan.slotLabel(chartSlot).title : ''}
                  subtitle={chartSlot != null && !isMine(chartSlot) && isTaken(chartSlot)
                    ? `${parts[chartSlot].name || 'Bir kardeşimiz'} · ${plan.title}` : plan.title}
                  days={chartDays}
                  canEdit={chartSlot != null && isMine(chartSlot)}
                  reactions={chartSlot != null && isTaken(chartSlot) &&
                    <ReactionPicker hatimKey={key} subKey={khatm.subKey} no={chartSlot} charts={khatm.charts} />}
                  load={() => chartData.load()} save={(day, value) => chartData.save(day, value)} />

      <ShareActions title={khatm.header || plan.title} />
    </Page>
  );
};

export default UcAylar;
