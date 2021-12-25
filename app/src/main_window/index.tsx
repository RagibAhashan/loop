import React from 'react';
import { render } from 'react-dom';
import { MemoryRouter } from 'react-router';
import '../App.global.less';
import App from './App';

render(
    <MemoryRouter>
        <App></App>
    </MemoryRouter>,
    document.getElementById('root'),
);
