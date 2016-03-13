'use strict';
var path = require('path');
var fs = require('fs');
var colors = require('colors');
var fileUtils = require('./utils/file')
var _ = require('./utils/object')
var writeLineStream = require('lei-stream').writeLine;


function ManifestWebpackPlugin(options) {
	if (!options || !options.buildPath) {
		console.info('Some parameters of the problem，please set as the follow:')
		console.info(" new".red + " ManifestWebpackPlugin({");
		console.info("   buildPath:'your path',".yellow);
		console.info("   outFileName: 'your outFileName',".yellow);
		console.info("   publicPath: 'your publicPath'".yellow);
		console.info(" })");
		throw new Error('Some parameters of the problem')
	}
	this.fileArray = [];
	this.options = _.extend({

	}, options);
}

ManifestWebpackPlugin.prototype.apply = function(compiler) {
	var _this = this;
	if (compiler) {
		compiler.plugin("done", function(compilation) {
			_this.oposs();
		});
	} else {
		_this.oposs();
	}
};

ManifestWebpackPlugin.prototype.oposs = function() {
	var _this = this;
	_this.fileArray = [];
	//上传oss的新代码
	fileUtils.eachFileSync(_this.options.buildPath, function(filename, stats) {
		_this.fileArray.push(filename);
	});

	var j = 0;
	var fileName = '';
	var s = writeLineStream(fs.createWriteStream(_this.options.outFileName), {
		newline: '\n',
		cacheLines: 0
	});
	s.write('CACHE MANIFEST', function() {});
	for (var i = 0; i < _this.fileArray.length; i++) {
		var file = _this.fileArray[i];
		s.write(_this.options.publicPath + file.split('/').pop(), function() {

		});
	}
	s.write('NETWORK:', function() {});
	s.write('*', function() {});
	// 结束
	s.end(function() {
		console.log('manifest has been success created.');
	});

}


module.exports = ManifestWebpackPlugin;