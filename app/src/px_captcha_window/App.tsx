import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../global-store/GlobalStore';
import CaptchaFrame from './CaptchaFrame';

const App = () => {
    return (
        <Provider store={store}>
            <CaptchaFrame></CaptchaFrame>
        </Provider>
    );
};

export default App;
