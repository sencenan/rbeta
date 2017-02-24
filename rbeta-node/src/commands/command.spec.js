'use strict';

const Command = require('./command');

describe('base command', function() {

	it('create logger', function() {
		const
			c = new Command(),
			l1 = c.log,
			l2 = c.log;

		assert(l1 instanceof Function);
		assert(l1 === l2);
	});

	it('throws errors asynchronously', function(cb) {
		new Command().run(null).catch(() => cb());
	});

});
