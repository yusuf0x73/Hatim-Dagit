//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Language from 'strings';
import {db} from 'backend';
import Sheet, {fmt} from './Sheet';
import {SheetTitle, SheetText, PartBadge} from './styles';

/*
  Cüz kartlarına bırakılan tebrikler. Yalnızca bu güzel emojiler seçilebilir.
  Gül ve kalp bilinçli olarak yok: karışık gruplarda yanlış anlaşılmasın (eski kayıtları da gösterilmez).
  hatim/<key>/<subKey>/charts/reactions/<parça>/<emoji>/<cihaz> = true
  Her cihaz kendi anahtarına yazar: sayaç olmadığı için aynı anda basanlar birbirini ezmez.
*/
export const REACTIONS = [
  {id: 'dua', emoji: '🤲'},
  {id: 'alkis', emoji: '👏'},
  {id: 'masallah', emoji: '🌟'},
  {id: 'tebrik', emoji: '🎉'},
];

const DEVICE = 'hd.deviceId';

export const deviceId = () => {
  try {
    let id = localStorage.getItem (DEVICE);
    if (!id) {
      id = `d${Date.now ().toString (36)}${Math.random ().toString (36).slice (2, 10)}`;
      localStorage.setItem (DEVICE, id);
    }
    return id;
  } catch (error) {
    return 'anon';
  }
};

// charts: alt hatmin "charts" düğümü (canlı veriden)
export const reactionsOf = (charts, no) => {
  const forPart = (charts && charts.reactions && charts.reactions[no]) || {};
  const me = deviceId ();
  return REACTIONS.map (r => {
    const devices = forPart[r.id] && typeof forPart[r.id] === 'object' ? forPart[r.id] : {};
    const ids = Object.keys (devices).filter (id => devices[id] === true);
    return {...r, count: ids.length, mine: ids.includes (me)};
  });
};

const Chips = styled.span`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2px 6px;
  font-size: 0.72rem;
  font-weight: 800;
  line-height: 1.2;
  color: var(--ink-soft);
`;

// Kartın altında küçük özet: "🤲3 🌹1"
export const ReactionChips = ({charts, no}) => {
  const list = reactionsOf (charts, no).filter (r => r.count > 0);
  if (list.length === 0) return null;
  return (
    <Chips aria-label={Language.Kit.ReactTitle} data-reactions={no}>
      {list.map (r => <span key={r.id}>{r.emoji}{r.count > 1 ? r.count : ''}</span>)}
    </Chips>
  );
};

const Wrap = styled.div`
  margin: 14px 0 4px;
  padding: 12px;
  border-radius: 18px;
  background: var(--gold-100);
  border: 1px solid var(--gold-200);

  p {
    margin: 0 0 8px;
    font-size: 0.85rem;
    font-weight: 800;
    color: var(--gold-600);
    text-align: center;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(${REACTIONS.length}, 1fr);
  gap: 6px;
`;

const Pick = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-height: 52px;
  padding: 6px 0;
  border-radius: 14px;
  border: 2px solid ${({active}) => (active ? 'var(--gold-500)' : 'transparent')};
  background: ${({active}) => (active ? '#fff' : 'rgba(255, 255, 255, 0.55)')};
  cursor: pointer;
  transition: transform 0.12s ease;

  span:first-child {
    font-size: 1.45rem;
    line-height: 1;
  }

  span:last-child {
    min-height: 1em;
    font-size: 0.72rem;
    font-weight: 800;
    color: var(--ink-soft);
  }

  &:active {
    transform: scale(0.9);
  }
`;

/**
 * Tebrik seçici: bir kez basınca eklenir, tekrar basınca geri alınır.
 * Hemen ekranda görünür; kayıt başarısız olursa geri döner.
 */
export const ReactionPicker = ({hatimKey, subKey, no, charts}) => {
  const [list, setList] = useState (() => reactionsOf (charts, no));

  useEffect (() => {
    setList (reactionsOf (charts, no));
  }, [charts, no]);

  const toggle = async id => {
    const current = list.find (r => r.id === id);
    const on = !current.mine;
    const apply = value => setList (items => items.map (r => (r.id === id ? {...r, mine: value, count: r.count + (value ? 1 : -1)} : r)));
    apply (on);
    const result = await db.setReaction ({hatimKey, subKey, partNo: no, reactionId: id, deviceId: deviceId (), value: on});
    if (result.error) apply (!on);
  };

  return (
    <Wrap>
      <p>{Language.Kit.ReactTitle}</p>
      <Row>
        {list.map (r => (
          <Pick key={r.id} type="button" active={r.mine} aria-pressed={r.mine} data-reaction={r.id} onClick={() => toggle (r.id)}>
            <span>{r.emoji}</span>
            <span>{r.count > 0 ? r.count : ''}</span>
          </Pick>
        ))}
      </Row>
    </Wrap>
  );
};

/**
 * Başkasının kartına dokununca: kimin aldığı ve tebrik seçici (çizelgesi olmayan sayfalar için).
 */
export const ReactSheet = ({target, onClose, hatimKey, charts, extra}) => (
  <Sheet visible={target != null} onClose={onClose}>
    {target && <>
      <PartBadge long={String (target.badge).length > 3}>{target.badge}</PartBadge>
      <SheetTitle>{target.label}</SheetTitle>
      {target.holder && <SheetText>{fmt (Language.Kit.TakenBy, {name: target.holder})}</SheetText>}
      <ReactionPicker hatimKey={hatimKey} subKey={target.subKey} no={target.no} charts={charts} />
      {extra}
    </>}
  </Sheet>
);
