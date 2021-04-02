const path = require('path');

module.exports = {
    devtool: 'inline-source-map',
    target: 'electron-main',
    mode: 'development',
    entry: './src/main.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [{ loader: 'ts-loader', options: { configFile: 'tsconfig.electron.json' } }],
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'main.prod.js',
        path: path.join(__dirname, 'src/'),
    },
    node: {
        __dirname: false,
        __filename: false,
    },
};
