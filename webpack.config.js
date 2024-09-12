const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // devtool: false, // Just add this line to turn off source maps
    entry: './src/index.js', // Entry point for your React app
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
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
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'), // Serve static files from 'public' directory
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
