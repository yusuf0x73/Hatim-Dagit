//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React from 'react';
import {Trash, Plus, QuestionMark} from 'tabler-icons-react';
import Language from 'strings';
import Sheet from './Sheet';
import {SheetTitle, SheetText, ButtonStack, MainButton, SecondaryButton, Spinner, IconBubble} from './styles';

const icons = {delete: Trash, add: Plus, ask: QuestionMark};

/** Evet / Vazgeç onayı. busy iken buton döner ve tekrar basılamaz. */
const ConfirmSheet = ({visible, title, text, confirmLabel, cancelLabel, danger, icon = 'ask', busy, onConfirm, onCancel}) => {
  const Icon = icons[icon] || QuestionMark;
  return (
    <Sheet visible={visible} onClose={busy ? undefined : onCancel}>
      <IconBubble danger={danger}><Icon size={30} /></IconBubble>
      <SheetTitle>{title}</SheetTitle>
      {text && <SheetText>{text}</SheetText>}
      <ButtonStack>
        <MainButton type="button" danger={danger} disabled={busy} onClick={onConfirm}>
          {busy && <Spinner />}
          {confirmLabel || Language.Kit.Yes}
        </MainButton>
        <SecondaryButton type="button" disabled={busy} onClick={onCancel}>
          {cancelLabel || Language.Kit.Cancel}
        </SecondaryButton>
      </ButtonStack>
    </Sheet>
  );
};

export default ConfirmSheet;
