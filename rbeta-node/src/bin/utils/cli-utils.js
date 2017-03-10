'use strict';

const
	bluebird = require('bluebird'),
	path = require('path'),
	prettyjson = require('prettyjson');

var _isRawModeOn = false;

exports.setRawMode = function(flag) {
	_isRawModeOn = flag;
};

exports.prompt = function(obj) {
	try {
		console.log(
			_isRawModeOn
				? JSON.stringify(obj, null, '\t')
				: prettyjson.render(obj)
		);
	} catch(e) {
		console.error(obj);
	}
};

exports.getSourceDir = function() {
	return path.resolve(__dirname, '../..');
};

exports.getDefaultOutputDir = function() {
	return process.cwd().indexOf(path.resolve(exports.getSourceDir(), '..')) >= 0
		? path.resolve(exports.getSourceDir(), '../build')
		: process.cwd();
};

exports.chain = function(cmd, args) {
	var f = (cmd, args) => (f._cmds.push({ cmd: cmd, args: args }), f);

	f._cmds = [];
	f._results = [];
	f.end = () => (
		f(exports.prompt, f._results),
		bluebird
			.reduce(
				f._cmds,
				(results, c) => Promise.resolve(
					(
						typeof c.cmd === 'function'
							? c.cmd
							: require(
								path.resolve(__dirname, '../commands/', c.cmd)
							).run
					)(
						typeof c.args === 'function'
							? c.args(results)
							: c.args
					)
				).then(r => (results.push(r), results)),
				f._results
			)
			.catch(err => {
				err && err.stack ? exports.prompt(err.stack) : exports.prompt(err);
				process.exit(1);
			})
	);

	return f(cmd, args);
};
