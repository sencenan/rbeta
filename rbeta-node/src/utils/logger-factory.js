'use strict';

var
	util = require('util'),

	log = util.debuglog('DEAD');

exports.makeForClass = function(constructorFn) {
	return exports.make(constructorFn.name);
};

exports.make = function(namespace) {
	/* istanbul ignore next */
	return function() {
		log(
			'%s, %s: %s',
			new Date().toISOString(), namespace,
			util.format.apply(util, arguments)
		);
	};
};
