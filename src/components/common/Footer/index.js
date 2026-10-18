//                                          BİSMİLLAHİRRAHMANİRRAHİM


import React, {useEffect, useContext, useState} from 'react'
import Language from '../../../strings/index';
import { FooterContainer, FooterWrapper, FooterLinksContainer, FooterLinkWrapper, FooterLinkItems, FooterLinkTitle, FooterLink,
Business, BusinessWrap, BusinessLogo, WebsiteRights, BusinessIcons, BusinessIconLink, BusinessVisit, BusinessMainPage, BusinessFeedback, 
BusinessPrivacyPolicy,
BusinessTermsConditions,
BusinessCookies, BusinessDownload} from "./FooterElements";
import {Linker} from '../../main/Question/QuestionElements';
import { FaGithub } from "react-icons/fa";
import {DatabaseContext} from '../../../backend';
import {version} from '../../../common'
import {LanguagePills} from '../LanguagePicker';
import {openAppDownload, isInstalledApp} from '../AppDownload';
import {BrandGooglePlay} from 'tabler-icons-react';



const Footer = () => {
    const db = useContext(DatabaseContext);
    const [ziyaretSayisi, setZiyaretSayisi] = useState(0)

    useEffect( () => {

        const fetchData =  async () => {
            setZiyaretSayisi(await db.ziyaretSayisiGetir())
        }
        fetchData();

    }, [])

    return (
        <>
         <FooterContainer id="hakkimda" onClick={()=>{
            //  easyStorage.ref("projects").set({
            //      test: true
            //  })
         }}>
             <FooterWrapper>
                        
                 {/* <FooterLinksContainer>
                     <FooterLinkWrapper>
                         <FooterLinkItems>
                             <FooterLinkTitle>
                                 {Language.Footer.Title}
                             </FooterLinkTitle>
    <FooterLink to={Language.Navbar.LinkHelpers[0]}>{Language.Navbar.Links[0]}</FooterLink>
    <FooterLink to={Language.Navbar.LinkHelpers[1]}>{Language.Navbar.Links[1]}</FooterLink>
    <FooterLink to={Language.Navbar.LinkHelpers[2]}>{Language.Navbar.Links[2]}</FooterLink>
    <FooterLink to={Language.Navbar.LinkHelpers[3]}>{Language.Navbar.Links[3]}</FooterLink>
    <FooterLink to={Language.Navbar.LinkHelpers[4]}>{Language.Navbar.Links[4]}</FooterLink>

                         </FooterLinkItems>
                     </FooterLinkWrapper>
                 </FooterLinksContainer> */}

                 

                 <Business>
                 
                     <BusinessWrap>
                        <BusinessMainPage to="/">
                            {Language.Footer.GoToMainPage}
                        </BusinessMainPage>
                        <BusinessFeedback onClick={()=>window.location.href = "mailto:hep.beraber.okuyalim@gmail.com"}>
                            {Language.Footer.Feedback}
                        </BusinessFeedback>

                        {!isInstalledApp() &&
                            <BusinessDownload type="button" id="footerDownload" onClick={openAppDownload}>
                                <BrandGooglePlay size={22} />
                                {Language.App.Download}
                            </BusinessDownload>}

                        <div style={{margin: '18px 0 6px'}}>
                            <LanguagePills dark />
                        </div>


                         <BusinessLogo to="starting">
                             {Language.Navbar.Logo}
                         </BusinessLogo>
                         {/* <WebsiteRights>
                             {Language.Footer.websiteRights} <Linker href="http://carlcheo.com/startcoding" target="_blank">http://carlcheo.com/startcoding</Linker>
                         </WebsiteRights> */}
                         <BusinessIcons>
                             <BusinessIconLink href="https://github.com/Yusuf-YENICERI/" target="_blank" aria-label="Github">
                                 <FaGithub></FaGithub>
                             </BusinessIconLink>
                         </BusinessIcons>

                         
                         <BusinessVisit>{Language.Footer.ziyaret[0]} {ziyaretSayisi} {Language.Footer.ziyaret[1]}</BusinessVisit>
                         {Language.rtl ? <BusinessVisit>{version} {Language.Footer.version}  </BusinessVisit>
                                       : <BusinessVisit>{Language.Footer.version} {version} </BusinessVisit> 
                        }

                        <div style={{textAlign: 'center', marginTop: '20px', fontSize: '0.8em'}}>
                         {Language.Footer.aciz_kul.split("\n").map((item, index) => <p style={{marginTop: '5px'}} key={index}>{item}</p>)} 
                         </div>

<BusinessPrivacyPolicy to="/privacypolicy">
                            {Language.Footer.PrivacyPolicy}
                        </BusinessPrivacyPolicy>
                        <BusinessTermsConditions to="/termsconditions">
                            {Language.Footer.TermsConditions}
                        </BusinessTermsConditions>
                        <BusinessCookies to="/cookies">
                            {Language.Footer.Cookies}
                        </BusinessCookies>
                     </BusinessWrap>
                 </Business>
             </FooterWrapper>
             </FooterContainer>   
        </>
    )
}

export default Footer
