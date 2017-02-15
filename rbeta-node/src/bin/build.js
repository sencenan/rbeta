'use strict';

const
	webpack = require('webpack'),
	joi = require('joi'),
	fs = require('fs'),
	path = require('path');

const renderConfig = function(entry, outputDir, outputFile) {
	return {
		target: 'node',

		entry: entry,

		output: {
			filename: outputFile,
			path: outputDir,
			library: 'reducer',
			libraryTarget: 'this'
		},

		resolve: {
			alias: {
				'rbeta-node$': path.resolve(__dirname, '../../index.js')
			}
		}
	};
};

module.exports = function(opts) {
	if (!fs.statSync(opts.output).isDirectory()) {
		throw new Error('output must be a directory');
	}

	return new Promise((resolve, reject) => webpack(
		renderConfig(opts.entry, opts.output, opts.name),
		(err, stats) => {
			if (err || stats.hasErrors()) {
				reject(err || stats.hasErrors());
			} else {
				resolve(stats);
			}
		}
	));
};
