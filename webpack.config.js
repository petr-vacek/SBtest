var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

const PATHS = {
    app: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'dist')/*,
    vendor: ["react", "react-bootstrap", "react-dom", "react-router", "html-webpack-plugin", "webpack"]*/
};

module.exports = {

    entry: PATHS.app,

    output: {
        path: PATHS.build,
        filename: 'bundle.js'
    },

    resolve: {
        extensions: ['', '.jsx', '.js']
    },

    module: {
        loaders: [
            {
                test: /\.css$/,
                loaders: ['style', 'css'],
                include: PATHS.app
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            },
            {
                test: /\.jsx?$/,
                loaders: ['babel'],
                include: PATHS.app
            },

            { test: /\.(png|gif|woff|woff2|eot|ttf|svg)|(\?v=.+)$/,
              loader: 'url-loader?limit=1000000' }         
            
            ]
    },

    devtool: "#inline-source-map",

    plugins:
      [
        new webpack.HotModuleReplacementPlugin(),
//        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js"),
        new HtmlwebpackPlugin({title: 'Songbook'})
      ]

};



