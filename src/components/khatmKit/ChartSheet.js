//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React, {useEffect, useRef, useState} from 'react';
import {Check as CheckIcon, Lock} from 'tabler-icons-react';
import {showNotification} from '@mantine/notifications';
import Language from 'strings';
import Sheet, {fmt} from './Sheet';
import {
  SheetTitle, SheetText, ChartHead, ChartMeta, LiveChip, ProgressTrack, GroupTitle,
  DayButton, Check, DayText, TodayChip, InlineNote,
} from './styles';

/**
 * Gün gün okuma çizelgesi. İşaretler veritabanında tutulur, hatimdeki herkes görür;
 * sadece parçayı alan kişi (canEdit) işaretleyebilir.
 *
 * days: [{index, group, label, title, subtitle, isToday}]
 * load(): okunan günlerin index listesi
 * save(index, value): başarılıysa true
 */
const ChartSheet = ({visible, onClose, title, subtitle, hint, days, load, save, canEdit, onChange, reactions}) => {
  const [done, setDone] = useState ([]);
  const [loading, setLoading] = useState (false);
  const todayRef = useRef (null);

  useEffect (() => {
    if (!visible) return;
    let active = true;
    setLoading (true);
    setDone ([]);
    Promise.resolve (load ())
      .then (result => active && setDone (result || []))
      .catch (() => {})
      .finally (() => {
        if (!active) return;
        setLoading (false);
        // Açılınca bugünün satırına kaydır
        setTimeout (() => todayRef.current && todayRef.current.scrollIntoView ({block: 'center'}), 60);
      });
    return () => { active = false; };
  }, [visible]);

  const toggle = async day => {
    if (!canEdit || loading) return;
    const value = !done.includes (day.index);
    const next = value ? [...done, day.index] : done.filter (index => index !== day.index);
    setDone (next);
    const ok = await save (day.index, value);
    if (!ok) {
      setDone (current => (value ? current.filter (index => index !== day.index) : [...current, day.index]));
      showNotification ({color: 'red', message: Language.Kit.ChartSaveFailed});
      return;
    }
    onChange && onChange (next);
  };

  const total = days.length;
  const count = done.filter (index => index < total).length;

  const header = (
    <ChartHead>
      <SheetTitle>{title}</SheetTitle>
      {subtitle && <SheetText>{subtitle}</SheetText>}
      <ChartMeta>
        <span>{loading ? Language.Kit.ChartLoading : fmt (Language.Kit.ChartRead, {done: count, total})}</span>
        <LiveChip>{Language.Kit.Live}</LiveChip>
      </ChartMeta>
      <ProgressTrack><span style={{width: `${total ? (count / total) * 100 : 0}%`}} /></ProgressTrack>
    </ChartHead>
  );

  let lastGroup = null;

  return (
    <Sheet visible={visible} onClose={onClose} wide header={header}>
      {hint && <SheetText style={{marginTop: 0, marginBottom: 8}}>{hint}</SheetText>}
      {/* Cüz kartına bırakılan tebrikler (seçici) */}
      {reactions}
      {!canEdit && <InlineNote style={{marginTop: 0, marginBottom: 8}}><Lock size={14} /> {Language.Kit.ChartOwnerOnly}</InlineNote>}

      {days.map (day => {
        const isDone = done.includes (day.index);
        const groupTitle = day.group !== lastGroup ? day.group : null;
        lastGroup = day.group;
        return (
          <React.Fragment key={day.index}>
            {groupTitle && <GroupTitle>{groupTitle}</GroupTitle>}
            <DayButton type="button" today={day.isToday} done={isDone} locked={!canEdit}
                       ref={day.isToday ? todayRef : undefined}
                       aria-pressed={isDone} onClick={() => toggle (day)}>
              <Check done={isDone}>{isDone && <CheckIcon size={18} strokeWidth={3} />}</Check>
              <DayText>
                <small>{day.label}</small>
                <strong>{day.title}</strong>
                {day.subtitle && <small>{day.subtitle}</small>}
              </DayText>
              {day.isToday && <TodayChip>{Language.Kit.Today}</TodayChip>}
            </DayButton>
          </React.Fragment>
        );
      })}

      <SheetText style={{fontSize: '0.85rem'}}>{Language.Kit.ChartLive}</SheetText>
    </Sheet>
  );
};

export default ChartSheet;
