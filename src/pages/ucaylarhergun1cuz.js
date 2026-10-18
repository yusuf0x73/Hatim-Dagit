//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React, {useState} from 'react'
import {useLocation} from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar'
import Footer from '../components/common/Footer';
import Pwa from '../components/common/Pwa';
import { CookiesBanner } from 'components/common/CookieConsent';
import LegacyKhatmPage from 'components/legacyKhatm/LegacyKhatmPage';

// 3 aylar boyunca günde 1 cüz (eski 3 aylar hatimleri)
export const UcAylarHerGun1Cuz = () => {

    const [isOpen, setIsOpen] = useState(false);
    // Başka bir hatme geçilince sayfa sıfırdan kurulur (arama, açık pencere vb. taşınmaz)
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
            <LegacyKhatmPage variant="ucaylarhergun1cuz" key={pathname} />
            <Footer/>
        </>
    )
}
