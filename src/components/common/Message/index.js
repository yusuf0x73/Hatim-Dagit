






import React from 'react'
import {Container, MessageButton, MessageLayout, MessageMain, MessageContainer} from './MessageElements'
import { Timeline, Text, ScrollArea, Title, MantineProvider, Divider, Card } from '@mantine/core';
import { GitBranch, GitPullRequest, GitCommit, MessageDots, ArrowBigRight, ArrowBigLeft } from 'tabler-icons-react';
import db from '@yusuf-yeniceri/easy-storage';
import { showNotification } from '@mantine/notifications';
import { useState, useRef, useEffect } from 'react';

const Message = () => {


    const [endOfScroll, setEndOfScroll] = useState(false)
    const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 });
    const scrollAreaRef = useRef()

    

  return (
    <MantineProvider
    theme={{
        fontFamily: 'inherit',
    }}
  >
    <Container id="message">
        <MessageContainer>
            <MessageLayout>
            <ScrollArea onScrollPositionChange={({x, y})=>{
                console.log(`${(scrollAreaRef.current.scrollHeight - scrollAreaRef.current.scrollTop)} > ${(scrollAreaRef.current.clientHeight)}`)
                if((scrollAreaRef.current.scrollHeight - scrollAreaRef.current.scrollTop) > (scrollAreaRef.current.clientHeight*3)){
                    setEndOfScroll(false);
                }else{
                    setEndOfScroll(true);
                }
            }} viewportRef={scrollAreaRef} style={{height: '380px',  borderRadius: '10px'}} type="always" >
            <Text sx={(theme)=>({
                fontSize: '1.8em',
                textAlign: 'center',
                color: '#00ba47'
            })}>Selamunaleyküm, <br></br> sayın Hatim Dağıt kullanıcısı</Text>

            <Divider my="sm"></Divider>
            <Text sx={(theme)=>({
                fontSize: '1.3em',
            })}><ArrowBigRight size={20} style={{color: '#00ba47'}}></ArrowBigRight> Size uygulamamızın nasıl geliştirildiğinden ve nasıl bize yardımcı olabileceğinizden bahsetmek istiyoruz</Text>
            <Divider my="sm"></Divider>
                
                <MessageMain>
                    {/* remove the [] from 1,2,3,4,5 */}
                    <Timeline color="green" active={[1,2,3,4,5]} bulletSize={30} lineWidth={2} styles={{
                        itemTitle:{lineHeight: '25px', fontSize: '1em', letterSpacing: '1px'},
                    }}>
                        <Timeline.Item  bullet={<GitBranch size={12} />} title="Yeni bir özellik eklenmesi gerektiğinde, kendi bilgisayarlarımızda gerekli kodları yazıyoruz">
                        <div style={{height: '10px'}}></div>
                        </Timeline.Item>

                        <Timeline.Item  bullet={<GitCommit size={12} />} title="Yazılan kodlarla özellik hazır hale geldiğinde, yazılan kodlar test ediliyor. Bu testler sanki bir kullanıcı siteyi ziyaret ediyormuş gibi yapılıyor inşaAllah">
                        <div style={{height: '10px'}}></div>
                        
                        </Timeline.Item>

                        <Timeline.Item title="Daha sonra yazılan kodlar internete yükleniyor" bullet={<GitPullRequest size={12} />} lineVariant="dashed">
                        <div style={{height: '10px'}}></div>
                        
                        </Timeline.Item>

                        <Timeline.Item title="Yüklenilen kodlar ikinci kez test ediliyor, herhangi bir hata varsa, kodlar yayınlanmıyor" bullet={<MessageDots size={12} />}>
                        <div style={{height: '10px'}}></div>
                        </Timeline.Item>

                        <Timeline.Item bullet={<GitBranch size={12} />} title="Eğer herhangi bir hata ile karşılaşılmazsa, kodlar yükleniyor ve kullanılmaya başlanıyor">
                        <div style={{height: '10px'}}></div>
                        </Timeline.Item>
                    </Timeline>
                </MessageMain>
                
                <Divider mt="40px" my="sm"></Divider>
                    <Text sx={(theme)=>({
                        fontSize: '1.3em',
                        letterSpacing: '0.02em'
                    })}><ArrowBigLeft size={20} style={{color: '#00ba47'}}></ArrowBigLeft> Sizden beklediğimiz, eğer herhangi bir hata ile karşılaşırsanız, bunu bize sayfanın sonunda bulunan <strong><i>Geri Bildirim Yap</i></strong> butonuna tıklayarak bildirmeniz.</Text>
                <Divider my="sm"></Divider>

                <Text my="30px" sx={(theme)=>({
                fontSize: '1.8em',
                textAlign: 'center',
                color: '#00ba47'
                })}>Okuduğunuz için, <br></br> Allah razı olsun.</Text>

                </ScrollArea>
                <MessageButton onClick={()=>{
                    if(!endOfScroll){
                        showNotification({
                            title: 'Uyarı',
                            message: 'Lütfen ekranı yukarı kaydırarak, yapılan tüm bilgilendirmeyi okuyun! Bilgilendirmeyi okumadan bu ekranı geçemezsiniz.',
                            color: 'red',
                            id: 'scroll-down'
                        })
                    }else{
                        db.ref("message").set({
                            read:true
                        })
                        document.getElementById('message').style.zIndex=-1;
                    }
                }}>Tamam</MessageButton>

            </MessageLayout>
        </MessageContainer>
    </Container>
    </MantineProvider>
  )
}

export default Message