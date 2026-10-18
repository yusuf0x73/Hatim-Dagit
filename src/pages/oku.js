//                                     BİSMİLLAHİRRAHMANİRRAHİM

import React, {Suspense, lazy} from 'react';

// Okuyucu ayrı bir parça olarak yüklenir; ana sayfaların paketini büyütmez
const MushafReader = lazy (() => import ('components/mushaf/MushafReader'));

// Kur'an okuyucu: /oku, /oku?bas=22&bit=41 (parça), /oku?sayfa=10
export const Oku = () => (
  <Suspense fallback={null}>
    <MushafReader />
  </Suspense>
);
