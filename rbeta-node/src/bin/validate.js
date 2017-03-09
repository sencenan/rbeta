'use strict';

const
	path = require('path'),
	fs = require('fs'),
	tmp = require('tmp'),
	childProc = require('child_process');

module.exports = function(opts) {
	return new Promise((resolve, reject) => {
		// write shim test setup file
		const testSetupShim = tmp.fileSync().name;

		fs.writeFileSync(
			testSetupShim,
			`
			global.bundle = require("${ path.resolve(opts.output, opts.name) }");
			`
		);

		childProc.execSync([
			'mkdir -p',
			path.resolve(opts.output, './node_modules')
		].join(' '));

		childProc.execSync([
			'cp -r',
			path.resolve(__dirname, '../../node_modules/aws-sdk'),
			path.resolve(opts.output, './node_modules')
		].join(' '));

		const output = childProc.execFileSync(
			path.resolve(__dirname, '../../node_modules/.bin/mocha'),
			[
				'-r', testSetupShim,
				path.resolve(__dirname, './validate.tests.js')
			],
			{
				stdio: 'pipe',
				cwd: opts.output,
				env: {
					RBETA_NAMESPACE: 'rbeta_test'
				}
			}
		);

		resolve({
			task: 'rbeta.validate',
			successful: true,
			buildResult: opts.buildResult,
			testResult: output.toString()
		});
	});
};
