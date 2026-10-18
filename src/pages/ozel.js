//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React, {useState} from 'react'
import {useLocation} from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar'
import Footer from '../components/common/Footer';
import Pwa from '../components/common/Pwa';
import { CookiesBanner } from 'components/common/CookieConsent';
import OzelPage from 'components/ozel/OzelPage';

// Programlanabilir hatim ve sûre hatimleri (Yâsîn, Fetih, özel)
export const Ozel = () => {

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
            <OzelPage key={pathname} />
            <Footer/>
        </>
    )
}
