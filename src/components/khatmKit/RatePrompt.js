//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React, {useEffect, useState} from 'react';
import styled, {keyframes} from 'styled-components';
import {Star, BrandGooglePlay, Mail} from 'tabler-icons-react';
import Language from 'strings';
import Sheet from './Sheet';
import {SheetTitle, SheetText, ButtonStack, MainButton, SecondaryButton} from './styles';
import {PLAY_URL, isAndroid} from 'components/common/AppDownload';

/*
  Parça alınınca (yalnızca Android'de) Play Store tarzı "puan verin" penceresi.
  Bıktırmasın diye: puan verdiyse bir daha sorulmaz; "daha sonra" 7 gün, düşük puan 30 gün sonra tekrar sorulur.
  4-5 yıldız Play Store'a, 1-3 yıldız bize (e-posta) yönlendirir.
*/
const KEY = 'hd.rate';
const DAY = 86400000;
const FEEDBACK = 'mailto:hep.beraber.okuyalim@gmail.com';

const readState = () => {
  try {
    return JSON.parse (localStorage.getItem (KEY)) || {};
  } catch (error) {
    return {};
  }
};

const writeState = state => {
  try {
    localStorage.setItem (KEY, JSON.stringify (state));
  } catch (error) {}
};

export const shouldAskRating = () => {
  if (!isAndroid ()) return false;
  const state = readState ();
  if (state.done) return false;
  return !state.until || Date.now () > state.until;
};

const pop = keyframes`
  0% { transform: scale(1); }
  45% { transform: scale(1.35); }
  100% { transform: scale(1); }
`;

const Stars = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin: 18px 0 6px;
`;

const StarButton = styled.button`
  display: flex;
  padding: 4px;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: ${({on}) => (on ? '#f5b400' : 'var(--line)')};
  animation: ${({on}) => (on ? pop : 'none')} 0.35s ease ${({delay}) => delay}ms both;

  svg {
    fill: ${({on}) => (on ? '#f5b400' : 'transparent')};
  }
`;

const PlayBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto 4px;
  padding: 6px 12px;
  border-radius: 999px;
  background: #111;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 800;

  svg {
    color: #3ddc84;
  }
`;

export const RateSheet = ({visible, onDone}) => {
  const [rating, setRating] = useState (0);

  useEffect (() => {
    if (visible) setRating (0);
  }, [visible]);

  const later = () => {
    writeState ({...readState (), until: Date.now () + 7 * DAY});
    onDone ();
  };

  const toStore = () => {
    writeState ({...readState (), done: true, rating});
    window.open (PLAY_URL, '_blank', 'noopener');
    onDone ();
  };

  const feedback = () => {
    writeState ({...readState (), until: Date.now () + 30 * DAY, rating});
    window.location.href = FEEDBACK;
    onDone ();
  };

  const closeLow = () => {
    writeState ({...readState (), until: Date.now () + 30 * DAY, rating});
    onDone ();
  };

  return (
    <Sheet visible={visible} onClose={later}>
      <div style={{textAlign: 'center'}}>
        <PlayBadge><BrandGooglePlay size={16} /> Google Play</PlayBadge>
      </div>
      <SheetTitle>{Language.Kit.RateTitle}</SheetTitle>
      <SheetText>{rating >= 4 ? Language.Kit.RateHigh : rating > 0 ? Language.Kit.RateLow : Language.Kit.RateText}</SheetText>

      <Stars role="radiogroup" aria-label={Language.Kit.RateTitle}>
        {[1, 2, 3, 4, 5].map (n => (
          <StarButton key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n}`}
                      data-star={n} on={n <= rating} delay={(n - 1) * 60} onClick={() => setRating (n)}>
            <Star size={40} strokeWidth={1.6} />
          </StarButton>
        ))}
      </Stars>

      <ButtonStack>
        {rating >= 4 &&
          <MainButton type="button" id="rateStore" onClick={toStore}>
            <BrandGooglePlay size={20} /> {Language.Kit.RateStore}
          </MainButton>}
        {rating > 0 && rating < 4 && <>
          <MainButton type="button" id="rateFeedback" onClick={feedback}>
            <Mail size={20} /> {Language.Kit.RateFeedback}
          </MainButton>
          <SecondaryButton type="button" onClick={closeLow}>{Language.Kit.Close}</SecondaryButton>
        </>}
        {rating === 0 && <SecondaryButton type="button" id="rateLater" onClick={later}>{Language.Kit.RateLater}</SecondaryButton>}
      </ButtonStack>
    </Sheet>
  );
};
