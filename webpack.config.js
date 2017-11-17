/**
 * @overview
 *
 * @author
 * @version 2017/11/14
 */


var path = require('path');
var webpack = require('webpack');
var WildcardsEntryWebpackPlugin = require('wildcards-entry-webpack-plugin');
//var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ExtractTextPlugin = require("extract-css-chunks-webpack-plugin");
var FlushCssChunksWebpackPlugin = require('flush-css-chunks-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');


const SRC_DIR = "src";
const DIST_DIR = "dist";

const FONTS_DIR = `static/fonts`;
const IMGS_DIR = `static/imgs`;
const JS_DIR = 'static/js'
const CSS_DIR = 'static/css'

const MOCK_API_JSON_FILE = './mock/api.json';



module.exports = function (env={}){
    const config = {
        entry: {
            "index": ["./src/index.entry.js"],
            "common": [
                'jquery',
                './src/common/scss/common.scss',
                'font-awesome/css/font-awesome.min.css',
                'simple-line-icons/css/simple-line-icons.css'
            ],
            "react": [
                'react',
                'react-dom',
                'react-router',
                'react-transition-group',
                'reactstrap'
            ]
        },
        output: {
            path:  path.resolve(__dirname, DIST_DIR),
            // publicPath 是用于html中，资源加前缀，对资源生成目录没影响
            publicPath: '/',
            filename: `${JS_DIR}/[name].[${env.prod?'chunkhash':'hash'}:8].js`
        },
        devServer: {
            hot: true,
            // 这里的outpu.path是放在内存中的
            // 这个变量的意思相当于nginx，
            //  location ${publicPath} {
            //      root   ${output.path};
            //  }
            //
            //  所以contentBase不用设置${output.path}
            publicPath:'/',

            // 额外的静态资源目录，不受publicPath影响, 访问path为/ 根路径
            // 这个变量的意思相当于nginx，
            //  location / {
            //      root   ${contentBase};
            //  }
            //
            // 如果publicPath也设置为/根路径，那么publicPath对应的资源也就是${output.path}优先级高
            // 官方文档有描述https://webpack.js.org/configuration/dev-server/#devserver-contentbase
            //
            contentBase: [path.resolve(__dirname, path.dirname(MOCK_API_JSON_FILE))],
            proxy:{
                '/**': {
                    bypass: (function() {
                        var fs = require('fs');
                        var JSON5 = require('json5');
                        var util= require('util');
                        var mTimeCache = {};
                        var apiJsonFileCache;

                        // 这里的请求路径能命中${contentBase}或者${output.path}就不匹配这里
                        return function(req, res, proxyOptions) {
                            let stats;
                            try {
                                stats = fs.statSync(MOCK_API_JSON_FILE)
                            }
                            catch(e){
                                //  如果没有api.json文件，不需要mock
                                return false;
                            }

                            //  如果api.json文件有改动,从新读取
                            if(mTimeCache[MOCK_API_JSON_FILE] !== stats.mtime){
                                let tmpData = fs.readFileSync(MOCK_API_JSON_FILE, 'utf8')
                                try {
                                    apiJsonFileCache = JSON5.parse(tmpData);
                                }
                                catch(e){
                                    console.error(MOCK_API_JSON_FILE);
                                    console.error(e);
                                    return false;
                                }
                            }

                            var mockJsonPath = apiJsonFileCache[req.path];
                            if(mockJsonPath) {
                                let mockJsonFullPath  = path.resolve(path.dirname(MOCK_API_JSON_FILE), mockJsonPath);
                                let mockData;
                                try {
                                    mockData = fs.readFileSync(mockJsonFullPath, 'utf8')
                                }
                                catch(e){
                                    console.warn('warn: 404', "request:",req.path+",", 'not found:', mockJsonPath)
                                    return false;
                                }
                                let result = JSON5.parse(mockData)
                                res.json(result);
                                return;
                            }
                            return;
                        }
                    })()
                }
            }
        },
        resolve: {

            //  require时搜寻的路径, 可以直接require bower_components
            modules: ["node_modules", path.resolve(__dirname, "bower_components")],

            //  可以利用别名来指向min.js，防止require三方依赖时，解析三方内部依赖！
            alias: {
                jquery$: path.resolve(__dirname, 'node_modules/jquery/dist/jquery.min.js'),
                "react-transition-group":path.resolve(__dirname, 'node_modules/react-transition-group/dist/react-transition-group.min.js'),
                reactstrap$: path.resolve(__dirname, 'node_modules/reactstrap/dist/reactstrap.min.js'),
                react$: path.resolve(__dirname, 'node_modules/react/cjs/react.production.min.js'),
                "react-dom$": path.resolve(__dirname, 'node_modules/react-dom/cjs/react-dom.production.min.js'),
                "react-router": path.resolve(__dirname, 'node_modules/react-router/umd/react-router.min.js'),
                "react-router-dom": path.resolve(__dirname, 'node_modules/react-router-dom/umd/react-router-dom.min.js')
            }
        },
        plugins:[
            //new WildcardsEntryWebpackPlugin(),
            new HtmlWebpackPlugin({
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


            // names 顺序与html inject顺序相反
            new webpack.optimize.CommonsChunkPlugin({
                name: ["react", "common"],
                minChunks: Infinity
            }),
            new CleanWebpackPlugin(['dist']),

            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: `"${ env.dev? 'development' : 'production'}"`,
                }
            })
        ],
        resolveLoader: {
            moduleExtensions: ["-loader"]
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: "style-loader"
                        },
                        {
                            loader: "css-loader"
                        }
                    ]
                },
                {
                    test: /\.less/,
                    use: [
                        {
                            loader: "style-loader"
                        },
                        {
                            loader: "css-loader"
                        },
                        {
                            loader: "less-loader"
                        }
                    ]
                },
                {
                    test: /\.scss/,
                    use: [
                        {
                            loader: "style-loader"
                        },
                        {
                            loader: "css-loader"
                        },
                        {
                            loader: "sass-loader"
                        }
                    ]
                },
                {
                    test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: `file?name=${FONTS_DIR}/[name].[ext]`
                },
                {
                    test: /\.(png|jpe?g|gif)$/,
                    loader: `url?limit=1024&name=${IMGS_DIR}/[name].[ext]`
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015','react', 'stage-2'],

                        //  import() 本来webpack支持，但是用了babel需要插件才能支持了。
                        //  否则报语法错误
                        plugins: ["syntax-dynamic-import", "dual-import"]
                    }
                }
            ]
        }
    }


    if (env.dev) {
        const pluginList = [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
        ];
        Array.prototype.push.apply(config.plugins, pluginList);
    }

    if (env.prod) {
        config.devtool = 'source-map';

        config.module.rules[0]=  {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader?minimize']
            })
        }
        config.module.rules[1]=  {
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader?minimize', 'less-loader']
            })
        }
        config.module.rules[2]=  {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader?minimize', 'sass-loader']
            })
        }
        Array.prototype.push.apply(config.plugins, [
            new ExtractTextPlugin({filename: `${CSS_DIR}/[name].[contenthash:8].css`}),

            // use in prod, commonsChunk vendor hash stable
            // output filename hash must be [chunkhash]
            new webpack.HashedModuleIdsPlugin(),

            // 根据路径作为稳定的模块名
            //new webpack.NamedModulesPlugin(),

            new webpack.optimize.UglifyJsPlugin({sourceMap: true}),
            new FlushCssChunksWebpackPlugin({ entryOnly: true })
        ]);
    }

    return config;
}
