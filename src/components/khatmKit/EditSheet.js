//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {field} from 'theme';
import Language from 'strings';
import Sheet from './Sheet';
import {SheetTitle, ButtonStack, MainButton, SecondaryButton, Spinner, FieldLabel, NameInput} from './styles';

const TextArea = styled.textarea`
  ${field};
  min-height: 96px;
  resize: vertical;
`;

/** Hatim başlığı, açıklaması ve (istenirse) dua tarihini değiştirme penceresi */
const EditSheet = ({visible, onClose, initial, withDate, onSave}) => {
  const [values, setValues] = useState ({header: '', description: '', date: ''});
  const [busy, setBusy] = useState (false);
  const labels = Language['/cuz'].CuzlerHatimCard.Modal;

  useEffect (() => {
    if (visible) setValues ({header: '', description: '', date: '', ...initial});
  }, [visible]);

  const change = key => event => setValues ({...values, [key]: event.target.value});

  const save = async () => {
    setBusy (true);
    const ok = await onSave (values);
    setBusy (false);
    if (ok) onClose ();
  };

  return (
    <Sheet visible={visible} onClose={busy ? undefined : onClose}>
      <SheetTitle>{labels.Title}</SheetTitle>

      <FieldLabel htmlFor="editHeader">{labels.Header}</FieldLabel>
      <NameInput id="editHeader" value={values.header} onChange={change ('header')} />

      <FieldLabel htmlFor="editDescription">{labels.Description}</FieldLabel>
      <TextArea id="editDescription" value={values.description} onChange={change ('description')} />

      {withDate && <>
        <FieldLabel htmlFor="editDate">{labels.Date}</FieldLabel>
        <NameInput id="editDate" type="date" value={values.date} onChange={change ('date')} />
      </>}

      <ButtonStack>
        <MainButton type="button" id="editSave" disabled={busy} onClick={save}>
          {busy && <Spinner />}
          {labels.Button}
        </MainButton>
        <SecondaryButton type="button" disabled={busy} onClick={onClose}>{Language.Kit.Cancel}</SecondaryButton>
      </ButtonStack>
    </Sheet>
  );
};

export default EditSheet;
