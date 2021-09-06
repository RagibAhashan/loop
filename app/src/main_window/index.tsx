import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import '../App.global.less';
import { store } from '../global-store/GlobalStore';
import App from './App';

render(
    <MemoryRouter>
        <Provider store={store}>
            <App></App>
        </Provider>
    </MemoryRouter>,
    document.getElementById('root'),
);
