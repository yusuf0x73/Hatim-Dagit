






import React, {useState} from 'react'
import { ShareBox, ShareContainer, ShareText, ShareLink, ShareIcon, ShareInputBox, ShareItemContainer, ShareItemIcon, ShareItemText } from "./ShareBoxElements";
import LanguageData from '../../../strings';
import close from '../../../icons/close.svg';
import { MessageCircle, BrandWhatsapp } from 'tabler-icons-react';


const ShareDialogBox = ({hatimHeader, shareBoxVisibility, changeShareBoxVisibility}) => {

    const [hideShareBox, setHideShareBox] = useState(false);

    return (
        <>
            <ShareBox visibility={shareBoxVisibility}>
                <ShareIcon src={close} onClick={
                        ()=>{
                            changeShareBoxVisibility();
                        }
                    } />

                <ShareText fontSize={"20px"}>
                     {LanguageData["/cuz"].ShareBox.Title}
                </ShareText>

                <ShareItemContainer onClick={()=>{
                    let newLocation = window.location.href.replace("localhost:3000","hatimdagit.com")
                    newLocation = newLocation.replace("hatim-dagit.web.app","hatimdagit.com")
                    if(navigator.userAgent.match(/Android/i)){
                        window.open('sms:?body=' + hatimHeader + "%0A%0A" + newLocation, '_blank')
                    }else{
                        window.open('sms:&body=' + hatimHeader + "%0A%0A" +newLocation, '_blank')
                    }
                }}>
                    <ShareItemIcon><MessageCircle size={24} /></ShareItemIcon>
                    <ShareItemText>{LanguageData["/cuz"].ShareBox.Sms}</ShareItemText>
                </ShareItemContainer>


                <ShareItemContainer onClick={()=>{
                    let newLocation = window.location.href.replace("localhost:3000","hatimdagit.com")
                    newLocation = newLocation.replace("hatim-dagit.web.app","hatimdagit.com")
                    window.open("whatsapp://send?text=" + hatimHeader + "%0A%0A" + newLocation)
                }}>
                    <ShareItemIcon whatsapp><BrandWhatsapp size={24} /></ShareItemIcon>
                    <ShareItemText>{LanguageData["/cuz"].ShareBox.Whatsapp}</ShareItemText>
                </ShareItemContainer>



            </ShareBox>

        </>
    )
}

export default ShareDialogBox
