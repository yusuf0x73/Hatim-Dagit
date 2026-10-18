//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React, {useEffect, useState} from 'react';
import styled, {keyframes} from 'styled-components';
import {BrandGooglePlay, Check, X} from 'tabler-icons-react';
import Language from 'strings';
import {Sheet} from 'components/khatmKit';

export const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.hatimdagit.twa';

const OPEN_EVENT = 'hd:app-download';
const BANNER_CLOSED = 'hd.playBannerClosed';

export const isAndroid = () => /android/i.test (navigator.userAgent);
const isIos = () => /iphone|ipad|ipod/i.test (navigator.userAgent);

// Play Store'dan kurulan uygulama (TWA) ya da ana ekrana eklenmiş site içinde miyiz?
export const isInstalledApp = () =>
  (window.matchMedia && window.matchMedia ('(display-mode: standalone)').matches) ||
  window.navigator.standalone === true ||
  document.referrer.startsWith ('android-app://');

/**
 * İndir butonlarının ortak davranışı:
 * iPhone'da (Play Store yok) mevcut "Ana ekrana ekle" yönergesi, diğerlerinde Google Play penceresi açılır.
 */
export const openAppDownload = () => {
  if (isIos ()) {
    const popup = document.getElementById ('pwa_component');
    if (popup) {
      popup.style.display = 'flex';
      return;
    }
  }
  window.dispatchEvent (new Event (OPEN_EVENT));
};

/* ---------- Google Play penceresi ---------- */

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-6px) rotate(8deg); }
`;

const shine = keyframes`
  0% { transform: translateX(-120%) skewX(-20deg); }
  40%, 100% { transform: translateX(320%) skewX(-20deg); }
`;

const Hero = styled.div`
  position: relative;
  margin: -26px -20px 0;
  padding: 34px 20px 26px;
  text-align: center;
  color: #fff;
  background-color: var(--emerald-800);
  background-image: var(--pattern), radial-gradient(circle at 50% 0%, var(--emerald-500), var(--emerald-900) 70%);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  overflow: hidden;

  @media screen and (min-width: 600px) {
    margin: -28px -26px 0;
  }
`;

const Logo = styled.div`
  display: inline-flex;
  padding: 14px;
  border-radius: 26px;
  background: #fff;
  box-shadow: 0 0 0 6px rgba(200, 160, 71, 0.25), 0 12px 30px rgba(0, 0, 0, 0.25);
  animation: ${float} 3.4s ease-in-out infinite;
`;

const HeroTitle = styled.h2`
  margin-top: 16px;
  font-size: 1.45rem;
  font-weight: 800;
  line-height: 1.25;
`;

const HeroText = styled.p`
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.85);
`;

const Bullets = styled.ul`
  list-style: none;
  margin: 20px 0 4px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    color: var(--ink-soft);
  }

  svg {
    flex-shrink: 0;
    padding: 3px;
    border-radius: 50%;
    background: var(--emerald-50);
    color: var(--emerald-700);
  }
`;

const PlayButton = styled.a`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 62px;
  margin-top: 20px;
  border-radius: 16px;
  background: #111;
  color: #fff;
  font-size: 1.15rem;
  font-weight: 800;
  text-decoration: none;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 40%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
    animation: ${shine} 2.8s ease-in-out infinite;
  }
`;

const Note = styled.p`
  margin-top: 14px;
  text-align: center;
  font-size: 0.85rem;
  color: var(--muted);
`;

const AppDownloadSheet = ({visible, onClose}) => (
  <Sheet visible={visible} onClose={onClose}>
    <Hero>
      <Logo><AppIcon size={64} /></Logo>
      <HeroTitle>{Language.App.Title}</HeroTitle>
      <HeroText>{Language.App.Subtitle}</HeroText>
    </Hero>
    <Bullets>
      {Language.App.Bullets.map (text => <li key={text}><Check size={22} strokeWidth={3} />{text}</li>)}
    </Bullets>
    <PlayButton href={PLAY_URL} target="_blank" rel="noopener" id="playStoreLink" onClick={onClose}>
      <BrandGooglePlay size={28} />
      {Language.App.Button}
    </PlayButton>
    <Note>{Language.App.Iphone}</Note>
  </Sheet>
);

/** Uygulamada bir kez bulunur; indir butonlarından gelen isteği dinler */
export const AppDownloadHost = () => {
  const [open, setOpen] = useState (false);
  useEffect (() => {
    const show = () => setOpen (true);
    window.addEventListener (OPEN_EVENT, show);
    return () => window.removeEventListener (OPEN_EVENT, show);
  }, []);
  return <AppDownloadSheet visible={open} onClose={() => setOpen (false)} />;
};

/* ---------- Ana sayfa bannerı (Android) ---------- */

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(200, 160, 71, 0.5), var(--shadow); }
  50% { box-shadow: 0 0 0 7px rgba(200, 160, 71, 0), var(--shadow); }
`;

const Banner = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 0 0 18px;
  padding: 14px 44px 14px 14px;
  border-radius: 20px;
  border: 2px solid var(--gold-500);
  background-color: #111;
  background-image: linear-gradient(120deg, #111 40%, var(--emerald-900));
  color: #fff;
  cursor: pointer;
  animation: ${glow} 2.4s ease-in-out 3;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 35%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.18), transparent);
    animation: ${shine} 3.4s ease-in-out infinite;
    pointer-events: none;
  }
`;

// Uygulama ikonu (public/network.png) ve köşesinde Google Play rozeti
const BannerIcon = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  padding: 7px;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  svg {
    position: absolute;
    right: -6px;
    bottom: -6px;
    padding: 3px;
    border-radius: 50%;
    background: #111;
    color: #3ddc84;
  }
`;

// Play Store'daki uygulamanın ikonu (public/network.png); mağazadaki ikon değişene kadar bu kalmalı
const AppIcon = ({size}) => <img src="/network.png" alt="" width={size} height={size} />;

const BannerText = styled.div`
  flex: 1;
  min-width: 0;

  strong {
    display: block;
    font-size: 1.05rem;
    font-weight: 800;
    line-height: 1.3;
  }

  span {
    font-size: 0.9rem;
    color: var(--gold-200);
    font-weight: 700;
  }
`;

const BannerClose = styled.button`
  position: absolute;
  z-index: 1;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  cursor: pointer;
`;

export const AppPromoBanner = () => {
  const [hidden, setHidden] = useState (() => {
    try {
      return localStorage.getItem (BANNER_CLOSED) === '1';
    } catch (error) {
      return false;
    }
  });

  if (hidden || !isAndroid () || isInstalledApp ()) return null;

  const close = event => {
    event.stopPropagation ();
    try {
      localStorage.setItem (BANNER_CLOSED, '1');
    } catch (error) {}
    setHidden (true);
  };

  return (
    <Banner role="button" tabIndex={0} id="playBanner" onClick={openAppDownload}>
      <BannerIcon><AppIcon size={42} /><BrandGooglePlay size={22} /></BannerIcon>
      <BannerText>
        <strong>{Language.App.BannerTitle}</strong>
        <span>{Language.App.BannerText} ›</span>
      </BannerText>
      <BannerClose type="button" aria-label={Language.App.Later} onClick={close}><X size={16} /></BannerClose>
    </Banner>
  );
};
