//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React from 'react';
import styled, {css, keyframes} from 'styled-components';

// Mantine bileşenlerinin (modal, buton, progress vb.) aynı palete uyması için
export const mantineTheme = {
  fontFamily: "'Nunito', 'Noto Sans Arabic', system-ui, sans-serif",
  headings: {fontFamily: "'Nunito', 'Noto Sans Arabic', system-ui, sans-serif"},
  primaryColor: 'emerald',
  primaryShade: 7,
  defaultRadius: 'md',
  colors: {
    emerald: [
      '#eef8f3',
      '#ddf1e8',
      '#bfe3d2',
      '#93cfb5',
      '#5fb592',
      '#1e9470',
      '#167a5b',
      '#11624a',
      '#0f4c39',
      '#0b3d2e',
    ],
    gold: [
      '#fbf6e8',
      '#f6ecd2',
      '#ecdcae',
      '#e0c785',
      '#d4b364',
      '#c8a047',
      '#a8822f',
      '#866626',
      '#654c1d',
      '#443314',
    ],
  },
};

// Sekiz köşeli yıldız (Rub'ul Hizb) — marka işareti
export const StarMark = ({size = 28, color = 'var(--gold-500)', inner = 'var(--emerald-900)'}) => (
  <svg width={size} height={size} viewBox='0 0 40 40' aria-hidden='true'>
    <rect x='8' y='8' width='24' height='24' rx='2' fill={color} />
    <rect x='8' y='8' width='24' height='24' rx='2' fill={color} transform='rotate(45 20 20)' />
    <circle cx='20' cy='20' r='6.5' fill={inner} />
    <circle cx='20' cy='20' r='3' fill={color} />
  </svg>
);

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(24px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

/*
  Diyaloglar mobilde alttan açılan "sheet", geniş ekranda ortalanmış kart olur.
  Arka plan karartması büyük bir box-shadow ile verilir; böylece mevcut JSX'e
  ek bir backdrop elemanı eklemeye gerek kalmaz.
*/
export const sheet = css`
  position: fixed;
  z-index: 1000;
  left: 0;
  right: 0;
  bottom: 0;
  top: auto;
  margin: 0;
  transform: none;
  width: 100%;
  height: auto;
  max-height: 92vh;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: var(--surface);
  color: var(--ink);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  padding: 28px 20px calc(24px + var(--safe-bottom));
  box-shadow: 0 0 0 100vmax rgba(11, 30, 24, 0.55), var(--shadow-lg);
  animation: ${slideUp} 0.25s ease-out;

  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 44px;
    height: 5px;
    border-radius: 5px;
    background: var(--line);
  }

  @media screen and (min-width: 600px) {
    left: 50%;
    right: auto;
    top: 50%;
    bottom: auto;
    width: 440px;
    transform: translate(-50%, -50%);
    border-radius: var(--radius-lg);
    padding: 32px 28px 28px;
    animation: ${fadeIn} 0.2s ease-out;

    &::before {
      display: none;
    }
  }
`;

// Tam ekran kaplayan yarı saydam katman (onay diyalogları için)
export const overlay = css`
  position: fixed;
  inset: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(11, 30, 24, 0.55);
  animation: ${fadeIn} 0.2s ease-out;

  @media screen and (min-width: 600px) {
    align-items: center;
  }
`;

export const overlayCard = css`
  width: 100%;
  max-width: 440px;
  background: var(--surface);
  color: var(--ink);
  border: 0;
  margin: 0;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  padding: 8px 8px calc(8px + var(--safe-bottom));
  box-shadow: var(--shadow-lg);
  animation: ${slideUp} 0.25s ease-out;

  @media screen and (min-width: 600px) {
    border-radius: var(--radius-lg);
    padding: 8px;
  }
`;

export const primaryButton = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 54px;
  padding: 14px 24px;
  border: 0;
  border-radius: 14px;
  background: var(--emerald-700);
  color: #fff;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  text-align: center;
  text-decoration: none;
  white-space: normal;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 6px 16px rgba(17, 98, 74, 0.28);
  transition: background 0.15s ease, transform 0.1s ease;

  &:hover {
    background: var(--emerald-800);
    color: #fff;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const PrimaryButton = styled.div.attrs({role: 'button', tabIndex: 0})`
  ${primaryButton};
  margin-top: 20px;
`;

export const fieldLabel = css`
  display: block;
  color: var(--ink-soft);
  opacity: 1;
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0 0 6px;
`;

export const field = css`
  width: 100%;
  min-height: 52px;
  padding: 12px 14px;
  border: 1.5px solid var(--line);
  border-radius: 12px;
  background: var(--cream);
  color: var(--ink);
  font-size: 1rem;
  transition: border-color 0.15s ease, background 0.15s ease;

  &::placeholder {
    color: #9aa59f;
  }

  &:focus {
    outline: none;
    border-color: var(--emerald-500);
    background: #fff;
  }
`;
