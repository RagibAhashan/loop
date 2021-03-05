import './App.css';
import OauthReact from './pages/oauthDiscord';
import LandingPage from './pages/landingPage';

import { Button } from 'antd';
import { BrowserRouter, Route, Switch } from 'react-router-dom';


const App = () => {

  return (
    <div style={{height:'100%'}}>

    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={LandingPage} />
            <Route path="/dashboard/" component={OauthReact} />
        </Switch>
    </BrowserRouter>


    </div>
  );
}

export default App;
