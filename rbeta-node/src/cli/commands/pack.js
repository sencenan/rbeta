'use strict';

const
	path = require('path'),
	fs = require('fs'),
	tmp = require('tmp'),
	zip = new require('node-zip')();

const
	build = require('./build'),
	cliUtils = require('../utils/cli-utils');

exports.DEF_LAMBDA_ZIP_NAME = 'rbeta-reducer';
exports.command = 'package';
exports.describe = 'package the rbeta reducer';

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
			describe: 'name of the output bundle',
			default: exports.DEF_LAMBDA_ZIP_NAME + '.zip'
		})
		.demand(['e']);
};

exports.handler = args => {
	const buildOpts = {
		entry: args.entry,
		output: tmp.dirSync({ unsafeCleanup: true }).name,
		name: build.DEF_BUNDLE_NAME + '.js'
	};

	return cliUtils.chain(
		'build', buildOpts
	)(
		'validate', buildOpts
	)(
		'pack', Object.assign({ buildOpts: buildOpts }, args)
	).end();
};

exports.run = function(args) {
	return new Promise((resolve, reject) => {
		const bundlePath = path.resolve(
			args.buildOpts.output, args.buildOpts.name
		);

		zip.file('index.js', fs.readFileSync(bundlePath));

		fs.writeFileSync(
			path.resolve(args.output, args.name),
			zip.generate({ base64: false }),
			'binary'
		);

		resolve({
			command: exports.command,
			output: {
				path: args.output,
				filename: args.name
			}
		});
	});
};
