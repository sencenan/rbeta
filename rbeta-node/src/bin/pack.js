'use strict';

const
	path = require('path'),
	fs = require('fs'),
	zip = new require('node-zip')();

module.exports = function(opts) {
	return new Promise((resolve, reject) => {
		const bundlePath = path.resolve(
			opts.buildOpts.output, opts.buildOpts.name
		);

		zip.file('index.js', fs.readFileSync(bundlePath));

		fs.writeFileSync(
			path.resolve(opts.output, opts.name),
			zip.generate({ base64: false }),
			'binary'
		);

		resolve({});
	});
};
