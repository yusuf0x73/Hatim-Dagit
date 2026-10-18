import styled from 'styled-components';
import { overlay, overlayCard } from 'theme';


export const Container = styled.div<{visible: boolean}>`
    ${overlay};
    z-index: 1000;
    display: ${({visible}) => (visible ? 'flex' : 'none')};
`;

export const YesNoContainer = styled.div`
    ${overlayCard};
`;

export const YesNoLayout = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 20px 12px 8px;
`;

export const YesNoText = styled.p`
    font-size: 1.2rem;
    font-weight: 800;
    text-align: center;
    padding: 4px 8px 16px;
`;

export const YesNoButtonContainer = styled.div`
    width: 100%;
`;

export const YesNoButtonLayout = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;

    button{
        height: 52px;
        font-size: 1.05rem;
    }
`;
