'use strict';

const returnp = require('./return-promise');

describe('return promise', function() {

	it('value', (cb) => {
		assert(
			returnp(1).then(v => assert.equal(v, 1)).then(cb) instanceof Promise
		);
	});

	it('null', (cb) => {
		assert(
			returnp(null)
				.then(v => assert.equal(v, null))
				.then(cb) instanceof Promise
		);
	});

	it('undefined', (cb) => {
		assert(
			returnp(undefined)
				.then(v => assert.equal(v, undefined))
				.then(cb) instanceof Promise
		);
	});

	it('error', (cb) => {
		assert(
			returnp(new Error()).catch(() => cb()) instanceof Promise
		);
	});

	it('promise.then', (cb) => {
		assert(
			returnp(new Promise(r => r(1)))
				.then(v => assert.equal(v, 1))
				.then(cb) instanceof Promise
		);
	});

	it('promise.catch', (cb) => {
		assert(
			returnp(new Promise((r, j) => j(1)))
				.catch(() => cb()) instanceof Promise
		);
	});

	const p = {
		then: f => (p.ok = f, p),
		catch: f => (p.error = f, p),
		resolve: v => p.ok(v),
		reject: e => p.error(e)
	};

	it('promise-like.then', (cb) => {
		assert(
			returnp(p)
				.then(v => assert.equal(v, 1))
				.then(cb) instanceof Promise
		);

		p.resolve(1);
	});

	it('promise-like.catch', (cb) => {
		assert(returnp(p).catch(() => cb()) instanceof Promise);

		p.reject();
	});

});
