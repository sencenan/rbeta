'use strict';

const schema = require('./schema');

module.exports = function(config) {

	const
		tName = require('./table-name')(config),
		AWS = schema.validate(config.AWS, schema.AWSSDK);

	const makeParam = (group, aggregate, fromSeq, exclusiveStartKey) => {
		const param = {
			TableName: tName.fromGroup(group),
			Select: 'ALL_ATTRIBUTES',
			KeyConditionExpression: '#a = :a AND #s >= :s',
			ExpressionAttributeNames: {
				'#a': 'aggregate',
				'#s': 'seq'
			},
			ExpressionAttributeValues: {
				':a': aggregate,
				':s': fromSeq
			},
			ScanIndexForward: true
		};

		if (exclusiveStartKey) {
			param.ExclusiveStartKey = exclusiveStartKey;
		}

		return param;
	};

	return function(group, aggregate, fromSeq) {
		group = schema.validate(group, schema.GroupName);
		aggregate = schema.validate(aggregate, schema.Aggregate);
		fromSeq = schema.validate(fromSeq || 0, schema.SequenceNumber);

		const ddoc = new AWS.DynamoDB.DocumentClient();

		return new Promise(function(resolve, reject) {
			const handler = function(err, data) {
				if (err) {
					reject(err);
				} else {
					resolve(
						function*() {
							yield* data.Items;
						}()
					);
				}
			};

			ddoc.query(makeParam(group, aggregate, fromSeq), handler);
		});
	};

};
