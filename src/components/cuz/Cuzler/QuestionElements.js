//                                  BİSMİLLAHİRRAHMANİRRAHİM
//                                      ALLAHU  EKBER
//                                      ELHAMDÜLİLLAH

import styled, {keyframes} from 'styled-components';
import {Add} from '@styled-icons/ionicons-outline';
import {Share, Copy} from 'tabler-icons-react';
import {sheet, field, primaryButton} from 'theme';

export const QuestionContainer = styled.div`
    background: var(--cream);
    position: relative;
    min-height: ${({minHeight}) => minHeight};
    padding-bottom: calc(96px + var(--safe-bottom));
`;

export const CardWrapper = styled.div`
    display: flex;
    justify-content: center;
    padding: 16px 16px 0;
`;

export const HatimContainer = styled.div`
    transform-origin: top;
    transform: ${({visibility}) => (!visibility ? 'scaleY(0)' : 'scaleY(1)')};
    height: ${({visibility}) => (!visibility ? '0' : '100%')};
    transition: height 0ms 0.4s ease, transform 0.4s 0ms ease;
    overflow: hidden;
`;

export const QuestionInnerContainer = styled.div``;

/* Birden fazla hatim varsa "1. hatim  [Gizle]" başlığı */
export const QuestionItem = styled.div`
    max-width: 720px;
    margin: 20px auto 0;
    padding: 0 16px;
    font-size: 1.05rem;
    font-weight: 800;
    color: var(--ink);
`;

// "1. hatim / 2. hatim" başlık şeridi: ızgaradan net ayrılsın diye koyu zemin
export const HatimIconTemplate = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 60px;
    padding: 10px 12px 10px 16px;
    border-radius: var(--radius);
    background-color: var(--emerald-800);
    background-image: var(--pattern);
    color: #fff;
    font-size: 1.1rem;
    text-transform: capitalize;
    box-shadow: var(--shadow);
`;

const smallPill = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 40px;
    padding: 0 16px;
    border-radius: 999px;
    font-size: 0.92rem;
    font-weight: 800;
    text-transform: none;
    cursor: pointer;
    user-select: none;
`;

export const HatimIconContainer = styled.div`
    ${smallPill}
    background: var(--gold-500);
    color: var(--emerald-900);
`;

export const DeleteHatimIconContainer = styled.div`
    ${smallPill}
    background: rgba(255,255,255,0.12);
    color: #ffd2cc;
    border: 1.5px solid rgba(255,210,204,0.5);
`;

export const HatimIconText = styled.div`
    font-size: 0.8rem;
`;

export const HideHatimIcon = styled.div``;

export const ShowHatimIcon = styled.div``;

export const DeleteHatimIcon = styled.div``;

export const CuzlerFinishDate = styled.div`
    margin: 16px;
    text-align: center;
    color: var(--muted);
`;

export const CuzlerDescription = styled.div`
    font-size: 1.05rem;
    text-align: center;
    margin: 0 24px;
`;

export const BackContainer = styled.div``;

export const BackButtonIcon = styled.img`
    height: ${({hide}) => (hide ? '30px' : '0')};
`;

/* ---------- Lejant + yenile ---------- */

export const GridToolbar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
    max-width: 720px;
    margin: 20px auto 0;
    padding: 0 16px;
`;

export const Legend = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px 14px;
`;

const legendColors = {
    free: 'background: #fff; border: 1.5px dashed #c9bfa9;',
    taken: 'background: var(--emerald-100); border: 1.5px solid var(--emerald-200);',
    read: 'background: var(--emerald-700); border: 1.5px solid var(--emerald-700);',
};

export const LegendItem = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.88rem;
    font-weight: 700;
    color: var(--ink-soft);

    &::before{
        content: '';
        width: 16px;
        height: 16px;
        border-radius: 5px;
        ${({kind}) => legendColors[kind]}
    }
`;

export const RefreshKhatmsContainer = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 40px;
    padding: 0 14px;
    border-radius: 999px;
    border: 1.5px solid var(--emerald-200);
    background: var(--surface);
    color: var(--emerald-700);
    cursor: pointer;
`;

export const RefreshKhatmsItem = styled.span`
    font-size: 0.9rem;
    font-weight: 800;
`;

export const RefreshKhatmsIcon = styled.img``;

export const GridHint = styled.p`
    max-width: 720px;
    margin: 12px auto 0;
    padding: 0 16px;
    text-align: center;
    font-size: 0.95rem;
    color: var(--muted);
`;

/* ---------- Cüz ızgarası ---------- */

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

    @media screen and (min-width: 480px){
        grid-template-columns: repeat(5, minmax(0, 1fr));
    }

    @media screen and (min-width: 768px){
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: 12px;
    }
`;

const tileTheme = ({taken, read}) => {
    if (read) return `
        background: var(--emerald-700);
        border: 1.5px solid var(--emerald-700);
        color: #fff;
    `;
    if (taken) return `
        background: var(--emerald-50);
        border: 1.5px solid var(--emerald-200);
        color: var(--ink);
    `;
    return `
        background: var(--surface);
        border: 1.5px dashed #c9bfa9;
        color: var(--ink);
    `;
};

export const ResponseItemContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: ${({taken}) => (taken ? 'var(--shadow-sm)' : 'none')};
    ${tileTheme}
    ${({mine}) => mine && `
        box-shadow: 0 0 0 2.5px var(--gold-500), var(--shadow-sm);
    `}
`;

export const ResponseItem = styled.div`
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    min-height: 86px;
    padding: 14px 6px 10px;
    text-align: center;
    cursor: pointer;
    transition: background 0.15s ease, transform 0.1s ease;

    &:active{
        transform: scale(0.97);
    }

    ${({bgColor}) => !bgColor && `
        @media (hover: hover){
            &:hover{ background: var(--emerald-50); }
        }
    `}
`;

export const ResponseLogo = styled.img`
    display: none;
`;

export const ResponseText = styled.div`
    font-size: 1.6rem;
    font-weight: 800;
    line-height: 1.1;
`;

export const ResponseName = styled.div`
    max-width: 100%;
    padding: 0 4px;
    font-size: 0.85rem;
    font-weight: ${({taken}) => (taken ? 700 : 600)};
    line-height: 1.25;
    opacity: ${({taken}) => (taken ? 0.95 : 0.55)};
    overflow-wrap: anywhere;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

export const MineBadge = styled.span`
    position: absolute;
    top: 6px;
    right: 6px;
    padding: 1px 7px;
    border-radius: 999px;
    background: var(--gold-500);
    color: var(--emerald-900);
    font-size: 0.66rem;
    font-weight: 800;
    letter-spacing: 0.02em;
`;

// Alınmış cüzün altındaki "Okunuyor / Okundu" şeridi
export const IsReadItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    min-height: 34px;
    padding: 4px;
    font-weight: 800;
    cursor: ${({bgColor}) => (bgColor ? 'default' : 'pointer')};
    background: ${({bgColor}) => (bgColor ? 'rgba(0,0,0,0.14)' : 'var(--gold-100)')};
    color: ${({bgColor}) => (bgColor ? '#fff' : 'var(--gold-600)')};
    border-top: 1px solid ${({bgColor}) => (bgColor ? 'rgba(255,255,255,0.15)' : 'var(--gold-200)')};
`;

export const IsReadText = styled.div`
    font-size: 0.8rem;
`;

export const Linker = styled.a`
    color: inherit;
`;

/* ---------- Yükleniyor ---------- */

const spin = keyframes`
    to { transform: rotate(360deg); }
`;

const shimmer = keyframes`
    from { background-position: -200% 0; }
    to { background-position: 200% 0; }
`;

const skeletonFill = `
    background: linear-gradient(90deg, var(--sand) 25%, #fbf6ec 50%, var(--sand) 75%);
    background-size: 200% 100%;
`;

// Veri gelene kadar sayfanın taslağı gösterilir; boş ekran yerine neyin geleceği belli olur
export const SkeletonPage = styled.div`
    max-width: 720px;
    margin: 0 auto;
    padding: 16px;

    & > *{
        animation: ${shimmer} 1.6s ease-in-out infinite;
    }
`;

export const SkeletonCard = styled.div`
    ${skeletonFill};
    height: 250px;
    border-radius: var(--radius-lg);
    margin-bottom: 20px;
`;

export const SkeletonGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    animation: none !important;

    @media screen and (min-width: 480px){
        grid-template-columns: repeat(5, minmax(0, 1fr));
    }

    @media screen and (min-width: 768px){
        grid-template-columns: repeat(6, minmax(0, 1fr));
    }
`;

export const SkeletonTile = styled.div`
    ${skeletonFill};
    height: 86px;
    border-radius: var(--radius);
    animation: ${shimmer} 1.6s ease-in-out infinite;
`;

// İskeletin üstünde duran, arkasını gösteren buzlu cam kutu
export const LoadingContainer = styled.div`
    display: ${({visibility}) => (visibility ? 'flex' : 'none')};
    flex-direction: column;
    align-items: center;
    gap: 12px;
    position: fixed;
    z-index: 20;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(340px, calc(100vw - 32px));
    padding: 22px 20px;
    border-radius: var(--radius-lg);
    border: 1px solid rgba(255,255,255,0.7);
    background: rgba(255, 255, 255, 0.62);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: var(--shadow-lg);
    text-align: center;

    ${({spinner}) => spinner && `
        &::before{
            content: '';
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 4px solid var(--emerald-100);
            border-top-color: var(--emerald-600);
        }
    `}

    &::before{
        animation: ${spin} 0.9s linear infinite;
    }
`;

export const LoadingItem = styled.p`
    font-size: 1.05rem;
    font-weight: 700;
    line-height: 1.45;
    color: var(--emerald-900);
`;

export const RetryButton = styled.button`
    ${primaryButton};
    min-height: 48px;
    font-size: 1rem;
`;

/* ---------- Cüz alma diyaloğu ---------- */

export const DialogBox = styled.div`
    ${sheet};
    display: ${({visibility}) => (visibility ? 'flex' : 'none')};
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
`;

export const DialogContainer = styled.div`
    display:flex;
    flex-direction:column;
    align-items: stretch;
`;

export const DialogText = styled.div`
    color: var(--ink);
    text-align:center;
    font-size: 1.2rem;
    font-weight: 800;
    padding: 4px 44px 0;
`;

export const DialogLink = styled.div`
    padding: 12px;
    border-radius: 12px;
    background: var(--emerald-50);
    text-align:center;
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

export const NavBtnLink = styled.div`
    ${primaryButton};
`;

/* ---------- Paylaş / kopyala çubuğu ---------- */

export const ActionBar = styled.div`
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 30;
    display: flex;
    gap: 10px;
    padding: 12px 16px calc(12px + var(--safe-bottom));
    background: var(--cream);
    border-top: 1px solid var(--line);

    @media screen and (min-width: 960px){
        left: 50%;
        right: auto;
        bottom: 20px;
        transform: translateX(-50%);
        width: 360px;
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 8px;
        box-shadow: var(--shadow-lg);
    }
`;

const actionButton = `
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 52px;
    padding: 0 12px;
    border-radius: 14px;
    font-weight: 800;
    cursor: pointer;
    user-select: none;
    transition: background 0.15s ease;

    @media screen and (min-width: 960px){
        border-radius: 999px;
    }
`;

export const ShareContainer = styled.div`
    ${actionButton}
    background: var(--emerald-700);
    color: #fff;

    @media screen and (min-width: 960px){
        display: none;
    }
`;

export const ShareItem = styled.span`
    font-size: 1rem;
`;

export const ShareIcon = styled(Share)``;

export const CopyContainer = styled.div`
    ${actionButton}
    background: ${({copied}) => (copied ? 'var(--emerald-50)' : 'var(--surface)')};
    color: var(--emerald-700);
    border: 1.5px solid var(--emerald-600);
`;

export const CopyItem = styled.span`
    font-size: 1rem;
`;

export const CopyIcon = styled(Copy)``;

/* ---------- Bu sayfaya yeni hatim ekle ---------- */

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
