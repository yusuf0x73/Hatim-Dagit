import styled from 'styled-components';
import {Link as LinkS} from 'react-scroll';
import {Link as LinkR} from 'react-router-dom';
import {FaTimes} from 'react-icons/fa';

export const SidebarContainer = styled.aside`
    position: fixed;
    z-index: 999;
    width: 100%;
    height: 100%;
    background-color: var(--emerald-900);
    background-image: var(--pattern);
    display: flex;
    flex-direction: column;
    justify-content: center;
    left: 0;
    transition: opacity 0.25s ease, top 0.3s ease;
    opacity: ${({ isOpen }) => (isOpen  ? '100%' : '0')};
    top: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
`;

export const CloseIcon = styled(FaTimes)`
    color: #fff;
`;

export const Icon = styled.div`
    position: absolute;
    top: 12px;
    right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
    font-size: 1.3rem;
    cursor: pointer;
`;

export const SidebarWrapper = styled.div`
    color: #fff;
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
    padding: 0 20px;
`
export const SidebarMenu = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 28px;
`

const sidebarLink = `
    display:flex;
    align-items:center;
    justify-content:center;
    min-height: 60px;
    padding: 0 20px;
    border-radius: 16px;
    background: #fff;
    border: 0;
    box-shadow: 0 4px 14px rgba(0,0,0,0.18);
    font-size: 1.2rem;
    font-weight: 800;
    text-decoration:none;
    list-style:none;
    transition: background 0.2s ease;
    color: var(--emerald-800);
    cursor: pointer;

    &:hover{
        background: var(--emerald-50);
        color: var(--emerald-900);
    }
`

export const SidebarLink = styled(LinkS)`
    ${sidebarLink}
`

export const SidebarLinkR = styled(LinkR)`
    ${sidebarLink}
`

export const SidebarBtnWrap = styled.div`
    display: flex;
    justify-content:center;
`

export const SidebarRouter = styled(LinkR)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 56px;
    border-radius: 16px;
    background: var(--gold-500);
    color: var(--emerald-900);
    font-size: 1.05rem;
    font-weight: 800;
    cursor: pointer;
    text-decoration:none;

    &:hover{
        background: var(--gold-200);
        color: var(--emerald-900);
    }
`
