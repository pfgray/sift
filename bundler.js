
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.dev.config.js");

module.exports = function() {
  var myConfig = Object.create(webpackConfig);
  new WebpackDevServer(webpack(myConfig), {
  	publicPath: myConfig.output.publicPath,
  	stats: {
  		colors: true,
      // modules:true,
      // reasons: true
  	},
    hot: true,
    quiet: false
  }).listen(9001, "0.0.0.0", function(err) {
  	if(err) throw new Error("webpack-dev-server", err);
    console.log('Bundling project, please wait...');
  });
};
