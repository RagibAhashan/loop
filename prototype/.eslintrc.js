module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        'no-unused-vars': 'off',
        'no-underf': 'off',
        'no-useless-escape': 'off',
        'no-empty': 'off',
    },
};
