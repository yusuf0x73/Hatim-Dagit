let english = {
  Navbar: {
    Logo: 'Distribute Khatm',
    Links: ['Make New Khatm', 'About', 'Change Language', 'My Khatms'],
    LinkHelpers: ['/', 'hakkimda', '/cizelgelerim'],
    Buttons: ['Send Feedback'],
    Languages: [
      {label: 'Arabic', value: 'ar'},
      {label: 'English', value: 'en'},
      {label: 'Turkish', value: 'tr'},
    ],
    Pwa: 'Download to Phone',
    Menu: 'Menu',
  },

  Pwa: {
    Alert: "Please use Chrome browser to download this, Safari doesn't support that feature yet!",
    Popup: [
      'To download this application please click',
      'the button available in your browser. Then choose the',
      'Add to Home Screen',
      'button from the menu open.',
      "the application is going to be installed insha'Allah.",
    ],
    SorryMessage: [
      `Dear Khatm Distribute users`,

      `First and foremost, we would like to express our gratitude to all the members who have been using the site. A substantial number of Khatms have been distributed for the Palestinian martyrs. May Allah be pleased. The website will be opened between 22:00-23:00(with Turkey time) in order to access the information in the made Khatms, inshaAllah.`,

      `Our site has undergone a restructuring process today due to unexpectedly high traffic. Therefore, we regret to inform you that we have had to temporarily close the site until the current congestion subsides.`,

      `Let's continue to pray for Palestine. We belive that we will see better days together, inshaAllah.`,

      `Khatm Distribute`,
    ],
  },

  Footer: {
    aciz_kul: 'Made by Yusuf YENİÇERİ',
    ziyaret: ['This site has been visited ', ' times'],
    version: 'Current version is ',
    GoToMainPage: 'Go to Home',
    Feedback: 'Give Feedback',
    Cookies: 'Cookie Policy',
    TermsConditions: 'User Agreement',
    PrivacyPolicy: 'Privacy Policy',
  },

  AlertDialog: {
    Text: 'You will send browser, browser information, system information etc. (user-agent in short) by accepting this. Do you want to continue?',
    Yes: 'Yes',
    No: 'No',
  },

  IsReadDialog: {
    Read: 'Read',
    NotRead: 'Being Read',
  },

  AutomaticKhatm: 'Stop Making Automatic Khatms',

  Home: {
    Title: 'Read together, complete together',
    Subtitle: 'Create your khatm, share the link, and your loved ones take their parts in seconds.',
    QuickDesc: 'Share the 30 parts with your loved ones. Ready in a minute.',
    OtherTypes: 'Other khatm types',
    YearBasedDesc: 'Complete khatms together at set intervals all year',
    Months3Desc: 'A part, 10 or 5 pages, a page or a surah a day; rotating or fixed',
    RamazanDesc: 'Parts rotate every day throughout Ramadan',
    EvradEzkarDesc: 'Distribute wirds and dhikr as a group',
    StepsTitle: 'How does it work?',
    Steps: [
      ['Create', 'Write a title and the prayer date.'],
      ['Share', 'Send the link via WhatsApp or SMS.'],
      ['Read together', 'Everyone writes their name and takes a part.'],
    ],
    Hadith: 'Read the Qur\'an, for on the Day of Resurrection it will come as an intercessor for those who recite it.',
    HadithSource: 'Muslim, Salat al-Musafirin, 252',
    SurahKhatm: 'Yasin · Fath Khatm',
    SurahKhatmDesc: 'Surah khatms; name your own recitation too',
    CustomKhatm: 'Program Your Own Khatm',
    CustomKhatmDesc: 'Split by part, hizb, page, surah or any number of pages',
    CreateFailed: 'The khatm could not be created',
    YearlyNote: 'You can open this khatm later from "My Khatms".',
  },

  MyKhatms: {
    Title: 'My Khatms',
    Subtitle: 'Parts you took, khatms you created and your reading charts',
    Today: "Today's reading",
    Taken: 'Parts I took',
    Created: 'Khatms I created',
    Open: 'Open khatm',
    Chart: 'Chart',
    CopyLink: 'Copy link',
    Copied: 'Copied',
    Remove: 'Remove from list',
    RemoveConfirm: 'Remove this khatm from your list? The khatm itself is not deleted.',
    Read: 'I read it',
    ReadDone: 'Read',
    EmptyTaken: 'You have not taken a part yet. Parts you take from a khatm link appear here.',
    EmptyCreated: 'You have not created a khatm yet.',
    CreateButton: 'Create a khatm',
    DeviceNote: 'This list is stored only on this device.',
  },

  App: {
    Title: 'Hatim Dağıt is now on Google Play!',
    Subtitle: 'Download the app and keep your khatms in your pocket.',
    Bullets: ['Opens with one tap', 'Your khatms and charts always at hand', 'Free'],
    Button: 'Get it on Google Play',
    Download: 'Download the app',
    BannerTitle: 'The Hatim Dağıt app is here!',
    BannerText: 'Download it free on Google Play',
    Iphone: 'On iPhone: Safari Share → Add to Home Screen',
    Later: 'Later',
  },

  Kit: {
    TakenTitle: "You took {n}",
    TakenChartHint: "You can mark your reading on the chart.",
    ReadQuranAll: "Read the Holy Quran",
    ReadQuranSub: "Diyanet mushaf · continue where you left off",
    ReadQuran: "Read in the Quran",
    Share: 'Share',
    ShareTitle: 'Share the khatm',
    Whatsapp: 'WhatsApp',
    Sms: 'SMS',
    More: 'More',
    Copy: 'Copy link',
    Copied: 'Copied',
    Invite: 'Join this khatm:',
    Close: 'Close',
    Cancel: 'Cancel',
    Yes: 'Yes',
    YesDelete: 'Yes, delete',
    TakeTitle: 'Take {n}?',
    MineTitle: '{n} is yours',
    OtherTitle: '{n}',
    TakenBy: 'Taken by: {name}',
    NameLabel: 'Your name',
    NamePlaceholder: 'e.g. Aisha',
    NameHint: 'Your name is shown in the list.',
    TakeButton: 'Take part',
    RenameButton: 'Update name',
    ReleaseButton: 'Release part',
    ReleaseYes: 'Yes, release',
    ReleaseConfirm: 'Are you sure you want to release this part? Someone else can take it.',
    Taken: '{n} is yours! Mark it in the chart after reading.',
    TakenSimple: '{n} is yours!',
    JustTaken: 'Someone else took this part a moment ago. Please choose another one.',
    OtherHint: 'If you took this part on this device, you can rename or release it.',
    NotYours: 'This part was taken on another device. Only the person who took it can change it.',
    ShowChart: 'See the reading chart',
    ReactTitle: 'Leave a cheer',
    EmptyKhatm: 'This khatm has no parts yet.',
    EmptyKhatmAdmin: 'This khatm has no parts yet. You can add one below.',
    RateTitle: 'Enjoying Hatim Dağıt?',
    RateText: 'Your rating helps more people join a khatm.',
    RateHigh: 'May Allah reward you! A few words on Google Play would mean a lot.',
    RateLow: 'Could you tell us what we can do better?',
    RateStore: 'Rate on Google Play',
    RateFeedback: 'Write to us',
    RateLater: 'Later',
    TakeFailed: 'This part may have just been taken by someone else, or the connection dropped. Please try again.',
    ReleaseFailed: 'Could not release the part. Check your internet and try again.',
    Released: 'Part released.',
    ChartTitle: 'Reading chart',
    ChartLive: 'Live: everyone in this khatm sees the marks',
    ChartOwnerOnly: 'Only the person who took this part can mark it.',
    ChartRead: '{done} / {total} days read',
    ChartSaveFailed: 'Could not save. Check your internet connection.',
    ChartLoading: 'Loading chart…',
    Today: 'Today',
    Day: 'Day {n}',
    KhatmNo: 'Khatm {n}',
    NewKhatm: 'Add a new khatm to this page',
    NewKhatmConfirm: 'Add a new khatm (30 parts) to this page?',
    NewKhatmAdded: 'New khatm added.',
    NewKhatmFailed: 'Could not add a new khatm. Please try again.',
    StopAuto: 'Stop automatic new khatms',
    DeleteFailed: 'Could not delete the khatm. Check your internet and try again.',
    Deleted: 'Khatm deleted.',
    Hide: 'Hide',
    Show: 'Show',
    EveryNDays: 'A khatm every {n} days',
    ReadToday: 'Read today',
    Live: 'Live',
    ErrorTitle: 'Something went wrong',
    ErrorText: 'The page hit an unexpected error. Reloading usually fixes it.',
    Reload: 'Reload page',
    Home: 'Home',
    RamazanChart: 'Ramadan chart',
    RamazanHint: 'Start from your part and read the next part each day.',
    Months3Hint: 'Each month, start from your part and read the next part each day.',
  },

  CuzGrid: {
    Hint: 'Tap the part you want to take',
    Available: 'Free',
    Taken: 'Taken',
    Read: 'Read',
    Mine: 'Yours',
    Refresh: 'Refresh',
    Completed: 'Alhamdulillah! All parts have been taken.',
    LoadError: 'Could not connect. Check your internet and try again.',
    ReadHint: 'After reading, tap the "Reading" strip below it to mark it as read.',
    RefreshWait: 'You can refresh once every 20 seconds.',
    Retry: 'Try again',
  },


  '/': {
    Question: 'Click on Button to Make New Khatm',
    MyInfos: 'Khatms I Made and My Charts',
    Button: {
      NewTag: 'New',
      BetaTag: 'Beta',
      MyInfos: {
        Charts: 'My Charts',
      },
      Main: 'New Khatm',
      YearBased: 'Make Yearly Khatm',
      Ramazan: 'Make New Ramazan Khatm (Cycled)',
      Aylar3: 'Make 3 Months Khatm',
      EvradEzkar: 'Distribute Vird-Dhikr',
      Header: {
        Text: 'Make New Khatm',
        InputSpan: [
          'Title',
          'Description',
          'Khatm Finish Date',
          'Number of Khatm',
          'Automatically make new Khatm when Khatm is finished',
          'Starting Date',
          'Number of Days To Finish A Khatm Together',
          'Total Khatm Number Will Be Finished',
          'Rotated Khatm',
        ],
        Input: ['Please enter a Khatm title'],
        Button: 'Continue',
      },
      Final: {
        Before: {
          Header: 'New Khatm Is Being Made!',
          Link: 'New Khatm Distribution Link:',
          LinkReady: 'Link is being made',
          Copy: 'Copy the Link',
          Button: 'Please wait',
        },

        After: {
          Header: 'New Khatm Is Ready!',
          Link: 'New Khatm Distribution Link:',
          Copy: 'Link Copied',
          Button: 'Continue',
        },
      },
    },
    ExistingKhatms: 'Khatms Made',
    BottomNavigation: {
      NewKhatm: 'New Khatm',
      KhatmInfos: 'My Khatms',
    },
  },

  '/cuz': {
    KhatmFinishDate: ['The Prayer of this Khatm is going to be made at', '.'],
    NewSubKhatm: 'Add New Khatm to this page',

    Before: {
      Question: 'Click the Part You Want ..',
      Wait: 'Please wait ..',
      Error: 'An error occured, please refresh the page!',
      Deleted: 'This Khatm has been deleted by its owner!',
      WrongLength: 'The link you clicked is not correct!',
    },

    After: {
      Copy: {
        Before: 'Copy the Link',
        After: 'Link Copied',
      },
      Share: 'Share Khatm',
    },

    Button: {
      Question: 'part, enter your name to take it',
      Take: 'Take the Part',
      TakeCancel: 'Release the Part',
    },

    ShareBox: {
      Title: 'Select an app to share:',
      Sms: 'Share with Sms',
      Whatsapp: 'Share with Whatsapp',
    },

    AlertDialog: {
      Title: 'Part is already taken! Please take another Part.',
      Button: 'Ok',
      Feedback: 'Send Feedback',
    },

    CuzlerHatimCard: {
      deleteHatim: 'Delete Khatm',
      changeHatim: 'Change',
      takenParts: 'Taken parts',
      leftParts: ' parts left',
      yourParts: 'The Parts You Took',
      dua: [
        '',
        'days left until prayer',
        'Prayer was done',
        'Prayer will be made today',
        '',
        'days left until prayer',
      ],
      Modal: {
        Title: 'Change Khatm Info',
        Header: 'Khatm Title',
        Description: 'Khatm Description',
        Date: 'Khatm Prayer Date',
        Button: 'Ok',
      },

      Notification: {
        Title: 'Information is being updated',
        Description: 'Please wait until information is being updated.',
      },

      PartModal: {
        Title: 'Change Part Info',
        Title2: 'Enter your name below to take the Part',
        Name: 'Name of Who Taken the Part',
        ChangeNameButton: 'Change Name',
        CancelPart: 'Cancel Part',
      },
    },

    AddKhatmAlert: {
      Question: 'Are you sure you want to add a new Khatm?',
      YesButton: 'Yes',
      NoButton: 'No',
    },

    DeleteKhatmAlert: {
      Question: 'Are you sure you want to delete this Khatm?',
      YesButton: 'Yes',
      NoButton: 'No',
    },

    CuzItem: {
      ChartButton: 'View Chart',
    },
  },

  '/ramazan': {
    KhatmFinishDate: ['The Prayer of this Khatm is going to be made at', '.'],
    NewSubKhatm: 'Add New Khatm to this page',

    Before: {
      Question: 'Click the Part You Want ..',
      Wait: 'Please wait ..',
      Error: 'An error occured, please refresh the page!',
    },

    After: {
      Copy: {
        Before: 'Copy the Link',
        After: 'Link Copied',
      },
      Share: 'Share Khatm',
    },

    Button: {
      Question: 'part, enter your name to take it',
      Take: 'Take the Part',
      TakeCancel: 'Release the Part',
    },

    ShareBox: {
      Title: 'Select an app to share:',
      Sms: 'Share with Sms',
      Whatsapp: 'Share with Whatsapp',
    },
  },

  '/ucaylarhergun1cuz': {},
};

export default english;
