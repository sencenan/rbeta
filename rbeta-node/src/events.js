'use strict';

const schema = require('./schema');

module.exports = function(config) {

	const
		tName = require('./table-name')(config),
		AWS = schema.validate(config.AWS, schema.AWSSDK);

	const makeParam = (group, aggregate, fromSeq, exclusiveStartKey) => {
		let param = {
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

	return function*(group, aggregate, fromSeq) {
		group = schema.validate(group, schema.GroupName);
		aggregate = schema.validate(aggregate, schema.Aggregate);

		if (arguments.length <= 2) {
			fromSeq = 0;
		}
		fromSeq = schema.validate(fromSeq, schema.SequenceNumber);

		// return a data structure that supplies data as requested
		// in 4.3.2+ mode, so genertors!
		// const
		// 	ddoc = new AWS.DynamoDB.DocumentClient(),
		// 	respHandler = (err, data) => {
		// 		if (err) {
		// 			return reject(err);
		// 		}

		// 		data.Items.map(item => { yield item; });

		// 		if (data.LastEvaluatedKey) { // has more!
		// 			ddoc.query(
		// 				makeParam(group, aggregate, fromSeq, data.LastEvaluatedKey),
		// 				respHandler
		// 			);
		// 		}
		// 	};

		// ddoc.query(params, makeParam(group, aggregate, fromSeq));
	};

};
