//                                  BİSMİLLAHİRRAHMANİRRAHİM
//                                      ALLAHU  EKBER
//                                      ELHAMDÜLİLLAH



import React from 'react';
import styled from 'styled-components';
import { Link as LinkR } from 'react-router-dom';
import { Link as LinkS } from 'react-scroll';
import { primaryButton } from 'theme';


export const Nav = styled.nav`
    background: ${({scrollNav}) => (scrollNav ? 'rgba(11, 61, 46, 0.97)' : 'var(--emerald-900)')};
    box-shadow: ${({scrollNav}) => (scrollNav ? '0 4px 16px rgba(0,0,0,0.18)' : 'none')};
    height: var(--nav-h);
    display:flex;
    justify-content:center;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 50;
    transition: box-shadow 0.3s ease, background 0.3s ease;
`

export const NavbarContainer = styled.div`
    display:flex;
    justify-content:space-between;
    align-items: center;
    gap: 10px;
    height: var(--nav-h);
    width: 100%;
    padding: 0 16px;
    max-width: 1100px;
`
export const NavLogo = styled(LinkR)`
    display:flex;
    min-width: 0;

    span{
        overflow: hidden;
        text-overflow: ellipsis;
    }

    svg{
        flex-shrink: 0;
    }

    /* Uygulama ikonu */
    img{
        flex-shrink: 0;
        display: block;
        border-radius: 8px;
        box-shadow: 0 0 0 1px rgba(236, 220, 174, 0.35), 0 2px 6px rgba(0, 0, 0, 0.25);
    }

    align-items: center;
    gap: 10px;
    color: #fff;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: 800;
    letter-spacing: 0.01em;
    text-decoration: none;
    white-space: nowrap;

    @media screen and (max-width: 400px){
        gap: 8px;
        font-size: 1.08rem;
    }
`
export const NavActions = styled.div`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 8px;
    margin-left: auto;
`

export const MobileIcon = styled.button`
    display: none;

    @media screen and (max-width: 768px){
        display: inline-flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
        min-height: 40px;
        padding: 0 12px;
        border: 1px solid rgba(255,255,255,0.22);
        border-radius: 999px;
        background: rgba(255,255,255,0.08);
        color: #fff;
        font-size: 0.95rem;
        font-weight: 700;
        cursor: pointer;
    }

    /* Dar ekranda "Hatim Dağıt" yazısı sığsın diye sadece ikon */
    @media screen and (max-width: 380px){
        width: 40px;
        padding: 0;
        justify-content: center;

        span{
            display: none;
        }
    }
`

export const NavMenu = styled.ul`
    display: flex;
    align-items: center;
    gap: 4px;
    list-style: none;
    text-align: center;

    @media screen and (max-width: 768px){
        display: none;
    }
`

export const NavItem = styled.li`
    height: var(--nav-h);
`

const navLink = `
    color: rgba(255,255,255,0.88);
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 0.9rem;
    height: 100%;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 700;
    border-bottom: 3px solid transparent;

    &:hover{
        color: #fff;
    }

    &.active{
        border-bottom-color: var(--gold-500);
    }
`

export const NavLinks = styled(LinkS)`
    ${navLink}
`

export const NavLinksR = styled(LinkR)`
    ${navLink}
`
export const NavBtn = styled.nav`
    display:flex;
    align-items: center;
    margin-left: 8px;

    /* Üst bardaki geribildirim butonu küçük altın bir hap olarak kalır */
    & > a, & > button{
        width: auto;
        min-height: 40px;
        margin: 0;
        padding: 8px 18px;
        font-size: 0.9rem;
        background: var(--gold-500);
        color: var(--emerald-900);
        box-shadow: none;
    }

    & > a:hover, & > button:hover{
        background: var(--gold-200);
        color: var(--emerald-900);
    }

    @media screen and (max-width: 768px){
        display: none;
    }
`

// Diyaloglarda ana eylem butonu olarak da kullanılıyor; "to" verilmezse (diyalog butonu) düz buton olur.
// Eskiden "to"suz bir router Link'iydi ve tıklanınca hata verip sayfayı kilitliyordu.
// eslint-disable-next-line no-unused-vars
const LinkOrButton = ({to, smooth, duration, spy, exact, offset, ...props}) =>
    (to ? <LinkR to={to} {...props} /> : <button type="button" {...props} />);

export const NavBtnLink = styled(LinkOrButton)`
    ${primaryButton};
    margin-top: 20px;
`

export const NavIcon = styled.a`
    color: var(--gold-500);
    display:flex;
    align-items: center;
    font-size: 32px;

    @media screen and (max-width: 768px){
        display: none;
    }
`

export const InstallContainer = styled.div`
    display: none;
    flex-shrink: 0;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    min-height: 40px;
    padding: 6px 12px;
    color: var(--gold-200);
    border: 1px solid var(--gold-500);
    border-radius: 999px;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
`;

// Dar ekranda sadece indirme ikonu kalır; dil ve menü butonlarına yer açılır
export const InstallText = styled.span`
    @media screen and (max-width: 560px){
        display: none;
    }
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--gold-200);
    white-space: nowrap;
`;
