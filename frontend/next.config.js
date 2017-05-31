module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.gql$/,
      loader: 'graphql-tag/loader',
    });
    return config;
  },
};
