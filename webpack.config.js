const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = {
  mode: "development",
  entry: {
    "script.js": resolve(__dirname, "src/script.js"),
    "article/script.js": resolve(__dirname, "src/article/script.js"),
    "signin/script.js": resolve(__dirname, "src/signin/script.js"),
    "signout/script.js": resolve(__dirname, "src/signout/script.js"),
    "admin/script.js": resolve(__dirname, "src/admin/script.js"),
    "admin/add-article/script.js": resolve(__dirname, "src/admin/add-article/script.js"),
    "admin/edit-article/script.js": resolve(__dirname, "src/admin/edit-article/script.js"),
    "admin/storage/script.js": resolve(__dirname, "src/admin/storage/script.js"),
    "admin/settings/script.js": resolve(__dirname, "src/admin/settings/script.js"),
  },
  output: {
    publicPath: "/",
    filename: "[name]",
    path: resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "src/index.html"),
      chunks: [],
      filename: "index.html",
    }),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "src/article/index.html"),
      chunks: [],
      filename: "article/index.html",
    }),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "src/signin/index.html"),
      chunks: [],
      filename: "signin/index.html",
    }),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "src/signout/index.html"),
      chunks: [],
      filename: "signout/index.html",
    }),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "src/admin/index.html"),
      chunks: [],
      filename: "admin/index.html",
    }),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "src/admin/add-article/index.html"),
      chunks: [],
      filename: "admin/add-article/index.html",
    }),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "src/admin/edit-article/index.html"),
      chunks: [],
      filename: "admin/edit-article/index.html",
    }),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "src/admin/storage/index.html"),
      chunks: [],
      filename: "admin/storage/index.html",
    }),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "src/admin/settings/index.html"),
      chunks: [],
      filename: "admin/settings/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};

module.exports = config;
