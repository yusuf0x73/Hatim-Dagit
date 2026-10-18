//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import {X} from 'tabler-icons-react';
import Language from 'strings';
import {Backdrop, Panel, PanelBody, CloseButton} from './styles';

// "{n}. cüz sizde" gibi kalıplardaki {anahtar} yerlerini doldurur
export const fmt = (template, values) =>
  String (template || '').replace (/\{(\w+)\}/g, (_, key) => (values[key] != null ? values[key] : ''));

let openSheets = 0;

/**
 * Alttan açılan (geniş ekranda ortalanan) pencere.
 * body'ye portal ile eklenir; böylece transform'lu kapsayıcıların içinde de doğru konumlanır.
 * Açıkken arka sayfa kaymaz.
 */
const Sheet = ({visible, onClose, wide, children, header, labelledBy}) => {
  useEffect (() => {
    if (!visible) return;
    openSheets++;
    document.body.style.overflow = 'hidden';
    const onKey = event => event.key === 'Escape' && onClose && onClose ();
    window.addEventListener ('keydown', onKey);
    return () => {
      openSheets--;
      if (openSheets === 0) document.body.style.overflow = '';
      window.removeEventListener ('keydown', onKey);
    };
  }, [visible]);

  if (!visible) return null;

  return ReactDOM.createPortal (
    <>
      <Backdrop onClick={onClose} />
      <Panel wide={wide} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        {onClose &&
          <CloseButton type="button" aria-label={Language.Kit.Close} onClick={onClose}>
            <X size={22} />
          </CloseButton>}
        {header}
        <PanelBody>{children}</PanelBody>
      </Panel>
    </>,
    document.body
  );
};

export default Sheet;
