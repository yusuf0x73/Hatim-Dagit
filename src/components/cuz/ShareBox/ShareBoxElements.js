//                                  BİSMİLLAHİRRAHMANİRRAHİM
//                                      ALLAHU  EKBER
//                                      ELHAMDÜLİLLAH



import styled from 'styled-components';
import { sheet } from 'theme';


export const ShareBox = styled.div`
    ${sheet};
    display: ${({visibility}) => (visibility ? 'flex' : 'none')};
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
`

export const ShareContainer = styled.div`
    display:flex;
    flex-direction:column;
    align-items: stretch;
`;

export const ShareText = styled.div`
    color: var(--ink);
    text-align:center;
    font-size: 1.2rem;
    font-weight: 800;
    padding: 4px 44px 8px;
`


export const ShareIcon = styled.img`
    position: absolute;
    top: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
    padding: 10px;
    border-radius: 50%;
    background: var(--sand);
    cursor: pointer;
`

export const ShareItemContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    min-height: 68px;
    padding: 10px 14px;
    border: 1.5px solid var(--line);
    border-radius: var(--radius);
    background: var(--surface);
    cursor: pointer;

    &:active{
        background: var(--emerald-50);
    }
`;

export const ShareItemIcon = styled.span`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    border-radius: 14px;
    background: ${({whatsapp}) => (whatsapp ? '#25d366' : 'var(--emerald-600)')};
    color: #fff;
`;

export const ShareItemText = styled.span`
    font-size: 1.05rem;
    font-weight: 800;
    color: var(--ink);
`;
