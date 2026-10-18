import Language from '../../../strings/index';
import {
  DialogBox,
  DialogContainer,
  DialogIcon,
  DialogText,
  DialogTextSpan,
  DialogInputBox,
  DialogTextArea,
} from '../Question/QuestionElements';
import {PrimaryButton} from 'theme';
import close from '../../../icons/close.svg';
import {Checkbox} from '@mantine/core';
import {useState, useEffect} from 'react';
import Counter from '../Counter';

const AskDialog = ({
  firebase,
  setHatimKey,
  setYazilar,
  propHideDialogBox,
  askDialogBox,
  setAskDialogBox,
  hatimKonu,
  setHatimKonu,
  hatimBitisTarihi,
  setHatimBitisTarihi,
  changeAskDialogBox,
  isRamazan,
  setHatimDescription,
  hatimDescription,
  setHatimCount,
  hatimCount,
}) => {
  const [makeNewHatim, setMakeNewHatim] = useState (false);

  return (
    <DialogBox visibility={askDialogBox}>

      <DialogContainer>

        <DialogIcon
          src={close}
          alignEnd={true}
          onClick={() => {
            changeAskDialogBox ();
          }}
        />

        <DialogText fontSize={'20px'}>
          {Language['/'].Button.Header.Text}
        </DialogText>

        <div style={{display: 'flex', flexDirection: 'column'}}>
          <DialogTextSpan>
            {Language['/'].Button.Header.InputSpan[0]}
          </DialogTextSpan>
          <DialogInputBox
            placeholder={Language['/'].Button.Header.Input[0]}
            onChange={event => {
              setHatimKonu (event.target.value);
            }}
          />
        </div>

        <div style={{display: 'flex', flexDirection: 'column'}}>
          <DialogTextSpan>
            {Language['/'].Button.Header.InputSpan[1]}
          </DialogTextSpan>
          <DialogTextArea
            rows="2"
            type=""
            placeholder={Language['/'].Button.Header.Input[1]}
            onChange={event => {
              setHatimDescription (event.target.value);
            }}
          />
        </div>

        <div style={{display: 'flex', flexDirection: 'column'}}>
          <DialogTextSpan>
            {Language['/'].Button.Header.InputSpan[2]}
          </DialogTextSpan>
          <DialogInputBox
            type="date"
            onChange={event => {
              setHatimBitisTarihi (event.target.value);
            }}
          />
        </div>

        {makeNewHatim == false &&
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <DialogTextSpan>
              {Language['/'].Button.Header.InputSpan[3]}
            </DialogTextSpan>
            <Counter hatimCount={hatimCount} setHatimCount={setHatimCount} />
          </div>}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '4px',
          }}
        >
          <Checkbox
            size="md"
            styles={{label: {fontSize: '0.95rem', lineHeight: 1.4}}}
            value={false}
            onChange={event => {
              setHatimCount (1);
              setMakeNewHatim (event.currentTarget.checked);
            }}
            label={Language['/'].Button.Header.InputSpan[4]}
          />
        </div>

      </DialogContainer>

<PrimaryButton
  onClick={async () => {
    setAskDialogBox (false);
    setYazilar ({
      baslik: Language['/'].Button.Final.Before.Header,
      link: Language['/'].Button.Final.Before.LinkReady,
      cevap: Language['/'].Button.Final.Before.Button,
    });
    propHideDialogBox.setHideDialogBox (true);
    try {
      let _hatimKey = await firebase.yeniHatim (
        hatimKonu,
        hatimBitisTarihi,
        false,
        isRamazan,
        hatimDescription,
        makeNewHatim,
        hatimCount
      );
      setHatimKey (_hatimKey);
      const route = isRamazan ? 'ramazan' : 'cuz';
      setYazilar ({
        baslik: Language['/'].Button.Final.After.Header,
        link: `https://hatimdagit.com/${route}/` + _hatimKey,
        cevap: Language['/'].Button.Final.After.Button,
      });
    } catch (error) {
      console.log (`AskDialog: ${error}`);
      setYazilar (prev => ({...prev, error: true}));
    }
  }}
>
  {Language['/'].Button.Header.Button}
</PrimaryButton>

    </DialogBox>
  );
};

export default AskDialog;
