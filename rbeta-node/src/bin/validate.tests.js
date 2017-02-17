'use strict';

const assert = require('assert');

describe('Validating reducer', function() {

	it('reducer', function() {
		assert(reducer);
		assert.equal(typeof reducer, 'object');
	});

	it('pump()', function() {
		assert(reducer.pump);
		assert.equal(typeof reducer.pump, 'function');
	});

	it('state()', function() {
		assert(reducer.state);
		assert.equal(typeof reducer.state, 'function');
	});

	it('reduce()', function() {
		assert(reducer.reduce);
		assert.equal(typeof reducer.reduce, 'function');
	});

});
