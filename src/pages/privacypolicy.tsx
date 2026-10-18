

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


export const PrivacyPolicy = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState('hatims'); //hatims, myInfos

    const toggle = () => {
        setIsOpen(!isOpen);
    }

    const text = `
    Gizlilik Politikası

Son Güncelleme Tarihi: 30.10.2024

Bu Gizlilik Politikası, Hatim Dağıt uygulamasını kullanan kullanıcıların kişisel verilerinin nasıl toplandığını, kullanıldığını, saklandığını ve korunduğunu açıklamaktadır. Uygulamamızı kullanarak, bu Gizlilik Politikası'nda belirtilen koşulları kabul etmiş olursunuz.

1. Toplanan Bilgiler
Uygulamamız, kullanıcılardan aşağıdaki bilgileri toplar:

İsim ve Soyisim: İsteğe bağlı olarak, cüz almak için isim ve soyisim bilgisi talep edilebilir. Bu bilgiyi vermek zorunlu değildir.
Hatim Bilgileri: Hatmin ismi, bitiş tarihi ve türü gibi bilgiler.
IP Adresi ve Diğer Loglar: Firebase Realtime Database ve  Cloud Logging(Google Cloud) sistemi aracılığıyla IP adresi, HTTP talepleri ve teknik loglar otomatik olarak toplanır.
Analitik Veriler: Google Analytics, uygulama kullanımı hakkında anonim veriler toplar (IP adresi, cihaz bilgileri, ziyaret süreleri gibi).

2. Bilgilerin Kullanımı
Toplanan kişisel veriler şu amaçlarla kullanılabilir:

Uygulama hizmetini sağlamak ve Hatim işlemlerini yönetmek.
İstatistiksel analizler yapmak ve uygulama performansını artırmak.
Google Analytics gibi hizmetler aracılığıyla kullanıcı deneyimini iyileştirmek.

3. Bilgilerin Paylaşımı
Toplanan kişisel bilgiler aşağıdaki durumlar dışında üçüncü kişilerle paylaşılmaz:

Firebase ve Google Analytics: Veriler, Firebase sunucularında saklanır ve Google Analytics tarafından anonim olarak analiz edilir.
Kanuni Yükümlülükler: Yasal talepler doğrultusunda veriler yetkili mercilerle paylaşılabilir.

4. Verilerin Yurt Dışına Aktarılması
Firebase ve Google Analytics gibi hizmet sağlayıcılar yurt dışında sunuculara sahip olabilir. Bu nedenle, kişisel veriler yurt dışına aktarılabilir. Bu aktarım, KVKK’nın 9. maddesine uygun şekilde yapılır ve gerekli güvenlik önlemleri alınır.

5. Verilerin Saklanma Süresi
Kullanıcıların kişisel verileri, yukarıda belirtilen amaçları yerine getirmek için gerekli olan süre boyunca saklanacaktır. Kullanıcılar, verilerinin silinmesini talep edebilir. Silme talepleri, KVKK ve diğer ilgili mevzuat kapsamında değerlendirilecektir.

6. Kullanıcı Hakları
KVKK kapsamında kullanıcılar aşağıdaki haklara sahiptir:

- Kişisel verilerin işlenip işlenmediğini öğrenme.
- İşlenen kişisel verilerle ilgili bilgi talep etme.
- Kişisel verilerin düzeltilmesini talep etme.
- Kişisel verilerin silinmesini veya yok edilmesini talep etme.
- Kişisel verilerin yurt dışına aktarılmasına itiraz etme.
- Bu haklarınızı kullanmak için bizimle <a href='mailto:hep.beraber.okuyalim@gmail.com'>buradan</a> üzerinden iletişime geçebilirsiniz.

7. Verilerin Güvenliği
Kişisel verilerinizin korunması için teknik ve idari önlemler alınmaktadır. Ancak, internet üzerinden yapılan veri aktarımlarının tamamen güvenli olduğu garanti edilemez.

8. Gizlilik Politikası'nda Değişiklikler
Bu Gizlilik Politikası zaman zaman güncellenebilir. Yapılan değişiklikler, bu sayfada yayınlanacak ve güncelleme tarihi belirtilecektir.

    `
   

    return (
        <>
            <Sidebar isOpen={isOpen} toggle={toggle}/>
            <Navbar toggle={toggle}/>
            {/* <SorryMessage /> */}
            <Pwa  />
            {Language.Navbar.Menu == 'Menü' && <div style={{padding: '24px 20px', margin: '16px auto 24px', maxWidth: 720, width: 'calc(100% - 32px)', textAlign: 'left', lineHeight: 1.7, color: 'var(--ink-soft)', backgroundColor: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflowWrap: 'anywhere'}} >
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

