const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
const path = require('path');

rules.push({
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
    module: {
        rules,
    },
    plugins: plugins,
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            // https://stackoverflow.com/questions/64557638/how-to-polyfill-node-core-modules-in-webpack-5
            assert: false,
            tls: false,
            net: false,
        },
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
            '@css': path.resolve(__dirname, 'src/css/'),
        },
    },
};
