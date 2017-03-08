'use strict';

const
	EmitEvent = require('../../commands/emit-event'),
	createStreamProcessor = require('./create-stream-processor');

describe.only('Create stream processor', function() {

	const
		db = {},
		mockReducer = {
			name: 'mock-reducer-createStreamProcessorTest',
			persist: (group, aggregate, state) => db[aggregate] = state,
			state: (aggregate) => db[aggregate],
			reduce: (state, event) => ({
				value: (state ? state.value : 0) + event.data.value
			})
		},
		group = 'createStreamProcessorTest',
		testCtx = {
			AWS: AWS,
			namespace: 'test'
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
					"group": { "S": group },
					"seq": { "N": 0 },
					"timestamp": { "S": "0" }
				},
				"NewImage": {
					"aggregate": { "S": "a1" },
					"group": { "S": "g1" },
					"seq": { "N": 0 },
					"timestamp": { "S": "0" }
				},
				"SequenceNumber": "211178100000000006555535837"
			}
		},
		{
			"eventName": "MODIFY",
			"dynamodb": {
				"Keys": {
					"aggregate": { "S": "a1" },
					"group": { "S": group },
					"seq": { "N": 2 },
					"timestamp": { "S": "1" }
				},
				"NewImage": {
					"aggregate": { "S": "a1" },
					"group": { "S": "g1" },
					"seq": { "N": 2 },
					"timestamp": { "S": "1" }
				},
				"SequenceNumber": "211178100000000006555535838"
			}
		},
		{
			"eventName": "INSERT",
			"dynamodb": {
				"Keys": {
					"aggregate": { "S": "a2" },
					"group": { "S": group },
					"seq": { "N": 0 },
					"timestamp": { "S": "0" }
				},
				"NewImage": {
					"aggregate": { "S": "a2" },
					"group": { "S": group },
					"seq": { "N": 0 },
					"timestamp": { "S": "0" }
				},
				"SequenceNumber": "311178100000000006555535837"
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

		createStreamProcessor(testCtx, mockReducer);
	});

	it('', () => {
	});

});
