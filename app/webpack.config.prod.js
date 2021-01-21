const path = require('path');

module.exports = {
    target: 'electron-main',
    mode: 'production',
    entry: './src/main.js',
    output: {
        filename: 'main.prod.js',
        path: path.join(__dirname, 'src/'),
    },

    node: {
        __dirname: false,
        __filename: false,
    },
};
