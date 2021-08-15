const path = require("path");
const fs = require("fs");

const distDir = path.resolve(__dirname, "dist", "website")
const websiteDir = path.resolve(__dirname, "website")

// Copy resources to the dist directory
fs.mkdirSync(distDir, { recursive: true })
fs.copyFileSync(
    path.join(__dirname, "compiled_beatmaps.json"),
    path.join(distDir, "favorite_beatmaps.json")
)
fs.copyFileSync(
  path.join(websiteDir, "index.html"),
  path.join(distDir, "index.html")
)
fs.copyFileSync(
  path.join(websiteDir, "style.css"),
  path.join(distDir, "style.css")
)

module.exports = {
    entry: path.join(websiteDir, "main.ts"),
    experiments: {
      topLevelAwait: true,
    },
    mode: "development",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [{
            loader: "ts-loader",
            options: {
                configFile: path.join(__dirname, "tsconfig.webpack.json"),
            }
        }],
          exclude: /node_modules/,
        },
        {
          test: /\.handlebars$/,
          loader: "handlebars-loader",
        }
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      filename: "main.js",
      path: distDir,
    },
};
