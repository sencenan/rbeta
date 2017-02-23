'use strict';

describe('table-name', function() {

	const
		ns = 'app',
		tName = require('./table-name');

	it('get table name from group name', () => {
		assert.throws(
			() => tName.fromGroup(''),
			/"namespace" is not allowed to be empty/
		);

		assert.throws(
			() => tName.fromGroup(ns, ''),
			/"group" is not allowed to be empty/
		);

		assert.throws(
			() => tName.fromGroup(ns, 'ab'),
			/"group" length must be at least 3 characters long/
		);

		assert.throws(
			() => tName.fromGroup(ns, 'ab '),
			/"group" length must be at least 3 characters long/
		);

		assert.equal(tName.fromGroup(ns, 'abc'), 'rbeta_app_ddb_abc');
	});

	it('get table name from event', () => {
		assert.throws(
			() => tName.fromEvent(ns, {}),
			/"group" is required/
		);

		assert.throws(
			() => tName.fromEvent(ns, { group: '' }),
			/"group" is not allowed to be empty/
		);

		assert.throws(
			() => tName.fromEvent(ns, { group: 'ab' }),
			/"group" length must be at least 3 characters long/
		);

		// trimmed
		assert.equal(
			tName.fromEvent(ns, { group: '  abc ' }),
			'rbeta_app_ddb_abc'
		);
	});

	it('get tracking table name from event', () => {
		assert.equal(
			tName.trackingName(tName.fromEvent(ns, { group: '  abc ' })),
			'rbeta_app_ddb_abc_tracking'
		);
		assert.equal(tName.trackingName(' abc   '), 'abc_tracking');
	});

});
