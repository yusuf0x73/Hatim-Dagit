//                                     BİSMİLLAHİRRAHMANİRRAHİM

/*
  Ramazan dönerli, eski 3 aylar (günde 1 cüz) ve cuzv2 sayfaları aynı veri yapısını kullanır
  (her hatimde 1/2/3 bölümleri ve "cevaplar" listesi). Bu sayfalar eskiden üç ayrı kopya
  bileşendi; artık hızlı hatimdeki bütün özelliklerle tek bileşen olarak çalışır.
*/

import React, {useEffect, useMemo, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {CalendarEvent, Plus, ChevronDown, ChevronUp, Check} from 'tabler-icons-react';
import {showNotification} from '@mantine/notifications';
import LocDb from '@yusuf-yeniceri/easy-storage';
import {db} from 'backend';
import Language from 'strings';
import {extractKey, getMonths3Date, initializeLocalStorage, removeAll, removeAll_v1} from 'common';
import {partsProcessor} from 'localStorage/parts';
import {rememberPart, forgetPart, rememberTitle, hideKhatm, getTicks, setTicks} from 'localStorage/myKhatms';
import {buildSchedule, formatDate, MONTH_NAMES} from 'plans';
import {juzRange} from 'plans/quran';
import {
  QuestionContainer, CardWrapper, GridToolbar, Legend, LegendItem, GridHint,
  RespondOuterContainer, RespondInnerContainer, ResponseItemContainer, ResponseItem, ResponseText, ResponseName, MineBadge,
} from 'components/cuz/Cuzler/QuestionElements';
import {
  ShareActions, PartSheet, ReactionChips, ReactionPicker, ReactSheet, hasSecret, failMessage, takeFailMessage, ChartSheet, ConfirmSheet, EditSheet, KhatmCard, chartStore, fmt,
  ChartStrip, KhatmBar, KhatmBarButton, AddKhatmButton, StopAutoButton, useLiveKhatm, KhatmStatus,
  ReadQuranBanner, TakenSheet, takenTitle,
} from 'components/khatmKit';

const ROOT_FIELDS = ['adminToken', 'delete', 'subKey', 'makeNewHatim', 'khatmSubKeys', 'activeSubKhatmKey', 'totalReadParts'];

const VARIANTS = {
  ramazan: {type: 'ramazan', route: 'ramazan', chart: 'ramazan', question: () => Language['/ramazan'].Before.Question},
  ucaylarhergun1cuz: {type: 'ucaylarhergun1cuz', route: 'ucaylarhergun1cuz', chart: 'months3', question: () => Language.CuzGrid.Hint},
  cuzv2: {type: 'cuz', route: 'cuzv2', chart: null, question: () => Language.CuzGrid.Hint},
};

const cevaplar = khatm => [1, 2, 3].flatMap (i => ((khatm[i] && khatm[i].cevaplar) || []).filter (Boolean));

/**
 * Ham veriyi hatim listesine çevirir.
 * Çok eski hatimlerde kökün kendisi tek hatimdir (api 1); alt anahtarı hatim anahtarıyla aynıdır.
 */
const parseKhatms = (data, hatimKey) => {
  if (data.baslik != null) return {api: 1, khatms: [{...data, subKey: hatimKey}]};
  const order = data.khatmSubKeys ? Object.values (data.khatmSubKeys) : [];
  const keys = Object.keys (data).filter (key => !ROOT_FIELDS.includes (key) && data[key] && data[key][1]);
  keys.sort ((a, b) => {
    const ia = order.indexOf (a);
    const ib = order.indexOf (b);
    return (ia === -1 ? 1e9 : ia) - (ib === -1 ? 1e9 : ib) || (a < b ? -1 : 1);
  });
  return {api: 2, khatms: keys.map (key => ({...data[key], subKey: key}))};
};

/*
  Cihazdaki eski kayıtlar asla ezilmez:
  - Çok eski sürümlerde 'cuz' bir diziydi (api 1). Yeni biçim yazılmadan önce bu dizi 'cuz_v1'e taşınır.
  - Beklenmedik bir biçim varsa (bozuk JSON, dizi olması gereken yerde nesne) hiç yazılmaz.
*/
const readRaw = name => {
  const raw = localStorage.getItem (name);
  if (raw == null) return {exists: false};
  try {
    return {exists: true, value: JSON.parse (raw)};
  } catch (error) {
    return {exists: true, broken: true};
  }
};

const safeWriteV1 = list => {
  const current = readRaw ('cuz_v1');
  if (current.exists && (current.broken || !Array.isArray (current.value))) return;
  localStorage.setItem ('cuz_v1', JSON.stringify (list));
};

const safeWriteV2 = obj => {
  const current = readRaw ('cuz');
  if (current.exists && current.broken) return;
  if (current.exists && Array.isArray (current.value)) {
    const v1 = readRaw ('cuz_v1');
    if (v1.exists) return; // iki eski kayıt da var: hiçbirine dokunulmaz
    localStorage.setItem ('cuz_v1', JSON.stringify (current.value));
  }
  localStorage.setItem ('cuz', JSON.stringify (obj));
};

const readLocalParts = api => {
  try {
    if (api === 1) {
      const list = JSON.parse (localStorage.getItem ('cuz_v1'));
      return Array.isArray (list) ? list : [];
    }
    const obj = JSON.parse (localStorage.getItem ('cuz'));
    return obj && typeof obj === 'object' && !Array.isArray (obj) ? obj : {};
  } catch (error) {
    return api === 1 ? [] : {};
  }
};

const isAdminOf = hatimKey => {
  try {
    const tokens = LocDb.ref ('Hatim/adminToken').get ();
    if (Array.isArray (tokens) && tokens.some (token => Object.keys (token)[0] === hatimKey)) return true;
    return (JSON.parse (localStorage.getItem ('CuzKeyler')) || []).includes (hatimKey);
  } catch (error) {
    return false;
  }
};

/* ---------- Çizelgeler ---------- */

const addDays = (date, days) => {
  const copy = new Date (date.getFullYear (), date.getMonth (), date.getDate () + days);
  return copy;
};

const toLocalDate = iso => {
  const [y, m, d] = iso.split ('-').map (Number);
  return new Date (y, m - 1, d);
};

// Ramazan dönerli: aldığınız cüzden başlayıp her gün bir sonraki cüz (eski Ramazan çizelgesiyle aynı tarihler)
const ramazanSchedule = no => {
  const period = getMonths3Date ();
  const [recep, saban, ramazan] = period.monthDays;
  const first = addDays (toLocalDate (period.startingDate), recep + saban - 1);
  const today = new Date ().toDateString ();
  return Array.from ({length: Math.max (ramazan, 30)}, (_, i) => {
    const date = addDays (first, i);
    return {
      index: i,
      group: MONTH_NAMES[2],
      label: `${fmt (Language.Kit.Day, {n: i + 1})} · ${formatDate (date)}`,
      title: `${((Number (no) - 1 + i) % 30) + 1}. cüz`,
      isToday: date.toDateString () === today,
    };
  });
};

const months3Schedule = no =>
  buildSchedule ('eachday1part', no, getMonths3Date ()).map (day => ({
    index: day.index,
    group: day.month,
    label: `${day.month} ${day.dayInMonth} · ${formatDate (day.date)}`,
    title: day.title,
    subtitle: day.subtitle,
    isToday: day.isToday,
  }));

/* ---------- Sayfa ---------- */

const LegacyKhatmPage = ({variant = 'ramazan'}) => {
  const config = VARIANTS[variant];
  const hatimKey = extractKey ().replace ('/', '');
  const history = useHistory ();
  const {status, data, retry} = useLiveKhatm (hatimKey);

  const [open, setOpen] = useState ({});
  const [part, setPart] = useState (null); // {subKey, no, name, mode}
  const [justTaken, setJustTaken] = useState (null); // az önce alınan cüz: {title, text, read}
  const [chart, setChart] = useState (null); // {subKey, no}
  const [react, setReact] = useState (null); // çizelgesiz sayfada başkasının cüzü
  const [busy, setBusy] = useState (false);
  const [confirm, setConfirm] = useState (null);
  const [editing, setEditing] = useState (false);
  const [localParts, setLocalParts] = useState (() => readLocalParts (2));

  const {api, khatms} = useMemo (() => (data ? parseKhatms (data, hatimKey) : {api: 2, khatms: []}), [data]);
  const first = khatms[0] || {};
  const isAdmin = isAdminOf (hatimKey);

  useEffect (() => {
    if (status === 'ready') setLocalParts (readLocalParts (api));
  }, [status, api]);

  // Hatim başka türdeyse doğru sayfaya yönlendir
  useEffect (() => {
    if (!first.subKey) return;
    if (variant !== 'ramazan' && first.isRamazan) window.location.replace (`/ramazan/${hatimKey}`);
    else if (variant !== 'ucaylarhergun1cuz' && first.isMonths3 && first.isMonths3.eachday1part) {
      window.location.replace (`/ucaylarhergun1cuz/${hatimKey}`);
    }
  }, [first.subKey]);

  useEffect (() => {
    if (first.baslik) rememberTitle (hatimKey, first.baslik);
  }, [first.baslik]);

  // İlk açılışta dolmamış ilk hatim açık gelir
  useEffect (() => {
    if (khatms.length === 0) return;
    setOpen (current => {
      if (Object.keys (current).length > 0) {
        const next = {...current};
        khatms.forEach (k => { if (next[k.subKey] === undefined) next[k.subKey] = true; });
        return next;
      }
      const firstOpen = khatms.find (k => cevaplar (k).some (c => !c.alindi)) || khatms[khatms.length - 1];
      return Object.fromEntries (khatms.map (k => [k.subKey, k.subKey === firstOpen.subKey]));
    });
  }, [khatms.length]);

  if (status !== 'ready') return <QuestionContainer><KhatmStatus status={status} retry={retry} /></QuestionContainer>;

  const isMine = (subKey, no) => {
    // İlk çizimde yerel kayıt henüz bu sayfanın biçiminde okunmamış olabilir (api 1: dizi, api 2: nesne)
    const list = api === 1
      ? (Array.isArray (localParts) ? localParts : [])
      : (localParts && !Array.isArray (localParts) && Array.isArray (localParts[subKey]) ? localParts[subKey] : []);
    if (list.some (item => String (item) === String (no))) return true;
    return variant === 'ucaylarhergun1cuz' && partsProcessor.partExists ({key: hatimKey, subKey, partId: no});
  };

  // Bugünkü okuması çizelgede işaretlenmiş cüzler "okundu" görünür
  const todayIndex = (() => {
    if (!config.chart) return null;
    const days = config.chart === 'ramazan' ? ramazanSchedule (1) : months3Schedule (1);
    const today = days.find (day => day.isToday);
    return today ? today.index : null;
  }) ();
  // Çok eski (api 1) hatimlerde çizelge hatim/<key>/<key>/charts altında
  const chartsOfKhatm = khatm => khatm.charts || (khatm[khatm.subKey] && khatm[khatm.subKey].charts);
  const chartsOf = subKey => {
    const khatm = khatms.find (k => k.subKey === subKey);
    return khatm ? chartsOfKhatm (khatm) : undefined;
  };
  const readToday = (khatm, no) => {
    const charts = chartsOfKhatm (khatm);
    return todayIndex != null && charts != null && charts[no] != null && charts[no][todayIndex] === true;
  };
  const isTakenPart = (subKey, no) => {
    const khatm = khatms.find (k => k.subKey === subKey);
    return !!(khatm && cevaplar (khatm).some (c => String (c.cevap) === String (no) && c.alindi));
  };

  const all = khatms.flatMap (cevaplar);
  const takenCount = all.filter (c => c.alindi).length;
  const myParts = khatms.flatMap ((k, index) =>
    cevaplar (k).filter (c => c.alindi && isMine (k.subKey, c.cevap))
      .map (c => ({
        label: khatms.length > 1 ? `${fmt (Language.Kit.KhatmNo, {n: index + 1})} · ${c.cevap}. cüz` : `${c.cevap}. cüz`,
        // Çizelgeli sayfalarda dokununca doğrudan okuma çizelgesi açılır
        onClick: config.chart ? () => setChart ({subKey: k.subKey, no: c.cevap}) : undefined,
      })));

  /* ---------- Cihazdaki kayıtlar (eski sayfalarla uyumlu) ---------- */

  const saveLocalTake = (subKey, no) => {
    if (api === 1) {
      const list = readLocalParts (1);
      list.push (no);
      safeWriteV1 (list);
    } else {
      const obj = readLocalParts (2);
      obj[subKey] = [...(obj[subKey] || []), no];
      safeWriteV2 (obj);
    }
    if (variant === 'ucaylarhergun1cuz') partsProcessor.takePart ({key: hatimKey, subKey, partId: no});
    rememberPart ({key: hatimKey, type: config.type, route: `/${config.route}/${hatimKey}`, title: first.baslik,
                   subKey, no, label: `${no}. cüz`, plan: variant === 'ucaylarhergun1cuz' ? 'eachday1part' : undefined});
    setLocalParts (readLocalParts (api));
  };

  const saveLocalRelease = (subKey, no) => {
    if (api === 1) {
      safeWriteV1 (removeAll_v1 (readLocalParts (1), no));
    } else {
      const obj = readLocalParts (2);
      obj[subKey] = obj[subKey] || [];
      safeWriteV2 (removeAll (obj, no, subKey));
    }
    if (variant === 'ucaylarhergun1cuz') partsProcessor.cancelPart ({key: hatimKey, subKey, partId: no});
    forgetPart ({key: hatimKey, subKey, no});
    setLocalParts (readLocalParts (api));
  };

  /* ---------- Cüz alma / bırakma ---------- */

  const take = async name => {
    setBusy (true);
    const {subKey, no} = part;
    const result = await db.cuzAl (name, no, subKey, true, data.makeNewHatim || false);
    setBusy (false);
    if (!result || result.code == -1) {
      showNotification ({color: 'red', message: takeFailMessage (result && result.status)});
      return;
    }
    saveLocalTake (subKey, no);
    setPart (null);
    setJustTaken ({title: takenTitle (`${no}. cüz`), read: juzRange (no),
               text: config.chart ? Language.Kit.TakenChartHint : undefined});
  };

  const rename = async name => {
    setBusy (true);
    const result = await db.cuzIsimDegistir (name, part.no, part.subKey);
    setBusy (false);
    if (!result || result.code == -1) {
      showNotification ({color: 'red', message: failMessage (result && result.status, Language.Kit.ChartSaveFailed)});
      return;
    }
    // Sunucu secret'ı doğruladı: cüz bu cihazındı, yerel kayıt geri gelir
    if (part.mode === 'other') saveLocalTake (part.subKey, part.no);
    setPart (null);
  };

  const release = async () => {
    setBusy (true);
    const {subKey, no, mode} = part;
    const result = await db.cuzIptal (no, subKey);
    setBusy (false);
    // İptal sunucuda başarısızsa cihazdaki kayıt silinmez
    if (!result || result.code == -1) {
      showNotification ({color: 'red', message: failMessage (result && result.status, Language.Kit.ReleaseFailed)});
      return;
    }
    saveLocalRelease (subKey, no);
    setPart (null);
    showNotification ({message: Language.Kit.Released});
  };

  const openPart = (subKey, c) => {
    const mine = c.alindi && isMine (subKey, c.cevap);
    // Cihazda bu hatim için secret varsa cüz bu cihazdan alınmış olabilir: sunucu karar verir
    const claimable = c.alindi && !mine && !isAdmin && hasSecret ({hatimKey, subKey, legacy: true});
    if (c.alindi && !mine && !isAdmin && !claimable) {
      if (config.chart) setChart ({subKey, no: c.cevap});
      else setReact ({subKey, no: c.cevap, badge: c.cevap, label: `${c.cevap}. cüz`, holder: c.isim});
      return;
    }
    setPart ({subKey, no: c.cevap, name: c.isim, mode: !c.alindi ? 'take' : mine ? 'mine' : claimable ? 'other' : 'admin'});
  };

  /* ---------- Yönetici işlemleri ---------- */

  const deleteKhatm = async () => {
    setBusy (true);
    const result = await db.deleteHatim ();
    setBusy (false);
    if (result === -1) {
      showNotification ({color: 'red', message: Language.Kit.DeleteFailed});
      return;
    }
    try {
      const keys = JSON.parse (localStorage.getItem ('CuzKeyler')) || [];
      const titles = JSON.parse (localStorage.getItem ('CuzKeylerBaslik')) || [];
      const index = keys.indexOf (hatimKey);
      if (index !== -1) {
        keys.splice (index, 1);
        titles.splice (index, 1);
        localStorage.setItem ('CuzKeyler', JSON.stringify (keys));
        localStorage.setItem ('CuzKeylerBaslik', JSON.stringify (titles));
      }
    } catch (error) {}
    hideKhatm (hatimKey);
    setConfirm (null);
    showNotification ({message: Language.Kit.Deleted});
    history.push ('/');
  };

  const addKhatm = async () => {
    setBusy (true);
    try {
      // Eskiden hatimCount gönderilmediği için hiç hatim eklenmiyordu
      await db.yeniHatim (first.baslik || '', first.bitisTarihi || '', true, first.isRamazan || false,
                          first.description || '', false, 1, first.isMonths3 || null);
      setConfirm (null);
      showNotification ({color: 'teal', message: Language.Kit.NewKhatmAdded});
    } catch (error) {
      showNotification ({color: 'red', message: Language.Kit.NewKhatmFailed});
    }
    setBusy (false);
  };

  const stopAuto = async () => {
    const response = await db.stopMakingNewKhatm ();
    if (response != 200) showNotification ({color: 'red', message: Language.Kit.ChartSaveFailed});
  };

  const saveEdit = async ({header, description, date}) => {
    const result = await db.hatimDegistir (header, date, description, first.subKey);
    if (result === -1) {
      showNotification ({color: 'red', message: Language.Kit.ChartSaveFailed});
      return false;
    }
    return true;
  };

  /* ---------- Çizelge ---------- */

  const chartDays = chart ? (config.chart === 'ramazan' ? ramazanSchedule (chart.no) : months3Schedule (chart.no)) : [];
  // Çok eski (api 1) hatimlerde alt anahtar yok; çizelge sadece bu cihazda tutulur
  const store = !chart ? null : api === 1
    ? {
        load: async () => getTicks (hatimKey, chart.no),
        save: async (day, value) => {
          const current = getTicks (hatimKey, chart.no).filter (d => d !== day);
          setTicks (hatimKey, chart.no, value ? [...current, day] : current);
          return true;
        },
      }
    : chartStore ({hatimKey, subKey: chart.subKey, partNo: chart.no});

  return (
    <QuestionContainer>
      <CardWrapper>
        <KhatmCard title={first.baslik} description={first.description}
                   taken={takenCount} total={all.length} duaDate={first.bitisTarihi}
                   myParts={myParts} isAdmin={isAdmin}
                   onDelete={() => setConfirm ('delete')} onEdit={() => setEditing (true)} />
      </CardWrapper>

      <GridToolbar>
        <Legend>
          <LegendItem kind="free">{Language.CuzGrid.Available}</LegendItem>
          <LegendItem kind="taken">{Language.CuzGrid.Taken}</LegendItem>
          {config.chart && <LegendItem kind="read">{Language.Kit.ReadToday}</LegendItem>}
        </Legend>
      </GridToolbar>
      <GridHint>{config.question ()}</GridHint>

      {khatms.map ((khatm, index) => {
        const visible = khatms.length === 1 || open[khatm.subKey];
        const items = cevaplar (khatm);
        const taken = items.filter (c => c.alindi).length;
        return (
          <React.Fragment key={khatm.subKey}>
            {khatms.length > 1 &&
              <KhatmBar>
                <div>
                  {fmt (Language.Kit.KhatmNo, {n: index + 1})}
                  <small>{taken} / {items.length} {Language.CuzGrid.Taken.toLocaleLowerCase ()}</small>
                </div>
                <KhatmBarButton type="button" onClick={() => setOpen ({...open, [khatm.subKey]: !visible})}>
                  {visible ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  {visible ? Language.Kit.Hide : Language.Kit.Show}
                </KhatmBarButton>
              </KhatmBar>}

            {visible &&
              <RespondOuterContainer>
                <RespondInnerContainer>
                  {items.map (c => {
                    const mine = c.alindi && isMine (khatm.subKey, c.cevap);
                    const read = c.alindi && readToday (khatm, c.cevap);
                    return (
                      <ResponseItemContainer key={c.cevap} taken={c.alindi} read={read} mine={mine}>
                        <ResponseItem bgColor={c.alindi} data-sub={khatm.subKey} data-part={c.cevap} onClick={() => openPart (khatm.subKey, c)}>
                          {mine && <MineBadge>{Language.CuzGrid.Mine}</MineBadge>}
                          <ResponseText>{c.cevap}</ResponseText>
                          <ResponseName taken={c.alindi}>{c.alindi ? c.isim || '—' : Language.CuzGrid.Available}</ResponseName>
                          {c.alindi && <ReactionChips charts={chartsOfKhatm (khatm)} no={c.cevap} />}
                        </ResponseItem>
                        {config.chart &&
                          <ChartStrip type="button" taken={c.alindi} read={read} onClick={() => setChart ({subKey: khatm.subKey, no: c.cevap})}>
                            {read ? <Check size={15} strokeWidth={3} /> : <CalendarEvent size={15} />}
                            {read ? Language.Kit.ReadToday : Language.MyKhatms.Chart}
                          </ChartStrip>}
                      </ResponseItemContainer>
                    );
                  })}
                </RespondInnerContainer>
              </RespondOuterContainer>}
          </React.Fragment>
        );
      })}

      {isAdmin && !data.makeNewHatim && api === 2 &&
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
                   {config.chart &&
                     <ChartStrip type="button" taken={false} style={{borderRadius: 14, minHeight: 48, border: 0}}
                                 onClick={() => { setChart ({subKey: part.subKey, no: part.no}); setPart (null); }}>
                       <CalendarEvent size={18} /> {Language.MyKhatms.Chart}
                     </ChartStrip>}
                 </>} />

      <ReactSheet target={react} onClose={() => setReact (null)} hatimKey={hatimKey} charts={react ? chartsOf (react.subKey) : undefined} />

      {config.chart &&
        <ChartSheet visible={chart != null} onClose={() => setChart (null)}
                    title={chart ? `${chart.no}. cüz · ${config.chart === 'ramazan' ? Language.Kit.RamazanChart : Language.Kit.ChartTitle}` : ''}
                    subtitle={first.baslik}
                    hint={config.chart === 'ramazan' ? Language.Kit.RamazanHint : Language.Kit.Months3Hint}
                    days={chartDays}
                    canEdit={chart ? isMine (chart.subKey, chart.no) : false}
                    reactions={chart && isTakenPart (chart.subKey, chart.no) &&
                      <ReactionPicker hatimKey={hatimKey} subKey={chart.subKey} no={chart.no} charts={chartsOf (chart.subKey)} />}
                    load={() => store.load ()} save={(day, value) => store.save (day, value)} />}

      <ConfirmSheet visible={confirm === 'delete'} danger icon="delete" busy={busy}
                    title={Language['/cuz'].DeleteKhatmAlert.Question} confirmLabel={Language.Kit.YesDelete}
                    onConfirm={deleteKhatm} onCancel={() => setConfirm (null)} />

      <ConfirmSheet visible={confirm === 'add'} icon="add" busy={busy}
                    title={Language.Kit.NewKhatmConfirm}
                    onConfirm={addKhatm} onCancel={() => setConfirm (null)} />

      <EditSheet visible={editing} onClose={() => setEditing (false)} withDate
                 initial={{header: first.baslik, description: first.description, date: first.bitisTarihi}}
                 onSave={saveEdit} />

      <ReadQuranBanner />
      <TakenSheet taken={justTaken} onClose={() => setJustTaken (null)} />

      <ShareActions title={first.baslik} />
    </QuestionContainer>
  );
};

export default LegacyKhatmPage;
