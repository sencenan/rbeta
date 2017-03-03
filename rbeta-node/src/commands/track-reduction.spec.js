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
		mkEvent = (agg, seq) => ({
			group: 'trackTest',
			aggregate: agg,
			type: 'update',
			seq: seq,
			data: {}
		});

	before(done => {
		new EmitEvent(mkEvent('a', 0)).run(testCtx).then(() => done());
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
			event: mkEvent('a', 1)
		});
	});

	it('track reduction', function(done) {
		new TrackReduction({
			group: 'trackTest',
			reducerName: 'reducer1',
			event: mkEvent('a1', 0)
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
			.then(data => {
				assert.equal(data.Items[0].reducerName, 'reducer1');
				assert.equal(data.Items[0].aggregate, 'a1');
				assert.equal(data.Items[0].event.aggregate, 'a1');
			})
			.then(() => done()).catch(done);
	});

	var
		iota = 0,
		handleFailedCondition = err => assert.equal(
			err.message, 'The conditional request failed'
		);

	it('track reduction, preventing duplicated seq(null)', function(done) {
		const agg = 'agg' + (iota++);

		new TrackReduction({
			group: 'trackTest',
			reducerName: 'reducer1',
			event: mkEvent(agg, 0)
		})
			.run(testCtx)
			.then(
				// failed previousSeq already used
				() => new TrackReduction({
					group: 'trackTest',
					reducerName: 'reducer1',
					event: mkEvent(agg, 0)
				}).run(testCtx).catch(handleFailedCondition)
			)
			.then(
				() => new TrackReduction({
					group: 'trackTest',
					reducerName: 'reducer1',
					event: mkEvent(agg + 'x', 0)
				}).run(testCtx)
			)
			.then(() => done()).catch(done);
	});

	it('track reduction, preventing duplicated seq', function(done) {
		const agg = 'agg' + (iota++);

		new TrackReduction({
			group: 'trackTest',
			reducerName: 'reducer1',
			event: mkEvent(agg, 0)
		})
			.run(testCtx)
			.then(
				() => new TrackReduction({
					group: 'trackTest',
					reducerName: 'reducer1',
					event: mkEvent(agg, 1),
					previousSeq: 0
				}).run(testCtx)
			)
			.then(
				() => new TrackReduction({
					group: 'trackTest',
					reducerName: 'reducer1',
					event: mkEvent(agg, 3),
					previousSeq: 1
				}).run(testCtx)
			)
			.then(
				// failed: event seq must increase
				() => new TrackReduction({
					group: 'trackTest',
					reducerName: 'reducer1',
					event: mkEvent(agg, 3),
					previousSeq: 3
				}).run(testCtx).catch(handleFailedCondition)
			)
			.then(
				// failed: previousSeq must match
				() => new TrackReduction({
					group: 'trackTest',
					reducerName: 'reducer1',
					event: mkEvent(agg, 4),
					previousSeq: 5
				}).run(testCtx).catch(handleFailedCondition)
			)
			.then(
				() => new TrackReduction({
					group: 'trackTest',
					reducerName: 'reducer1',
					event: mkEvent(agg, 5),
					previousSeq: 3
				}).run(testCtx)
			)
			.then(() => done()).catch(done);
	});

	it('retrieve last reduced event', function(done) {
		const agg = 'agg' + (iota++);

		new TrackReduction({
			group: 'trackTest',
			reducerName: 'reducer1',
			event: mkEvent(agg, 0)
		})
			.run(testCtx)
			.then(() => new FetchLastReduction({
				group: 'trackTest',
				reducerName: 'reducer1',
				aggregate: agg
			}).run(testCtx))
			.then(event => { assert.deepEqual(event, mkEvent(agg, 0)) })
			.then(() => done()).catch(done);
	});

	it('retrieve last reduced event, empty aggregate', function(done) {
		const agg = 'agg' + (iota++);

		new FetchLastReduction({
			group: 'trackTest',
			reducerName: 'reducer1',
			aggregate: agg
		})
			.run(testCtx)
			.then(event => { assert.equal(event, undefined); })
			.then(() => done()).catch(done);
	});

	it('track to non existent', function(done) {
		new TrackReduction({
			group: 'NotThere',
			reducerName: 'reducer1',
			event: mkEvent('a4', 0)
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
