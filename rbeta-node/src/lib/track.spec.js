'use strict';

describe('track', function() {

	const EVENT = {
		group: 'trackTest',
		aggregate: 'a1',
		type: 'update',
		seq: 0,
		data: {}
	};

	before(function(done) {
		rbeta.emit(EVENT).then(() => done());
	});

	it('validate parameters', function() {
		assert.throws(() => rbeta.track(), /"group" is required/);
		assert.throws(
			() => rbeta.track('a'), /"group" length must be at least 3/
		);
		assert.throws(
			() => rbeta.track('abc'), /"reducerName" is required/
		);
		assert.throws(
			() => rbeta.track('abc', 'a'), /"event" is required/
		);
		assert.throws(
			() => rbeta.track('abc', 'a', {}), /child "group" fails/
		);
		rbeta.track('abc', 'a', EVENT);
	});

	it('track seq handled by a reducer', function(done) {
		rbeta
			.track('trackTest', 'reducer1', EVENT)
			.then(() => new Promise(
				(resolve, reject) => new AWS.DynamoDB.DocumentClient().query(
					{
						TableName: rbeta.tableName.trackingName(
							rbeta.tableName.fromGroup('trackTest')
						),
						Select: 'ALL_ATTRIBUTES',
						KeyConditionExpression: '#a = :a AND #s = :s',
						ExpressionAttributeNames: {
							'#a': 'aggregate', '#s': 'reducerName'
						},
						ExpressionAttributeValues: {
							':a': 'a1', ':s': 'reducer1'
						}
					},
					(err, data) => err ? reject(err) : resolve(data)
				)
			))
			.then((data) => {
				assert.equal(data.Items[0].reducerName, 'reducer1');
				assert.equal(data.Items[0].aggregate, 'a1');
				assert.equal(data.Items[0].event.aggregate, 'a1');
			})
			.then(() => done()).catch(done);
	});

	it('retrieve last reduced event', function(done) {
		rbeta
			.track('trackTest', 'reducer1', EVENT)
			.then(() => rbeta.lastReducedEvent('trackTest', 'reducer1', 'a1'))
			.then(event => { assert.deepEqual(event, EVENT) })
			.then(() => done()).catch(done);
	});

	it('retrieve last reduced event, empty aggregate', function(done) {
		rbeta
			.track('trackTest', 'reducer1', EVENT)
			.then(() => rbeta.lastReducedEvent('trackTest', 'reducer1', 'a2'))
			.then(event => { assert.equal(event, undefined); })
			.then(() => done()).catch(done);
	});

	it('track to non existent', function(done) {
		rbeta.track('NotThere', 'reducer1', EVENT).catch(() => done());
	});

	it('retrieve last from non existent', function(done) {
		rbeta.lastReducedEvent('NotThere', 'reducer1', 'a1').catch(() => done());
	});

});
