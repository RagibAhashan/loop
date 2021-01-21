const path = require('path');

module.exports = {
    devtool: 'inline-source-map',
    target: 'electron-main',
    mode: 'development',
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
