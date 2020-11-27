module.exports = {
    env: {
        browser: true,
    },
    extends: ['prettier', 'plugin:jsx-a11y/recommended', 'plugin:sonarjs/recommended', 'plugin:promise/recommended'],
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['import', 'prettier', 'jsx-a11y', 'sonarjs', 'promise'],
    rules: {
        'no-shadow': 'off',
        'no-console': 'worn',
        'sonarjs/cognitive-complexity': ['error', 30],
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                ts: 'never',
                tsx: 'never',
                js: 'never',
                jsx: 'never',
            },
        ],
    },
    settings: {
        'import/resolver': {
            webpack: {
                config: 'webpack.config.js',
            },
        },
    },
};
