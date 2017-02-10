'use strict';

describe('Test table name generation', function() {

	it('module creation', () => {
		assert.throws(
			() => require('./table-name')(),
			/Cannot read property \'namespace\'/
		);

		assert.throws(
			() => require('./table-name')({}),
			/"namespace" is required/
		);

		require('./table-name')({ namespace: 'app' });
	});

	it('table name from group name', () => {
		const tName = require('./table-name')({ namespace: 'app' });

		assert.throws(
			() => tName.fromGroup(''),
			/"group" is not allowed to be empty/
		);

		assert.throws(
			() => tName.fromGroup('ab'),
			/"group" length must be at least 3 characters long/
		);

		assert.equal(tName.fromGroup('abc'), 'rbeta_app_ddb_abc');
	});

	it('table name from event', () => {
		const tName = require('./table-name')({ namespace: 'app' });

		assert.throws(
			() => tName.fromEvent({}),
			/"group" is required/
		);

		assert.throws(
			() => tName.fromEvent({ group: '' }),
			/"group" is not allowed to be empty/
		);

		assert.throws(
			() => tName.fromEvent({ group: 'ab' }),
			/"group" length must be at least 3 characters long/
		);

		assert.equal(tName.fromEvent({ group: 'abc' }), 'rbeta_app_ddb_abc');
	});

});
