const path = require("path");
const fs = require("fs");

const distDir = path.join(__dirname, "dist", "website")
const websiteDir = path.join(__dirname, "website")
const filesToCopy = [
    {
        from: path.join(websiteDir, "index.html"),
        to: path.join(distDir, "index.html"),
    },
    {
        from: path.join(websiteDir, "style.css"),
        to: path.join(distDir, "style.css"),
    },
    {
        from: path.join(websiteDir, "favicon.svg"),
        to: path.join(distDir, "favicon.svg"),
    },
    {
        from: path.join(__dirname, "compiled_beatmaps.json"),
        to: path.join(distDir, "favorite_beatmaps.json"),
    },
]

// Copy resources to the dist directory
fs.mkdirSync(distDir, { recursive: true })
for (const fileToCopy of filesToCopy) {
    fs.copyFileSync(fileToCopy.from, fileToCopy.to)
}

module.exports = {
    entry: path.join(websiteDir, "main.ts"),
    experiments: {
        topLevelAwait: true,
    },
    mode: "development",
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            configFile: path.join(
                              __dirname,
                              "tsconfig.webpack.json",
                            ),
                        },
                    },
                ],
            },
            {
                loader: "handlebars-loader",
                test: /\.handlebars$/,
            },
        ],
    },
    output: {
        filename: "main.js",
        path: distDir,
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
}
