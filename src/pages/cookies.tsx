

import React, {useState, useEffect} from 'react'
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar'
import Question from '../components/main/Question'
import Footer from '../components/common/Footer';
import Pwa from '../components/common/Pwa';
import BottomNavigation from 'components/main/BottomNavigation';
import MyInfos from '../components/main/MyInfos'
import SorryMessage from 'components/common/SorryMessage';
import Language from 'strings';


export const Cookies = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState('hatims'); //hatims, myInfos

    const toggle = () => {
        setIsOpen(!isOpen);
    }

    const text = `
    Çerez Politikası

Son Güncelleme Tarihi: 30.10.2024

Bu Çerez Politikası, Hatim Dağıt uygulamasını kullanan kullanıcıların cihazlarına yerleştirilen çerezlerin (cookies) nasıl kullanıldığını açıklamaktadır. Uygulamamızı kullanarak, bu politikada belirtilen çerezlerin kullanımını kabul etmiş olursunuz.

1. Çerez Nedir?
Çerezler, bir web sitesi veya uygulama tarafından tarayıcınıza gönderilen ve cihazınıza kaydedilen küçük veri dosyalarıdır. Çerezler, ziyaret ettiğiniz sayfaları hatırlamak, kullanıcı tercihlerinizi saklamak ve uygulama performansını iyileştirmek için kullanılır.

2. Çerez Türleri
Hatim Dağıt uygulamasında aşağıdaki çerez türleri kullanılabilir:

Oturum Çerezleri: Bu çerezler, kullanıcı oturumu boyunca geçerlidir ve uygulama kapatıldığında veya oturum sona erdiğinde silinir. Bu çerezler, kullanıcı deneyimini iyileştirmek için kullanılır.

Analitik Çerezler: Google Analytics gibi üçüncü taraf hizmet sağlayıcılar aracılığıyla toplanan çerezler, kullanıcı davranışlarını anonim olarak analiz etmemize yardımcı olur. Bu çerezler, hangi sayfaların en çok ziyaret edildiğini, kullanıcıların uygulamada ne kadar süre geçirdiğini ve uygulamanın nasıl performans gösterdiğini anlamamıza olanak tanır.

3. Çerezlerin Kullanım Amaçları
Çerezler, aşağıdaki amaçlarla kullanılabilir:

Uygulama Performansı ve Güvenliği: Çerezler, uygulamanın hızlı çalışmasını ve kullanıcıların güvenliğini sağlamaya yardımcı olur.
Kullanıcı Deneyimini İyileştirme: Kullanıcı tercihlerini hatırlamak, dil ve ayar tercihlerini kaydetmek gibi kişiselleştirme amaçları için kullanılır.
Analitik ve Raporlama: Uygulamanın kullanımına dair anonim veriler toplanarak kullanıcı deneyimi geliştirilir.

4. Çerez Yönetimi
Çoğu tarayıcı, varsayılan olarak çerezleri otomatik olarak kabul eder. Ancak, tarayıcı ayarlarından çerezleri devre dışı bırakabilir veya silebilirsiniz. Çerezleri devre dışı bırakmanız durumunda, uygulamanın bazı özellikleri düzgün çalışmayabilir.

5. Üçüncü Taraf Çerezler
Hatim Dağıt uygulaması, Google Analytics gibi üçüncü taraf hizmet sağlayıcılar tarafından sunulan çerezleri kullanabilir. Bu çerezler, kullanıcıların uygulamayı nasıl kullandığını analiz etmek için anonim veri toplar. Bu hizmet sağlayıcıların çerez politikaları ve kullanım şartları geçerli olacaktır.

6. Çerez Politikası’nda Değişiklikler
Bu Çerez Politikası, gerektiğinde güncellenebilir. Yapılan değişiklikler, bu sayfada yayınlandığı tarihten itibaren geçerli olacaktır.
    `
   

    return (
        <>
            <Sidebar isOpen={isOpen} toggle={toggle}/>
            <Navbar toggle={toggle}/>
            {/* <SorryMessage /> */}
            <Pwa  />
            {Language.Navbar.Menu == 'Menü' && <div style={{padding: '24px 20px', margin: '16px auto 24px', maxWidth: 720, width: 'calc(100% - 32px)', textAlign: 'left', lineHeight: 1.7, color: 'var(--ink-soft)', backgroundColor: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflowWrap: 'anywhere'}}>
            {text.split("\n").map((satir, index) => (
    <React.Fragment key={index}>
      {satir.split(/(<a href='.*?'>.*?<\/a>)/g).map((parca, i) => {
        // Eğer parça <a> etiketi ise, href ve metni çıkar
        const linkMatch = parca.match(/<a href='(.*?)'>(.*?)<\/a>/);
        if (linkMatch) {
          const [_, href, text] = linkMatch;
          return (
            <a key={i} href={href}>
              {text}
            </a>
          );
        }
        return parca;
      })}
            <br />
    </React.Fragment>
  ))}
            </div> }
            <Footer/>
        </>
    )
}

