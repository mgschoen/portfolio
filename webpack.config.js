const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {

    // General settings
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    performance: {
        hints: false
    },

    // Dev environment
    devServer: {
        contentBase: './dist'
    },

    // Minification and source maps
    devtool: 'source-map',
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin({})
        ]
    },

    // Plugins
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css'
        })
    ],

    module: {
        rules: [

            // CSS/SCSS processing
            {
                test: /\.css$/,
                use: [ 
                    MiniCssExtractPlugin.loader, 
                    'css-loader' 
                ]
            },
            {
                test: /\.scss$/,
                use: [ 
                    MiniCssExtractPlugin.loader, 
                    'css-loader',
                    'sass-loader' 
                ]
            },

            // Image processing
            {
                test: /\.(jpg|jpeg|png)$/,
                loader: 'file-loader'
            }
        ]
    }
}