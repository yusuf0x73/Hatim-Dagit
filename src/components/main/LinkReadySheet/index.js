//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React, {useState, useEffect} from 'react';
import {Copy, Check, AlertCircle} from 'tabler-icons-react';
import Language from '../../../strings/index';
import close from '../../../icons/close.svg';
import {PrimaryButton} from 'theme';
import {
  DialogBox,
  DialogContainer,
  DialogIcon,
  DialogText,
  DialogLink,
  CopyLinkButton,
  SheetNote,
  ErrorBox,
} from '../Question/QuestionElements';

const copyToClipboard = async text => {
  try {
    await navigator.clipboard.writeText (text);
    return true;
  } catch (error) {
    // Eski tarayıcılar ve http için yedek yöntem
    const textArea = document.createElement ('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild (textArea);
    textArea.select ();
    const copied = document.execCommand ('copy');
    textArea.remove ();
    return copied;
  }
};

/**
 * Tüm hatim türleri için ortak "Hatim oluşturuldu" penceresi.
 * link: hazır değilse null; error: oluşturma başarısızsa true; note: isteğe bağlı uyarı metni
 */
const LinkReadySheet = ({visible, link, error, note, onClose}) => {
  const [copied, setCopied] = useState (false);
  const ready = typeof link === 'string' && link.length > 0;
  const texts = Language['/'].Button.Final;

  useEffect (
    () => {
      if (!visible) setCopied (false);
    },
    [visible, link]
  );

  return (
    <DialogBox visibility={visible}>
      <DialogIcon src={close} alignEnd={true} onClick={onClose} />

      <DialogContainer>
        <DialogText fontSize={'20px'}>
          {error ? Language.Home.CreateFailed : ready ? texts.After.Header : texts.Before.Header}
        </DialogText>

        {error
          ? <ErrorBox>
              <AlertCircle size={22} />
              <span>{Language.CuzGrid.LoadError}</span>
            </ErrorBox>
          : <>
              <DialogText fontSize={'15px'}>{texts.Before.Link}</DialogText>

              <DialogLink pending={!ready}>
                {ready ? link : texts.Before.LinkReady}
              </DialogLink>

              <CopyLinkButton
                copied={copied}
                disabled={!ready}
                onClick={async () => {
                  if (!ready) return;
                  setCopied (await copyToClipboard (link));
                }}
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                {copied ? texts.After.Copy : texts.Before.Copy}
              </CopyLinkButton>

              {note && ready && <SheetNote>{note}</SheetNote>}
            </>}
      </DialogContainer>

      {!error &&
        <PrimaryButton
          aria-disabled={!ready}
          style={ready ? undefined : {opacity: 0.55, cursor: 'wait'}}
          onClick={() => {
            if (!ready) return;
            // Router yerine tam sayfa yönlendirme: yeni hatim sayfası temiz state ile açılır
            window.location.href = link.replace (/^https?:\/\/[^/]+/, '');
          }}
        >
          {ready ? texts.After.Button : texts.Before.Button}
        </PrimaryButton>}
    </DialogBox>
  );
};

export default LinkReadySheet;
