import React from 'react';
import { render } from 'react-dom';
import { MemoryRouter } from 'react-router';
import '../App.global.less';
import License from './License';
render(
    <MemoryRouter>
        <License></License>
    </MemoryRouter>,
    document.getElementById('root'),
);
