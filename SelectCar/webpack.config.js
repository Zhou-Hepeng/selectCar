var path = require("path");
var webpack = require('webpack');
var node_modules_dir = path.resolve(__dirname, 'node_modules');

// process.env.NODE_ENV  product or dev

var config = {
    devtool:false,
    entry: {
       // admin : path.resolve(__dirname, 'containers/Admin'),
        all: './index',
    },
    output: {
        path: path.resolve(__dirname, 'build/'),
        filename: "[name].js"
        ,publicPath: "/build/"
    },

    module: {
        loaders: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: [node_modules_dir]
            },{
                  test: /\.json$/,
                  loaders: ['json'],
                  exclude: /node_modules/
            },{
                  test: /\.(png|jpg|eot|woff|svg|ttf|woff2|gif)$/,
                  loader: 'url?limit=900000'
            }, {
                  test: /\.less/,
                  loader: 'style-loader!css-loader!less-loader'
            },
        ]
    },
    resolve: {
        extensions: ['', '.js', '.json', '.jsx', 'less']
    },
    //压缩 提前common文件
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: ['import', '$', 'export']
            },
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.CommonsChunkPlugin('common.js'),
    ]
};
module.exports = config;



// ,{
//                   test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
//                   exclude: /^node_modules$/,
//                   loader: 'file-loader?name=[name].[ext]'
//             }
