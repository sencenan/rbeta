'use strict';

const
	EmitEvent = require('./emit-event'),
	TrackReduction = require('./track-reduction'),
	FetchLastReduction = require('./fetch-last-reduction');

describe('track event reduction', function() {

	const
		testCtx = {
			AWS: AWS,
			namespace: 'test'
		},
		EVENT = {
			group: 'trackTest',
			aggregate: 'a1',
			type: 'update',
			seq: 0,
			data: {}
		};

	before(function(done) {
		new EmitEvent(EVENT).run(testCtx).then(() => done());
	});

	it('validate parameters', function() {
		assert.throws(() => new TrackReduction(), /"parameter" is required/);
		assert.throws(() => new TrackReduction({}), /"group" is required/);
		assert.throws(
			() => new TrackReduction({ group: 'a' }),
			/"GroupName" length must be at least 3/
		);
		assert.throws(
			() => new TrackReduction({ group: 'abc' }), /"reducerName" is required/
		);
		assert.throws(
			() => new TrackReduction({ group: 'abc', reducerName: 'a' }),
			/"event" is required/
		);
		assert.throws(
			() => new TrackReduction({
				group: 'abc', reducerName: 'a', event: {}
			}),
			/child "group" fails/
		);
		new TrackReduction({
			group: 'abc',
			reducerName: 'a',
			event: EVENT
		});
	});

	it('track seq handled by a reducer', function(done) {
		new TrackReduction({
			group: 'trackTest',
			reducerName: 'reducer1',
			event: EVENT
		})
			.run(testCtx)
			.then(() => new Promise(
				(resolve, reject) => new AWS.DynamoDB.DocumentClient().query(
					{
						TableName: 'rbeta_test_ddb_trackTest_tracking',
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
		new TrackReduction({
			group: 'trackTest',
			reducerName: 'reducer1',
			event: EVENT
		})
			.run(testCtx)
			.then(() => new FetchLastReduction({
				group: 'trackTest',
				reducerName: 'reducer1',
				aggregate: 'a1'
			}).run(testCtx))
			.then(event => { assert.deepEqual(event, EVENT) })
			.then(() => done()).catch(done);
	});

	it('retrieve last reduced event, empty aggregate', function(done) {
		new FetchLastReduction({
			group: 'trackTest',
			reducerName: 'reducer1',
			aggregate: 'a2'
		})
			.run(testCtx)
			.then(event => { assert.equal(event, undefined); })
			.then(() => done()).catch(done);
	});

	it('track to non existent', function(done) {
		new TrackReduction({
			group: 'NotThere',
			reducerName: 'reducer1',
			event: EVENT
		}).run(testCtx).catch(() => done());
	});

	it('retrieve last from non existent', function(done) {
		new FetchLastReduction({
			group: 'NotThere',
			reducerName: 'reducer1',
			aggregate: 'a1'
		}).run(testCtx).catch(() => done());
	});

});
