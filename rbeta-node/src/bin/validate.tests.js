'use strict';

const assert = require('assert');

describe('Validating reducer', function() {

	it('reducer', function() {
		assert(reducer);
		assert.equal(typeof reducer, 'object');
	});

	it('name', function() {
		schema.ReducerName.check(reducer.name);
	});

	it('aws()', function() {
		assert(reducer.aws);
		assert.equal(typeof reducer.aws, 'function');
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
