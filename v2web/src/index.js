// React Required
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// holds reference to the current connected user
import UserProvider from './component/common/UserContext';
// Create Import File
import './index.scss';
import * as serviceWorker from './serviceWorker';

const Root = () => {
    return (
        <UserProvider>
            <BrowserRouter basename={'/'}>
                <App></App>
            </BrowserRouter>
        </UserProvider>
    );
};

ReactDOM.render(<Root />, document.getElementById('root'));
serviceWorker.register();
