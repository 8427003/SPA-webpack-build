/**
 * @overview
 *
 * @author 
 * @version 2017/11/14
 */


var path = require('path');
var webpack = require('webpack');
var WildcardsEntryWebpackPlugin = require('wildcards-entry-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

const SRC_DIR = "src";
const DIST_DIR = "dist";

const FONTS_DIR = `static/fonts`;
const IMGS_DIR = `static/imgs`;
const JS_DIR = 'static/js'

module.exports = {
    entry: WildcardsEntryWebpackPlugin.entry('./src/**/*.entry.js?(x)', {
        "jquery": ['jquery'],
        "bootstrap": ['bootstrap'],
        "react": ['react', 'react-dom', 'react-router']
    }),
    output: {
        path:  path.resolve(__dirname, DIST_DIR),
        filename: `${JS_DIR}/[name].[chunkhash].js`
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, DIST_DIR)
    },
    resolve: {

        //  require时搜寻的路径, 可以直接require bower_components
        modules: ["node_modules", path.resolve(__dirname, "bower_components")],

        //  可以利用别名来指向min.js，防止require三方依赖时，解析三方内部依赖！
        alias: {
            bootstrap$: path.resolve(__dirname, 'bower_components/bootstrap/dist/js/bootstrap.min.js'),
            "bootstrap.css$": path.resolve(__dirname, 'bower_components/bootstrap/dist/css/bootstrap.min.css'),
            react: path.resolve(__dirname, 'node_modules/react/cjs/react.production.min.js'),
            "react-dom$": path.resolve(__dirname, 'node_modules/react-dom/cjs/react-dom.production.min.js'),
            "react-router": path.resolve(__dirname, 'node_modules/react-router/umd/react-router.min.js'),
            "react-router-dom": path.resolve(__dirname, 'node_modules/react-router-dom/umd/react-router-dom.min.js')
        }
    },
    plugins:[
        new WildcardsEntryWebpackPlugin(),
        new HtmlWebpackPlugin({

            // 这里有bug，filename必须没有任何目录路径，否则webpack-dev-server 404
            // output.path设置就受到限制了
            // https://github.com/jantimon/html-webpack-plugin/issues/3
            // https://github.com/jantimon/html-webpack-plugin/issues/685
            filename: "index.html", //生成的html存放路径，相对于output.path

            template: `${SRC_DIR}/index.html`, // 相对cwd
            inject: true
        }),

        // 相当于每个模块顶部var $  = require('jquery');
        // https://webpack.js.org/plugins/provide-plugin/
        // 'window.jQuery': 'jquery' vs  jQuery: "jquery" 二者有区别!
        // 一个是全局，一个是模块内。所以这里的变量注入是在每个模块内完成的！
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            'window.jQuery': 'jquery'
        }),

        // use in prod, commonsChunk vendor hash stable
        // output filename hash must be [chunkhash]
        //new webpack.HashedModuleIdsPlugin(),

        // names 顺序与html inject顺序相反
        new webpack.optimize.CommonsChunkPlugin({
            name: ["js/react", "js/bootstrap", "js/jquery"],
            minChunks: Infinity
        }),
        new CleanWebpackPlugin(['dist'])
    ],
    resolveLoader: {
        moduleExtensions: ["-loader"]
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            // 需要安装less依赖
            {
                test: /\.less$/,
                    loader: 'style!css!less'
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: `file?name=${FONTS_DIR}/[name].[ext]`
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: 'url?limit=1024&name=${IMGS_DIR}/[name].[ext]'
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
}
