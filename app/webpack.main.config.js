const path = require('path');
module.exports = {
    /**
     * This is the main entry point for your application, it's the first file
     * that runs in the main process.
     */
    entry: './src/main.ts',
    // Put your normal webpack config below here
    module: {
        rules: require('./webpack.rules'),
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
        alias: {
            '@main_window': path.resolve(__dirname, 'src/main_window/'),
            '@license_window': path.resolve(__dirname, 'src/license_window/'),
            '@captcha_window': path.resolve(__dirname, 'src/captcha_window/'),
        },
    },
};
