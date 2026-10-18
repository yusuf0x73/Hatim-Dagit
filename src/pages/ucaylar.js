import React, {useState} from 'react'
import {useLocation} from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar'
import Footer from '../components/common/Footer';
import Pwa from '../components/common/Pwa';
import { CookiesBanner } from 'components/common/CookieConsent';
import UcAylar from 'components/ucaylar';

// Yeni 3 aylar hatimleri: her gün aynı sayfa / sûre, 10 ve 5 sayfalık planlar
export const UcAylarPage = () => {

    const [isOpen, setIsOpen] = useState(false);

    const {pathname} = useLocation();

    const toggle = () => {
        setIsOpen(!isOpen);
    }

    return (
        <>
            <Sidebar isOpen={isOpen} toggle={toggle}/>
            <Navbar toggle={toggle}/>
            <CookiesBanner />
            <Pwa />
            <UcAylar key={pathname} />
            <Footer/>
        </>
    )
}
