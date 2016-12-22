module.exports = {
  entry: './src/app.js',
  output: {
    filename: './bin/bundle.js'
  },
  module: {
    loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
}
