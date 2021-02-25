const path = require('path');
const { DefinePlugin } = require('webpack');

const nodeExternals = require('webpack-node-externals');

const NODE_ENV = process.env.NODE_ENV;
const isDevMode = NODE_ENV === 'development';

const dotenv = require('dotenv').config({
    path: path.join(__dirname, '.env' + (isDevMode ? '.development' : '')),
});

const env = dotenv.parsed;

module.exports = {
    resolve: {
        extensions: ['.js', '.json', '.mjs'],
    },
    mode: NODE_ENV || 'development',
    entry: path.resolve(__dirname, 'src/server/index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.js',
        // publicPath: ASSET_PATH,
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                use: 'babel-loader',
                // exclude: [/node_modules/],
            },
            {
                test: /\.(c|sa|sc)ss?$/,
                use: [
                    'style-loader',
                    // { loader: 'css-modules-typescript-loader' }, // to generate a .d.ts module next to the .scss file (also requires a declaration.d.ts with "declare modules '*.scss';" in it to tell TypeScript that "import styles from './styles.scss';" means to load the module "./styles.scss.d.td")
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 3,
                            modules: {
                                mode: 'local',
                                localIdentName: '[name]__[local]__[hash:base64:5]',
                                auto: /\.module\.\w+$/i,
                            },
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/',
                        },
                    },
                ],
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                use: ['url-loader'],
            },
        ],
    },
    plugins: [
        new DefinePlugin({
            'process.env': {
                PUBLIC_PATH: `'${env.PUBLIC_PATH}'`,
                CONFIG: `'${env.CONFIG}'`,
            },
        }),
    ],

    devtool: 'source-map',
};
