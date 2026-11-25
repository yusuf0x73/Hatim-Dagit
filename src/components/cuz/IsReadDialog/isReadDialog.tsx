import React from 'react';
import {Button} from '@mantine/core';
import {
  YesNoButtonContainer,
  YesNoButtonLayout,
  YesNoContainer,
  YesNoLayout,
  YesNoText,
  Container
} from './styles';
import Language from '../../../strings';
import { isReadDialogAlertActions, isReadDialogAlertFunctions, useIsReadDialogAlert } from 'features/isReadDialogAlert';
import { useDispatch } from 'react-redux';
import { cuzlerFunctionTriggerActions } from 'features/cuzlerFunctionTrigger';
import { AppDispatch } from 'redux/store';
// @ts-ignore
import {tx} from 'strings/tx';

const isReadDialog = ({hatimlerVisibilities, toggleHatimlerVisibilities}:{hatimlerVisibilities: any, toggleHatimlerVisibilities: any}) => {
  const {visible, subKey, partNo, isRead} = useIsReadDialogAlert ();
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Container visible={visible}>
      <YesNoContainer>
        <YesNoLayout>

          <YesNoText>{tx('Cüzü okudunuz mu?', 'Did you read the juz?', 'هل قرأت الجزء؟')}</YesNoText>

          <YesNoButtonContainer>
            <YesNoButtonLayout>

              <Button
                fullWidth
                radius="md"
                onClick={() => {
                  dispatch(isReadDialogAlertFunctions.partRead({subKey, partNo}))
                  dispatch(cuzlerFunctionTriggerActions.toggleVisibility())
                  alert (tx('Allah kabul etsin.', 'May Allah accept it.', 'تقبّل الله.'));
                }}
              >
                {tx('Evet', 'Yes', 'نعم')}
              </Button>
              <Button
                fullWidth
                radius="md"
                variant="default"
                onClick={() => {
                  if(isRead){
                    dispatch(isReadDialogAlertFunctions.partNotRead({subKey, partNo}))
                    dispatch(cuzlerFunctionTriggerActions.toggleVisibility())
                  }else{
                    dispatch(isReadDialogAlertActions.toggleVisibility())
                  }
                }}
              >
                {tx('Hayır', 'No', 'لا')}
              </Button>

            </YesNoButtonLayout>
          </YesNoButtonContainer>

        </YesNoLayout>
      </YesNoContainer>
    </Container>
  );
};

export default isReadDialog;
