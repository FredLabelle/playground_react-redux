const webpack = require('webpack');

module.exports = {
  webpack(config) {
    config.module.rules.push(
      {
        test: /\.css$/,
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]',
        },
      },
      {
        test: /\.css$/,
        use: ['babel-loader', 'raw-loader', 'postcss-loader'],
      } /*, {
      test: /\.gql$/,
      loader: 'graphql-tag/loader',
    }*/,
    );
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
    return config;
  },
};
