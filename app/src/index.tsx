import React from 'react';
import { render } from 'react-dom';
import App from './App';
import './App.global.less';
import { HashRouter, MemoryRouter, Route, Switch } from 'react-router-dom';
import CaptchaFrame from './components/CaptchaFrame';

render(
    <HashRouter>
        <Switch>
            <Route exact path="/captcha" component={CaptchaFrame} />
            <Route path="/" component={App} />
        </Switch>
    </HashRouter>,
    document.getElementById('root'),
);
