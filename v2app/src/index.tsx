import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import App from './App';
import './App.global.less';
import { CAPTCHA_ROUTE } from './common/Constants';
import CaptchaFrame from './components/Captcha/CaptchaFrame';
import { store } from './global-store/GlobalStore';
import License from './License/pages/License';

render(
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route exact path={`/${CAPTCHA_ROUTE}/:store`} component={CaptchaFrame} />
                <Route path="/app/:page" component={App} />
                <Route path="/" component={License} />
            </Switch>
        </HashRouter>
    </Provider>,
    document.getElementById('root'),
);
