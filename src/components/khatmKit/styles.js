//                                     BİSMİLLAHİRRAHMANİRRAHİM

import styled, {keyframes, css} from 'styled-components';
import {field, primaryButton} from 'theme';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const popIn = keyframes`
  from { transform: translate(-50%, -46%) scale(0.96); opacity: 0; }
  to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
`;

/* ---------- Alttan açılan pencere ---------- */

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(11, 30, 24, 0.5);
  animation: ${fadeIn} 0.18s ease-out;
`;

export const Panel = styled.div`
  position: fixed;
  z-index: 1001;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  background: var(--surface);
  color: var(--ink);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  box-shadow: var(--shadow-lg);
  animation: ${slideUp} 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    width: 44px;
    height: 5px;
    margin-left: -22px;
    border-radius: 5px;
    background: var(--line);
  }

  @media screen and (min-width: 600px) {
    left: 50%;
    right: auto;
    top: 50%;
    bottom: auto;
    width: ${({wide}) => (wide ? '560px' : '460px')};
    max-height: 86vh;
    border-radius: var(--radius-lg);
    transform: translate(-50%, -50%);
    animation: ${popIn} 0.18s ease-out;

    &::before {
      display: none;
    }
  }
`;

export const PanelBody = styled.div`
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding: 26px 20px calc(22px + var(--safe-bottom));

  @media screen and (min-width: 600px) {
    padding: 28px 26px 26px;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  z-index: 2;
  top: 14px;
  right: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  background: var(--sand);
  color: var(--ink-soft);
  cursor: pointer;
`;

export const SheetTitle = styled.h2`
  padding: 0 44px;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1.35;
  overflow-wrap: anywhere;
`;

export const SheetText = styled.p`
  margin-top: 8px;
  text-align: center;
  color: var(--muted);
  line-height: 1.5;
`;

export const ButtonStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 54px;
  padding: 12px 20px;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.1s ease, background 0.15s ease;

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export const MainButton = styled.button`
  ${primaryButton};
  ${({danger}) => danger && `
    background: var(--danger);
    box-shadow: 0 6px 16px rgba(180, 68, 58, 0.25);
    &:hover { background: #9c3a31; }
  `}

  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
`;

export const SecondaryButton = styled.button`
  ${buttonBase};
  border: 1.5px solid ${({danger}) => (danger ? '#e7b7b1' : 'var(--line)')};
  background: ${({danger}) => (danger ? 'var(--danger-soft)' : 'var(--surface)')};
  color: ${({danger}) => (danger ? 'var(--danger)' : 'var(--ink-soft)')};
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Spinner = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  animation: ${spin} 0.8s linear infinite;
`;

export const IconBubble = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin: 0 auto 14px;
  border-radius: 50%;
  background: ${({danger}) => (danger ? 'var(--danger-soft)' : 'var(--emerald-50)')};
  color: ${({danger}) => (danger ? 'var(--danger)' : 'var(--emerald-700)')};
`;

/* ---------- Cüz alma penceresi ---------- */

export const PartBadge = styled.div`
  display: flex;
  width: fit-content;
  align-items: center;
  justify-content: center;
  min-width: 76px;
  height: 76px;
  margin: 0 auto 14px;
  padding: 0 14px;
  border-radius: 38px;
  background-color: var(--emerald-800);
  background-image: var(--pattern);
  box-shadow: 0 0 0 4px var(--gold-200);
  color: #fff;
  font-size: ${({long}) => (long ? '1.25rem' : '2rem')};
  font-weight: 800;
  line-height: 1;
`;

export const FieldLabel = styled.label`
  display: block;
  margin: 20px 0 6px;
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--ink-soft);
`;

export const NameInput = styled.input`
  ${field};
  font-size: 1.1rem;
`;

export const FieldHint = styled.p`
  margin-top: 6px;
  font-size: 0.85rem;
  color: var(--muted);
`;

export const InlineNote = styled.p`
  margin-top: 14px;
  padding: 10px 14px;
  border-radius: 12px;
  background: ${({danger}) => (danger ? 'var(--danger-soft)' : 'var(--gold-100)')};
  color: ${({danger}) => (danger ? 'var(--danger)' : 'var(--gold-600)')};
  font-size: 0.92rem;
  font-weight: 700;
  text-align: center;
`;

/* ---------- Paylaş çubuğu ve açılan menü ---------- */

export const ShareBar = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 900;
  display: flex;
  gap: 10px;
  padding: 10px 16px calc(10px + var(--safe-bottom));
  background: var(--cream);
  border-top: 1px solid var(--line);
  box-shadow: 0 -6px 18px rgba(11, 61, 46, 0.06);

  @media screen and (min-width: 960px) {
    left: 50%;
    right: auto;
    bottom: 20px;
    width: 380px;
    margin-left: -190px;
    padding: 8px;
    border: 1px solid var(--line);
    border-radius: 999px;
    box-shadow: var(--shadow-lg);
  }
`;

export const BarButton = styled.button`
  ${buttonBase};
  flex: 1;
  min-height: 52px;
  font-size: 1rem;
  border: 1.5px solid ${({primary}) => (primary ? 'var(--emerald-700)' : 'var(--emerald-600)')};
  background: ${({primary, done}) => (primary ? 'var(--emerald-700)' : done ? 'var(--emerald-50)' : 'var(--surface)')};
  color: ${({primary}) => (primary ? '#fff' : 'var(--emerald-700)')};

  @media screen and (min-width: 960px) {
    border-radius: 999px;
  }
`;

export const PopBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 899;
  background: rgba(11, 30, 24, 0.35);
  animation: ${fadeIn} 0.15s ease-out;
`;

export const PopMenu = styled.div`
  position: fixed;
  z-index: 901;
  left: 16px;
  bottom: calc(84px + var(--safe-bottom));
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  pointer-events: ${({open}) => (open ? 'auto' : 'none')};

  @media screen and (min-width: 960px) {
    left: 50%;
    bottom: 96px;
    margin-left: -182px;
  }
`;

// Menü öğeleri paylaş butonundan sırayla "pop" ederek çıkar
export const PopItem = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  padding: 6px 20px 6px 6px;
  border: 0;
  border-radius: 999px;
  background: var(--surface);
  color: var(--ink);
  box-shadow: var(--shadow-lg);
  font-size: 1.05rem;
  font-weight: 800;
  cursor: pointer;
  transform-origin: left bottom;
  transform: ${({open}) => (open ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.6)')};
  opacity: ${({open}) => (open ? 1 : 0)};
  transition: transform 0.26s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.18s ease;
  transition-delay: ${({open, order}) => (open ? `${order * 45}ms` : '0ms')};
`;

export const PopIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({bg}) => bg};
  color: ${({fg}) => fg || '#fff'};
`;

/* ---------- Çizelge ---------- */

export const ChartHead = styled.div`
  padding: 26px 20px 14px;
  border-bottom: 1px solid var(--line);

  @media screen and (min-width: 600px) {
    padding: 26px 26px 14px;
  }
`;

export const ChartMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 14px;
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--ink-soft);
`;

export const LiveChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--emerald-50);
  color: var(--emerald-700);
  font-size: 0.8rem;
  font-weight: 800;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--emerald-500);
    box-shadow: 0 0 0 3px rgba(30, 148, 112, 0.2);
  }
`;

export const ProgressTrack = styled.div`
  height: 10px;
  margin-top: 8px;
  border-radius: 999px;
  background: var(--sand);
  overflow: hidden;

  span {
    display: block;
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--emerald-600), var(--emerald-500));
    transition: width 0.3s ease;
  }
`;

export const GroupTitle = styled.h3`
  position: sticky;
  top: -1px;
  z-index: 1;
  margin: 0 -20px;
  padding: 10px 20px 6px;
  background: var(--surface);
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gold-600);

  @media screen and (min-width: 600px) {
    margin: 0 -26px;
    padding: 10px 26px 6px;
  }
`;

export const DayButton = styled.button`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  min-height: 64px;
  margin: 6px 0;
  padding: 10px 14px;
  border-radius: 14px;
  border: 1.5px solid ${({today, done}) => (today ? 'var(--gold-500)' : done ? 'var(--emerald-200)' : 'var(--line)')};
  background: ${({today, done}) => (today ? 'var(--gold-100)' : done ? 'var(--emerald-50)' : 'var(--surface)')};
  color: var(--ink);
  text-align: left;
  cursor: ${({locked}) => (locked ? 'default' : 'pointer')};
  transition: background 0.15s ease;
`;

export const Check = styled.span`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid ${({done}) => (done ? 'var(--emerald-600)' : '#c9bfa9')};
  background: ${({done}) => (done ? 'var(--emerald-600)' : 'transparent')};
  color: #fff;
  transition: background 0.15s ease, border-color 0.15s ease;
`;

export const DayText = styled.span`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;

  small {
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--muted);
  }

  strong {
    font-size: 1.02rem;
    font-weight: 800;
    text-decoration: ${({done}) => (done ? 'none' : 'none')};
  }
`;

export const TodayChip = styled.span`
  flex-shrink: 0;
  padding: 2px 9px;
  border-radius: 999px;
  background: var(--gold-500);
  color: var(--emerald-900);
  font-size: 0.75rem;
  font-weight: 800;
`;

/* ---------- Izgara yardımcıları ---------- */

// Kutunun altındaki "Çizelge" şeridi
export const ChartStrip = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 100%;
  min-height: 34px;
  padding: 4px;
  border: 0;
  border-top: 1px solid ${({taken, read}) => (read ? 'rgba(255,255,255,0.15)' : taken ? 'var(--emerald-200)' : 'var(--gold-200)')};
  background: ${({taken, read}) => (read ? 'rgba(0,0,0,0.14)' : taken ? 'var(--emerald-700)' : 'var(--gold-100)')};
  color: ${({taken}) => (taken ? '#fff' : 'var(--gold-600)')};
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
`;

export const KhatmBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: calc(720px - 32px);
  min-height: 60px;
  margin: 22px auto 0;
  padding: 10px 12px 10px 18px;
  border-radius: var(--radius);
  background-color: var(--emerald-800);
  background-image: var(--pattern);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 800;
  box-shadow: var(--shadow);

  @media screen and (max-width: 752px) {
    margin-left: 16px;
    margin-right: 16px;
  }

  small {
    display: block;
    font-size: 0.82rem;
    font-weight: 700;
    opacity: 0.75;
  }
`;

export const KhatmBarButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 40px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  background: ${({danger}) => (danger ? 'rgba(255,255,255,0.12)' : 'var(--gold-500)')};
  color: ${({danger}) => (danger ? '#ffd2cc' : 'var(--emerald-900)')};
  font-size: 0.92rem;
  font-weight: 800;
  cursor: pointer;
`;

export const AddKhatmButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: calc(100% - 32px);
  max-width: calc(720px - 32px);
  min-height: 58px;
  margin: 24px auto 0;
  border: 2px dashed var(--emerald-500);
  border-radius: var(--radius);
  background: var(--surface);
  color: var(--emerald-700);
  font-size: 1.02rem;
  font-weight: 800;
  cursor: pointer;
`;

export const StopAutoButton = styled(AddKhatmButton)`
  border: 1.5px solid #e7b7b1;
  background: var(--danger-soft);
  color: var(--danger);
`;

/* ---------- Hata ekranı ---------- */

export const ErrorWrap = styled.div`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: var(--cream);
`;

export const ErrorCard = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 28px 22px 22px;
  border-radius: var(--radius-lg);
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  text-align: center;
`;

/* ---------- Kur'an okuyucuya geçiş ---------- */
// Altın düğme: diğer yeşil/gri düğmelerden ayrışsın, "oku" hemen göze çarpsın
export const ReadButton = styled.button`
  ${buttonBase};
  border: 0;
  background: linear-gradient(135deg, var(--gold-500), var(--gold-600));
  color: #fff;
  box-shadow: 0 6px 16px rgba(168, 130, 47, 0.32);
  &:hover { filter: brightness(1.05); }
`;

export const ReadBanner = styled.button`
  display: flex;
  align-items: center;
  gap: 14px;
  width: calc(100% - 24px);
  max-width: 720px;
  margin: 14px auto;
  padding: 14px 16px;
  border: 0;
  border-radius: 18px;
  cursor: pointer;
  text-align: start;
  color: #fff;
  background: linear-gradient(135deg, var(--emerald-900), var(--emerald-700));
  box-shadow: 0 10px 24px rgba(11, 61, 46, 0.25);

  .ar {
    font-family: var(--font-arabic);
    font-size: 26px;
    line-height: 1;
    color: var(--gold-500);
    flex: none;
  }
  .txt { flex: 1; min-width: 0; }
  b { display: block; font-size: 17px; }
  small { display: block; opacity: 0.8; font-size: 13px; margin-top: 2px; }
  .go {
    flex: none;
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--gold-500), var(--gold-600));
  }
`;
