const webpack = require('webpack');
const path = require('path');
// const envKeys = Object.keys(env).reduce((prev, next) => {
//   prev['process.env.${next}'] = JSON.stringify(env[next]);
//   return prev;
// }, {});
const config= 
  {entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['*',
      '.js',
      '.jsx'
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(
    // (envKeys)
      { 'process.env.REACT_APP_CLOUD_URL':'https://efix-dev1.hcm.us6.oraclecloud.com'} 
      // { 'process.env.API_URL': JSON.stringify(${env.REACT_APP_CLOUD_URL}) }
      )
  ],
 
  devServer: {
    contentBase: './dist',
    hot: true
  },
  externals:{
    
  }
  
}

module.exports = config;