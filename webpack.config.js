const path = require('path');

module.exports = {
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
        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'), // Serve static files from 'public' directory
        },
        compress: true,
        port: 8080, // Port to run the development server
    },
};
