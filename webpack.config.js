const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const Handlebars = require('handlebars')

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
            template: './src/index.hbs'
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
                test: /\.(svg|jpg|jpeg|png)$/,
                loader: 'file-loader'
            },

            // Template compilation
            {
                test: /\.hbs$/,
                loader: 'html-loader',
                options: {
                    preprocessor: (content, loaderContext) => {
                        const templateName = path.basename(loaderContext.resourcePath, '.hbs');
                        const data = require(`./content/${templateName}.json`);
                        const template = Handlebars.compile(content);
                        return template(data);
                    }
                }
            }
        ]
    }
}