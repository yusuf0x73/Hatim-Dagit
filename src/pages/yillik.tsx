

import React, {useState, useEffect, useRef} from 'react'
import {useLocation} from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar'
import Question from '../components/main/Question'
import Footer from '../components/common/Footer';
import YillikDonerli from 'components/yillik';
import Pwa from '../components/common/Pwa';
import YillikTable from 'components/yillik/Table'
import button from "../icons/button.svg";
import SorryMessage from 'components/common/SorryMessage';
import { CookiesBanner } from 'components/common/CookieConsent';


export const Yillik = () => {

    const [isOpen, setIsOpen] = useState(false);
    const {pathname} = useLocation();
    const [cizelge, setCizelge] = useState(false);
    const [cizelgeId, setCizelgeId] = useState(0);
    const [keyHolder, setKeyHolder] = useState<{key:string|undefined, subKey:string|undefined}>({key:undefined, subKey:undefined})
    const cizelgeRef = useRef<HTMLDivElement>(null);


    const toggle = () => {
        setIsOpen(!isOpen);
    }

    const toggleCizelge = () => {
        if(cizelgeRef.current == null) return;
        cizelgeRef.current.style.zIndex = cizelge ? '-10' : '20';
        setCizelge(!cizelge)
    }

    const toggleCizelgeId = (id:number) => {
        setCizelgeId(id);
    }

    const changeKeyHolder = (value:{key:string|undefined, subKey:string|undefined}) => {
        setKeyHolder(value);
    }

    return (
        <>
            <Sidebar isOpen={isOpen} toggle={toggle}/>
            <Navbar toggle={toggle}/>
            {/* <SorryMessage /> */}
            <CookiesBanner />
            <Pwa />
            {/* <YillikTable cizelgeRef={cizelgeRef} toggleCizelge={toggleCizelge} cizelgeId={cizelgeId} data={undefined} /> */}
            <YillikDonerli key={pathname} />
            {/* <YillikDonerli  toggleCizelge={toggleCizelge} cizelgeId={cizelgeId} toggleCizelgeId={toggleCizelgeId}/> */}
            <Footer/>
        </>
    )
}

