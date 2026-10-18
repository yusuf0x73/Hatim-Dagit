

//                                          BİSMİLLAHİRRAHMANİRRAHİM
//                                              ALLAHU EKBER
//                                              ELHAMDÜLİLLAH

// import map from '../../src/images/map.svg'
// import blog from '../../src/images/blog.svg'
// import message from '../../src/images/message.svg'
import detectLanguage from '../common';
import Arabic from './Arabic';
import Turkish from './Turkish';
import english from './english';

export type LanguageType = {
    Navbar: {
        Logo: string,
        Links: string[],
        LinkHelpers: string[],
        Buttons: string[],
        Languages: {[key:string]:string}[],
        Pwa: string,
        Menu: string,


    },

    Pwa: {
        Alert: string,
        Popup: string[]
    },

    Footer: {
        aciz_kul: string,
        ziyaret: string[],
        version: string,
        GoToMainPage: string,
        Feedback: string,

    },

    AlertDialog: {
        Text: string,
        Yes: string,
        No: string
    },

    AutomaticKhatm: string,

    Home: {
        Title: string,
        Subtitle: string,
        QuickDesc: string,
        SurahKhatm: string,
        SurahKhatmDesc: string,
        CustomKhatm: string,
        CustomKhatmDesc: string,
        OtherTypes: string,
        YearBasedDesc: string,
        Months3Desc: string,
        RamazanDesc: string,
        EvradEzkarDesc: string,
        StepsTitle: string,
        Steps: string[][],
        Hadith: string,
        HadithSource: string,
        YearlyNote: string,
        CreateFailed: string,
    },

    MyKhatms: {[key: string]: string},

    App: {[key: string]: any},

    Kit: {[key: string]: string},

    CuzGrid: {
        Hint: string,
        Available: string,
        Taken: string,
        Read: string,
        Mine: string,
        Refresh: string,
        Completed: string,
        LoadError: string,
        Retry: string,
        ReadHint: string,
        RefreshWait: string,
    },

    "/" : {
        Question: string,
        MyInfos?: string,
        Button: {
            NewTag: string,
            MyInfos?: {
                Charts: string
            },
            Main: string,
            YearBased:string,
            Ramazan: string,
            Aylar3?: string,
            EvradEzkar:string,
            Header: {
                Text: string,
                Text3MonthProgram?: string,
                InputSpan: string[],
                Input: string[],
                Button: string
            },
            Final: {
                Before: {
                    Header: string,
                    Link: string,
                    LinkReady: string,
                    Copy: string,
                    Button: string
                },

                After: {
                    Header: string,
                    Link: string,
                    Copy: string,
                    Button: string
                }
            }
        },
        ExistingKhatms:string,
        BottomNavigation: {
            NewKhatm: string,
            KhatmInfos: string
        }

    },

    "/cuz":any,

    "/ramazan":any,

    "/ucaylarhergun1cuz":any,
}


// detectLanguage her zaman "tr", "en" ya da "ar" döner
const languages: {[code: string]: LanguageType} = {tr: Turkish, en: english, ar: Arabic};
const Language: LanguageType = languages[detectLanguage()] || Turkish;

export default Language;

