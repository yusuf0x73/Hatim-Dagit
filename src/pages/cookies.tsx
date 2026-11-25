

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


export const Cookies = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState('hatims'); //hatims, myInfos

    const toggle = () => {
        setIsOpen(!isOpen);
    }

    const textTr = `
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

    const textEn = `
    Cookie Policy

Last updated: 30.10.2024

This Cookie Policy explains how cookies placed on the devices of users of the Hatim Dağıt application are used. By using our application, you accept the use of the cookies described in this policy.

1. What Is a Cookie?
Cookies are small data files that a website or application sends to your browser and stores on your device. They are used to remember the pages you visit, store your preferences and improve the performance of the application.

2. Types of Cookies
The following types of cookies may be used in the Hatim Dağıt application:

Session cookies: These cookies are valid during the user session and are deleted when the application is closed or the session ends. They are used to improve the user experience.

Analytics cookies: Cookies collected through third-party service providers such as Google Analytics help us analyse user behaviour anonymously. They let us understand which pages are visited most, how long users spend in the application and how the application performs.

3. Why Cookies Are Used
Cookies may be used for the following purposes:

Application performance and security: Cookies help the application run quickly and keep users secure.
Improving the user experience: They are used for personalisation, such as remembering user preferences and saving language and settings.
Analytics and reporting: Anonymous data about how the application is used is collected to improve the user experience.

4. Managing Cookies
Most browsers accept cookies automatically by default. However, you can disable or delete cookies in your browser settings. If you disable cookies, some features of the application may not work properly.

5. Third-Party Cookies
The Hatim Dağıt application may use cookies provided by third-party service providers such as Google Analytics. These cookies collect anonymous data to analyse how users use the application. The cookie policies and terms of use of these service providers apply.

6. Changes to the Cookie Policy
This Cookie Policy may be updated when necessary. Changes take effect from the date they are published on this page.
    `

    const textAr = `
    سياسة ملفات تعريف الارتباط

تاريخ آخر تحديث: 30.10.2024

توضّح سياسة ملفات تعريف الارتباط هذه كيفية استخدام ملفات تعريف الارتباط (الكوكيز) التي توضع على أجهزة مستخدمي تطبيق Hatim Dağıt. باستخدامك تطبيقنا فإنك توافق على استخدام ملفات تعريف الارتباط المذكورة في هذه السياسة.

1. ما ملف تعريف الارتباط؟
ملفات تعريف الارتباط ملفات بيانات صغيرة يرسلها موقع أو تطبيق إلى متصفحك وتُحفظ على جهازك. وتُستخدم لتذكّر الصفحات التي تزورها، وحفظ تفضيلاتك، وتحسين أداء التطبيق.

2. أنواع ملفات تعريف الارتباط
قد تُستخدم في تطبيق Hatim Dağıt الأنواع التالية:

ملفات الجلسة: تكون صالحة طوال جلسة المستخدم، وتُحذف عند إغلاق التطبيق أو انتهاء الجلسة. وتُستخدم لتحسين تجربة المستخدم.

ملفات التحليلات: ملفات تُجمع عبر مزوّدي خدمات من أطراف ثالثة مثل Google Analytics، وتساعدنا على تحليل سلوك المستخدمين دون الكشف عن هويتهم. وتمكّننا من معرفة الصفحات الأكثر زيارة، والمدة التي يقضيها المستخدمون في التطبيق، وأداء التطبيق.

3. أغراض استخدام ملفات تعريف الارتباط
قد تُستخدم ملفات تعريف الارتباط للأغراض التالية:

أداء التطبيق وأمانه: تساعد على عمل التطبيق بسرعة وعلى حماية المستخدمين.
تحسين تجربة المستخدم: تُستخدم لأغراض التخصيص مثل تذكّر تفضيلات المستخدم وحفظ اللغة والإعدادات.
التحليلات والتقارير: تُجمع بيانات مجهولة الهوية عن استخدام التطبيق لتحسين تجربة المستخدم.

4. إدارة ملفات تعريف الارتباط
تقبل معظم المتصفحات ملفات تعريف الارتباط تلقائيًا. ومع ذلك يمكنك تعطيلها أو حذفها من إعدادات المتصفح. وإذا عطّلتها فقد لا تعمل بعض ميزات التطبيق كما ينبغي.

5. ملفات تعريف الارتباط من أطراف ثالثة
قد يستخدم تطبيق Hatim Dağıt ملفات تعريف ارتباط يقدّمها مزوّدو خدمات من أطراف ثالثة مثل Google Analytics. وتجمع هذه الملفات بيانات مجهولة الهوية لتحليل كيفية استخدام التطبيق. وتسري سياسات ملفات تعريف الارتباط وشروط الاستخدام الخاصة بهؤلاء المزوّدين.

6. التغييرات على سياسة ملفات تعريف الارتباط
قد تُحدَّث هذه السياسة عند الحاجة. وتسري التغييرات من تاريخ نشرها في هذه الصفحة.
    `

    const text = tx(textTr, textEn, textAr);
   

    return (
        <>
            <Sidebar isOpen={isOpen} toggle={toggle}/>
            <Navbar toggle={toggle}/>
            {/* <SorryMessage /> */}
            <Pwa  />
            {<div style={{padding: '24px 20px', margin: '16px auto 24px', maxWidth: 720, width: 'calc(100% - 32px)', textAlign: 'start', lineHeight: 1.7, color: 'var(--ink-soft)', backgroundColor: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflowWrap: 'anywhere'}}>
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

