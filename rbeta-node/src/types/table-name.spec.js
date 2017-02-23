'use strict';

const TableName = require('./table-name');

describe('table-name', function() {

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
			() => new TableName({ namespace: 'a', groupName: '' }),
			/"GroupName" is not allowed to be empty/
		);

		assert.throws(
			() => new TableName({ namespace: 'a', groupName: 'ab' }),
			/"GroupName" length must be at least 3 characters long/
		);

		assert.equal(
			new TableName({ namespace: 'app', groupName: 'abc' }).toString(),
			'rbeta_app_ddb_abc'
		);
	});

	it('get table name from event', () => {
		assert.throws(
			() => TableName.fromEvent('ns', {}),
			/"groupName" is required/
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
			'rbeta_ns_ddb_abc'
		);
	});

	it('get tracking table name from event', () => {
		assert.equal(
			TableName.fromEvent('app', { group: '  abc ' }).trackingName,
			'rbeta_app_ddb_abc_tracking'
		);
	});

});
