let Turkish = {
  Navbar: {
    Logo: 'Hatim Dağıt',
    Links: ['Hatim Oluştur', 'Hakkında', 'Dil Değiştir', 'Hatimlerim'],
    LinkHelpers: ['/', 'hakkimda', '/cizelgelerim'],
    Buttons: ['Geribildirim Yap'],
    Languages: [
      {label: 'Arapça', value: 'ar'},
      {label: 'İngilizce', value: 'en'},
      {label: 'Türkçe', value: 'tr'},
    ],
    Pwa: 'Telefona İndir',
    Menu: 'Menü',
  },

  Pwa: {
    Alert: 'Lütfen Chrome tarayıcısını kullanarak telefonunuza indirin. Safari bu özelliği desteklemiyor!',
    Popup: [
      'Bu uygulamayı telefonunuza indirmek için önce tarayıcınızda bulunan',
      'ikonuna tıklayın. Daha sonra açılan menüden',
      'Ana Ekrana Ekle',
      'seçeneğini seçin.',
      'Uygulama telefonunuza inecektir inşaAllah.',
    ],
    SorryMessage: [
      `
      DUYURU
      `,
      `
Bu uygulama üzerinden siyasi veya dini motifli terör örgütleri adına Hatim dağıtılamaz.
`,
      `Öncelikle, siteyi kullanan tüm üyelerimize teşekkür etmek istiyoruz. Filistin şehitleri için büyük miktarlarda Hatim dağıtıldı. Allah razı olsun.`,

      `Sitemiz, bugün beklenilenden fazla karşılaştığı yoğunluk sebebiyle yeniden yapılanmaya girmiştir. Bu nedenle, mevcut yoğunluk azalana kadar siteyi geçiçi olarak kullanıma kapatmak zorunda kaldığımızı üzülerek bildirmek istiyoruz. Oluşturulmuş Hatimlerdeki bilgilere ulaşılabilmesi için saat 22:00-23:00 arasında site açılacak inşaAllah.`,

      `Filistin için dua etmeye devam edelim. Birlikte daha güzel günler göreceğimize olan inancımızı yitirmiyoruz inşaAllah.`,

      `Hatim Dağıt`,
    ],
  },

  Footer: {
    aciz_kul: 'Bu uygulamanın herhangi bir kurum ya da kuruluşla ilişkisi yoktur.\n Bu uygulama üzerinden siyasi veya dini motifli terör örgütleri adına Hatim oluşturulamaz.',
    ziyaret: ['Bu site ', ' defa ziyaret edildi'],
    version: 'Mevcut versiyon ',
    GoToMainPage: 'Anasayfaya Git',
    Feedback: 'Geribildirim Yap',
    Cookies: 'Çerez Politikası',
    TermsConditions: 'Kullanıcı Sözleşmesi',
    PrivacyPolicy: 'Gizlilik Politikası',
  },

  AlertDialog: {
    Text: 'Hatayı bildirerek kullandığınız tarayıcı, tarayıcı versiyonu, sistem bilgisi vb. bilgileri (bkz. user-agent) sisteme gönderecektir. Kabul ediyor musunuz?',
    Yes: 'Evet',
    No: 'Hayır',
  },

  IsReadDialog: {
    Read: 'Okundu',
    NotRead: 'Okunuyor',
  },

  AutomaticKhatm: 'Otomatik Hatim Oluşturmayı Durdur',

  Home: {
    Title: 'Birlikte okuyalım, birlikte hatmedelim',
    Subtitle: 'Hatminizi oluşturun, linki paylaşın; sevdikleriniz cüzlerini saniyeler içinde alsın.',
    QuickDesc: '30 cüzü sevdiklerinizle paylaşın. Bir dakikada hazır.',
    OtherTypes: 'Diğer hatim türleri',
    YearBasedDesc: 'Yıl boyunca belirli aralıklarla birlikte hatim',
    Months3Desc: 'Günde 1 cüz, 10 ya da 5 sayfa, 1 sayfa veya 1 sûre; dönerli ya da sabit',
    RamazanDesc: 'Ramazan boyunca cüzler her gün sırayla döner',
    EvradEzkarDesc: 'Vird ve zikirleri topluca paylaştırın',
    StepsTitle: 'Nasıl çalışır?',
    Steps: [
      ['Oluşturun', 'Başlığı ve dua tarihini yazın.'],
      ['Paylaşın', 'Linki WhatsApp veya SMS ile gönderin.'],
      ['Birlikte okuyun', 'Herkes ismini yazıp cüzünü alır.'],
    ],
    Hadith: 'Kur\'an okuyunuz. Çünkü Kur\'an, kıyamet gününde okuyanlara şefaatçi olarak gelecektir.',
    HadithSource: 'Müslim',
    SurahKhatm: 'Yâsîn · Fetih Hatmi',
    SurahKhatmDesc: 'Sûre hatimleri; isim vererek kendi okumanızı da dağıtın',
    CustomKhatm: 'Kendi Hatmini Programla',
    CustomKhatmDesc: 'Cüz, hizb, sayfa, sûre ya da istediğiniz sayfa sayısıyla dağıtın',
    CreateFailed: 'Hatim oluşturulamadı',
    YearlyNote: 'Bu hatmi daha sonra "Hatimlerim" sayfasından da açabilirsiniz.',
  },

  MyKhatms: {
    Title: 'Hatimlerim',
    Subtitle: 'Aldığınız cüzler, oluşturduğunuz hatimler ve okuma çizelgeleriniz',
    Today: 'Bugün okuyacaklarım',
    Taken: 'Aldıklarım',
    Created: 'Oluşturduklarım',
    Open: 'Hatme git',
    Chart: 'Çizelge',
    CopyLink: 'Linki kopyala',
    Copied: 'Kopyalandı',
    Remove: 'Listeden kaldır',
    RemoveConfirm: 'Bu hatim listenizden kaldırılsın mı? Hatmin kendisi silinmez.',
    Read: 'Okudum',
    ReadDone: 'Okundu',
    EmptyTaken: 'Henüz bir cüz almadınız. Size gönderilen hatim linkinden cüz aldığınızda burada görünür.',
    EmptyCreated: 'Henüz hatim oluşturmadınız.',
    CreateButton: 'Hatim oluştur',
    DeviceNote: 'Bu liste yalnızca bu cihazda saklanır.',
  },

  App: {
    Title: 'Hatim Dağıt artık Google Play\'de!',
    Subtitle: 'Uygulamayı indirin, hatimleriniz her an cebinizde olsun.',
    Bullets: ['Tek dokunuşla açılır', 'Hatimleriniz ve çizelgeleriniz hep elinizin altında', 'Ücretsiz'],
    Button: 'Google Play\'den indir',
    Download: 'Uygulamayı indir',
    BannerTitle: 'Hatim Dağıt uygulaması çıktı!',
    BannerText: 'Google Play\'den ücretsiz indirin',
    Iphone: 'iPhone\'da: Safari\'de Paylaş → Ana Ekrana Ekle',
    Later: 'Daha sonra',
  },

  Kit: {
    TakenTitle: "{n} aldınız",
    TakenChartHint: "Okudukça çizelgeden işaretleyebilirsiniz.",
    ReadQuranAll: "Kur'an-ı Kerîm'i oku",
    ReadQuranSub: "Diyanet mushafı · kaldığınız sayfadan devam edin",
    ReadQuran: "Kur'an'dan oku",
    Share: 'Paylaş',
    ShareTitle: 'Hatmi paylaşın',
    Whatsapp: 'WhatsApp',
    Sms: 'SMS',
    More: 'Diğer',
    Copy: 'Linki kopyala',
    Copied: 'Kopyalandı',
    Invite: 'Hatme siz de katılın:',
    Close: 'Kapat',
    Cancel: 'Vazgeç',
    Yes: 'Evet',
    YesDelete: 'Evet, sil',
    TakeTitle: '{n} sizin olsun mu?',
    MineTitle: '{n} sizde',
    OtherTitle: '{n}',
    TakenBy: 'Alan kişi: {name}',
    NameLabel: 'İsminiz',
    NamePlaceholder: 'Örn. Ayşe',
    NameHint: 'İsminiz listede görünür.',
    TakeButton: 'Cüzü al',
    RenameButton: 'İsmi güncelle',
    ReleaseButton: 'Cüzü bırak',
    ReleaseYes: 'Evet, bırak',
    ReleaseConfirm: 'Bu cüzü bırakmak istediğinize emin misiniz? Başka biri alabilir.',
    Taken: '{n} sizde! Okuyunca çizelgeden işaretleyebilirsiniz.',
    TakenSimple: '{n} sizde!',
    JustTaken: 'Bu cüzü az önce başkası aldı. Başka bir cüz seçebilirsiniz.',
    OtherHint: 'Bu cüzü bu cihazdan siz aldıysanız ismini değiştirebilir ya da bırakabilirsiniz.',
    NotYours: 'Bu cüz başka bir cihazdan alınmış. Değişikliği yalnızca alan kişi yapabilir.',
    ShowChart: 'Okuma çizelgesini gör',
    ReactTitle: 'Tebrik bırakın',
    EmptyKhatm: 'Bu hatimde henüz cüz yok.',
    EmptyKhatmAdmin: 'Bu hatimde henüz cüz yok. Aşağıdan yeni hatim ekleyebilirsiniz.',
    RateTitle: 'Hatim Dağıt\'ı beğendiniz mi?',
    RateText: 'Puanınız, daha çok kişinin hatme katılmasına vesile olur.',
    RateHigh: 'Allah razı olsun! Google Play\'de birkaç kelime yazarsanız çok seviniriz.',
    RateLow: 'Neyi daha iyi yapabileceğimizi bize yazar mısınız?',
    RateStore: 'Google Play\'de puan ver',
    RateFeedback: 'Görüşünüzü bize yazın',
    RateLater: 'Daha sonra',
    TakeFailed: 'Bu cüz az önce başkası tarafından alınmış olabilir ya da bağlantı koptu. Lütfen tekrar deneyin.',
    ReleaseFailed: 'Cüz bırakılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.',
    Released: 'Cüz bırakıldı.',
    ChartTitle: 'Okuma çizelgesi',
    ChartLive: 'Canlı: işaretlemeleri hatimdeki herkes görür',
    ChartOwnerOnly: 'Bu çizelgeyi sadece cüzü alan kişi işaretleyebilir.',
    ChartRead: '{done} / {total} gün okundu',
    ChartSaveFailed: 'Kaydedilemedi. İnternet bağlantınızı kontrol edin.',
    ChartLoading: 'Çizelge yükleniyor…',
    Today: 'Bugün',
    Day: '{n}. gün',
    KhatmNo: '{n}. Hatim',
    NewKhatm: 'Bu sayfaya yeni hatim ekle',
    NewKhatmConfirm: 'Bu sayfaya yeni bir hatim (30 cüz) eklensin mi?',
    NewKhatmAdded: 'Yeni hatim eklendi.',
    NewKhatmFailed: 'Yeni hatim eklenemedi. Lütfen tekrar deneyin.',
    StopAuto: 'Otomatik yeni hatmi durdur',
    DeleteFailed: 'Hatim silinemedi. İnternet bağlantınızı kontrol edip tekrar deneyin.',
    Deleted: 'Hatim silindi.',
    Hide: 'Gizle',
    Show: 'Göster',
    EveryNDays: '{n} günde bir hatim',
    ReadToday: 'Bugün okundu',
    Live: 'Canlı',
    ErrorTitle: 'Bir şeyler ters gitti',
    ErrorText: 'Sayfa beklenmedik bir hata verdi. Yenilemek çoğu zaman düzeltir.',
    Reload: 'Sayfayı yenile',
    Home: 'Ana sayfa',
    RamazanChart: 'Ramazan çizelgesi',
    RamazanHint: 'Aldığınız cüzden başlayıp her gün bir sonraki cüzü okursunuz.',
    Months3Hint: 'Her ay aldığınız cüzden başlayıp her gün bir sonraki cüzü okursunuz.',
  },

  CuzGrid: {
    Hint: 'Almak istediğiniz cüze dokunun',
    Available: 'Boş',
    Taken: 'Alındı',
    Read: 'Okundu',
    Mine: 'Sizin',
    Refresh: 'Yenile',
    Completed: 'Elhamdülillah! Bütün cüzler alındı.',
    LoadError: 'Bağlantı kurulamadı. İnternetinizi kontrol edip tekrar deneyin.',
    ReadHint: 'Okuyunca altındaki "Okunuyor" şeridine dokunup "Okundu" yapabilirsiniz.',
    RefreshWait: '20 saniyede bir yenileyebilirsiniz.',
    Retry: 'Tekrar dene',
  },


  '/': {
    Question: 'Butona Tıklayarak Yeni Bir Hatim Oluştur!',
    MyInfos: 'Oluşturduğum Hatimler ve Çizelgelerim',
    Button: {
      NewTag: 'Yeni',
      BetaTag: 'Beta',
      MyInfos: {
        Charts: 'Çizelgelerim',
      },
      Main: 'Hızlıca Hatim Oluştur',
      YearBased: 'Yıllık Hatim Oluştur',
      Ramazan: 'Ramazan Dönerli Hatim Oluştur',
      Aylar3: '3 Aylar Hatmi Oluştur',
      EvradEzkar: 'Vird-Zikir Dağıt',
      Header: {
        Text: 'Yeni Hatim Oluştur',
        Text3MonthProgram: 'Program Seç',
        InputSpan: [
          'Başlık',
          'Açıklama',
          'Hatim Duası Tarihi',
          'Hatim Sayısı',
          'Hatim bittiğinde otomatik olarak yeni hatim oluştur',
          'Başlama Tarihi',
          'Kaç Günde Bir Birlikte Hatim Bitecek',
          'Toplam Birlikte Bitecek Hatim Sayısı',
          'Dönerli Hatim',
        ],
        Input: [
          'Lütfen Hatim başlığı yazın ..',
          'Lütfen Hatim için açıklama yazın ..',
        ],
        Button: 'Devam Et',
      },
      Final: {
        Before: {
          Header: 'Yeni Hatim Oluşturuluyor',
          Link: 'Hatmi Dağıtmak için Linkiniz:',
          LinkReady: 'Link hazırlanıyor',
          Copy: 'Linki Kopyala',
          Button: 'Lütfen bekleyiniz ..',
        },

        After: {
          Header: 'Yeni Hatim Oluşturuldu!',
          Link: 'Hatmi Dağıtmak için Linkiniz:',
          Copy: 'Link Kopyalandı',
          Button: 'Devam Et',
        },
      },
    },
    ExistingKhatms: 'Oluşturulmuş Hatimler',
    BottomNavigation: {
      NewKhatm: 'Hatim Oluştur',
      KhatmInfos: 'Hatimlerim',
    },
  },

  '/cuz': {
    KhatmFinishDate: ['Hatim Duasının Yapılacağı Tarih: ', ''],
    NewSubKhatm: 'Bu sayfaya Yeni Hatim ekle',

    Before: {
      Question: 'İstediğiniz cüze tıklayın ..',
      Wait: 'Lütfen Bekleyiniz ..',
      Error: 'Bir Hata Oluştu, Sayfayı Güncelleyin!',
      Deleted: 'Bu Hatim oluşturan kişi tarafından silinmiş!',
      WrongLength: 'Tıkladığınız link hatalı!',
    },

    After: {
      Copy: {
        Before: 'Linki Kopyala',
        After: 'Link Kopyalandı',
      },
      Share: 'Hatmi Paylaş',
    },

    Button: {
      Question: 'Cüzü almak için isminizi girin:',
      Take: 'Cüzü Al',
      TakeCancel: 'İptal Et',
    },

    ShareBox: {
      Title: 'Paylaşmak için uygulama seçin:',
      Sms: 'Sms ile Paylaş',
      Whatsapp: 'Whatsapp ile Paylaş',
    },

    AlertDialog: {
      Title: 'Cüz çoktan alınmış. Lütfen başka bir cüzü almayı deneyin!',
      Button: 'Tamam',
      Feedback: 'Hata Bildir',
    },

    CuzlerHatimCard: {
      deleteHatim: 'Hatmi Sil',
      changeHatim: 'Değiştir',
      takenParts: 'Alınan cüzler',
      leftParts: ' cüz kaldı',
      yourParts: 'Aldığınız cüzler',
      dua: [
        'Duaya',
        'gün kaldı',
        'Duası yapıldı',
        'Duası bugün yapılacak',
        'Duaya',
        'gün kaldı',
      ],
      Modal: {
        Title: 'Hatim bilgilerinde değişiklik yap',
        Header: 'Hatim başlığı',
        Description: 'Hatim açıklaması',
        Date: 'Hatim duası tarihi',
        Button: 'Tamam',
      },

      Notification: {
        Title: 'Bilgiler güncelleniyor',
        Description: 'Bilgileri güncellenene kadar lütfen bekleyin.',
      },

      PartModal: {
        Title: 'Cüz bilgilerinde değişiklik yap',
        Title2: 'Cüz almak için aşağıya isminizi girin',
        Name: 'Cüzü alan kişinin ismi',
        ChangeNameButton: 'İsmini Değiştir',
        CancelPart: 'Cüzü İptal Et',
      },
    },

    AddKhatmAlert: {
      Question: 'Yeni Hatim oluşturmak istediğinize emin misiniz?',
      YesButton: 'Evet',
      NoButton: 'Hayır',
    },

    DeleteKhatmAlert: {
      Question: 'Bu Hatmi silmek istediğinize emin misiniz?',
      YesButton: 'Evet',
      NoButton: 'Hayır',
    },

    CuzItem: {
      ChartButton: 'Çizelgeyi Görüntüle',
    },
  },

  '/ramazan': {
    Before: {
      Question: 'Başlamak istediğiniz cüzü seçin ..',
      Wait: 'Lütfen Bekleyiniz ..',
      Error: 'Bir Hata Oluştu, Sayfayı Güncelleyin!',
    },

    After: {
      Copy: {
        Before: 'Linki Kopyala',
        After: 'Link Kopyalandı',
      },
      Share: 'Hatmi Paylaş',
    },

    Button: {
      Question: 'Cüzü almak için isminizi girin:',
      Take: 'Cüzü Al',
      TakeCancel: 'İptal Et',
    },

    ShareBox: {
      Title: 'Paylaşmak için uygulama seçin:',
      Sms: 'Sms ile Paylaş',
      Whatsapp: 'Whatsapp ile Paylaş',
    },
  },

  '/ucaylarhergun1cuz': {},
};

export default Turkish;
