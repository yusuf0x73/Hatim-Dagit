//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React, {useEffect, useState} from 'react';
import {RefreshCircle} from '@styled-icons/ionicons-outline';
import {db} from 'backend';
import Language from 'strings';
import {
  SkeletonPage, SkeletonCard, SkeletonGrid, SkeletonTile, LoadingContainer, LoadingItem, RetryButton,
} from 'components/cuz/Cuzler/QuestionElements';

const LOAD_TIMEOUT = 10000;

/**
 * Hatmi canlı dinler: biri cüz aldığında / çizelgeyi işaretlediğinde sayfa kendiliğinden güncellenir.
 * status: loading | ready | error | deleted | missing | badLink
 * 10 saniyede veri gelmezse "error" olur ama dinleme sürer; internet gelince sayfa kendiliğinden dolar.
 */
export const useLiveKhatm = hatimKey => {
  const [state, setState] = useState ({status: 'loading', data: null});
  const [attempt, setAttempt] = useState (0);

  useEffect (() => {
    if (!hatimKey || hatimKey.length < 20) {
      setState ({status: 'badLink', data: null});
      return;
    }

    let received = false;
    const timer = setTimeout (() => {
      if (!received) setState ({status: 'error', data: null});
    }, navigator.onLine === false ? 0 : LOAD_TIMEOUT);

    const stop = db.listenHatim (
      hatimKey,
      data => {
        received = true;
        clearTimeout (timer);
        if (data == null) setState ({status: 'missing', data: null});
        else if (data.delete != undefined) setState ({status: 'deleted', data: null});
        else setState ({status: 'ready', data});
      },
      () => {
        clearTimeout (timer);
        setState ({status: 'error', data: null});
      }
    );

    return () => {
      clearTimeout (timer);
      stop ();
    };
  }, [hatimKey, attempt]);

  const retry = () => {
    setState ({status: 'loading', data: null});
    setAttempt (value => value + 1);
  };

  // İnternet geri gelince kendiliğinden tekrar dene
  useEffect (() => {
    if (state.status !== 'error') return;
    window.addEventListener ('online', retry);
    return () => window.removeEventListener ('online', retry);
  }, [state.status]);

  return {...state, retry};
};

const messages = () => ({
  loading: Language['/cuz'].Before.Wait,
  error: Language.CuzGrid.LoadError,
  deleted: Language['/cuz'].Before.Deleted,
  missing: Language['/cuz'].Before.WrongLength,
  badLink: Language['/cuz'].Before.WrongLength,
});

/** Veri gelene kadar sayfanın iskeleti ve üstünde yarı saydam bilgi kutusu */
export const KhatmStatus = ({status, retry, tiles = 30}) => (
  <>
    <SkeletonPage aria-hidden="true">
      <SkeletonCard />
      <SkeletonGrid>
        {Array.from ({length: tiles}, (_, i) => <SkeletonTile key={i} />)}
      </SkeletonGrid>
    </SkeletonPage>
    <LoadingContainer visibility={true} spinner={status === 'loading'}>
      <LoadingItem>{messages ()[status]}</LoadingItem>
      {status === 'error' &&
        <RetryButton onClick={retry}>
          <RefreshCircle height="20px" width="20px" />
          {Language.CuzGrid.Retry}
        </RetryButton>}
    </LoadingContainer>
  </>
);
