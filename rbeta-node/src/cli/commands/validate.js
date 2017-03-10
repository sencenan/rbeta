'use strict';

const
	path = require('path'),
	fs = require('fs'),
	tmp = require('tmp'),
	childProc = require('child_process');

const
	build = require('./build'),
	cliUtils = require('../utils/cli-utils');

exports.command = 'validate';
exports.describe = 'validate a rbeta reducer';

exports.builder = function(yargs) {
	return yargs
		.option('entry', {
			alias: 'e',
			describe: 'entry point javascript file'
		})
		.demand(['e']);
};

exports.handler = args => {
	args = {
		entry: args.entry,
		output: tmp.dirSync({ unsafeCleanup: true }).name,
		name: build.DEF_BUNDLE_NAME + '.js'
	};

	return cliUtils.chain('build', args)('validate', args).end();
};

exports.run = function(args) {
	return new Promise((resolve, reject) => {
		let
			testDataPath = path.resolve(args.entry, '../rbetatest.js'),
			hasTestData,
			output;

		// try to get validate reducer using the test data suppilied
		try {
			require(testDataPath);
			hasTestData = true;
		} catch(ex) {}

		// write shim test setup file
		const testSetupShim = tmp.fileSync().name;

		fs.writeFileSync(
			testSetupShim,
			`
				global.bundle = require("${
					path.resolve(args.output, args.name)
				}");
				if (${ hasTestData }) {
					global.testData = require("${ testDataPath }");
				}
			`
		);

		childProc.execSync([
			'mkdir -p',
			path.resolve(args.output, './node_modules')
		].join(' '));

		childProc.execSync([
			'cp -r',
			path.resolve(cliUtils.getSourceDir(), '../node_modules/aws-sdk'),
			path.resolve(args.output, './node_modules')
		].join(' '));

		try {
			output = childProc.execFileSync(
				path.resolve(cliUtils.getSourceDir(), '../node_modules/.bin/mocha'),
				[
					'-r', testSetupShim,
					path.resolve(__dirname, '../utils/validate.tests.js')
				],
				{
					stdio: 'pipe',
					cwd: args.output,
					env: {
						RBETA_NAMESPACE: 'rbeta_test'
					}
				}
			);
		} catch(ex) {
			if (ex.output) {
				throw {
					command: exports.command,
					buildResult: args.buildResult,
					hasTestData: hasTestData,
					testResult: ex.output.toString()
				};
			} else {
				throw ex;
			}
		}

		childProc.execSync([
			'rm -r',
			path.resolve(args.output, './node_modules')
		].join(' '));

		resolve({
			command: exports.command,
			buildResult: args.buildResult,
			hasTestData: hasTestData,
			testResult: output.toString().trim()
		});
	});
};
