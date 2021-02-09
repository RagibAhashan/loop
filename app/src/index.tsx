import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import App from './App';
import './App.global.less';
import { CAPTCHA_ROUTE } from './common/Constants';
import CaptchaFrame from './components/Captcha/CaptchaFrame';

render(
    <HashRouter>
        <Switch>
            <Route exact path={`/${CAPTCHA_ROUTE}/:store`} component={CaptchaFrame} />
            <Route path="/" component={App} />
        </Switch>
    </HashRouter>,
    document.getElementById('root'),
);
