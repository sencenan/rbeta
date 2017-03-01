'use strict';

const
	groupEvents = require('./group-events'),
	unmarshalItem = require('./unmarshal-item');

describe('ddb lib', function() {

	const ddbEvents = [
		{
			"eventID": "54e79ccc0a2fecd6b44e74401e54db9f",
			"eventName": "INSERT",
			"eventVersion": "1.1",
			"eventSource": "aws:dynamodb",
			"awsRegion": "us-east-1",
			"dynamodb": {
				"ApproximateCreationDateTime": 1488301440,
				"Keys": {
					"aggregate": { "S": "a1" },
					"seq": { "N": 0 },
					"timestamp": { "S": "0" }
				},
				"NewImage": {
					"aggregate": { "S": "a1" },
					"seq": { "N": 0 },
					"timestamp": { "S": "0" }
				},
				"SequenceNumber": "211178100000000006555535837",
				"SizeBytes": 8,
				"StreamViewType": "NEW_IMAGE"
			}
		},
		{
			"eventName": "REMOVE",
			"dynamodb": {
				"Keys": {
					"aggregate": { "S": "a1" },
					"seq": { "N": 1 },
					"timestamp": { "S": "2" }
				},
				"SequenceNumber": "211178100000000006555535839"
			}
		},
		{
			"eventName": "REMOVE", // dup
			"dynamodb": {
				"Keys": {
					"aggregate": { "S": "a1" },
					"seq": { "N": 1 },
					"timestamp": { "S": "2" }
				},
				"SequenceNumber": "211178100000000006555535839"
			}
		},
		{
			"eventName": "MODIFY",
			"dynamodb": {
				"Keys": {
					"aggregate": { "S": "a1" },
					"seq": { "N": 2 },
					"timestamp": { "S": "1" }
				},
				"NewImage": {
					"aggregate": { "S": "a1" },
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
					"seq": { "N": 0 },
					"timestamp": { "S": "0" }
				},
				"NewImage": {
					"aggregate": { "S": "a2" },
					"seq": { "N": 0 },
					"timestamp": { "S": "0" }
				},
				"SequenceNumber": "311178100000000006555535837"
			}
		}
	];

	it('group empty event.Records', () => {
		assert.deepEqual(groupEvents({ Records: [] }), []);
	});

	it('group and sort event.Records', () => {
		assert.deepEqual(
			groupEvents({ Records: ddbEvents }),
			[
				[ddbEvents[0], ddbEvents[3], ddbEvents[1], ddbEvents[2]],
				[ddbEvents[4]]
			]
		);
	});

	it('unmarshal ddb item', () => {
		assert.deepEqual(
			unmarshalItem(
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
	});

});
