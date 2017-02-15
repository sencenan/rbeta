const path = require('path');

module.exports = {
	target: 'node',

	entry: path.resolve(__dirname, './index.js'),

	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, '../..', 'build')
	},

	resolve: {
		alias: {
			'rbeta-node$': path.resolve(__dirname, '../../index.js')
		}
	}
};
