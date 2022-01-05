import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import '@css/index.less';
import React from 'react';
import { render } from 'react-dom';
import { MemoryRouter } from 'react-router';
import App from './App';

render(
    <MemoryRouter>
        <ChakraProvider>
            <ColorModeScript initialColorMode={'light'} />
            <App></App>
        </ChakraProvider>
    </MemoryRouter>,
    document.getElementById('root'),
);
