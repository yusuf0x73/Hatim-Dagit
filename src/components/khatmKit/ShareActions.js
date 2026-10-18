//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React, {useEffect, useState} from 'react';
import {Share, Copy, Check, BrandWhatsapp, MessageCircle, Dots} from 'tabler-icons-react';
import Language from 'strings';
import {ShareBar, BarButton, PopBackdrop, PopMenu, PopItem, PopIcon} from './styles';

// Yerel geliştirme / firebase adresleri yerine her zaman asıl alan adı paylaşılır
export const shareLink = () => {
  const {hostname, origin, pathname} = window.location;
  const isInternal = hostname === 'localhost' || hostname === '127.0.0.1' || /hatim-dagit\.(web\.app|firebaseapp\.com)$/.test (hostname);
  return (isInternal ? 'https://hatimdagit.com' : origin) + pathname;
};

export const copyText = async text => {
  try {
    await navigator.clipboard.writeText (text);
    return true;
  } catch (error) {
    // Eski tarayıcılar / http için yedek yol
    const area = document.createElement ('textarea');
    area.value = text;
    area.setAttribute ('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild (area);
    area.select ();
    const ok = document.execCommand ('copy');
    document.body.removeChild (area);
    return ok;
  }
};

/**
 * Hatim sayfalarının altındaki paylaş / kopyala çubuğu.
 * "Paylaş"a basınca WhatsApp, SMS, diğer uygulamalar ve kopyala seçenekleri sırayla açılır.
 */
const ShareActions = ({title, link}) => {
  const [open, setOpen] = useState (false);
  const [copied, setCopied] = useState (false);

  const url = link || shareLink ();
  const message = `${title ? `${title}\n` : ''}${Language.Kit.Invite}\n${url}`;
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  useEffect (() => {
    if (!copied) return;
    const timer = setTimeout (() => setCopied (false), 2500);
    return () => clearTimeout (timer);
  }, [copied]);

  useEffect (() => {
    if (!open) return;
    const onKey = event => event.key === 'Escape' && setOpen (false);
    window.addEventListener ('keydown', onKey);
    return () => window.removeEventListener ('keydown', onKey);
  }, [open]);

  const copy = async () => {
    setOpen (false);
    if (await copyText (url)) setCopied (true);
  };

  const items = [
    {
      key: 'whatsapp', label: Language.Kit.Whatsapp, bg: '#25D366', icon: <BrandWhatsapp size={24} />,
      run: () => window.open (`https://wa.me/?text=${encodeURIComponent (message)}`, '_blank', 'noopener'),
    },
    {
      key: 'sms', label: Language.Kit.Sms, bg: 'var(--emerald-600)', icon: <MessageCircle size={24} />,
      // "sms:?&body=" hem iOS hem Android'de çalışır
      run: () => { window.location.href = `sms:?&body=${encodeURIComponent (message)}`; },
    },
    canNativeShare && {
      key: 'more', label: Language.Kit.More, bg: 'var(--gold-500)', fg: 'var(--emerald-900)', icon: <Dots size={24} />,
      run: () => navigator.share ({title: title || 'Hatim Dağıt', text: `${title ? `${title}\n` : ''}${Language.Kit.Invite}`, url}).catch (() => {}),
    },
    {
      key: 'copy', label: Language.Kit.Copy, bg: 'var(--sand)', fg: 'var(--emerald-800)', icon: <Copy size={22} />,
      run: copy,
    },
  ].filter (Boolean);

  return (
    <>
      {open && <PopBackdrop onClick={() => setOpen (false)} />}

      <PopMenu open={open} aria-hidden={!open}>
        {/* En alttaki öğe butona en yakın olanı; sıra aşağıdan yukarı açılır */}
        {items.map ((item, index) => (
          <PopItem key={item.key} type="button" open={open} order={items.length - 1 - index}
                   tabIndex={open ? 0 : -1} id={`share-${item.key}`}
                   onClick={() => { setOpen (false); item.run (); }}>
            <PopIcon bg={item.bg} fg={item.fg}>{item.icon}</PopIcon>
            {item.label}
          </PopItem>
        ))}
      </PopMenu>

      <ShareBar>
        <BarButton type="button" primary id="shareButton" aria-expanded={open} onClick={() => setOpen (value => !value)}>
          <Share size={22} />
          {Language.Kit.Share}
        </BarButton>
        <BarButton type="button" done={copied} id="copyButton" onClick={copy}>
          {copied ? <Check size={22} /> : <Copy size={22} />}
          {copied ? Language.Kit.Copied : Language.Kit.Copy}
        </BarButton>
      </ShareBar>
    </>
  );
};

export default ShareActions;
