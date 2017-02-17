'use strict';

const schema = require('./schema');

module.exports = function(config) {

	const
		tName = require('./table-name')(config),
		AWS = schema.AWSSDK.check(config.AWS);

	const makeParam = (group, aggregate) => ({
		TableName: tName.fromGroup(group),
		Select: 'ALL_ATTRIBUTES',
		KeyConditionExpression: '#a = :a',
		ExpressionAttributeNames: { '#a': 'aggregate' },
		ExpressionAttributeValues: { ':a': aggregate },
		ScanIndexForward: false,
		Limit: 1
	});

	return function(group, aggregate) {
		group = schema.GroupName.check(group);
		aggregate = schema.Aggregate.check(aggregate);

		const ddoc = new AWS.DynamoDB.DocumentClient();

		return new Promise((resolve, reject) => {
			ddoc.query(makeParam(group, aggregate), (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data.Items[0]);
				}
			});
		});
	};

};