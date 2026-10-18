import React from 'react';
import {Button} from '@mantine/core';
import {
  Container,
  YesNoButton,
  YesNoButtonContainer,
  YesNoButtonLayout,
  YesNoContainer,
  YesNoLayout,
  YesNoText,
} from './YesNoDialogElements';
import {useYesNoDialogAlert} from '../../../features/yesNoDialogAlert';
import Language from '../../../strings';
import {useDispatch} from 'react-redux';
import {loadingOverlayActions} from 'features/loadingOverlay';

const YesNoDialog = ({
  yesHandler,
  yesHandlerParameters,
  noHandler,
  hatimlerVisibilities,
  toggleHatimlerVisibilities,
}) => {
  const {visible, text} = useYesNoDialogAlert ();
  const dispatch = useDispatch ();

  return (
    <Container visible={visible}>
      <YesNoContainer>
        <YesNoLayout>

          <YesNoText>{text}</YesNoText>

          <YesNoButtonContainer>
            <YesNoButtonLayout>

              <Button
                fullWidth
                radius="md"
                onClick={() => {
                  if (yesHandlerParameters != null) {
                    yesHandler (yesHandlerParameters);
                  } else {
                    yesHandler ();
                  }
                }}
              >
                {Language['/cuz'].AddKhatmAlert.YesButton}
              </Button>
              <Button
                fullWidth
                radius="md"
                variant="default"
                onClick={noHandler}
              >
                {Language['/cuz'].AddKhatmAlert.NoButton}
              </Button>

            </YesNoButtonLayout>
          </YesNoButtonContainer>

        </YesNoLayout>
      </YesNoContainer>
    </Container>
  );
};

export default YesNoDialog;
