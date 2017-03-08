'use strict';

const
	groupEvents = require('./group-events'),
	unmarshalItem = require('./unmarshal-item');

describe('ddb lib', function() {

	const testCtx = {
		AWS: AWS,
		namespace: 'test'
	};

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
					"group": { "S": "g1" },
					"seq": { "N": 0 },
					"timestamp": { "S": "0" }
				},
				"SequenceNumber": "211178100000000006555535837"
			}
		},
		{
			"eventName": "REMOVE",
			"dynamodb": {
				"Keys": {
					"aggregate": { "S": "a1" },
					"seq": { "N": 1 }
				},
				"SequenceNumber": "211178100000000006555535839"
			}
		},
		{
			"eventName": "REMOVE", // dup
			"dynamodb": {
				"Keys": {
					"aggregate": { "S": "a1" },
					"seq": { "N": 1 }
				},
				"SequenceNumber": "211178100000000006555535839"
			}
		},
		{
			"eventName": "MODIFY",
			"dynamodb": {
				"Keys": {
					"aggregate": { "S": "a1" },
					"seq": { "N": 2 }
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
					"seq": { "N": 0 }
				},
				"NewImage": {
					"aggregate": { "S": "a2" },
					"group": { "S": "g1" },
					"seq": { "N": 0 },
					"timestamp": { "S": "0" }
				},
				"SequenceNumber": "311178100000000006555535837"
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
					"group": { "S": "g2" },
					"seq": { "N": 0 },
					"timestamp": { "S": "0" }
				},
				"SequenceNumber": "411178100000000006555535837"
			}
		}
	];

	it('unmarshal ddb item', () => {
		assert.deepEqual(
			unmarshalItem(
				testCtx,
				{
					"aggregate": { "S": "a1" },
					"seq": { "N": 0 },
					"timestamp": { "S": "0" }
				}
			),
			{
				aggregate: 'a1',
				seq: 0,
				timestamp: '0'
			}
		);

		assert.deepEqual(unmarshalItem(testCtx, {}), {});
		assert.deepEqual(unmarshalItem(testCtx, null), null);
	});

	it('group empty event.Records', () => {
		assert.deepEqual(groupEvents(testCtx, { Records: [] }), []);
	});

	it('group and sort event.Records', () => {
		assert.deepEqual(
			groupEvents(testCtx, { Records: ddbEvents }),
			[
				[
					{ aggregate: 'a1', group: 'g1', seq: 0, timestamp: '0' },
					{ aggregate: 'a1', group: 'g1', seq: 2, timestamp: '1' }
				],
				[
					{ aggregate: 'a2', group: 'g1', seq: 0, timestamp: '0' }
				],
				[
					{ aggregate: 'a2', group: 'g2', seq: 0, timestamp: '0' }
				]
			]
		);
	});

});
