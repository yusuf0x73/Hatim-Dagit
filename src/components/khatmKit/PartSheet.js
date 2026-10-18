//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React, {useEffect, useState} from 'react';
import {ReadQuranButton} from './ReadQuran';
import Language from 'strings';
import Sheet, {fmt} from './Sheet';
import {
  SheetTitle, SheetText, ButtonStack, MainButton, SecondaryButton, Spinner,
  PartBadge, FieldLabel, NameInput, FieldHint, InlineNote,
} from './styles';

const LAST_NAME = 'hd.lastName';

const readLastName = () => {
  try {
    return localStorage.getItem (LAST_NAME) || '';
  } catch (error) {
    return '';
  }
};

const saveLastName = name => {
  try {
    if (name) localStorage.setItem (LAST_NAME, name);
  } catch (error) {}
};

/**
 * Cüz / parça alma, ismini değiştirme ve bırakma penceresi.
 * mode: 'take' (boş parça), 'mine' (bu cihazdan alınmış), 'admin' (hatmi oluşturan, başkasının parçası),
 *       'other' (alınmış ama bu cihazda kaydı yok: cihazdaki secret ile denenir, kararı sunucu verir)
 * Son yazılan isim hatırlanır; bir sonraki cüzde tekrar yazmak gerekmez.
 * read: {start, end} verilirse parçanın sayfaları Kur'an okuyucuda (/oku) açılabilir.
 */
const PartSheet = ({visible, onClose, mode = 'take', badge, label, holder, busy,
                    takeText, onTake, onRename, onRelease, extra, read}) => {
  const [name, setName] = useState ('');
  const [confirmRelease, setConfirmRelease] = useState (false);

  useEffect (() => {
    if (!visible) return;
    setName (mode === 'take' ? readLastName () : holder || '');
    setConfirmRelease (false);
  }, [visible, mode, holder]);

  const take = () => {
    if (busy) return;
    saveLastName (name.trim ());
    onTake (name.trim ());
  };

  const rename = () => {
    if (busy) return;
    if (mode !== 'admin') saveLastName (name.trim ());
    onRename (name.trim ());
  };

  const release = () => {
    if (busy) return;
    if (!confirmRelease) {
      setConfirmRelease (true);
      return;
    }
    onRelease ();
  };

  const title = mode === 'take'
    ? fmt (Language.Kit.TakeTitle, {n: label})
    : mode === 'mine' ? fmt (Language.Kit.MineTitle, {n: label}) : fmt (Language.Kit.OtherTitle, {n: label});

  return (
    <Sheet visible={visible} onClose={busy ? undefined : onClose}>
      <PartBadge long={String (badge).length > 3}>{badge}</PartBadge>
      <SheetTitle>{title}</SheetTitle>
      {(mode === 'admin' || mode === 'other') && holder && <SheetText>{fmt (Language.Kit.TakenBy, {name: holder})}</SheetText>}
      {mode === 'other' && onRename && <FieldHint>{Language.Kit.OtherHint}</FieldHint>}

      {(mode === 'take' || onRename) && <>
        <FieldLabel htmlFor="partName">{Language.Kit.NameLabel}</FieldLabel>
        <NameInput id="partName" value={name} placeholder={Language.Kit.NamePlaceholder}
                   autoComplete="name" enterKeyHint="done"
                   onChange={event => setName (event.target.value)}
                   onKeyDown={event => event.key === 'Enter' && (mode === 'take' ? take () : rename ())} />
        {mode === 'take' && <FieldHint>{Language.Kit.NameHint}</FieldHint>}
      </>}

      {confirmRelease && <InlineNote danger>{Language.Kit.ReleaseConfirm}</InlineNote>}

      <ButtonStack>
        {mode === 'take' &&
          <MainButton type="button" id="takeButton" disabled={busy} onClick={take}>
            {busy && <Spinner />}
            {takeText || Language.Kit.TakeButton}
          </MainButton>}

        {mode !== 'take' && onRename && !confirmRelease &&
          <MainButton type="button" disabled={busy} onClick={rename}>
            {busy && <Spinner />}
            {Language.Kit.RenameButton}
          </MainButton>}

        {mode !== 'take' && onRelease &&
          (confirmRelease
            ? <MainButton type="button" danger id="releaseButton" disabled={busy} onClick={release}>
                {busy && <Spinner />}
                {Language.Kit.ReleaseYes}
              </MainButton>
            : <SecondaryButton type="button" danger id="releaseButton" disabled={busy} onClick={release}>
                {Language.Kit.ReleaseButton}
              </SecondaryButton>)}

        {confirmRelease &&
          <SecondaryButton type="button" disabled={busy} onClick={() => setConfirmRelease (false)}>
            {Language.Kit.Cancel}
          </SecondaryButton>}

        {read && !confirmRelease && <ReadQuranButton read={read} id="readQuran" />}

        {extra}
      </ButtonStack>
    </Sheet>
  );
};

export default PartSheet;
