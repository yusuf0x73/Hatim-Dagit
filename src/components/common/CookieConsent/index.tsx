








import { Button, Paper, Text, Group, CloseButton } from '@mantine/core';
import { useState } from 'react';
import localDb from '@yusuf-yeniceri/easy-storage';
import { isEmptyObjectLocDb } from 'common';

export function CookiesBanner() {

    const [cookieVisibility, setCookieVisibility] = useState(true);

    let {cookieBannerAccepted} = localDb.ref('cookieStuff').get();

    if (isEmptyObjectLocDb(cookieBannerAccepted) != null && cookieBannerAccepted)
        return <></>;

  return (
    <Paper withBorder p="md" radius="lg" shadow="xl" style={{display: cookieVisibility ? 'block' : 'none', position: 'fixed', zIndex: 999, bottom: 'calc(88px + var(--safe-bottom))', left: 12, right: 12, maxWidth: 560, margin: '0 auto', borderColor: 'var(--line)'}}>
      <Group position="apart" mb="xs">
        <Text weight={800}>
          Çerez Bildirimi
        </Text>
        { /*@ts-ignore*/ }
        <CloseButton mr={-9} mt={-9} onClick={() => setCookieVisibility(false)} />
      </Group>
      <Text size="sm" color="dimmed">
      Bu internet sitesinde, kullanıcı deneyimini geliştirmek ve internet sitesinin verimli çalışmasını sağlamak amacıyla çerezler kullanılmaktadır. Bu internet sitesini kullanarak bu çerezlerin kullanılmasını kabul etmiş olursunuz. Çerezleri nasıl kullandığımız, sildiğimiz ve engellediğimiz ile ilgili detaylı bilgi için lütfen Çerez Politikası sayfasını okuyunuz: <a href='https://hatimdagit.com/cookies'>Çerez Politikası</a>
      </Text>
      <Group mt="md">
        <Button radius="md" onClick={() => {
            localDb.ref('cookieStuff').set({
                cookieBannerAccepted: true});
            setCookieVisibility(false)}}>
          Anladım
        </Button>
      </Group>
    </Paper>
  );
}