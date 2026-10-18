//                                  BİSMİLLAHİRRAHMANİRRAHİM
//                                      ALLAHU  EKBER
//                                      ELHAMDÜLİLLAH



import styled, { keyframes } from 'styled-components';
import { sheet, field, fieldLabel } from 'theme';


export const QuestionContainer = styled.div`
    background: var(--cream);
    padding-bottom: calc(var(--tabbar-h) + var(--safe-bottom) + 24px);
`;

/* ---------- Hero ---------- */

export const Hero = styled.header`
    position: relative;
    background-color: var(--emerald-900);
    background-image: var(--pattern), radial-gradient(120% 90% at 50% 0%, var(--emerald-700) 0%, var(--emerald-900) 70%);
    color: #fff;
    text-align: center;
    padding: 28px 20px 76px;
    overflow: hidden;

    &::after{
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -1px;
        height: 28px;
        background: var(--cream);
        border-radius: 28px 28px 0 0;
    }

    @media screen and (min-width: 768px){
        padding: 48px 24px 96px;
    }
`;

export const Bismillah = styled.p`
    font-family: var(--font-arabic);
    font-size: 1.7rem;
    line-height: 1.6;
    color: var(--gold-200);
    direction: rtl;
    margin-bottom: 10px;

    @media screen and (min-width: 768px){
        font-size: 2.2rem;
    }
`;

export const HeroTitle = styled.h1`
    font-size: 1.65rem;
    line-height: 1.25;
    font-weight: 800;
    max-width: 560px;
    margin: 0 auto;

    @media screen and (min-width: 768px){
        font-size: 2.4rem;
    }
`;

export const HeroText = styled.p`
    margin: 12px auto 0;
    max-width: 480px;
    font-size: 1.02rem;
    color: rgba(255,255,255,0.82);
`;

/* ---------- İçerik ---------- */

export const Content = styled.main`
    position: relative;
    z-index: 1;
    max-width: 640px;
    margin: -56px auto 0;
    padding: 0 16px;
`;

// Kartın üzerinden soldan sağa geçen parıltı; birkaç saniyede bir tekrarlar
const shine = keyframes`
    0% { transform: translateX(-120%) skewX(-20deg); }
    35%, 100% { transform: translateX(260%) skewX(-20deg); }
`;

const goldGlow = keyframes`
    0%, 100% { box-shadow: 0 0 0 0 rgba(200, 160, 71, 0.45), var(--shadow-lg); }
    50% { box-shadow: 0 0 0 6px rgba(200, 160, 71, 0), var(--shadow-lg); }
`;

export const PrimaryAction = styled.button`
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    padding: 20px 18px;
    border: 2.5px solid var(--gold-500);
    border-radius: var(--radius-lg);
    background: linear-gradient(135deg, var(--emerald-600) 0%, var(--emerald-800) 100%);
    color: #fff;
    text-align: start;
    cursor: pointer;
    box-shadow: var(--shadow-lg);
    /* box-shadow animasyonu her karede boyama yapar; birkaç kez atıp durur, parıltı devam eder */
    animation: ${goldGlow} 2.4s ease-in-out 3;
    transition: transform 0.12s ease;

    &::after{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 45%;
        height: 100%;
        background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,240,200,0.32) 50%, rgba(255,255,255,0) 100%);
        animation: ${shine} 3.2s ease-in-out infinite;
        will-change: transform;
        pointer-events: none;
    }

    &:active{
        transform: scale(0.985);
    }

    @media (prefers-reduced-motion: reduce){
        animation: none;
        &::after{ animation: none; }
    }

    @media (hover: hover){
        &:hover{
            transform: translateY(-2px);
        }
    }
`;

export const ActionIcon = styled.span`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: ${({ light }) => (light ? 'var(--emerald-50)' : 'rgba(255,255,255,0.14)')};
    color: ${({ light }) => (light ? 'var(--emerald-700)' : 'var(--gold-200)')};
`;

export const ActionBody = styled.span`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

export const ActionTitle = styled.span`
    font-size: ${({ large }) => (large ? '1.3rem' : '1.08rem')};
    font-weight: 800;
    line-height: 1.3;
`;

export const ActionDesc = styled.span`
    font-size: 0.95rem;
    line-height: 1.4;
    color: ${({ light }) => (light ? 'var(--muted)' : 'rgba(255,255,255,0.8)')};
`;

export const ActionArrow = styled.span`
    flex-shrink: 0;
    display: flex;
    color: ${({ light }) => (light ? 'var(--gold-500)' : 'var(--gold-200)')};

    [dir='rtl'] & { transform: scaleX(-1); }

    /* Arapçada (sağdan sola) ok ters yöne bakar */
    [dir='rtl'] & svg{
        transform: scaleX(-1);
    }
`;

export const SectionLabel = styled.h2`
    margin: 32px 4px 12px;
    font-size: 0.85rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
`;

/* Diğer hatim türleri: tek kart, ortak ve belirgin bir zemin */
export const OptionList = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--emerald-200);
    border-radius: var(--radius-lg);
    background-color: var(--emerald-100);
    background-image: linear-gradient(165deg, #d8efe3 0%, var(--emerald-100) 50%, #efe4c4 130%);
    box-shadow: var(--shadow-sm);
`;

export const OptionRow = styled.button`
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    min-height: 84px;
    padding: 14px 16px;
    border: 0;
    border-bottom: 1px solid rgba(17, 98, 74, 0.14);
    background: transparent;
    color: var(--ink);
    text-align: start;
    cursor: pointer;
    transition: background 0.15s ease;

    &:last-child{
        border-bottom: 0;
    }

    ${ActionIcon}{
        background: rgba(255, 255, 255, 0.75);
        color: var(--emerald-700);
    }

    &:active{
        background: rgba(255, 255, 255, 0.45);
    }

    @media (hover: hover){
        &:hover{
            background: rgba(255, 255, 255, 0.35);
        }
    }
`;

export const TitleLine = styled.span`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
`;

export const NewFeatureTag = styled.span`
    display: inline-block;
    padding: 2px 9px;
    border-radius: 999px;
    background: var(--gold-100);
    color: var(--gold-600);
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
`;

/* ---------- Nasıl çalışır ---------- */

export const Steps = styled.ol`
    list-style: none;
    display: grid;
    gap: 10px;

    @media screen and (min-width: 600px){
        grid-template-columns: repeat(3, 1fr);
    }
`;

export const Step = styled.li`
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 16px;
    border-radius: var(--radius);
    background: var(--surface);
    border: 1px solid var(--line);

    @media screen and (min-width: 600px){
        flex-direction: column;
        gap: 10px;
    }
`;

export const StepNum = styled.span`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--emerald-700);
    color: #fff;
    font-weight: 800;
`;

export const StepTitle = styled.strong`
    display: block;
    font-size: 1.02rem;
    font-weight: 800;
`;

export const StepText = styled.span`
    display: block;
    color: var(--muted);
    font-size: 0.95rem;
`;

export const Quote = styled.figure`
    margin: 28px 0 0;
    padding: 22px 20px;
    border-radius: var(--radius-lg);
    background: var(--gold-100);
    border: 1px solid var(--gold-200);
    text-align: center;
    color: var(--emerald-900);

    blockquote{
        font-size: 1.05rem;
        line-height: 1.6;
        font-weight: 600;
    }

    figcaption{
        margin-top: 8px;
        font-size: 0.85rem;
        font-weight: 800;
        color: var(--gold-600);
    }
`;

export const Linker = styled.a`
    color: inherit;
`

/* ---------- Diyaloglar (Hatim oluştur / link hazır) ---------- */

export const DialogBox = styled.div`
    ${sheet};
    display: ${({visibility}) => (visibility ? 'flex' : 'none')};
    flex-direction: column;
    align-items: stretch;
`

export const DialogContainer = styled.div`
    display:flex;
    flex-direction:column;
    align-items: stretch;
    gap: 14px;
`;

export const DialogText = styled.div`
    color: var(--ink);
    text-align:center;
    font-size: ${({fontSize}) => (fontSize === '20px' ? '1.3rem' : '1rem')};
    font-weight: ${({fontSize}) => (fontSize === '20px' ? 800 : 600)};
    padding: ${({fontSize}) => (fontSize === '20px' ? '4px 44px 6px' : '0')};
`

export const DialogTextSpan = styled.span`
    ${fieldLabel};
`

export const DialogLink = styled.div`
    opacity: ${({pending}) => (pending ? 0.6 : 1)};
    padding: 14px;
    border-radius: 12px;
    background: var(--emerald-50);
    border: 1.5px dashed var(--emerald-200);
    color: var(--emerald-800);
    font-size: 0.95rem;
    font-weight: 700;
    text-align: center;
    word-break: break-all;
`

// alignEnd=true olan ikon kapatma butonudur; sağ üst köşeye sabitlenir
export const DialogIcon = styled.img`
    width: 40px;
    height: 40px;
    padding: 10px;
    border-radius: 50%;
    background: var(--sand);
    align-self: center;
    cursor: pointer;
    flex-shrink: 0;
    ${({alignEnd}) => alignEnd && `
        position: absolute;
        top: 16px;
        right: 16px;
        z-index: 2;
    `}
`

export const CopyLinkButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 50px;
    padding: 0 18px;
    border: 1.5px solid var(--emerald-600);
    border-radius: 14px;
    background: ${({copied}) => (copied ? 'var(--emerald-50)' : 'transparent')};
    color: var(--emerald-700);
    font-size: 1rem;
    font-weight: 800;
    cursor: pointer;

    &:disabled{
        opacity: 0.45;
        cursor: wait;
    }
`

export const SheetNote = styled.p`
    padding: 12px 14px;
    border-radius: 12px;
    background: var(--gold-100);
    color: var(--gold-600);
    font-size: 0.92rem;
    font-weight: 700;
    text-align: center;
`

export const ErrorBox = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 14px;
    border-radius: 12px;
    background: var(--danger-soft);
    color: var(--danger);
    font-weight: 700;
    line-height: 1.45;
`

export const FieldRow = styled.div`
    display: flex;
    flex-direction: column;
`

export const DialogInputBox = styled.input`
    ${field};
`

export const DialogTextArea = styled.textarea`
    ${field};
    resize: vertical;
    min-height: 84px;
`
