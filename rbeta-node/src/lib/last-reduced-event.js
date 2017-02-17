'use strict';

const schema = require('./schema');

module.exports = function(config) {

	const
		tName = require('./table-name')(config),
		AWS = schema.AWSSDK.check(config.AWS);

	const makeParam = (group, reducerName, aggregate) => ({
		TableName: tName.trackingName(tName.fromGroup(group)),
		Select: 'ALL_ATTRIBUTES',
		KeyConditionExpression: '#a = :a AND #s = :s',
		ExpressionAttributeNames: { '#a': 'aggregate', '#s': 'reducerName' },
		ExpressionAttributeValues: { ':a': aggregate, ':s': reducerName },
		Limit: 1
	});

	return function(group, reducerName, aggregate) {
		group = schema.GroupName.check(group);
		aggregate = schema.Aggregate.check(aggregate);

		const ddoc = new AWS.DynamoDB.DocumentClient();

		return new Promise((resolve, reject) => {
			ddoc.query(makeParam(group, reducerName, aggregate), (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data.Items[0] && data.Items[0].event);
				}
			});
		});
	};

};
