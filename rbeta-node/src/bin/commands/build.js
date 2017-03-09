'use strict';

const
	webpack = require('webpack'),
	fs = require('fs'),
	path = require('path');

const cliUtils = require('../utils/cli-utils');

exports.DEF_BUNDLE_NAME = 'rbeta-reducer-bundle';
exports.command = 'build';
exports.describle = 'build the rbeta reducer';

exports.builder = function(yargs) {
	return yargs
		.option('entry', {
			alias: 'e',
			describe: 'entry point javascript file'
		})
		.option('output', {
			alias: 'o',
			describe: 'output directory',
			default: cliUtils.getDefaultOutputDir()
		})
		.option('name', {
			alias: 'n',
			describe: 'name of the output file',
			default: exports.DEF_BUNDLE_NAME + '.js'
		})
		.demand(['e']);
};

exports.handler = args => cliUtils.chain('build', args)('validate', args).end();

exports.run = function(args) {
	if (!fs.statSync(args.output).isDirectory()) {
		throw new Error('output must be a directory');
	}

	return new Promise((resolve, reject) => webpack(
		renderConfig(args.entry, args.output, args.name),
		(err, stats) => {
			if (err || stats.hasErrors()) {
				reject(stats.hasErrors() ? stats.compilation.errors[0] : err);
			} else {
				resolve({
					command: exports.command,
					output: {
						path: args.output,
						filename: args.name
					},
					duration: stats.endTime - stats.startTime
				});
			}
		}
	));
};

const renderConfig = function(entry, outputDir, outputFile) {
	return {
		target: 'node',

		entry: path.resolve(cliUtils.getSourceDir(), './lib/lambda-template'),

		output: {
			filename: outputFile,
			path: outputDir,
			libraryTarget: 'this'
		},

		plugins: [
			new webpack.NormalModuleReplacementPlugin(
				/^aws-sdk$/,
				path.resolve(__dirname, '../utils/aws-sdk-wrapper.js')
			)
		],

		module: {
			noParse: /aws-sdk-wrapper/
		},

		resolve: {
			alias: {
				'rbeta-node$': path.resolve(cliUtils.getSourceDir(), './index.js'),
				'rbeta-reducer$': path.resolve(process.cwd(), entry)
			}
		}
	};
};
