







import React, {useState} from 'react'
import { Container, HatimsContainer, HatimsTemplate, MyInfosContainer, MyInfosTemplate, Template, Seperator, HatimsIcon, HatimsText, MyInfosIcon, MyInfosText, HatimsWrapper, MyInfosWrapper } from './styles'
import { Book, ChartDonut4 } from 'tabler-icons-react';
import Language from '../../../strings';

const BottomNavigation = ({page, changePage, bottomNavigationVisible}: {page: string, changePage: (value: string) => {},
bottomNavigationVisible: boolean}) => {

  if(!bottomNavigationVisible) return (<></>)

  return (
    <Container>
      <Template>
        
        <HatimsContainer onClick={()=>{
          changePage("hatims")
        }}>
          <HatimsTemplate>
            <HatimsWrapper active={page == "hatims" ? false : true}>
              <HatimsIcon>
                  <Book
                    size={26}
                    strokeWidth={2}
                    color={'currentColor'}
                  />
              </HatimsIcon>
              <HatimsText>
                {Language['/'].BottomNavigation.NewKhatm}
              </HatimsText>
            </HatimsWrapper>
          </HatimsTemplate>
        </HatimsContainer>
        
        <Seperator />

        <MyInfosContainer onClick={()=>{
          changePage("myInfos")
        }}>
          <MyInfosTemplate>
            <MyInfosWrapper active={page == "myInfos" ? false : true}>
              <MyInfosIcon>
              <ChartDonut4
                size={26}
                strokeWidth={2}
                color={'currentColor'}
              />
              </MyInfosIcon>
              <MyInfosText>
              {Language['/'].BottomNavigation.KhatmInfos}
              </MyInfosText>
            </MyInfosWrapper>
          </MyInfosTemplate>
        </MyInfosContainer>

      </Template>
    </Container>
  )
}

export default BottomNavigation