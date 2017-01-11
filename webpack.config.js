global.Promise = require('bluebird');

var webpack = require('webpack');
var path = require('path');
var plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            BROWSER:  JSON.stringify(true),
            NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
        }
    })
];

if (process.env.NODE_ENV === 'production') {
    plugins.push(
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        })
    );
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            include: /\.js$/,
            minimize: true
        })
    );
}


module.exports = {
    entry: {
        'main': ['babel-polyfill', './app/app.js']
    },
    debug: process.env.NODE_ENV !== 'production',
    resolve: {
        root: path.join(__dirname, 'src'),
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: path.join(__dirname, "plugin/js"),
        filename: "[name].js"
    },
    module: {
        plugins: plugins,
        loaders: [
            {test: /\.jsx?$/, loader: 'babel', exclude: [/node_modules/, /plugin/]}
        ]
    },
    devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : null
};
