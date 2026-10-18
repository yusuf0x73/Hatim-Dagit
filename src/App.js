import { Ozel } from './pages/ozel';
import logo from './logo.svg';
import './App.css';
import {Home} from './pages';
import {Cuz} from './pages/cuz';
import {CuzV2} from './pages/cuzV2';
import {Ramazan} from './pages/ramazan';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import {ErrorBoundary} from 'components/khatmKit';
import {AppDownloadHost} from 'components/common/AppDownload';
import Message from './components/common/Message';
import { UcAylarHerGun1Cuz } from 'pages/ucaylarhergun1cuz';
import { UcAylarPage } from 'pages/ucaylar';
import { CizelgelerimPage } from 'pages/cizelgelerim';
import { Yillik } from 'pages/yillik';
import { Cookie } from 'tabler-icons-react';
import { PrivacyPolicy } from 'pages/privacypolicy';
import { TermsConditions } from 'pages/termsconditions';
import {Cookies} from 'pages/cookies'
import {Oku} from 'pages/oku';


function App() {
  return (
    <>
    {/* <Message /> */}
    <BrowserRouter>
      <ErrorBoundary>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/cuz" component={Cuz} />
        <Route path="/cuzv2" component={CuzV2} />
        <Route path="/ramazan" component={Ramazan} />
        <Route path="/ucaylarhergun1cuz" component={UcAylarHerGun1Cuz} />
        <Route path="/ucaylar" component={UcAylarPage} />
        <Route path="/ozel" component={Ozel} />
        <Route path="/oku" component={Oku} />
        <Route path="/cizelgelerim" component={CizelgelerimPage} exact />
        <Route path="/yillik" component={Yillik} />
        <Route path="/cookies" component={Cookies} />
        <Route path="/privacypolicy" component={PrivacyPolicy} />
        <Route path="/termsconditions" component={TermsConditions} />
      </Switch>
      </ErrorBoundary>
      <AppDownloadHost />
    </BrowserRouter>
    </>
  );
}

export default App;
