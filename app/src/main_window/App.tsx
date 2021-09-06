import React, { Fragment } from 'react';

const App = () => {
    return (
        <Fragment>
            <button
                onClick={() => {
                    window.ElectronBridge.send('test-channel', 'test string', 123, []);
                }}
            >
                click
            </button>
            <div style={{ color: 'white' }}> Test font 123 hi how are you doing I am doing pretty fine thanks </div>
        </Fragment>
    );
};

export default App;
