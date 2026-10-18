//                                     BİSMİLLAHİRRAHMANİRRAHİM
//                                          ALLAHU  EKBER
//                                          ELHAMDÜLİLLAH


import React, {useState, useEffect} from 'react'
import {Nav, NavActions, NavbarContainer, NavLogo, MobileIcon, NavMenu, NavItem, NavLinks, NavLinksR, NavBtn, NavBtnLink, NavIcon, InstallContainer, InstallText} from './NavbarElements';
import Language from '../../../strings/index';
import { FaGithub } from "react-icons/fa";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import './navbar.css'
import { setLanguage } from "../../../common";
import { Menu2, Download } from 'tabler-icons-react';
import { LanguageButton } from '../LanguagePicker';
import { openAppDownload, isInstalledApp } from '../AppDownload';

const Navbar = ({ toggle }) => {

    const [scrollNav, setScrollNav] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);

    const changeNav = () => {
        if(window.scrollY >= 80){
            setScrollNav(true);
        }else{
            setScrollNav(false);
        }
    }

    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
    }


    

    useEffect(() => {

        window.addEventListener('scroll', changeNav, {passive: true})
        window.addEventListener('resize', handleWindowSizeChange);

        return () => {
            window.removeEventListener('scroll', changeNav);
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

let isMobile = (width <= 768);

    return (
       <>
        <Nav scrollNav={scrollNav}>
            <NavbarContainer>
                <NavLogo to="/"
                smooth={true}
                duration={500}
                spy={true}
                exact="true"
                >
                    <img src="/icons/app-icon-192.png" alt="" width={30} height={30} />
                    <span>{Language.Navbar.Logo}</span>
                </NavLogo>

                <InstallContainer id={"pwabutton"} aria-label={Language.App.Download}
                                  style={{display: isInstalledApp() ? 'none' : 'inline-flex'}} onClick={openAppDownload}>
                    <Download size={20} aria-label={Language.Navbar.Pwa} />
                    <InstallText>{Language.Navbar.Pwa}</InstallText>
                </InstallContainer>

                <NavActions>
                    <LanguageButton />
                    <MobileIcon onClick={toggle} aria-label={Language.Navbar.Menu}>
                        <Menu2 size={22} strokeWidth={2.2} />
                        <span>{Language.Navbar.Menu}</span>
                    </MobileIcon>
                </NavActions>
                <NavMenu>
                    <NavItem>
                        <NavLinksR
                        smooth={true}
                        duration={500}
                        spy={true}
                        exact="true"
                        offset={100}
                        to={Language.Navbar.LinkHelpers[0]}>{Language.Navbar.Links[0]}</NavLinksR>
                    </NavItem>
                    <NavItem>
                        <NavLinks
                        smooth={true}
                        duration={500}
                        spy={true}
                        exact="true"
                        offset={100}
                        to={Language.Navbar.LinkHelpers[1]}>{Language.Navbar.Links[1]}</NavLinks>
                    </NavItem>
                    <NavBtn>
                    <NavBtnLink
                    smooth={true}
                    duration={500}
                    spy={true}
                    exact="true"
                    offset={100}
                    onClick={()=>{
                        window.location.href = "mailto:hep.beraber.okuyalim@gmail.com";
                    }} >{Language.Navbar.Buttons[0]}</NavBtnLink>
                </NavBtn>
                    {/* <NavItem>
                        <NavLinks
                        smooth={true}
                        duration={500}
                        spy={true}
                        exact="true"
                        offset={100}
                        to={Language.Navbar.LinkHelpers[1]}>{Language.Navbar.Links[1]}</NavLinks>
                    </NavItem>
                    <NavItem>
                        <NavLinks
                        smooth={true}
                        duration={500}
                        spy={true}
                        exact="true"
                        offset={100}
                        to={Language.Navbar.LinkHelpers[2]}>{Language.Navbar.Links[2]}</NavLinks>
                    </NavItem>
                    <NavItem>
                        <NavLinks
                        smooth={true}
                        duration={500}
                        spy={true}
                        exact="true"
                        offset={100}
                        to={Language.Navbar.LinkHelpers[3]}>{Language.Navbar.Links[3]}</NavLinks>
                    </NavItem>
                    <NavItem>
                        <NavLinks
                        smooth={true}
                        duration={500}
                        spy={true}
                        exact="true"
                        offset={isMobile ? 50 : 200}
                        to={Language.Navbar.LinkHelpers[4]}>{Language.Navbar.Links[4]}</NavLinks>
                    </NavItem> */}
                </NavMenu>
               
                {/* <NavIcon href="https://github.com/Yusuf-YENICERI/" target="_blank">
                    <FaGithub></FaGithub>
                </NavIcon> */}
                
            </NavbarContainer>
        </Nav>
       </>
    )
};

export default Navbar
