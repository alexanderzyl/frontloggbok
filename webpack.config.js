const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

module.exports = {
    entry: './src/index.js', // Entry point for your React app
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/',  // Ensures static files are correctly referenced
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html', // This points to your HTML template file
            filename: 'index.html', // Output file name in the 'dist' directory
        }),
        // DefinePlugin to pass environment variables to the application
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env),
        }),
    ],
    devServer: {
        historyApiFallback: {
            index: '/' // Ensures all routes serve the index.html file
        },
        static: {
            directory: path.join(__dirname, 'public'), // Serve static files from 'public' directory
            publicPath: '/', // Ensure the server knows the root public path
        },
        compress: true,
        port: 3000, // Port to run the development server
    },
    resolve: {
        fallback: {
            "url": require.resolve("url")
        }
    }
};