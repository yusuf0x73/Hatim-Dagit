import styled from 'styled-components';
import {Link as LinkR} from 'react-router-dom';
import {Link as LinkS} from 'react-scroll';

export const FooterContainer = styled.footer`
    background-color: var(--emerald-900);
    background-image: var(--pattern);
    overflow-x: hidden;
    color: rgba(255,255,255,0.85);
    padding-bottom: calc(var(--tabbar-h) + var(--safe-bottom));
`;

export const FooterWrapper = styled.div`
    padding: 40px 20px 32px;
    max-width: 640px;
    margin: 0 auto;
`;

export const FooterLinksContainer = styled.div`
    display: flex;
    justify-content: center;
`;

export const FooterLinkWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

export const FooterLinkItems = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const FooterLinkTitle = styled.h1`
    font-size: 14px;
    margin-bottom: 16px;
`;

export const FooterLink = styled (LinkS)`
    color: #fff;
    text-decoration: none;
    font-size: 14px;
`;

export const Business = styled.div`
    width: 100%;
`;

export const BusinessWrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

export const BusinessLogo = styled (LinkS)`
    order: -2;
    color: #fff;
    cursor: pointer;
    text-decoration: none;
    font-size: 1.3rem;
    font-weight: 800;
    margin-bottom: 4px;
`;

export const WebsiteRights = styled.small`
    color: #fff;
`;

export const BusinessIcons = styled.div`
    order: -1;
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
`;

export const BusinessIconLink = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    color: #fff;
    font-size: 20px;
`;

export const BusinessVisit = styled.p`
    margin-top: 6px;
    font-size: 0.85rem;
    color: rgba(255,255,255,0.7);
`;

export const BusinessVersion = styled.p`
    margin-top: 6px;
    font-size: 0.85rem;
`;

const pillLink = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding: 0 18px;
    margin: 4px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    font-size: 0.9rem;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
`

export const BusinessMainPage = styled (LinkR)`
    ${pillLink}
    background: #fff;
    border-color: #fff;
    color: var(--emerald-800);
`;

export const BusinessFeedback = styled.div`
    ${pillLink}
    background: var(--gold-500);
    border-color: var(--gold-500);
    color: var(--emerald-900);
    margin-bottom: 20px;
`;

const smallLink = `
    font-size: 0.85rem;
    color: rgba(255,255,255,0.75);
    text-decoration: underline;
    text-underline-offset: 3px;
    margin-top: 10px;
`

export const BusinessPrivacyPolicy = styled (LinkR)`
    ${smallLink}
    margin-top: 24px;
`;

export const BusinessTermsConditions = styled (LinkR)`
    ${smallLink}
`;

export const BusinessCookies = styled (LinkR)`
    ${smallLink}
`;

// "Uygulamayı indir": koyu zemin üzerinde Google Play rengiyle öne çıkan buton
export const BusinessDownload = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 52px;
    margin-top: 12px;
    padding: 0 24px;
    border-radius: 999px;
    border: 2px solid var(--gold-500);
    background: #111;
    color: #fff;
    font-size: 1rem;
    font-weight: 800;
    cursor: pointer;

    svg{
        color: #3ddc84;
    }
`;
