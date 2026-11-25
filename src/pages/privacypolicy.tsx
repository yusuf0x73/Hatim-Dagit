

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
// @ts-ignore
import {tx} from 'strings/tx';


export const PrivacyPolicy = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState('hatims'); //hatims, myInfos

    const toggle = () => {
        setIsOpen(!isOpen);
    }

    const textTr = `
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

    const textEn = `
    Privacy Policy

Last updated: 30.10.2024

This Privacy Policy explains how the personal data of users of the Hatim Dağıt application is collected, used, stored and protected. By using our application, you accept the terms set out in this Privacy Policy.

1. Information We Collect
Our application collects the following information from users:

Name and surname: To take a part, you may optionally be asked for a name and surname. Providing it is not required.
Khatm information: Information such as the khatm's name, end date and type.
IP address and other logs: The IP address, HTTP requests and technical logs are collected automatically through Firebase Realtime Database and Cloud Logging (Google Cloud).
Analytics data: Google Analytics collects anonymous data about how the application is used (such as IP address, device information and visit durations).

2. How We Use Information
The personal data collected may be used to:

Provide the application service and manage khatms.
Carry out statistical analysis and improve the application's performance.
Improve the user experience through services such as Google Analytics.

3. Sharing Information
The personal information collected is not shared with third parties except in the following cases:

Firebase and Google Analytics: Data is stored on Firebase servers and analysed anonymously by Google Analytics.
Legal obligations: Data may be shared with the competent authorities in response to legal requests.

4. Transfer of Data Abroad
Service providers such as Firebase and Google Analytics may have servers abroad. Personal data may therefore be transferred abroad. Such transfers are made in accordance with Article 9 of the Turkish Personal Data Protection Law (KVKK), and the necessary security measures are taken.

5. How Long Data Is Kept
Users' personal data is kept for as long as necessary to fulfil the purposes above. Users may request that their data be deleted. Deletion requests are assessed under the KVKK and other applicable legislation.

6. User Rights
Under the KVKK, users have the right to:

- Learn whether their personal data is processed.
- Request information about the personal data processed.
- Request that their personal data be corrected.
- Request that their personal data be deleted or destroyed.
- Object to their personal data being transferred abroad.
- To use these rights, you can contact us <a href='mailto:hep.beraber.okuyalim@gmail.com'>here</a>.

7. Data Security
Technical and administrative measures are taken to protect your personal data. However, data transmitted over the internet cannot be guaranteed to be completely secure.

8. Changes to the Privacy Policy
This Privacy Policy may be updated from time to time. Changes will be published on this page with the date of the update.
    `

    const textAr = `
    سياسة الخصوصية

تاريخ آخر تحديث: 30.10.2024

توضّح سياسة الخصوصية هذه كيفية جمع البيانات الشخصية لمستخدمي تطبيق Hatim Dağıt واستخدامها وحفظها وحمايتها. باستخدامك تطبيقنا فإنك توافق على الشروط الواردة في سياسة الخصوصية هذه.

1. المعلومات التي نجمعها
يجمع تطبيقنا المعلومات التالية من المستخدمين:

الاسم واللقب: قد يُطلب الاسم واللقب اختياريًا لأخذ جزء، وتقديمهما غير إلزامي.
معلومات الختمة: مثل اسم الختمة وتاريخ انتهائها ونوعها.
عنوان IP والسجلات الأخرى: يُجمع عنوان IP وطلبات HTTP والسجلات التقنية تلقائيًا عبر Firebase Realtime Database وCloud Logging (Google Cloud).
بيانات التحليلات: يجمع Google Analytics بيانات مجهولة الهوية عن استخدام التطبيق (مثل عنوان IP ومعلومات الجهاز ومدة الزيارة).

2. استخدام المعلومات
قد تُستخدم البيانات الشخصية التي نجمعها للأغراض التالية:

تقديم خدمة التطبيق وإدارة الختمات.
إجراء تحليلات إحصائية وتحسين أداء التطبيق.
تحسين تجربة المستخدم عبر خدمات مثل Google Analytics.

3. مشاركة المعلومات
لا تُشارك المعلومات الشخصية مع أطراف ثالثة إلا في الحالات التالية:

Firebase وGoogle Analytics: تُحفظ البيانات على خوادم Firebase وتُحلَّل دون كشف الهوية عبر Google Analytics.
الالتزامات القانونية: قد تُشارك البيانات مع الجهات المختصة استجابةً للطلبات القانونية.

4. نقل البيانات إلى الخارج
قد تكون لمزوّدي الخدمات مثل Firebase وGoogle Analytics خوادم خارج تركيا، لذا قد تُنقل البيانات الشخصية إلى الخارج. ويتم هذا النقل وفقًا للمادة 9 من قانون حماية البيانات الشخصية التركي (KVKK)، مع اتخاذ التدابير الأمنية اللازمة.

5. مدة حفظ البيانات
تُحفظ البيانات الشخصية للمستخدمين طوال المدة اللازمة لتحقيق الأغراض المذكورة أعلاه. ويحق للمستخدمين طلب حذف بياناتهم، وتُدرس طلبات الحذف وفق قانون KVKK والتشريعات الأخرى ذات الصلة.

6. حقوق المستخدم
بموجب قانون KVKK يحق للمستخدمين:

- معرفة ما إذا كانت بياناتهم الشخصية تُعالَج.
- طلب معلومات عن البيانات الشخصية المعالَجة.
- طلب تصحيح بياناتهم الشخصية.
- طلب حذف بياناتهم الشخصية أو إتلافها.
- الاعتراض على نقل بياناتهم الشخصية إلى الخارج.
- لممارسة هذه الحقوق يمكنك التواصل معنا <a href='mailto:hep.beraber.okuyalim@gmail.com'>من هنا</a>.

7. أمن البيانات
تُتخذ تدابير تقنية وإدارية لحماية بياناتك الشخصية. ومع ذلك لا يمكن ضمان أن يكون نقل البيانات عبر الإنترنت آمنًا تمامًا.

8. التغييرات على سياسة الخصوصية
قد تُحدَّث سياسة الخصوصية هذه من وقت لآخر، وتُنشر التغييرات في هذه الصفحة مع ذكر تاريخ التحديث.
    `

    const text = tx(textTr, textEn, textAr);
   

    return (
        <>
            <Sidebar isOpen={isOpen} toggle={toggle}/>
            <Navbar toggle={toggle}/>
            {/* <SorryMessage /> */}
            <Pwa  />
            {<div style={{padding: '24px 20px', margin: '16px auto 24px', maxWidth: 720, width: 'calc(100% - 32px)', textAlign: 'start', lineHeight: 1.7, color: 'var(--ink-soft)', backgroundColor: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflowWrap: 'anywhere'}} >
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

