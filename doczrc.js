module.exports = {
  title: "hooks",
  description: "MYGZB.com react-hooks 库",
  typescript: true,
  ordering: "ascending",
  hashRouter: true,
  modifyBundlerConfig: config => {
    const rule = config.module.rules[1];
    config.module.rules.unshift({
      test: /\.css$/,
      use: [require.resolve("style-loader"), require.resolve("css-loader")]
    });
    rule.use[1] = {
      loader: require.resolve("react-docgen-typescript-loader"),
      options: {
        tsconfigPath: "tsconfig.json"
      }
    };
    return config;
  }
};
