//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React, {useState} from 'react';
import styled from 'styled-components';
import detectLanguage, {setLanguage} from 'common';
import Language from 'strings';
import {Sheet} from 'components/khatmKit';

// Her dil kendi dilinde yazılır; dili bilmeyen biri de kendi dilini tanır
export const LANGUAGES = [
  {code: 'tr', flag: '🇹🇷', name: 'Türkçe'},
  {code: 'en', flag: '🇬🇧', name: 'English'},
  {code: 'ar', flag: '🇸🇦', name: 'العربية'},
];

const current = () => LANGUAGES.find (lang => lang.code === detectLanguage ()) || LANGUAGES[0];

const choose = code => {
  if (code === detectLanguage ()) return;
  setLanguage (code);
  window.location.reload ();
};

const Pills = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
`;

const Pill = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1.5px solid ${({active, dark}) => (active ? 'var(--gold-500)' : dark ? 'rgba(255,255,255,0.35)' : 'var(--line)')};
  background: ${({active, dark}) => (active ? 'var(--gold-500)' : dark ? 'rgba(255,255,255,0.08)' : 'var(--surface)')};
  color: ${({active, dark}) => (active ? 'var(--emerald-900)' : dark ? '#fff' : 'var(--ink)')};
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;

  span {
    font-size: 1.3rem;
    line-height: 1;
  }
`;

/** Yan yana üç dil butonu (alt bilgi, menü) */
export const LanguagePills = ({dark}) => {
  const active = current ().code;
  return (
    <Pills role="group" aria-label="Language / Dil / اللغة">
      {LANGUAGES.map (lang => (
        <Pill key={lang.code} type="button" dark={dark} active={lang.code === active} lang={lang.code}
              aria-pressed={lang.code === active} onClick={() => choose (lang.code)}>
          <span aria-hidden="true">{lang.flag}</span>
          {lang.name}
        </Pill>
      ))}
    </Pills>
  );
};

const FlagButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;

  span {
    font-size: 1.3rem;
    line-height: 1;
  }

  /* Dar ekranda sadece bayrak */
  em {
    font-style: normal;
    @media screen and (max-width: 400px) {
      display: none;
    }
  }
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 18px;
`;

const Option = styled.button`
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 60px;
  padding: 0 18px;
  border-radius: 16px;
  border: 2px solid ${({active}) => (active ? 'var(--emerald-600)' : 'var(--line)')};
  background: ${({active}) => (active ? 'var(--emerald-50)' : 'var(--surface)')};
  color: var(--ink);
  font-size: 1.15rem;
  font-weight: 800;
  cursor: pointer;

  span {
    font-size: 1.8rem;
    line-height: 1;
  }
`;

const Title = styled.h2`
  padding: 0 44px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 800;
`;

/** Üst bardaki bayrak butonu; dokununca büyük seçeneklerle dil penceresi açılır */
export const LanguageButton = () => {
  const [open, setOpen] = useState (false);
  const active = current ();
  return (
    <>
      <FlagButton type="button" id="languageButton" aria-label={`${Language.Navbar.Links[2]} · Language · اللغة`}
                  onClick={() => setOpen (true)}>
        <span aria-hidden="true">{active.flag}</span>
        <em>{active.code.toUpperCase ()}</em>
      </FlagButton>
      <Sheet visible={open} onClose={() => setOpen (false)}>
        <Title>🌐 Dil · Language · اللغة</Title>
        <Options>
          {LANGUAGES.map (lang => (
            <Option key={lang.code} type="button" lang={lang.code} active={lang.code === active.code}
                    onClick={() => choose (lang.code)}>
              <span aria-hidden="true">{lang.flag}</span>
              {lang.name}
            </Option>
          ))}
        </Options>
      </Sheet>
    </>
  );
};
