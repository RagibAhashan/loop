const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//  new BundleAnalyzerPlugin()

module.exports = [new ForkTsCheckerWebpackPlugin()];
