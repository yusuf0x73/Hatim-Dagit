//                                     BİSMİLLAHİRRAHMANİRRAHİM

/*
  "Sûre hatimleri" (Yâsîn, Fetih, isim verilen özel okuma) ve
  "Kendi hatmini programla" (cüz, yarım cüz, hizb, sayfa, sûre, sayfa grubu) oluşturma penceresi.
*/

import React, {useState} from 'react';
import styled from 'styled-components';
import {field} from 'theme';
import Language from 'strings';
import {db} from 'backend';
import {RECITATIONS, SURAH_KHATM_SIZE, UNIT_OPTIONS, unitOf} from 'plans/units';
import {rememberCreated} from 'localStorage/myKhatms';
import {Sheet} from 'components/khatmKit';
import {SheetTitle, SheetText, ButtonStack, MainButton, FieldLabel, NameInput, FieldHint} from 'components/khatmKit/styles';
import Counter from '../Counter';
import LinkReadySheet from '../LinkReadySheet';

const Choices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 18px;
`;

const Choice = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  width: 100%;
  min-height: 64px;
  padding: 12px 16px;
  border-radius: 16px;
  border: 2px solid ${({active}) => (active ? 'var(--emerald-600)' : 'var(--line)')};
  background: ${({active}) => (active ? 'var(--emerald-50)' : 'var(--surface)')};
  color: var(--ink);
  text-align: start;
  cursor: pointer;

  strong {
    font-size: 1.08rem;
    font-weight: 800;
  }

  span {
    font-size: 0.9rem;
    color: var(--muted);
    font-weight: 600;
  }
`;

const TextArea = styled.textarea`
  ${field};
  min-height: 80px;
  resize: vertical;
`;

const Summary = styled.p`
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--gold-100);
  color: var(--gold-600);
  font-weight: 800;
  text-align: center;
`;

const BackLink = styled.button`
  margin-top: 10px;
  border: 0;
  background: transparent;
  color: var(--emerald-700);
  font-weight: 800;
  cursor: pointer;
`;

const SURAH_CHOICES = [
  {id: 'yasin', title: 'Yâsîn hatmi', meta: `Bir hatim ${SURAH_KHATM_SIZE} Yâsîn`},
  {id: 'fetih', title: 'Fetih hatmi', meta: `Bir hatim ${SURAH_KHATM_SIZE} Fetih`},
  {id: 'custom', title: 'İsim vererek özel hatim', meta: 'Ne okunacağını ve bir hatimde kaç okuma olacağını siz belirleyin'},
];

const OzelDialog = ({mode, visible, onClose}) => {
  const [choice, setChoice] = useState (null);
  const [customName, setCustomName] = useState ('');
  const [customCount, setCustomCount] = useState ('100');
  const [pageSize, setPageSize] = useState ('3');
  const [header, setHeader] = useState ('');
  const [description, setDescription] = useState ('');
  const [duaDate, setDuaDate] = useState ('');
  const [khatmCount, setKhatmCount] = useState (1);
  const [result, setResult] = useState (null); // {link, error}

  const reset = () => {
    setChoice (null);
    setCustomName ('');
    setHeader ('');
    setDescription ('');
    setDuaDate ('');
    setKhatmCount (1);
  };

  const close = () => {
    reset ();
    setResult (null);
    onClose ();
  };

  const unitSpec = (() => {
    if (!choice) return null;
    if (mode === 'surah') {
      if (choice === 'custom') return {kind: 'recite', name: customName.trim (), count: Math.min (Math.max (parseInt (customCount, 10) || 0, 0), 5000)};
      return {kind: 'recite', name: RECITATIONS[choice].name, count: RECITATIONS[choice].count, recitation: choice};
    }
    if (choice === 'pages') return {kind: 'pages', size: Math.min (Math.max (parseInt (pageSize, 10) || 0, 0), 302)};
    return {kind: choice};
  }) ();

  const invalid = !unitSpec ||
    (unitSpec.kind === 'recite' && (!unitSpec.name || unitSpec.count < 1)) ||
    (unitSpec.kind === 'pages' && unitSpec.size < 1);
  const unit = unitSpec && !invalid ? unitOf (unitSpec) : null;
  const defaultTitle = unit ? (unitSpec.kind === 'recite' ? `${unitSpec.name} hatmi` : 'Hatmimiz') : '';

  const create = async () => {
    if (!unit) return;
    setResult ({link: null, error: false});
    const title = header.trim () || defaultTitle;
    try {
      const response = await db.yeniOzelHatim ({
        header: title, description: description.trim (), duaDate,
        unit: unitSpec, slots: unit.slots, khatmCount,
      });
      if (response.data === undefined) throw response.error;
      const key = response.data.hatimKey;
      rememberCreated ({key, type: 'ozel', route: `/ozel/${key}`, title});
      setResult ({link: `https://hatimdagit.com/ozel/${key}`, error: false});
      reset ();
    } catch (error) {
      console.log (`OzelDialog: ${error}`);
      setResult ({link: null, error: true});
    }
  };

  if (result) {
    return <LinkReadySheet visible={visible} link={result.link} error={result.error} onClose={close} />;
  }

  const options = mode === 'surah' ? SURAH_CHOICES : UNIT_OPTIONS.map (o => ({id: o.kind, title: o.title, meta: o.meta}));

  return (
    <Sheet visible={visible} onClose={close}>
      <SheetTitle>{mode === 'surah' ? 'Sûre hatmi oluştur' : 'Kendi hatmini programla'}</SheetTitle>
      <SheetText>
        {mode === 'surah'
          ? 'Okumalar kişilere dağıtılır; herkes ismini yazıp bir okuma alır.'
          : 'Kur\'ân\'ı nasıl bölmek istediğinizi seçin; herkes istediği parçayı alır.'}
      </SheetText>

      {!choice &&
        <Choices>
          {options.map (option => (
            <Choice key={option.id} type="button" id={`ozel-${option.id}`} onClick={() => setChoice (option.id)}>
              <strong>{option.title}</strong>
              <span>{option.meta}</span>
            </Choice>
          ))}
        </Choices>}

      {choice && <>
        <BackLink type="button" onClick={() => setChoice (null)}>‹ Diğer seçenekler</BackLink>
        <Choices>
          <Choice type="button" active>
            <strong>{options.find (o => o.id === choice).title}</strong>
            <span>{options.find (o => o.id === choice).meta}</span>
          </Choice>
        </Choices>

        {choice === 'custom' && <>
          <FieldLabel htmlFor="ozelName">Ne okunacak?</FieldLabel>
          <NameInput id="ozelName" value={customName} placeholder="Örn. İhlâs, Fâtiha, Salavât" onChange={e => setCustomName (e.target.value)} />
          <FieldLabel htmlFor="ozelCount">Bir hatimde kaç okuma?</FieldLabel>
          <NameInput id="ozelCount" type="number" inputMode="numeric" min="1" max="5000" value={customCount}
                     onChange={e => setCustomCount (e.target.value)} />
        </>}

        {choice === 'pages' && <>
          <FieldLabel htmlFor="ozelPages">Her parça kaç sayfa?</FieldLabel>
          <NameInput id="ozelPages" type="number" inputMode="numeric" min="1" max="302" value={pageSize}
                     onChange={e => setPageSize (e.target.value)} />
        </>}

        <FieldLabel htmlFor="ozelHeader">{Language['/'].Button.Header.InputSpan[0]}</FieldLabel>
        <NameInput id="ozelHeader" value={header} placeholder={defaultTitle || Language['/'].Button.Header.Input[0]}
                   onChange={e => setHeader (e.target.value)} />

        <FieldLabel htmlFor="ozelDescription">{Language['/'].Button.Header.InputSpan[1]}</FieldLabel>
        <TextArea id="ozelDescription" value={description} placeholder={Language['/'].Button.Header.Input[1]}
                  onChange={e => setDescription (e.target.value)} />

        <FieldLabel htmlFor="ozelDate">{Language['/'].Button.Header.InputSpan[2]}</FieldLabel>
        <NameInput id="ozelDate" type="date" value={duaDate} onChange={e => setDuaDate (e.target.value)} />

        <FieldLabel>{Language['/'].Button.Header.InputSpan[3]}</FieldLabel>
        <Counter hatimCount={khatmCount} setHatimCount={setKhatmCount} max={20} />
        <FieldHint>Her hatim ayrı bir liste olarak sayfada görünür; sonradan yeni hatim de ekleyebilirsiniz.</FieldHint>

        {unit && <Summary>{khatmCount} hatim × {unit.slots} {unit.noun} = {khatmCount * unit.slots} parça</Summary>}

        <ButtonStack>
          <MainButton type="button" id="ozelCreate" disabled={!unit} onClick={create}>
            {Language['/'].Button.Header.Button}
          </MainButton>
        </ButtonStack>
      </>}
    </Sheet>
  );
};

export default OzelDialog;
