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
			'global.reducer = require("'
				+ path.resolve(opts.output, opts.name)
				+ '").reducer;'
		);

		resolve(childProc.execFileSync(
			path.resolve(__dirname, '../../node_modules/.bin/mocha'),
			[
				'-r', testSetupShim,
				path.resolve(__dirname, './validate.tests.js')
			],
			{
				stdio: 'inherit'
			}
		));
	});
};
