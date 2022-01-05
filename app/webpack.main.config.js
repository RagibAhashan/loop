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
            '@google_captcha_window': path.resolve(__dirname, 'src/google_captcha_window/'),
            '@px_captcha_window': path.resolve(__dirname, 'src/px_captcha_window/'),
            '@core': path.resolve(__dirname, 'src/core/'),
            '@pages': path.resolve(__dirname, 'src/pages/'),
            '@components': path.resolve(__dirname, 'src/components/'),
            '@common': path.resolve(__dirname, 'src/common/'),
            '@constants': path.resolve(__dirname, 'src/constants/'),
            '@interfaces': path.resolve(__dirname, 'src/interfaces/'),
            '@services': path.resolve(__dirname, 'src/services/'),
            '@styles': path.resolve(__dirname, 'src/styles/'),
        },
    },
    externals: {
        bufferutil: 'bufferutil',
        'utf-8-validate': 'utf-8-validate',
        canvas: 'canvas',
        'osx-temperature-sensor': 'osx-temperature-sensor',
    },
};
