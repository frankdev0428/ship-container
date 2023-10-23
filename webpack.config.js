/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

const { merge } = require('webpack-merge')
const singleSpaDefaults = require('webpack-config-single-spa-react-ts')
const webpack = require('webpack')

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: 'aeler',
    projectName: 'flocktilla',
    webpackConfigEnv,
    argv,
  })

  return merge(defaultConfig, {
    devServer: {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':
          'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers':
          'X-Requested-With, content-type, Authorization',
      },
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        REACT_APP_AELER_AUTH_BASE_URL: '',
        REACT_APP_AELER_AUTH_CLIENT_ID: '',
        REACT_APP_AELER_AUTH_REALM: '',
        REACT_APP_AELERAPI_URL: '',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.ts|\.tsx$/,
          exclude: path.resolve(__dirname, 'node_modules'),
          include: path.resolve(__dirname, 'src'),
          use: 'ts-loader',
        },
        {
          test: /\.js$/,
          exclude: path.resolve(__dirname, 'node_modules'),
          include: path.resolve(__dirname, 'src'),
          use: 'babel-loader',
        },
        {
          test: /\.d.ts$/,
          loader: 'ignore-loader',
        },
        {
          test: /\.(png|jpg|woff|woff2|eot|ttf|svg|gif)$/i,
          type: 'asset/resource',
          // exclude: path.resolve(__dirname, 'node_modules'),
        },
        // {
        //   test: /\.(woff|woff2|eot|ttf|otf)$/i,
        //   type: 'asset/resource',
        //   // exclude: path.resolve(__dirname, 'node_modules'),
        // },
      ],
    },
    resolve: {
      // extensions: ['.ts', '.tsx', '.js'],
      fallback: { path: false },
    },
  })
}
