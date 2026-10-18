

import React, {useState, useEffect} from 'react'
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar'
import Question from '../components/main/Question'
import Footer from '../components/common/Footer';
import Pwa from '../components/common/Pwa';
import BottomNavigation from 'components/main/BottomNavigation';
import MyKhatms from 'components/myKhatms';
import SorryMessage from 'components/common/SorryMessage';
import { CookiesBanner } from 'components/common/CookieConsent';


export const Home = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState('hatims'); //hatims, myInfos
    const [bottomNavigationVisible, setBottomNavigationVisible] = useState(true);

    const toggle = () => {
        setIsOpen(!isOpen);
    }

    const changePage = (value) => {
        setPage(value);
    }

    // const getOffset = (element) => {
    //     const rect = element?.getBoundingClientRect(),
    //       scrollTop =
    //         window.pageYOffset ||  document.documentElement.scrollTop;
      
    //     if(rect != null) return rect.top + scrollTop;
    //     else return scrollTop;
    //   };

    // const listenToScroll = () => {
    //     const heightToHideFrom =
    //   getOffset(document.querySelector("#hakkimda"))
    //     const winScroll = document.body.scrollTop ||
    //         document.documentElement.scrollTop;
      
    //     console.log(`height: ${heightToHideFrom}, winScroll: ${winScroll}`)

    //     if (winScroll > heightToHideFrom) {
    //        bottomNavigationVisible &&      // to limit setting state only the first time
    //          setBottomNavigationVisible(false);
    //     } else {
    //          setBottomNavigationVisible(true);
    //     }
    // };

    // useEffect(() => {
    //     window.addEventListener("scroll", listenToScroll);
    //     return () =>
    //        window.removeEventListener("scroll", listenToScroll);
    // }, [])
    

   

    return (
        <>
            <Sidebar isOpen={isOpen} toggle={toggle}/>
            <Navbar toggle={toggle}/>
            {/* <SorryMessage /> */}
            <CookiesBanner />
            <Pwa  />
            { page == "hatims" && <Question />}
            { page == "myInfos" && <MyKhatms />}
            <BottomNavigation bottomNavigationVisible={bottomNavigationVisible} page={page} changePage={changePage} />
            <Footer/>
        </>
    )
}

