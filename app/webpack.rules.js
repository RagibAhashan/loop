module.exports = [
    // Add support for native node modules
    {
        // We're specifying native_modules in the test because the asset relocator loader generates a
        // "fake" .node file which is really a cjs file.
        test: /native_modules\/.+\.node$/,
        use: 'node-loader',
    },
    {
        test: /\.(m?js|node)$/,
        parser: { amd: false },
        use: {
            loader: '@vercel/webpack-asset-relocator-loader',
            options: {
                outputAssetBase: 'native_modules',
            },
        },
    },
    {
        test: /\.tsx?$/,
        exclude: /(node_modules|\.webpack)/,
        use: {
            loader: 'ts-loader',
            options: {
                transpileOnly: true,
            },
        },
    },
    {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
            {
                loader: 'file-loader',
            },
        ],
    },

    {
        test: /\.(less|css)$/,
        use: [
            {
                loader: 'style-loader',
            },
            {
                loader: 'css-loader',
            },
            {
                loader: 'less-loader',
                options: {
                    lessOptions: {
                        javascriptEnabled: true,
                    },
                },
            },
        ],
    },
    {
        // regex for the files that are problematic
        test: /\.\/node_modules\/puppeteer-extra\/dist\/index\.esm\.js/,
        loader: 'string-replace-loader',
        options: {
            // match a require function call where the argument isn't a string
            // also capture the first character of the args so we can ignore it later
            search: 'require[(]([^\'"])',
            // replace the 'require(' with a '__non_webpack_require__(', meaning it will require the files at runtime
            // $1 grabs the first capture group from the regex, the one character we matched and don't want to lose
            replace: '__non_webpack_require__($1',
            flags: 'g',
        },
    },
    {
        test: /\.js$/,
        use: 'unlazy-loader',
    },
];
