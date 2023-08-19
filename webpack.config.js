// eslint-disable-next-line no-undef
module.exports = {
  devtool: "cheap-module-source-map",
  "process.env": {
    NODE_ENV: JSON.stringify("production"),
  },
  resolve: {
    // eslint-disable-next-line no-undef
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    fallback: { "crypto": false },
  },
}