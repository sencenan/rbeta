'use strict';

const TableName = require('./table-name');

describe('table name', function() {

	it('get table name from group name', () => {
		assert.throws(
			() => new TableName(),
			/"parameter" is required/
		);

		assert.throws(
			() => new TableName({}),
			/"namespace" is required/
		);

		assert.throws(
			() => new TableName({ namespace: '' }),
			/"Namespace" is not allowed to be empty/
		);

		assert.throws(
			() => new TableName({ namespace: 'a', group: '' }),
			/"GroupName" is not allowed to be empty/
		);

		assert.throws(
			() => new TableName({ namespace: 'a', group: 'ab' }),
			/"GroupName" length must be at least 3 characters long/
		);

		assert.equal(
			new TableName({ namespace: 'app', group: 'abc' }).toString(),
			'rbeta_ddb_app_abc'
		);
	});

	it('get table name from event', () => {
		assert.throws(
			() => TableName.fromEvent('ns', {}),
			/"group" is required/
		);

		assert.throws(
			() => TableName.fromEvent('ns', { group: '' }),
			/"GroupName" is not allowed to be empty/
		);

		assert.throws(
			() => TableName.fromEvent('ns', { group: 'ab' }),
			/"GroupName" length must be at least 3 characters long/
		);

		// trimmed
		assert.equal(
			TableName.fromEvent('ns', { group: '  abc ' }).toString(),
			'rbeta_ddb_ns_abc'
		);
	});

	it('get tracking table name from event', () => {
		assert.equal(
			TableName.fromEvent('app', { group: '  abc_1 ' }).trackingName,
			'rbeta_ddb_tracking_app_abc_1'
		);
	});

});
