

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


export const TermsConditions = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState('hatims'); //hatims, myInfos

    const toggle = () => {
        setIsOpen(!isOpen);
    }

   const text = `
   Kullanıcı Sözleşmesi

Son Güncelleme Tarihi: 30.10.2024

Bu Kullanıcı Sözleşmesi ("Sözleşme"), Hatim Dağıt uygulamasını kullanan kullanıcılar ile Hatim Dağıt uygulaması arasında yapılmaktadır. Uygulamayı kullanarak, bu Sözleşme'yi kabul ettiğinizi beyan etmiş olursunuz. Bu Sözleşme'yi kabul etmiyorsanız, uygulamayı kullanmamalısınız.

1. Taraflar
Bu Sözleşme, Hatim Dağıt uygulamasını kullanan bireyler ("Kullanıcı") ile Hatim Dağıt uygulaması ("Hatim Dağıt") arasında yapılmıştır.

2. Hizmetin Amacı
Hatim Dağıt, kullanıcıların Kuran-ı Kerim cüzlerini alarak Hatim oluşturmalarını sağlayan bir hizmet sunar. Kullanıcılar bu uygulama aracılığıyla Hatim açabilir, cüz alabilir ve Hatimlerini tamamlayabilirler.

3. Kullanıcı Bilgileri ve Gizlilik
Uygulama aracılığıyla kullanıcıdan şu bilgiler toplanabilir:

- İsim ve soyisim (isteğe bağlı).
- Hatim bilgileri (Hatim ismi, türü ve bitiş tarihi).
- IP adresi ve teknik log verileri. Kullanıcı bilgileri Gizlilik Politikamızda belirtilen esaslar doğrultusunda işlenir ve korunur. Gizlilik Politikamızı inceleyebilirsiniz.

4. Kullanım Koşulları
- Kullanıcılar, uygulama üzerinden yalnızca Hatim oluşturma ve cüz alma işlemlerini gerçekleştirebilir.
- Kullanıcılar, başkalarının haklarını ihlal edecek veya uygulamanın işleyişine zarar verecek eylemlerde bulunamaz.
-Uygulamanın kötüye kullanımı tespit edildiğinde, kullanıcıların erişimi engellenebilir.

5. Kullanıcının Yükümlülükleri
- Kullanıcı, uygulamayı doğru ve yasalara uygun şekilde kullanacağını kabul eder.
- Kullanıcılar, kendi girdikleri bilgilerin doğruluğundan sorumludur.
- Kullanıcı, uygulamada yapacağı işlemlerin KVKK ve diğer ilgili mevzuata uygun olacağını kabul eder.

6. Sorumluluk Reddi
Hatim Dağıt uygulaması, hizmetin kesintisiz, hatasız veya tam güvenli olacağına dair herhangi bir garanti vermez.
Uygulamanın kullanımı sırasında oluşabilecek herhangi bir veri kaybı, hatalı işlem veya teknik aksaklıklardan dolayı Hatim Dağıt sorumlu tutulamaz.

7. Üçüncü Taraf Hizmetler
Uygulamada, Firebase ve Google Analytics gibi üçüncü taraf hizmet sağlayıcıları kullanılabilir. Bu hizmet sağlayıcıların gizlilik politikaları ve kullanım şartları geçerli olacaktır.

8. Fikri Mülkiyet Hakları
Hatim Dağıt uygulaması üzerindeki tüm fikri mülkiyet hakları Hatim Dağıt'a aittir. Uygulamanın kopyalanması, dağıtılması veya değiştirilmesi yasaktır.

9. Sözleşmenin Feshi
Bu Sözleşme, kullanıcıların uygulamayı kullanmaya devam ettikleri sürece geçerlidir. Uygulama, kullanıcıların bu Sözleşme'yi ihlal etmesi durumunda, herhangi bir bildirimde bulunmaksızın kullanıcıların erişimini durdurma hakkını saklı tutar.

10. Değişiklikler
Uygulama, bu Sözleşme'de zaman zaman değişiklik yapma hakkını saklı tutar. Değişiklikler, uygulamada yayınlandığı tarihten itibaren geçerli olacaktır.

11. İletişim
Bu Sözleşme ile ilgili herhangi bir sorunuz veya talebiniz için <a href='mailto:hep.beraber.okuyalim@gmail.com'>buradan</a> üzerinden bizimle iletişime geçebilirsiniz.

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

