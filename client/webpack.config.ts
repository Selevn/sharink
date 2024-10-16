import path from 'path';
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const config: webpack.Configuration = {
  entry: {
    yandex: './src/yandex/yandex.ts',
    youtube: './src/youtube.ts',
    background: './src/background.ts',
  },
  output: {
    filename: 'sharink-[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
  },
  module: {
    rules: [
      {
        use: 'ts-loader',
        test: /\.ts$/,
        exclude: /node_modules/,
      },
      {
        use: ['css-loader'],
        test: /\.css$/,
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'development',
  watch: true,
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'static' },
        {
          from: '**/*.css', // adjust the path as needed
          to: path.resolve(__dirname, 'dist/assets/sharink-[name][ext]'),
          context: 'src', // only copy from the 'src' directory
        },
      ],
    }),
  ],
};

export default config;
