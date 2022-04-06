const path = require('path');

module.exports = {
  entry: './engine/src/App.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },/*
      {
        test: /\.(json|gltf)/,
        use: "json-loader",
        exclude: /node_modules/
      },*/
      {
        test: /\.(glsl|vs|fs|vert|frag|glb|obj|gltf)$/,
        use: 'raw-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: 'file-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.bin$/,
        exclude: /node_modules/,
        use:'binary-loader',
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'App.js',
    path: path.resolve(__dirname, 'build'),
  },
};