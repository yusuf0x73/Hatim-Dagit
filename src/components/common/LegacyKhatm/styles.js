//                                  BİSMİLLAHİRRAHMANİRRAHİM

/*
  Ramazan, eski 3 aylar (günde 1 cüz) ve cuzv2 sayfalarının ortak görünümü.
  Bu sayfaların JSX'i eski cüz sayfasının kopyası olduğu için aynı export isimleri korunur;
  sadece görünüm yeni tasarıma (zümrüt / krem / altın) uyarlanır.
*/

import styled, {keyframes} from 'styled-components';
import {Link as LinkS} from 'react-scroll';
import {Add, ChevronDown, ChevronUp} from '@styled-icons/ionicons-outline';
import {sheet, field, primaryButton} from 'theme';

export const QuestionContainer = styled.div`
    background: var(--cream);
    position: relative;
    min-height: ${({minHeight}) => minHeight};
    padding: 8px 0 calc(110px + var(--safe-bottom));
`;

export const HatimContainer = styled.div`
    transform-origin: top;
    transform: ${({visibility}) => (!visibility ? 'scaleY(0)' : 'scaleY(1)')};
    height: ${({visibility}) => (!visibility ? '0' : '100%')};
    transition: height 0ms 0.4s ease, transform 0.4s 0ms ease;
    overflow: hidden;
`;

export const QuestionInnerContainer = styled.div`
    max-width: 720px;
    margin: 0 auto;
    padding: 0 16px;
`;

// Hatim başlığı ve "cüz seçin" yönergesi
export const QuestionItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    max-width: 720px;
    margin: 12px auto 0;
    padding: 8px 16px;
    text-align: center;
    color: var(--ink);
    font-size: ${({fontSize}) => (fontSize === '1.6rem' ? '1.35rem' : '1rem')};
    font-weight: ${({fontSize}) => (fontSize === '1.6rem' ? 800 : 600)};
    overflow-wrap: anywhere;

    ${({fontSize}) => fontSize === '1.6rem' && `
        margin: 16px auto 0;
        max-width: calc(720px - 32px);
        width: calc(100% - 32px);
        padding: 18px 16px;
        border-radius: var(--radius-lg);
        color: #fff;
        background-color: var(--emerald-800);
        background-image: var(--pattern), linear-gradient(135deg, var(--emerald-600), var(--emerald-900));
        box-shadow: var(--shadow);
    `}

    ${({fontSize}) => fontSize === '1.3rem' && `
        color: var(--muted);
        font-weight: 700;
    `}
`;

export const BackContainer = styled.div``;

export const BackButtonIcon = styled.img`
    height: ${({hide}) => (hide ? '30px' : '0')};
`;

export const RespondContainer = styled.div`
    visibility: ${({visibility}) => (visibility ? 'visible' : 'hidden')};
`;

export const RespondOuterContainer = styled.div`
    max-width: 720px;
    margin: 0 auto;
    padding: 12px 16px 8px;
`;

export const RespondInnerContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;

    & > div{
        display: flex;
        flex-direction: column;
        min-width: 0;
    }

    @media screen and (min-width: 480px){
        grid-template-columns: repeat(5, minmax(0, 1fr));
    }

    @media screen and (min-width: 768px){
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: 12px;
    }
`;

// Cüz kutusu: boşsa kesik çizgili beyaz, alınmışsa açık yeşil
export const ResponseItem = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    min-height: 84px;
    padding: 12px 6px;
    text-align: center;
    cursor: pointer;
    border-radius: var(--radius) var(--radius) ${({bgColor}) => (bgColor ? '0 0' : 'var(--radius) var(--radius)')};
    border: 1.5px ${({bgColor}) => (bgColor ? 'solid var(--emerald-200)' : 'dashed #c9bfa9')};
    background: ${({bgColor}) => (bgColor ? 'var(--emerald-50)' : 'var(--surface)')};
    transition: transform 0.1s ease;

    &:active{
        transform: scale(0.97);
    }
`;

// Cüz kutusunun altındaki "Çizelgeyi görüntüle" şeridi
export const ResponseTable = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 34px;
    margin-top: -1.5px;
    padding: 4px;
    border-radius: 0 0 var(--radius) var(--radius);
    border: 1.5px solid ${({bgColor}) => (bgColor ? 'var(--emerald-200)' : 'var(--gold-200)')};
    background: ${({bgColor}) => (bgColor ? 'var(--emerald-700)' : 'var(--gold-100)')};
    color: ${({bgColor}) => (bgColor ? '#fff' : 'var(--gold-600)')};
    font-size: 0.78rem;
    font-weight: 800;
    line-height: 1.2;
    text-align: center;
    cursor: pointer;

    ${({bgColor}) => !bgColor && `
        margin-top: 6px;
        border-radius: 999px;
    `}
`;

export const ResponseLogo = styled.img`
    display: none;
`;

// İlk metin cüz numarası, ikincisi (color prop'lu) cüzü alanın ismi
export const ResponseText = styled.div`
    max-width: 100%;
    overflow-wrap: anywhere;
    color: var(--ink);
    font-size: ${({color}) => (color ? '0.85rem' : '1.55rem')};
    font-weight: ${({color}) => (color ? 700 : 800)};
    line-height: 1.2;
    opacity: ${({color}) => (color ? 0.9 : 1)};
`;

export const Linker = styled.a`
    color: inherit;
`;

const spin = keyframes`
    to { transform: rotate(360deg); }
`;

export const LoadingContainer = styled.div`
    display: ${({visibility}) => (visibility ? 'flex' : 'none')};
    flex-direction: column;
    align-items: center;
    gap: 14px;
    position: fixed;
    z-index: 20;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(320px, calc(100vw - 32px));
    padding: 22px 20px;
    border-radius: var(--radius-lg);
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    box-shadow: var(--shadow-lg);
    text-align: center;

    &::before{
        content: '';
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 4px solid var(--emerald-100);
        border-top-color: var(--emerald-600);
        animation: ${spin} 0.9s linear infinite;
    }
`;

export const LoadingItem = styled.p`
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--emerald-900);
`;

export const DialogBox = styled.div`
    ${sheet};
    display: ${({visibility}) => (visibility ? 'flex' : 'none')};
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
`;

export const DialogContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
`;

export const DialogText = styled.div`
    color: var(--ink);
    text-align: center;
    font-size: 1.2rem;
    font-weight: 800;
    padding: 4px 44px 0;
`;

export const DialogLink = styled.div`
    padding: 12px;
    border-radius: 12px;
    background: var(--emerald-50);
    text-align: center;
`;

export const DialogIcon = styled.img`
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 2;
    width: 40px;
    height: 40px;
    padding: 10px;
    border-radius: 50%;
    background: var(--sand);
    cursor: pointer;
`;

export const DialogInputBox = styled.input`
    ${field};
    font-size: 1.1rem;
`;

/* Paylaş / kopyala: ekranın altında sabit iki buton */

const actionButton = `
    position: fixed;
    z-index: 30;
    bottom: calc(12px + var(--safe-bottom));
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 52px;
    border-radius: 14px;
    font-weight: 800;
    cursor: pointer;
    user-select: none;
    box-shadow: var(--shadow);
`;

export const CopyContainer = styled.div`
    ${actionButton}
    left: calc(50% + 5px);
    right: 16px;
    background: var(--surface);
    color: var(--emerald-700);
    border: 1.5px solid var(--emerald-600);

    @media screen and (min-width: 960px){
        left: 50%;
        right: auto;
        width: 300px;
        transform: translateX(-50%);
        border-radius: 999px;
    }
`;

export const CopyItem = styled.p`
    font-size: 1rem;
`;

export const CopyIcon = styled.img`
    width: 22px;
    height: 22px;
`;

export const ShareContainer = styled.div`
    ${actionButton}
    left: 16px;
    right: calc(50% + 5px);
    background: var(--emerald-700);
    color: #fff;

    img{
        filter: brightness(0) invert(1);
    }

    @media screen and (min-width: 960px){
        display: none;
    }
`;

export const ShareItem = styled.p`
    font-size: 1rem;
`;

export const ShareIcon = styled.img`
    width: 22px;
    height: 22px;
`;

/* Eski dosyalarda tanımlı, sayfalarda kullanılmayan gezinme bileşenleri */

export const Nav = styled.nav``;
export const NavbarContainer = styled.div``;
export const NavLogo = styled(LinkS)``;
export const MobileIcon = styled.div``;
export const NavMenu = styled.ul``;
export const NavItem = styled.li``;
export const NavLinks = styled(LinkS)``;
export const NavBtn = styled.nav``;
export const NavIcon = styled.a``;

// Cüz alma penceresindeki ana buton
export const NavBtnLink = styled.div.attrs({role: 'button', tabIndex: 0})`
    ${primaryButton};
`;

export const YeniHatimWrapper = styled.div`
    display: flex;
    justify-content: center;
    max-width: 720px;
    margin: 0 auto;
    padding: 16px;
`;

export const YeniHatimContainer = styled.div`
    width: 100%;
`;

export const YeniHatimButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    min-height: 56px;
    border: 2px dashed var(--emerald-500);
    border-radius: var(--radius);
    background: transparent;
    color: var(--emerald-700);
    font-size: 1rem;
    font-weight: 800;
    cursor: pointer;
`;

export const YeniHatimText = styled.span``;

export const YeniHatimIcon = styled(Add)`
    width: 26px;
`;

export const HatimHeaderContainer = styled.div`
    display: flex;
`;

export const HatimIconContainer = styled.div`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--gold-500);
    color: var(--emerald-900);
    cursor: pointer;
`;

export const HatimIconText = styled.div`
    font-size: 0.8rem;
`;

export const HideHatimIcon = styled(ChevronUp)`
    width: 24px;
`;

export const ShowHatimIcon = styled(ChevronDown)`
    width: 24px;
`;

export const CuzlerDescription = styled.div`
    margin: 12px 0 0;
    padding: 12px 16px;
    border-radius: var(--radius);
    background: var(--surface);
    border: 1px solid var(--line);
    text-align: center;
    color: var(--ink-soft);
    overflow-wrap: anywhere;
`;

export const CuzlerFinishDate = styled.div`
    margin: 12px 16px;
    text-align: center;
    color: var(--muted);
`;
