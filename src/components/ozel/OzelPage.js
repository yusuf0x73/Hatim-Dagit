//                                     BİSMİLLAHİRRAHMANİRRAHİM

/*
  Programlanabilir hatim sayfası: cüz, yarım cüz, hizb, sayfa, sûre, sayfa grubu
  ya da Yâsîn / Fetih gibi sûre okumaları. Birden fazla hatim olabilir.
*/

import React, {useMemo, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {HandClick, Plus, ChevronDown, ChevronUp, Check} from 'tabler-icons-react';
import {showNotification} from '@mantine/notifications';
import LocDb from '@yusuf-yeniceri/easy-storage';
import {db} from 'backend';
import Language from 'strings';
import {extractKey} from 'common';
import {unitOf} from 'plans/units';
import {listKhatms, rememberPart, forgetPart, rememberTitle, hideKhatm} from 'localStorage/myKhatms';
import {
  ShareActions, PartSheet, ReactionChips, ReactionPicker, ReactSheet, hasSecret, failMessage, takeFailMessage, ConfirmSheet, EditSheet, KhatmCard, fmt, chartStore,
  KhatmBar, KhatmBarButton, AddKhatmButton, useLiveKhatm, KhatmStatus,
  ReadQuranBanner, TakenSheet, takenTitle,
} from 'components/khatmKit';
import {SecondaryButton} from 'components/khatmKit/styles';
import {
  Page, Wrap, SectionTitle, Toolbar, SearchInput, FilterRow, FilterChip, LuckyButton,
  GroupList, Group, GroupHead, GroupNo, GroupInfo, GroupTitle, MiniBar, TileGrid, Tile, Row, RowStatus, ListCard, Empty,
} from 'components/ucaylar/styles';

const ROOT_FIELDS = ['type', 'version', 'adminToken', 'header', 'description', 'startingDate', 'duaDate', 'unit', 'makeNewHatim', 'delete'];

// Okundu işareti: çizelgenin 0. günü (hatim/<key>/<subKey>/charts/<no>/0)
const READ_DAY = 0;

const normalize = text =>
  String (text).toLocaleLowerCase ('tr-TR').normalize ('NFD').replace (/[̀-ͯ']/g, '').replace (/ı/g, 'i');

const subKhatms = data =>
  Object.keys (data)
    .filter (key => !ROOT_FIELDS.includes (key) && data[key] && typeof data[key] === 'object' && data[key].parts)
    .map (key => {
      const parts = {};
      Object.entries (data[key].parts).forEach (([no, part]) => { if (part) parts[no] = part; });
      return {subKey: key, parts, charts: data[key].charts || {}};
    });

const OzelPage = () => {
  const hatimKey = extractKey ().replace ('/', '');
  const history = useHistory ();
  const live = useLiveKhatm (hatimKey);
  const data = live.data;

  const [open, setOpen] = useState ({});
  const [openGroups, setOpenGroups] = useState ([]);
  const [filter, setFilter] = useState ('all');
  const [query, setQuery] = useState ('');
  const [part, setPart] = useState (null); // {subKey, no, name, mode}
  const [justTaken, setJustTaken] = useState (null); // az önce alınan parça: {title, read}
  const [react, setReact] = useState (null); // başkasının parçası: tebrik penceresi
  const [busy, setBusy] = useState (false);
  const [confirm, setConfirm] = useState (null);
  const [editing, setEditing] = useState (false);
  const [version, setVersion] = useState (0);

  const unit = useMemo (() => unitOf (data && data.unit), [data && JSON.stringify (data.unit)]);
  const khatms = useMemo (() => (data ? subKhatms (data) : []), [data]);
  const mine = useMemo (() => {
    const entry = listKhatms ().find (e => e.key === hatimKey);
    return new Set ((entry ? entry.parts : []).map (p => `${p.subKey}/${p.no}`));
  }, [version, data]);

  if (live.status !== 'ready') return <Page><KhatmStatus status={live.status} retry={live.retry} /></Page>;

  if (data.header) rememberTitle (hatimKey, data.header);

  const isAdmin = (() => {
    const token = LocDb.ref (`Hatim/${hatimKey}/adminToken`).get ();
    return typeof token === 'string' && token.length > 0;
  }) ();

  const isMine = (subKey, no) => mine.has (`${subKey}/${no}`);
  const isRead = (khatm, no) => khatm.charts[no] != null && khatm.charts[no][READ_DAY] === true;
  const total = khatms.length * unit.slots;
  const taken = khatms.reduce ((sum, k) => sum + Object.values (k.parts).filter (p => p.isTaken).length, 0);
  const myParts = khatms.flatMap ((k, index) =>
    Object.keys (k.parts).filter (no => isMine (k.subKey, no))
      .map (no => ({
        label: khatms.length > 1 ? `${fmt (Language.Kit.KhatmNo, {n: index + 1})} · ${unit.label (no)}` : unit.label (no),
        // Özel hatimde çizelge yok: dokununca "okudum" işaretlenebilen parça penceresi açılır
        onClick: () => setPart ({subKey: k.subKey, no, name: (k.parts[no] || {}).name, mode: 'mine'}),
      })));

  /* ---------- Parça alma / bırakma / okundu ---------- */

  const take = async name => {
    setBusy (true);
    const {subKey, no} = part;
    const result = await db.cuzAlV3 (name, no, subKey, true, false);
    setBusy (false);
    if (!result || result.data != 200) {
      showNotification ({color: 'red', message: takeFailMessage (result && result.code)});
      return;
    }
    rememberPart ({key: hatimKey, type: 'ozel', route: `/ozel/${hatimKey}`, title: data.header, subKey, no, label: unit.label (no)});
    setVersion (v => v + 1);
    setPart (null);
    setJustTaken ({title: takenTitle (unit.label (no)), read: unit.range ? unit.range (no) : undefined});
  };

  const rename = async name => {
    setBusy (true);
    const result = await db.cuzIsimDegistirV3 (name, part.no, part.subKey);
    setBusy (false);
    if (!result || result.data != 200) {
      showNotification ({color: 'red', message: failMessage (result && result.code, Language.Kit.ChartSaveFailed)});
      return;
    }
    if (part.mode === 'other') {
      // Secret tuttu: parça bu cihazındı, "Benimkiler"e geri gelir
      rememberPart ({key: hatimKey, type: 'ozel', route: `/ozel/${hatimKey}`, title: data.header,
                     subKey: part.subKey, no: part.no, label: unit.label (part.no)});
      setVersion (v => v + 1);
    }
    setPart (null);
  };

  const release = async () => {
    setBusy (true);
    const {subKey, no} = part;
    const result = await db.cuzIptalV3 (no, subKey);
    setBusy (false);
    if (!result || result.data != 200) {
      showNotification ({color: 'red', message: failMessage (result && result.code, Language.Kit.ReleaseFailed)});
      return;
    }
    forgetPart ({key: hatimKey, subKey, no});
    setVersion (v => v + 1);
    setPart (null);
    showNotification ({message: Language.Kit.Released});
  };

  const toggleRead = async () => {
    const {subKey, no} = part;
    const khatm = khatms.find (k => k.subKey === subKey);
    setBusy (true);
    const ok = await chartStore ({hatimKey, subKey, partNo: no}).save (READ_DAY, !isRead (khatm, no));
    setBusy (false);
    if (!ok) showNotification ({color: 'red', message: Language.Kit.ChartSaveFailed});
    setPart (null);
  };

  const openPart = (khatm, no) => {
    const p = khatm.parts[no] || {};
    if (p.isTaken && !isMine (khatm.subKey, no)) {
      // Hatmi oluşturan herkesin parçasında isim değiştirip bırakabilir
      if (isAdmin) {
        setPart ({subKey: khatm.subKey, no, name: p.name, mode: 'admin'});
        return;
      }
      // Cihazda bu hatim için secret varsa parça bu cihazdan alınmış olabilir: sunucu karar verir
      if (hasSecret ({hatimKey, subKey: khatm.subKey})) setPart ({subKey: khatm.subKey, no, name: p.name, mode: 'other'});
      // Başkasının parçası: kimin aldığı ve tebrik
      else setReact ({subKey: khatm.subKey, no, badge: unit.tile (no), label: unit.label (no), holder: p.name});
      return;
    }
    setPart ({subKey: khatm.subKey, no, name: p.name, mode: p.isTaken ? 'mine' : 'take'});
  };

  // Sıradaki (ilk) boş parça: önce açık hatimlerde aranır
  const pickNextFree = () => {
    for (const khatm of khatms) {
      for (let no = 1; no <= unit.slots; no++) {
        if (khatm.parts[no] && !khatm.parts[no].isTaken) {
          setOpen (current => ({...current, [khatm.subKey]: true}));
          setPart ({subKey: khatm.subKey, no: String (no), name: '', mode: 'take'});
          return;
        }
      }
    }
  };

  /* ---------- Yönetici ---------- */

  const deleteKhatm = async () => {
    setBusy (true);
    const result = await db.deleteHatimV3 ();
    setBusy (false);
    if (result === -1) {
      showNotification ({color: 'red', message: Language.Kit.DeleteFailed});
      return;
    }
    LocDb.ref ('Hatim/').modify (local => { delete local[hatimKey]; return local; });
    hideKhatm (hatimKey);
    setConfirm (null);
    showNotification ({message: Language.Kit.Deleted});
    history.push ('/');
  };

  const addKhatm = async () => {
    setBusy (true);
    const result = await db.yeniOzelAltHatim ({slots: unit.slots});
    setBusy (false);
    if (result.error != undefined) {
      showNotification ({color: 'red', message: Language.Kit.NewKhatmFailed});
      return;
    }
    setConfirm (null);
    showNotification ({color: 'teal', message: Language.Kit.NewKhatmAdded});
  };

  const saveEdit = async ({header, description, date}) => {
    const result = await db.ozelHatimDegistir ({header, description, duaDate: date || ''});
    if (result.error != undefined) {
      showNotification ({color: 'red', message: Language.Kit.ChartSaveFailed});
      return false;
    }
    return true;
  };

  /* ---------- Liste ---------- */

  const term = query.trim ();
  const termNumber = /^\d+$/.test (term) ? Number (term) : null;
  const matches = no => {
    if (!term) return true;
    if (unit.kind === 'surah') return termNumber != null ? Number (no) === termNumber : normalize (unit.tile (no)).includes (normalize (term));
    if (termNumber == null) return true;
    if (unit.group && unit.kind !== 'pages' && unit.kind !== 'page') return unit.group (no) === termNumber;
    // Sayfa ve sayfa grubunda: o sayfayı içeren parça
    return unit.label (no).match (/\d+/g).map (Number).some ((n, i, all) => (all.length === 1 ? n === termNumber : termNumber >= all[0] && termNumber <= all[1]));
  };
  const passes = (khatm, no) => {
    const p = khatm.parts[no] || {};
    if (filter === 'free' && p.isTaken) return false;
    if (filter === 'mine' && !isMine (khatm.subKey, no)) return false;
    return matches (no);
  };

  const renderTile = (khatm, no) => {
    const p = khatm.parts[no] || {};
    const own = isMine (khatm.subKey, no);
    return (
      <Tile key={no} type="button" taken={p.isTaken} mine={own} read={p.isTaken && isRead (khatm, no)}
            data-sub={khatm.subKey} data-part={no} onClick={() => openPart (khatm, no)}>
        <strong>{unit.tile (no)}</strong>
        <span>{p.isTaken ? p.name || '—' : Language.CuzGrid.Available}</span>
        {p.isTaken && <ReactionChips charts={khatm.charts} no={no} />}
      </Tile>
    );
  };

  const renderKhatm = khatm => {
    const numbers = Array.from ({length: unit.slots}, (_, i) => String (i + 1)).filter (no => passes (khatm, no));
    if (numbers.length === 0) return <Empty>{term ? 'Aramanıza uygun parça yok.' : 'Gösterilecek parça yok.'}</Empty>;

    if (unit.list) {
      return (
        <ListCard>
          {numbers.map (no => {
            const p = khatm.parts[no] || {};
            const own = isMine (khatm.subKey, no);
            return (
              <Row key={no} type="button" mine={own} data-sub={khatm.subKey} data-part={no} onClick={() => openPart (khatm, no)}>
                <GroupNo>{no}</GroupNo>
                <GroupInfo>
                  <strong>{unit.tile (no)}</strong>
                  <small style={{color: 'var(--muted)', fontWeight: 700}}>{unit.sub (no)}</small>
                </GroupInfo>
                <RowStatus taken={p.isTaken}>
                  {p.isTaken && isRead (khatm, no) && <Check size={12} strokeWidth={3} />} {p.isTaken ? p.name || Language.CuzGrid.Taken : Language.CuzGrid.Available}
                  {p.isTaken && <ReactionChips charts={khatm.charts} no={no} />}
                </RowStatus>
              </Row>
            );
          })}
        </ListCard>
      );
    }

    if (!unit.group) {
      return <TileGrid cols={4} wideCols={6} style={{padding: 0}}>{numbers.map (no => renderTile (khatm, no))}</TileGrid>;
    }

    // Sayfa tabanlı birimler cüzlere göre gruplanır; kalabalık gruplar dokununca açılır
    const groups = [];
    numbers.forEach (no => {
      const juz = unit.group (no);
      const last = groups[groups.length - 1];
      if (last && last.juz === juz) last.items.push (no);
      else groups.push ({juz, items: [no]});
    });
    const collapsible = unit.slots > 120;
    return (
      <GroupList>
        {groups.map (group => {
          const id = `${khatm.subKey}/${group.juz}`;
          const expanded = !collapsible || openGroups.includes (id) || filter !== 'all' || !!term;
          const free = group.items.filter (no => !(khatm.parts[no] || {}).isTaken).length;
          return (
            <Group key={group.juz} mine={group.items.some (no => isMine (khatm.subKey, no))}>
              <GroupHead type="button" static={!collapsible} onClick={() => collapsible && setOpenGroups (current =>
                current.includes (id) ? current.filter (g => g !== id) : [...current, id])}>
                <GroupNo>{group.juz}</GroupNo>
                <GroupInfo>
                  <GroupTitle>
                    <span>{group.juz}. cüz</span>
                    <small>{free} {Language.CuzGrid.Available.toLocaleLowerCase ()}</small>
                  </GroupTitle>
                  {collapsible && <MiniBar aria-hidden="true">
                    {group.items.map (no => <i key={no} className={isMine (khatm.subKey, no) ? 'mine' : (khatm.parts[no] || {}).isTaken ? 'taken' : ''} />)}
                  </MiniBar>}
                </GroupInfo>
              </GroupHead>
              {expanded && <TileGrid cols={4} wideCols={collapsible ? 7 : 4}>
                {group.items.map (no => renderTile (khatm, no))}
              </TileGrid>}
            </Group>
          );
        })}
      </GroupList>
    );
  };

  const selectedKhatm = part ? khatms.find (k => k.subKey === part.subKey) : null;
  const searchHint = unit.kind === 'surah' ? 'Sûre ara (ör. Yâsîn, 67)'
    : unit.kind === 'page' || unit.kind === 'pages' ? 'Sayfa numarası (1–604)'
    : unit.group ? 'Cüz numarası (1–30)' : null;

  return (
    <Page>
      <Wrap>
        <KhatmCard title={data.header || unit.noun} description={data.description}
                   taken={taken} total={total} duaDate={data.startingDate || data.duaDate}
                   badges={[`${khatms.length > 1 ? `${khatms.length} hatim × ` : ''}${unit.slots} ${unit.countNoun || unit.noun}`]}
                   myParts={myParts} isAdmin={isAdmin}
                   takenLabel={unit.kind === 'recite' ? 'Alınan okumalar' : unit.kind === 'juz' ? undefined : 'Alınan parçalar'}
                   leftLabel={left => `${left} ${unit.countNoun || unit.noun} kaldı`}
                   mineLabel={unit.kind === 'recite' ? 'Aldığınız okumalar' : 'Aldıklarınız'}
                   onDelete={() => setConfirm ('delete')} onEdit={() => setEditing (true)} />

        <SectionTitle>{unit.kind === 'recite' ? 'Almak istediğiniz okumaya dokunun' : 'Almak istediğiniz parçaya dokunun'}</SectionTitle>
        <Toolbar>
          {taken < total &&
            <LuckyButton type="button" id="nextFree" onClick={pickNextFree}>
              <HandClick size={22} /> Sıradakini bana verin
            </LuckyButton>}
          {searchHint &&
            <SearchInput value={query} placeholder={searchHint}
                         inputMode={unit.kind === 'surah' ? 'text' : 'numeric'}
                         onChange={event => setQuery (event.target.value)} />}
          <FilterRow>
            {[['all', 'Tümü'], ['free', 'Boş olanlar'], ['mine', 'Benimkiler']].map (([id, text]) => (
              <FilterChip key={id} type="button" active={filter === id} onClick={() => setFilter (id)}>{text}</FilterChip>
            ))}
          </FilterRow>
        </Toolbar>

        {khatms.map ((khatm, index) => {
          const visible = khatms.length === 1 || open[khatm.subKey] !== false;
          const count = Object.values (khatm.parts).filter (p => p.isTaken).length;
          return (
            <React.Fragment key={khatm.subKey}>
              {khatms.length > 1 &&
                <KhatmBar style={{marginLeft: 0, marginRight: 0, marginBottom: 12}}>
                  <div>
                    {fmt (Language.Kit.KhatmNo, {n: index + 1})}
                    <small>{count} / {unit.slots} {Language.CuzGrid.Taken.toLocaleLowerCase ()}</small>
                  </div>
                  <KhatmBarButton type="button" onClick={() => setOpen ({...open, [khatm.subKey]: !visible})}>
                    {visible ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    {visible ? Language.Kit.Hide : Language.Kit.Show}
                  </KhatmBarButton>
                </KhatmBar>}
              {visible && renderKhatm (khatm)}
            </React.Fragment>
          );
        })}

        {isAdmin &&
          <AddKhatmButton type="button" id="NewSubKhatm" style={{width: '100%'}} onClick={() => setConfirm ('add')}>
            <Plus size={22} />
            {Language.Kit.NewKhatm}
          </AddKhatmButton>}
      </Wrap>

      <PartSheet visible={part != null} onClose={() => setPart (null)} busy={busy}
                 mode={part ? part.mode : 'take'} holder={part ? part.name : ''}
                 badge={part ? unit.tile (part.no) : ''} label={part ? unit.label (part.no) : ''}
                 takeText={unit.kind === 'recite' ? 'Okumayı al' : undefined}
                 read={part && unit.range ? unit.range (part.no) : undefined}
                 onTake={take} onRename={rename} onRelease={release}
                 extra={part && <>
                   {part.mode !== 'take' && <ReactionPicker hatimKey={hatimKey} subKey={part.subKey} no={part.no}
                                                            charts={(khatms.find (k => k.subKey === part.subKey) || {}).charts} />}
                   {unit.sub (part.no) && <p style={{textAlign: 'center', color: 'var(--muted)', fontWeight: 700}}>{unit.sub (part.no)}</p>}
                   {part.mode === 'mine' && selectedKhatm &&
                     <SecondaryButton type="button" id="toggleRead" disabled={busy} onClick={toggleRead}>
                       <Check size={20} /> {isRead (selectedKhatm, part.no) ? `${Language.MyKhatms.ReadDone} · geri al` : Language.MyKhatms.Read}
                     </SecondaryButton>}
                 </>} />

      <ReactSheet target={react} onClose={() => setReact (null)} hatimKey={hatimKey}
                  charts={react ? (khatms.find (k => k.subKey === react.subKey) || {}).charts : undefined} />

      <ConfirmSheet visible={confirm === 'delete'} danger icon="delete" busy={busy}
                    title={Language['/cuz'].DeleteKhatmAlert.Question} confirmLabel={Language.Kit.YesDelete}
                    onConfirm={deleteKhatm} onCancel={() => setConfirm (null)} />

      <ConfirmSheet visible={confirm === 'add'} icon="add" busy={busy}
                    title={`Bu sayfaya yeni bir hatim (${unit.slots} ${unit.noun}) eklensin mi?`}
                    onConfirm={addKhatm} onCancel={() => setConfirm (null)} />

      <EditSheet visible={editing} onClose={() => setEditing (false)} withDate
                 initial={{header: data.header, description: data.description, date: data.startingDate || data.duaDate}} onSave={saveEdit} />

      <ReadQuranBanner />
      <TakenSheet taken={justTaken} onClose={() => setJustTaken (null)} />

      <ShareActions title={data.header} />
    </Page>
  );
};

export default OzelPage;
