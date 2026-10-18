//                                     BİSMİLLAHİRRAHMANİRRAHİM
//                                          ALLAHU  EKBER
//                                          ELHAMDÜLİLLAH


import React, {useState, useEffect} from 'react'
import {Container, Header, HeaderTitle, Content, SectionLabel, List, Row, RowLink, RowIcon, RowTitle, RowArrow,
    RemoveButton} from './styles';
import Language from '../../../strings/index';
import {DatabaseContext} from '../../../backend';
import {Book, ChartDonut4, ChevronRight, X} from 'tabler-icons-react';

const Constr = ({toggle}: {toggle: ()=>{}}) => {
    return <DatabaseContext.Consumer>
                    {
                        firebase => {

                        return <Question toggle={toggle} firebase={firebase}></Question>

                    }
                }
            </DatabaseContext.Consumer>
}

const Question = ({ firebase, toggle } : {toggle: ()=>{}, firebase: any}) => {

    const [hideMevcutHatimler, setHideMevcutHatimler] = useState(false);
    const [mevcutHatimler, setMevcutHatimler] = useState<string[]>([]);
    const [mevcutHatimlerBaslik, setMevcutHatimlerBaslik] = useState<string[]>([]);

    useEffect(() => {
        let localStorageCuzKeylerArr = JSON.parse(localStorage.getItem("CuzKeyler") ?? "{}");
        if(localStorageCuzKeylerArr == null || localStorageCuzKeylerArr.length == 0) return;
        setHideMevcutHatimler(!hideMevcutHatimler);
        setMevcutHatimler(localStorageCuzKeylerArr)

        let localStorageCuzKeylerBaslikArr = JSON.parse(localStorage.getItem("CuzKeylerBaslik") ?? "{}");
        if(localStorageCuzKeylerBaslikArr == null || localStorageCuzKeylerBaslikArr.length == 0) return;
        setMevcutHatimlerBaslik(localStorageCuzKeylerBaslikArr)
    }, []);


    const removeKhatm = (index: number) => {
        let localStorageCuzKeylerArr = JSON.parse(localStorage.getItem("CuzKeyler") ?? "{}");
        if(localStorageCuzKeylerArr == null) {
            alert('Hata var!');
            return;
        }
        localStorageCuzKeylerArr.splice(index, 1);
        localStorage.setItem("CuzKeyler", JSON.stringify(localStorageCuzKeylerArr))

        let localStorageCuzKeylerArrBaslik = JSON.parse(localStorage.getItem("CuzKeylerBaslik") ?? "{}");
        localStorageCuzKeylerArrBaslik.splice(index, 1)
        localStorage.setItem("CuzKeylerBaslik", JSON.stringify(localStorageCuzKeylerArrBaslik))

        setMevcutHatimler(localStorageCuzKeylerArr);
        setMevcutHatimlerBaslik(localStorageCuzKeylerArrBaslik);
    }

    return (
        <Container>
            <Header>
                <HeaderTitle>{Language["/"].MyInfos}</HeaderTitle>
            </Header>

            <Content>
                <List>
                    <Row as="button" onClick={()=>{ window.location.href = "/cizelgelerim" }}>
                        <RowIcon><ChartDonut4 size={26} strokeWidth={1.8} /></RowIcon>
                        <RowTitle>{Language["/"].Button.MyInfos?.Charts}</RowTitle>
                        <RowArrow><ChevronRight size={22} /></RowArrow>
                    </Row>
                </List>

                {hideMevcutHatimler && mevcutHatimler.length > 0 && <>
                    <SectionLabel>{Language["/"].ExistingKhatms}</SectionLabel>
                    <List>
                        {mevcutHatimler.map((item, index) => (
                            <Row key={item}>
                                <RowLink href={"/cuz/" + item}>
                                    <RowIcon><Book size={24} strokeWidth={1.8} /></RowIcon>
                                    <RowTitle>{mevcutHatimlerBaslik[index]}</RowTitle>
                                </RowLink>
                                <RemoveButton aria-label="Sil" onClick={() => removeKhatm(index)}>
                                    <X size={20} />
                                </RemoveButton>
                            </Row>
                        ))}
                    </List>
                </>}
            </Content>
        </Container>
    )
};

export default Constr
