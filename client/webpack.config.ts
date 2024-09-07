import path from 'path';
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const config: webpack.Configuration = {
  entry: {
    yandex: './src/yandex.ts',
    youtube: './src/youtube.ts',
    background: './src/background.ts',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        use: 'ts-loader',
        test: /\.ts$/,
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'development',
  watch: true,
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: 'static' }],
    }),
  ],
};

export default config;
