//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React, {useEffect, useMemo, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {CalendarEvent, Plus, ChevronDown, ChevronUp, Check} from 'tabler-icons-react';
import {showNotification} from '@mantine/notifications';
import LocDb from '@yusuf-yeniceri/easy-storage';
import {db, localDatabase} from 'backend';
import Language from 'strings';
import {extractKey} from 'common';
import {rememberPart, forgetPart, rememberTitle, hideKhatm} from 'localStorage/myKhatms';
import {juzRange} from 'plans/quran';
import {
  QuestionContainer, CardWrapper, GridToolbar, Legend, LegendItem, GridHint,
  RespondOuterContainer, RespondInnerContainer, ResponseItemContainer, ResponseItem, ResponseText, ResponseName, MineBadge,
} from 'components/cuz/Cuzler/QuestionElements';
import {
  ShareActions, PartSheet, ReactionChips, ReactionPicker, hasSecret, failMessage, takeFailMessage, ChartSheet, ConfirmSheet, EditSheet, KhatmCard, chartStore, fmt,
  ChartStrip, KhatmBar, KhatmBarButton, AddKhatmButton, StopAutoButton, useLiveKhatm, KhatmStatus,
  ReadQuranBanner, TakenSheet, takenTitle,
} from 'components/khatmKit';

const ROOT_FIELDS = ['header', 'description', 'adminToken', 'donerli', 'howManyDays', 'makeNewHatim',
                     'startingDate', 'totalKhatmsBeDistributed', 'type', 'version', 'delete'];

// Kök alanlar dışındaki, "parts" içeren her çocuk bir hatimdir (Firebase push anahtarları zaman sırasıdır)
const subKhatms = data =>
  Object.keys (data)
    .filter (key => !ROOT_FIELDS.includes (key) && data[key] && typeof data[key] === 'object' && data[key].parts)
    .map (key => ({
      subKey: key,
      charts: data[key].charts,
      parts: Object.keys (data[key].parts)
        .filter (no => data[key].parts[no] != null)
        .map (no => ({no: Number (no), ...data[key].parts[no]}))
        .sort ((a, b) => a.no - b.no),
    }));

const formatDay = date => date.toLocaleDateString (undefined, {day: 'numeric', month: 'long', year: 'numeric'});

/** Yıllık çizelge: her dönem "howManyDays" gün; dönerliyse her dönemde bir sonraki cüz */
const yearlySchedule = (data, no) => {
  const days = [];
  const total = Number (data.totalKhatmsBeDistributed) || 0;
  const step = Math.max (Number (data.howManyDays) || 1, 1);
  const [y, m, d] = String (data.startingDate || '').split ('-').map (Number);
  if (!y) return days;
  const today = new Date ();
  today.setHours (0, 0, 0, 0);
  for (let i = 0; i < total; i++) {
    const start = new Date (y, m - 1, d + i * step);
    const end = new Date (y, m - 1, d + i * step + step - 1);
    const juz = data.donerli ? ((no - 1 + i) % 30) + 1 : no;
    days.push ({
      index: i,
      group: String (start.getFullYear ()),
      label: step > 1 ? `${formatDay (start)} – ${formatDay (end)}` : formatDay (start),
      title: `${juz}. cüz`,
      subtitle: fmt (Language.Kit.KhatmNo, {n: i + 1}),
      isToday: today >= start && today <= end,
    });
  }
  return days;
};

// Bugün hangi dönemdeyiz (çizelge satırı); dönem dışındaysa null
const yearlyTodayIndex = data => {
  const step = Math.max (Number (data.howManyDays) || 1, 1);
  const [y, m, d] = String (data.startingDate || '').split ('-').map (Number);
  if (!y) return null;
  const today = new Date ();
  today.setHours (0, 0, 0, 0);
  const index = Math.floor ((today - new Date (y, m - 1, d)) / 86400000 / step);
  return index >= 0 && index < (Number (data.totalKhatmsBeDistributed) || 0) ? index : null;
};

const chartTicked = (charts, no, index) => index != null && charts != null && charts[no] != null && charts[no][index] === true;

const isMine = (no, subKey) => localDatabase.partExists (no, subKey).data == true;

const YearlyPage = () => {
  const hatimKey = extractKey ().replace ('/', '');
  const history = useHistory ();
  const {status, data, retry} = useLiveKhatm (hatimKey);

  const [open, setOpen] = useState ({});
  const [part, setPart] = useState (null); // {subKey, no, name, mode}
  const [justTaken, setJustTaken] = useState (null); // az önce alınan cüz: {title, text, read}
  const [chart, setChart] = useState (null); // {subKey, no}
  const [busy, setBusy] = useState (false);
  const [confirm, setConfirm] = useState (null); // 'delete' | 'add'
  const [editing, setEditing] = useState (false);
  // Yerel kayıtlar değişince "Sizin" rozetleri yeniden hesaplansın
  const [, setLocalVersion] = useState (0);

  const khatms = useMemo (() => (data ? subKhatms (data) : []), [data]);
  const isAdmin = status === 'ready' && localDatabase.isCurrentUserAdmin ().data == true;

  useEffect (() => {
    if (data && data.header) rememberTitle (hatimKey, data.header);
  }, [data && data.header]);

  // İlk açılışta dolmamış ilk hatim açık, diğerleri kapalı gelir
  useEffect (() => {
    if (khatms.length === 0) return;
    setOpen (current => {
      if (Object.keys (current).length > 0) {
        const next = {...current};
        khatms.forEach (k => { if (next[k.subKey] === undefined) next[k.subKey] = true; });
        return next;
      }
      const firstOpen = khatms.find (k => k.parts.some (p => !p.isTaken)) || khatms[khatms.length - 1];
      return Object.fromEntries (khatms.map (k => [k.subKey, k.subKey === firstOpen.subKey]));
    });
  }, [khatms.length]);

  if (status !== 'ready') return <QuestionContainer><KhatmStatus status={status} retry={retry} /></QuestionContainer>;

  const todayIndex = yearlyTodayIndex (data);
  const allParts = khatms.flatMap (k => k.parts);
  const takenCount = allParts.filter (p => p.isTaken).length;
  const myParts = khatms.flatMap ((k, index) =>
    k.parts.filter (p => isMine (p.no, k.subKey))
      .map (p => ({
        label: khatms.length > 1 ? `${fmt (Language.Kit.KhatmNo, {n: index + 1})} · ${p.no}. cüz` : `${p.no}. cüz`,
        // Dokununca doğrudan okuma çizelgesi açılır
        onClick: () => setChart ({subKey: k.subKey, no: p.no}),
      })));

  const chartsOf = subKey => (khatms.find (k => k.subKey === subKey) || {}).charts;
  const takenPart = (subKey, no) => ((khatms.find (k => k.subKey === subKey) || {parts: []}).parts.find (p => String (p.no) === String (no)) || {}).isTaken;

  /* ---------- Cüz alma / bırakma ---------- */

  const take = async name => {
    setBusy (true);
    const {subKey, no} = part;
    const result = await db.cuzAlV3 (name, no, subKey, true, data.makeNewHatim);
    setBusy (false);
    if (result.data != 200) {
      showNotification ({color: 'red', message: takeFailMessage (result.code)});
      return;
    }
    localDatabase.cuzAl (name, no, subKey, true, data.makeNewHatim);
    rememberPart ({key: hatimKey, type: 'yillik', route: `/yillik/${hatimKey}`, title: data.header,
                   subKey, no, label: `${no}. cüz`});
    setLocalVersion (v => v + 1);
    setPart (null);
    setJustTaken ({title: takenTitle (`${no}. cüz`), text: Language.Kit.TakenChartHint, read: juzRange (no)});
  };

  const rename = async name => {
    setBusy (true);
    const {subKey, no} = part;
    const result = await db.cuzIsimDegistirV3 (name, no, subKey);
    setBusy (false);
    if (result.data != 200) {
      showNotification ({color: 'red', message: failMessage (result.code, Language.Kit.ChartSaveFailed)});
      return;
    }
    if (part.mode === 'other') {
      // Secret tuttu: cüz bu cihazındı, yerel kayıt geri gelir
      localDatabase.cuzAl (name, no, subKey, true, data.makeNewHatim);
      rememberPart ({key: hatimKey, type: 'yillik', route: `/yillik/${hatimKey}`, title: data.header,
                     subKey, no, label: `${no}. cüz`});
      setLocalVersion (v => v + 1);
    } else if (part.mode === 'mine') {
      localDatabase.cuzIsimDegistir (name, no, subKey);
    }
    setPart (null);
  };

  const release = async () => {
    setBusy (true);
    const {subKey, no} = part;
    const result = await db.cuzIptalV3 (no, subKey);
    setBusy (false);
    if (result.data != 200) {
      showNotification ({color: 'red', message: failMessage (result.code, Language.Kit.ReleaseFailed)});
      return;
    }
    localDatabase.cuzIptal (no, subKey);
    forgetPart ({key: hatimKey, subKey, no});
    setLocalVersion (v => v + 1);
    setPart (null);
    showNotification ({message: Language.Kit.Released});
  };

  const openPart = (subKey, p) => {
    if (p.isTaken && !isMine (p.no, subKey)) {
      // Hatmi oluşturan herkesin cüzünde isim değiştirip bırakabilir
      if (isAdmin) {
        setPart ({subKey, no: p.no, name: p.name, mode: 'admin'});
        return;
      }
      // Cihazda bu hatim için secret varsa cüz bu cihazdan alınmış olabilir: sunucu karar verir
      if (hasSecret ({hatimKey, subKey})) {
        setPart ({subKey, no: p.no, name: p.name, mode: 'other'});
        return;
      }
      // Başkasının cüzü: sadece çizelgesi açılır
      setChart ({subKey, no: p.no});
      return;
    }
    setPart ({subKey, no: p.no, name: p.name, mode: p.isTaken ? 'mine' : 'take'});
  };

  /* ---------- Yönetici işlemleri ---------- */

  const deleteKhatm = async () => {
    setBusy (true);
    const result = await db.deleteHatimV3 ();
    setBusy (false);
    if (result === -1) {
      showNotification ({color: 'red', message: Language.Kit.DeleteFailed});
      return;
    }
    LocDb.ref ('Hatim/').modify (local => {
      delete local[hatimKey];
      return local;
    });
    hideKhatm (hatimKey);
    setConfirm (null);
    showNotification ({message: Language.Kit.Deleted});
    history.push ('/');
  };

  const addKhatm = async () => {
    setBusy (true);
    const result = await db.yeniYillikHatim ({header: '', description: '', startingDate: '', howManyDays: '',
                                             totalKhatmsBeDistributed: '', donerli: '', makeNewHatim: '', mevcutHatim: true});
    setBusy (false);
    if (result.data == undefined) {
      showNotification ({color: 'red', message: Language.Kit.NewKhatmFailed});
      return;
    }
    setConfirm (null);
    showNotification ({color: 'teal', message: Language.Kit.NewKhatmAdded});
  };

  const stopAuto = async () => {
    const response = await db.stopMakingNewKhatm ();
    if (response != 200) showNotification ({color: 'red', message: Language.Kit.ChartSaveFailed});
  };

  const saveEdit = async ({header, description}) => {
    const result = await db.yillikHatimDegistirV3 (header, data.startingDate, description);
    if (result.error != undefined) {
      showNotification ({color: 'red', message: Language.Kit.ChartSaveFailed});
      return false;
    }
    return true;
  };

  /* ---------- Çizelge ---------- */

  const chartDays = chart ? yearlySchedule (data, chart.no) : [];
  const chartKhatmIndex = chart ? khatms.findIndex (k => k.subKey === chart.subKey) : -1;
  const store = chart ? chartStore ({hatimKey, subKey: chart.subKey, partNo: chart.no}) : null;

  return (
    <QuestionContainer>
      <CardWrapper>
        <KhatmCard title={data.header} description={data.description}
                   taken={takenCount} total={allParts.length}
                   badges={data.howManyDays ? [fmt (Language.Kit.EveryNDays, {n: data.howManyDays})] : []}
                   myParts={myParts} isAdmin={isAdmin}
                   onDelete={() => setConfirm ('delete')} onEdit={() => setEditing (true)} />
      </CardWrapper>

      <GridToolbar>
        <Legend>
          <LegendItem kind="free">{Language.CuzGrid.Available}</LegendItem>
          <LegendItem kind="taken">{Language.CuzGrid.Taken}</LegendItem>
          <LegendItem kind="read">{Language.Kit.ReadToday}</LegendItem>
        </Legend>
      </GridToolbar>
      <GridHint>{Language.CuzGrid.Hint}</GridHint>

      {/* Yarıda kalmış eski oluşturmalarda hiç hatim olmayabilir */}
      {khatms.length === 0 &&
        <p id="emptyKhatm" style={{margin: '8px 16px 24px', textAlign: 'center', color: 'var(--muted)', fontWeight: 700}}>
          {isAdmin ? Language.Kit.EmptyKhatmAdmin : Language.Kit.EmptyKhatm}
        </p>}

      {khatms.map ((khatm, index) => {
        const visible = khatms.length === 1 || open[khatm.subKey];
        const taken = khatm.parts.filter (p => p.isTaken).length;
        return (
          <React.Fragment key={khatm.subKey}>
            {khatms.length > 1 &&
              <KhatmBar>
                <div>
                  {fmt (Language.Kit.KhatmNo, {n: index + 1})}
                  <small>{taken} / {khatm.parts.length} {Language.CuzGrid.Taken.toLocaleLowerCase ()}</small>
                </div>
                <KhatmBarButton type="button" onClick={() => setOpen ({...open, [khatm.subKey]: !visible})}>
                  {visible ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  {visible ? Language.Kit.Hide : Language.Kit.Show}
                </KhatmBarButton>
              </KhatmBar>}

            {visible &&
              <RespondOuterContainer>
                <RespondInnerContainer>
                  {khatm.parts.map (p => {
                    const mine = p.isTaken && isMine (p.no, khatm.subKey);
                    const read = p.isTaken && chartTicked (khatm.charts, p.no, todayIndex);
                    return (
                      <ResponseItemContainer key={p.no} taken={p.isTaken} read={read} mine={mine}>
                        <ResponseItem bgColor={p.isTaken} data-sub={khatm.subKey} data-part={p.no} onClick={() => openPart (khatm.subKey, p)}>
                          {mine && <MineBadge>{Language.CuzGrid.Mine}</MineBadge>}
                          <ResponseText>{p.no}</ResponseText>
                          <ResponseName taken={p.isTaken}>{p.isTaken ? p.name || '—' : Language.CuzGrid.Available}</ResponseName>
                          {p.isTaken && <ReactionChips charts={khatm.charts} no={p.no} />}
                        </ResponseItem>
                        <ChartStrip type="button" taken={p.isTaken} read={read} onClick={() => setChart ({subKey: khatm.subKey, no: p.no})}>
                          {read ? <Check size={15} strokeWidth={3} /> : <CalendarEvent size={15} />}
                          {read ? Language.Kit.ReadToday : Language.MyKhatms.Chart}
                        </ChartStrip>
                      </ResponseItemContainer>
                    );
                  })}
                </RespondInnerContainer>
              </RespondOuterContainer>}
          </React.Fragment>
        );
      })}

      {isAdmin && !data.makeNewHatim &&
        <AddKhatmButton type="button" id="NewSubKhatm" onClick={() => setConfirm ('add')}>
          <Plus size={22} />
          {Language.Kit.NewKhatm}
        </AddKhatmButton>}

      {isAdmin && data.makeNewHatim &&
        <StopAutoButton type="button" onClick={stopAuto}>{Language.Kit.StopAuto}</StopAutoButton>}

      <PartSheet visible={part != null} onClose={() => setPart (null)} busy={busy}
                 mode={part ? part.mode : 'take'} badge={part ? part.no : ''} label={part ? `${part.no}. cüz` : ''}
                 read={part ? juzRange (part.no) : undefined}
                 holder={part ? part.name : ''}
                 onTake={take} onRename={rename} onRelease={release}
                 extra={part && <>
                   {part.mode !== 'take' && <ReactionPicker hatimKey={hatimKey} subKey={part.subKey} no={part.no} charts={chartsOf (part.subKey)} />}
                   <ChartStrip as="button" type="button" taken={false} style={{borderRadius: 14, minHeight: 48, border: 0}}
                                            onClick={() => { setChart ({subKey: part.subKey, no: part.no}); setPart (null); }}>
                   <CalendarEvent size={18} /> {Language.MyKhatms.Chart}
                 </ChartStrip>
                 </>} />

      <ChartSheet visible={chart != null} onClose={() => setChart (null)}
                  title={chart ? `${chart.no}. cüz · ${Language.Kit.ChartTitle}` : ''}
                  subtitle={chart && khatms.length > 1 ? fmt (Language.Kit.KhatmNo, {n: chartKhatmIndex + 1}) : data.header}
                  days={chartDays}
                  canEdit={chart ? isMine (chart.no, chart.subKey) : false}
                  reactions={chart && takenPart (chart.subKey, chart.no) &&
                    <ReactionPicker hatimKey={hatimKey} subKey={chart.subKey} no={chart.no} charts={chartsOf (chart.subKey)} />}
                  load={() => store.load ()} save={(day, value) => store.save (day, value)} />

      <ConfirmSheet visible={confirm === 'delete'} danger icon="delete" busy={busy}
                    title={Language['/cuz'].DeleteKhatmAlert.Question} confirmLabel={Language.Kit.YesDelete}
                    onConfirm={deleteKhatm} onCancel={() => setConfirm (null)} />

      <ConfirmSheet visible={confirm === 'add'} icon="add" busy={busy}
                    title={Language.Kit.NewKhatmConfirm}
                    onConfirm={addKhatm} onCancel={() => setConfirm (null)} />

      <EditSheet visible={editing} onClose={() => setEditing (false)}
                 initial={{header: data.header, description: data.description}} onSave={saveEdit} />

      <ReadQuranBanner />
      <TakenSheet taken={justTaken} onClose={() => setJustTaken (null)} />

      <ShareActions title={data.header} />
    </QuestionContainer>
  );
};

export default YearlyPage;
