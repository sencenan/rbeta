'use strict';

const schema = require('./schema');

module.exports = function(config) {

	const
		tName = require('./table-name')(config),
		AWS = schema.validate(config.AWS, schema.AWSSDK);

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
		group = schema.validate(group, schema.GroupName);
		aggregate = schema.validate(aggregate, schema.Aggregate);

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
