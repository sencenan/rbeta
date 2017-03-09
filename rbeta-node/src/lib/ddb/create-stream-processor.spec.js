'use strict';

const
	EmitEvent = rbeta.commands.EmitEvent,
	createStreamProcessor = rbeta.lib.ddb.createStreamProcessor;

describe('Create stream processor', function() {

	const
		group = 'createStreamProcessorTest',
		testCtx = {
			AWS: AWS,
			namespace: 'test'
		},
		mkReducer = function(reducerName) {
			var db = {};

			return {
				db: db,
				name: reducerName,
				persist: (group, aggregate, state) => db[aggregate] = state,
				state: (aggregate) => db[aggregate],
				reduce: (state, event) => ({
					value: (state ? state.value : 0) + event.data.value
				})
			};
		},
		mkEvent = seq => ({
			group: group,
			aggregate: 'a',
			type: 'update',
			seq: seq,
			data: { value: seq + 1 }
		}),
		checkValue = seq => (seq + 2) * (seq + 1) / 2;

	const ddbEvents = [
		{
			"eventName": "INSERT",
			"dynamodb": {
				"Keys": {
					"aggregate": { "S": "a1" },
					"seq": { "N": 0 }
				},
				"NewImage": {
					"aggregate": { "S": "a1" },
					"group": { "S": group },
					"seq": { "N": 0 },
					"timestamp": { "S": "0" },
					"type": { "S": "newValue" },
					"data": { "M": { "value": { "N": 1 } } }
				}
			}
		},
		{
			"eventName": "INSERT",
			"dynamodb": {
				"Keys": {
					"aggregate": { "S": "a1" },
					"seq": { "N": 1 }
				},
				"NewImage": {
					"aggregate": { "S": "a1" },
					"group": { "S": group },
					"seq": { "N": 1 },
					"timestamp": { "S": "1" },
					"type": { "S": "newValue" },
					"data": { "M": { "value": { "N": 2 } } }
				}
			}
		},
		{
			"eventName": "INSERT",
			"dynamodb": {
				"Keys": {
					"aggregate": { "S": "a1" },
					"seq": { "N": 2 }
				},
				"NewImage": {
					"aggregate": { "S": "a1" },
					"group": { "S": group },
					"seq": { "N": 2 },
					"timestamp": { "S": "1" },
					"type": { "S": "newValue" },
					"data": { "M": { "value": { "N": 5 } } }
				}
			}
		},
		{
			"eventName": "INSERT",
			"dynamodb": {
				"Keys": {
					"aggregate": { "S": "a2" },
					"seq": { "N": 0 }
				},
				"NewImage": {
					"aggregate": { "S": "a2" },
					"group": { "S": group },
					"seq": { "N": 0 },
					"timestamp": { "S": "0" },
					"type": { "S": "newValue" },
					"data": { "M": { "value": { "N": 3 } } }
				}
			}
		}
	];

	before(function(done) {
		// create table with data
		new EmitEvent(mkEvent(0))
			.run(testCtx)
			.then(() => done()).catch(done);
	});

	it('validating parameters', () => {
		assert.throws(
			() => createStreamProcessor(),
			/"reducer" is required/
		);

		assert.throws(
			() => createStreamProcessor(testCtx, {}),
			/"reducer" must conform to schema of type ReducerObj/
		);

		createStreamProcessor(testCtx, mkReducer('csptestvalidating'));
	});

	it('handle error in processor', cb => {
		const
			proc = createStreamProcessor(testCtx, mkReducer('csptesterror')),
			eventMissingTable = JSON.parse(JSON.stringify(ddbEvents[0]));

		eventMissingTable.dynamodb.NewImage.group.S = 'boo';

		proc({ Records: [eventMissingTable, ddbEvents[3]] }, {}, (err, data) => {
			assert(err);
			assert.equal(err[1].aggregate, 'a2');
			assert.equal(err[1].group, group);

			cb();
		});
	});

	it('process empty event stream', cb => {
		const proc = createStreamProcessor(testCtx, mkReducer('csptestempty'));

		proc({ Records: [] }, {}, (err, data) => {
			assert(!err);
			assert.deepEqual(data, []);

			cb();
		});
	});

	it('process event stream', cb => {
		const
			reducer = mkReducer('csptest'),
			proc = createStreamProcessor(testCtx, reducer);

		proc({ Records: ddbEvents }, {}, (err, data) => {
			assert(!err);
			assert.equal(reducer.db['a1'].value, 1 + 2 + 5);
			assert.equal(reducer.db['a2'].value, 3);

			cb();
		});
	});

});
