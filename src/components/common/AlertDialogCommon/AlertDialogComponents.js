import styled from 'styled-components';
import { overlay, overlayCard } from 'theme';


export const Container = styled.div`
    ${overlay};
    z-index: 1000;
    display: ${({alertVisible})=>alertVisible ? "flex" : "none"};
`;


export const AlertContainer = styled.div`
    ${overlayCard};
`;

export const AlertLayout = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 20px 12px 8px;

    & > div:last-child{
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
`;

export const AlertText = styled.div`
    font-size: 1.1rem;
    font-weight: 700;
    line-height: 1.5;
    text-align: center;
    padding: 4px 8px 18px;
`;

const button = `
    min-height: 52px;
    padding: 0 16px;
    border-radius: 14px;
    font-size: 1.05rem;
    font-weight: 800;
    cursor: pointer;
`;

export const YesButton = styled.button`
    ${button}
    background: var(--emerald-700);
    color: #fff;
    border: 0;
`;

export const NoButton = styled.button`
    ${button}
    background: transparent;
    color: var(--danger);
    border: 1.5px solid var(--danger);
`;
