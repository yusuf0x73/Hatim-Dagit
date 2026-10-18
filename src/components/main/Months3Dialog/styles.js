



import styled from 'styled-components';
import { sheet, fieldLabel } from 'theme';


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
    font-size: 1.3rem;
    font-weight: 800;
    padding: 4px 44px 6px;
`

export const DialogTextSpan = styled.span`
    ${fieldLabel};
`

export const DialogLink = styled.div`
    padding: 14px;
    border-radius: 12px;
    background: var(--emerald-50);
    color: var(--emerald-800);
    font-size: 0.95rem;
    text-align: center;
    word-break: break-all;
`

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
`

export const DialogHeader = styled.div`
    display: flex;
    justify-content: center;
`;


export const OptionContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`

export const Option = styled.button`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    width: 100%;
    padding: 14px 16px;
    border-radius: 14px;
    border: 1.5px solid var(--emerald-200);
    background: var(--emerald-50);
    color: var(--emerald-900);
    text-align: start;
    cursor: pointer;

    &:active{
        background: var(--emerald-100);
    }
`;

export const OptionTitle = styled.span`
    font-size: 1rem;
    font-weight: 800;
    line-height: 1.35;
`;

export const OptionMeta = styled.span`
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--gold-600);
`;

export const OptionText = styled.p`
    padding: 12px 14px;
    border-radius: 12px;
    background: var(--cream);
    color: var(--ink-soft);
    font-size: 0.95rem;
    line-height: 1.5;
`;

export const PeriodNote = styled.p`
    margin-top: -6px;
    text-align: center;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--gold-600);
`;

export const BackLink = styled.button`
    align-self: flex-start;
    border: 0;
    background: none;
    color: var(--emerald-700);
    font-weight: 800;
    font-size: 0.95rem;
    cursor: pointer;
    padding: 4px 0;
`;

export const ModeRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: 14px 0 4px;
`;

export const ModeOption = styled.button`
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px;
    border-radius: 14px;
    border: 2px solid ${({active}) => (active ? 'var(--emerald-600)' : 'var(--line)')};
    background: ${({active}) => (active ? 'var(--emerald-50)' : 'var(--surface)')};
    color: var(--ink);
    text-align: left;
    cursor: pointer;

    strong{
        font-size: 1rem;
        font-weight: 800;
        color: ${({active}) => (active ? 'var(--emerald-700)' : 'var(--ink)')};
    }

    span{
        font-size: 0.82rem;
        line-height: 1.4;
        color: var(--muted);
    }
`;
