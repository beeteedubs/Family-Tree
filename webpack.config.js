var HTMLWebpackPlugin = require("html-webpack-plugin");
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: __dirname + "/templates/index2.html",
  filename: "index.html",
  inject: "body",
});
module.exports = {
  entry: __dirname + "/static/js/index2.js",
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  output: {
    filename: "transformed.js",
    path: __dirname + "/build",
  },
  plugins: [HTMLWebpackPluginConfig],
};
