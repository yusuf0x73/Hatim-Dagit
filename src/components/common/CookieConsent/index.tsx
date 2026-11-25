








import { Button, Paper, Text, Group, CloseButton } from '@mantine/core';
import { useState } from 'react';
import localDb from '@yusuf-yeniceri/easy-storage';
import { isEmptyObjectLocDb } from 'common';
// @ts-ignore
import {tx} from 'strings/tx';

export function CookiesBanner() {

    const [cookieVisibility, setCookieVisibility] = useState(true);

    let {cookieBannerAccepted} = localDb.ref('cookieStuff').get();

    if (isEmptyObjectLocDb(cookieBannerAccepted) != null && cookieBannerAccepted)
        return <></>;

  return (
    <Paper withBorder p="md" radius="lg" shadow="xl" style={{display: cookieVisibility ? 'block' : 'none', position: 'fixed', zIndex: 999, bottom: 'calc(88px + var(--safe-bottom))', left: 12, right: 12, maxWidth: 560, margin: '0 auto', borderColor: 'var(--line)'}}>
      <Group position="apart" mb="xs">
        <Text weight={800}>
          {tx('Çerez Bildirimi', 'Cookie notice', 'إشعار ملفات تعريف الارتباط')}
        </Text>
        { /*@ts-ignore*/ }
        <CloseButton mr={-9} mt={-9} onClick={() => setCookieVisibility(false)} />
      </Group>
      <Text size="sm" color="dimmed">
      {tx('Bu internet sitesinde, kullanıcı deneyimini geliştirmek ve internet sitesinin verimli çalışmasını sağlamak amacıyla çerezler kullanılmaktadır. Bu internet sitesini kullanarak bu çerezlerin kullanılmasını kabul etmiş olursunuz. Çerezleri nasıl kullandığımız, sildiğimiz ve engellediğimiz ile ilgili detaylı bilgi için lütfen Çerez Politikası sayfasını okuyunuz:',
          'This website uses cookies to improve your experience and to keep the site running efficiently. By using this website, you accept the use of these cookies. For details on how we use, delete and block cookies, please read the Cookie Policy:',
          'يستخدم هذا الموقع ملفات تعريف الارتباط لتحسين تجربة المستخدم وضمان عمل الموقع بكفاءة. باستخدامك هذا الموقع فإنك توافق على استخدام هذه الملفات. لمعرفة كيف نستخدم هذه الملفات ونحذفها ونحظرها، يرجى قراءة سياسة ملفات تعريف الارتباط:')} <a href='https://hatimdagit.com/cookies'>{tx('Çerez Politikası', 'Cookie Policy', 'سياسة ملفات تعريف الارتباط')}</a>
      </Text>
      <Group mt="md">
        <Button radius="md" onClick={() => {
            localDb.ref('cookieStuff').set({
                cookieBannerAccepted: true});
            setCookieVisibility(false)}}>
          {tx('Anladım', 'Got it', 'فهمت')}
        </Button>
      </Group>
    </Paper>
  );
}