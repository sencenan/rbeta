'use strict';

const
	webpack = require('webpack'),
	joi = require('joi'),
	fs = require('fs'),
	path = require('path');

const renderConfig = function(entry, outputDir, outputFile) {
	return {
		target: 'node',

		entry: path.resolve(__dirname, '../lib/reducer-context.js'),

		output: {
			filename: outputFile,
			path: outputDir,
			libraryTarget: 'this'
		},

		resolve: {
			alias: {
				'reducer$': path.resolve(process.cwd(), entry)
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
				reject(
					stats.hasErrors()
						? stats.compilation.errors[0]
						: err
				);
			} else {
				resolve(stats);
			}
		}
	));
};
