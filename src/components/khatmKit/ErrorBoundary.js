//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React from 'react';
import Language from 'strings';
import {ErrorWrap, ErrorCard, SheetTitle, SheetText, ButtonStack, MainButton, SecondaryButton} from './styles';

/**
 * Bir bileşen hata verdiğinde bütün sayfanın beyaz kalması / donması yerine
 * yenile ve ana sayfa butonları olan bir kart gösterir.
 */
class ErrorBoundary extends React.Component {
  constructor (props) {
    super (props);
    this.state = {failed: false};
  }

  static getDerivedStateFromError () {
    return {failed: true};
  }

  componentDidCatch (error, info) {
    console.error ('ErrorBoundary', error, info);
  }

  render () {
    if (!this.state.failed) return this.props.children;
    return (
      <ErrorWrap>
        <ErrorCard role="alert">
          <div style={{display: 'flex', justifyContent: 'center', marginBottom: 14}}><img src="/icons/app-icon-192.png" alt="" width={56} height={56} style={{borderRadius: 14}} /></div>
          <SheetTitle style={{padding: 0}}>{Language.Kit.ErrorTitle}</SheetTitle>
          <SheetText>{Language.Kit.ErrorText}</SheetText>
          <ButtonStack>
            <MainButton type="button" onClick={() => window.location.reload ()}>{Language.Kit.Reload}</MainButton>
            <SecondaryButton type="button" onClick={() => { window.location.href = '/'; }}>{Language.Kit.Home}</SecondaryButton>
          </ButtonStack>
        </ErrorCard>
      </ErrorWrap>
    );
  }
}

export default ErrorBoundary;
