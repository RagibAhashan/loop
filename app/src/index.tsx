import React from 'react';
import { render } from 'react-dom';
import App from './App';
import './App.global.less';
import { BrowserRouter, MemoryRouter, Route, Switch } from 'react-router-dom';
import CaptchaFrame from './components/CaptchaFrame';

render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/captcha" component={CaptchaFrame} />
            <Route path="/" component={App} />
        </Switch>
    </BrowserRouter>,
    document.getElementById('root'),
);
