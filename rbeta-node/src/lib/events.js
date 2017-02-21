'use strict';

const
	rbeta = require('./rbeta'),
	tName = require('./table-name'),
	schema = require('./schema');

const makeParam = (group, aggregate, fromSeq, toSeq, esk) => {
	const param = {
		TableName: tName.fromGroup(group),
		Select: 'ALL_ATTRIBUTES',
		KeyConditionExpression: '#a = :a',
		ExpressionAttributeNames: { '#a': 'aggregate', '#s': 'seq' },
		ExpressionAttributeValues: { ':a': aggregate },
		ScanIndexForward: true
	};

	if (toSeq) {
		param.KeyConditionExpression += ' AND (#s BETWEEN :lo AND :hi)';
		param.ExpressionAttributeValues[':lo'] = fromSeq;
		param.ExpressionAttributeValues[':hi'] = toSeq;
	} else {
		param.KeyConditionExpression += ' AND #s >= :s';
		param.ExpressionAttributeValues[':s'] = fromSeq;
	}

	if (esk) {
		param.ExclusiveStartKey = esk;
	}

	return param;
};

module.exports = function(group, aggregate, fromSeq, toSeq) {
	group = schema.GroupName.check(group);
	aggregate = schema.Aggregate.check(aggregate);
	fromSeq = schema.SequenceNumber.check(fromSeq || 0);

	const ddoc = new rbeta.config.AWS.DynamoDB.DocumentClient();
	let items = [];

	return new Promise((resolve, reject) => ddoc.query(
		makeParam(group, aggregate, fromSeq, toSeq),
		function handler(err, data) {
			if (err) {
				reject(err);
			} else {
				items = items.concat(data.Items);

				if (data.LastEvaluatedKey) {
					ddoc.query(
						makeParam(
							group, aggregate, fromSeq, toSeq, data.LastEvaluatedKey
						),
						handler
					);
				} else {
					resolve(items);
				}
			}
		}
	));
};
