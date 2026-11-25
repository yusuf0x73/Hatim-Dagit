

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


export const TermsConditions = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState('hatims'); //hatims, myInfos

    const toggle = () => {
        setIsOpen(!isOpen);
    }

   const textTr = `
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

    const textEn = `
   Terms of Use

Last updated: 30.10.2024

These Terms of Use ("Agreement") are made between users of the Hatim Dağıt application and the Hatim Dağıt application. By using the application, you declare that you accept this Agreement. If you do not accept this Agreement, you should not use the application.

1. Parties
This Agreement is made between individuals who use the Hatim Dağıt application ("User") and the Hatim Dağıt application ("Hatim Dağıt").

2. Purpose of the Service
Hatim Dağıt provides a service that lets users complete khatms of the Holy Qur'an by taking its parts. Through this application, users can open khatms, take parts and complete their khatms.

3. User Information and Privacy
The following information may be collected from users through the application:

- Name and surname (optional).
- Khatm information (khatm name, type and end date).
- IP address and technical log data. User information is processed and protected according to the principles set out in our Privacy Policy, which you can review.

4. Terms of Use
- Users may only create khatms and take parts through the application.
- Users may not take actions that violate the rights of others or harm the operation of the application.
- If misuse of the application is detected, users' access may be blocked.

5. User Obligations
- The user agrees to use the application correctly and lawfully.
- Users are responsible for the accuracy of the information they enter.
- The user agrees that their actions in the application will comply with the KVKK and other applicable legislation.

6. Disclaimer
The Hatim Dağıt application gives no guarantee that the service will be uninterrupted, error-free or completely secure.
Hatim Dağıt cannot be held responsible for any data loss, incorrect operation or technical problems that may occur while using the application.

7. Third-Party Services
Third-party service providers such as Firebase and Google Analytics may be used in the application. The privacy policies and terms of use of these service providers apply.

8. Intellectual Property Rights
All intellectual property rights in the Hatim Dağıt application belong to Hatim Dağıt. Copying, distributing or modifying the application is prohibited.

9. Termination
This Agreement remains in force for as long as users continue to use the application. The application reserves the right to suspend users' access without notice if they breach this Agreement.

10. Changes
The application reserves the right to change this Agreement from time to time. Changes take effect from the date they are published in the application.

11. Contact
For any questions or requests about this Agreement, you can contact us <a href='mailto:hep.beraber.okuyalim@gmail.com'>here</a>.
    `

    const textAr = `
   اتفاقية الاستخدام

تاريخ آخر تحديث: 30.10.2024

تُبرم اتفاقية الاستخدام هذه ("الاتفاقية") بين مستخدمي تطبيق Hatim Dağıt وتطبيق Hatim Dağıt. باستخدامك التطبيق فإنك تقرّ بقبولك هذه الاتفاقية. وإن لم تقبلها فلا ينبغي لك استخدام التطبيق.

1. الأطراف
أُبرمت هذه الاتفاقية بين الأفراد الذين يستخدمون تطبيق Hatim Dağıt ("المستخدم") وتطبيق Hatim Dağıt ("Hatim Dağıt").

2. الغرض من الخدمة
يقدّم Hatim Dağıt خدمة تتيح للمستخدمين إتمام ختمات القرآن الكريم بأخذ أجزائه. ومن خلال هذا التطبيق يمكن للمستخدمين فتح ختمات وأخذ أجزاء وإتمام ختماتهم.

3. معلومات المستخدم والخصوصية
قد تُجمع من المستخدم عبر التطبيق المعلومات التالية:

- الاسم واللقب (اختياري).
- معلومات الختمة (اسم الختمة ونوعها وتاريخ انتهائها).
- عنوان IP وبيانات السجلات التقنية. وتُعالَج معلومات المستخدم وتُحمى وفق المبادئ الواردة في سياسة الخصوصية، ويمكنك الاطلاع عليها.

4. شروط الاستخدام
- لا يجوز للمستخدمين عبر التطبيق إلا إنشاء الختمات وأخذ الأجزاء.
- لا يجوز للمستخدمين القيام بأفعال تنتهك حقوق الآخرين أو تضرّ بعمل التطبيق.
- عند اكتشاف إساءة استخدام التطبيق قد يُمنع وصول المستخدمين.

5. التزامات المستخدم
- يوافق المستخدم على استخدام التطبيق بطريقة صحيحة ومشروعة.
- المستخدمون مسؤولون عن صحة المعلومات التي يُدخلونها.
- يوافق المستخدم على أن تكون معاملاته في التطبيق متوافقة مع قانون KVKK والتشريعات الأخرى ذات الصلة.

6. إخلاء المسؤولية
لا يقدّم تطبيق Hatim Dağıt أي ضمان بأن تكون الخدمة متواصلة أو خالية من الأخطاء أو آمنة تمامًا.
ولا يُعدّ Hatim Dağıt مسؤولًا عن أي فقدان للبيانات أو خطأ في المعاملات أو أعطال تقنية قد تحدث أثناء استخدام التطبيق.

7. خدمات الأطراف الثالثة
قد تُستخدم في التطبيق خدمات من أطراف ثالثة مثل Firebase وGoogle Analytics، وتسري سياسات الخصوصية وشروط الاستخدام الخاصة بهؤلاء المزوّدين.

8. حقوق الملكية الفكرية
جميع حقوق الملكية الفكرية في تطبيق Hatim Dağıt تعود إلى Hatim Dağıt. ويُحظر نسخ التطبيق أو توزيعه أو تعديله.

9. إنهاء الاتفاقية
تظل هذه الاتفاقية سارية ما دام المستخدمون يواصلون استخدام التطبيق. ويحتفظ التطبيق بحق إيقاف وصول المستخدمين دون إشعار في حال انتهاكهم هذه الاتفاقية.

10. التغييرات
يحتفظ التطبيق بحق تعديل هذه الاتفاقية من وقت لآخر، وتسري التعديلات من تاريخ نشرها في التطبيق.

11. التواصل
لأي سؤال أو طلب بخصوص هذه الاتفاقية يمكنك التواصل معنا <a href='mailto:hep.beraber.okuyalim@gmail.com'>من هنا</a>.
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

