'use strict';

const
	rbeta = require('./rbeta'),
	tName = require('./table-name'),
	schema = require('./schema');

const makeParam = (group, aggregate) => ({
	TableName: tName.fromGroup(group),
	Select: 'ALL_ATTRIBUTES',
	KeyConditionExpression: '#a = :a',
	ExpressionAttributeNames: { '#a': 'aggregate' },
	ExpressionAttributeValues: { ':a': aggregate },
	ScanIndexForward: false,
	Limit: 1
});

module.exports = function(group, aggregate) {
	group = schema.GroupName.check(group);
	aggregate = schema.Aggregate.check(aggregate);

	const ddoc = new rbeta.config.AWS.DynamoDB.DocumentClient();

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
