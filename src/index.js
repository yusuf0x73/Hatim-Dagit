import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {DatabaseContext, dataService, DataServiceContext, db} from './backend';
import {isEmptyObjectLocDb, isSafari, isStandalone} from './common';
import detectLanguage from './common';
import Language from './strings';
import localDb from '@yusuf-yeniceri/easy-storage';
import {store} from './redux/store';
import {Provider} from 'react-redux';
import {NotificationsProvider} from '@mantine/notifications';
import {MantineProvider} from '@mantine/core';
import {mantineTheme} from './theme';

// Arapça sağdan sola okunur; ekran okuyucular için sayfanın dili de bildirilir
document.documentElement.lang = detectLanguage ();
document.documentElement.dir = detectLanguage () === 'ar' ? 'rtl' : 'ltr';

ReactDOM.render (
  <DataServiceContext.Provider value={dataService}>
    <DatabaseContext.Provider value={db}>
      <Provider store={store}>
        <MantineProvider theme={mantineTheme}>
          <NotificationsProvider position="top-center" autoClose={3500}>
            <App />
          </NotificationsProvider>
        </MantineProvider>
      </Provider>
    </DatabaseContext.Provider>
  </DataServiceContext.Provider>,
  document.getElementById ('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals ();

/***
 * temporary
 */
// if(navigator.userAgent.indexOf("ASUS_T00J")){
//   localStorage.setItem("user","test")
// }
/**
 * temporary end
 */

/**
 * firebase part
 */
const firebaseToDo = async () => {
  if (localStorage.getItem ('user') != 'test') await db.ziyaretSayisiArtir ();
};

firebaseToDo ();

/**
 * firebase part end
 */

if ('serviceWorker' in navigator) {
  console.log ('Will the service worker register?');
  navigator.serviceWorker
    .register ('service-worker.js')
    .then (function (reg) {
      console.log ('Yes, it did.');
    })
    .catch (function (err) {
      console.log ("No it didn't. This happened:", err);
    });
}

// Kurulum artık Google Play (Android) ya da "Ana ekrana ekle" yönergesi (iPhone) ile; tarayıcının kendi kurulum çubuğu gösterilmez
window.addEventListener ('beforeinstallprompt', e => e.preventDefault ());

/**
 * message part
 */

/**
 * message part end
 */
