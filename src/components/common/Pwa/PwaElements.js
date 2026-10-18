//                       BİSMİLLAHİRRAHMANİRRAHİM


import styled, {keyframes} from 'styled-components';
import { Share } from "@styled-icons/ionicons-outline";


const LoadingLogoAnimation = keyframes`
    0%{
        transform: scaleY(0);
    }

    100%{
        transform: scaleY(1);
    }
`;

export const PwaContainer = styled.div`
    z-index: 998;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: none;
    flex-direction: column;
    background: var(--surface);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    padding-bottom: var(--safe-bottom);
    box-shadow: 0 0 0 100vmax rgba(11, 30, 24, 0.55), var(--shadow-lg);
    transform-origin: bottom;
    animation:  ${LoadingLogoAnimation} 0.3s ease;
`;

export const PwaIconContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    flex-grow: 1;
`;

export const PwaIcon = styled.img`
width: 40px;
height: 40px;
padding: 10px;
margin: 16px 16px 0 0;
border-radius: 50%;
background: var(--sand);
cursor: pointer;
`;


export const PwaTextContainer = styled.div`
text-align: center;
padding: 8px 24px 32px;
flex-grow: 3;
`;

export const PwaTextDefault = styled.p`
    font-size: 1.05rem;
    line-height: 1.9;
`;

export const PwaTextStrong = styled.span`
    font-size: 1.1rem;
    font-weight: bolder;
    margin-left: 4px;
    margin-right: 4px;
`;


export const PwaAppleShareIcon = styled(Share)`
    color: #1c73ff;
    width: 30px;
    padding: 3px;
    background-color: var(--emerald-50);
    border: 1px solid var(--emerald-200);
    border-radius: 5px;
    margin-left: 4px;
    margin-right: 4px;
`;

