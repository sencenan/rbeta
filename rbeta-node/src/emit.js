'use strict';

const schema = require('./schema');

const CREATE_TABLE_PARAMS = require('./create-table.tmplt.json');

module.exports = function(config) {

	const
		tName = require('./table-name')(config),
		AWS = schema.validate(config.AWS, schema.AWSSDK);

	const storeEvent = (event) => new Promise((resolve, reject) => {
		new AWS.DynamoDB.DocumentClient().put(
			{
				TableName: tName.fromEvent(event),
				Item: event,
				ConditionExpression: 'attribute_not_exists(#s)',
				ExpressionAttributeNames: { '#s': 'seq' }
			},
			(err, data) => err ? reject(err) : resolve(data)
		);
	});

	const createTableForEvent = (event) => {
		const
			ddb = new AWS.DynamoDB(),
			tableName = tName.fromEvent(event);

		return new Promise((resolve, reject) => ddb.createTable(
			Object.assign({ TableName: tableName }, CREATE_TABLE_PARAMS),
			(err, data) => err ? reject(err) : resolve(data)
		)).then(() => new Promise((resolve, reject) => ddb.waitFor(
			'tableExists',
			{ TableName: tableName },
			(err, data) => err ? reject(err) : resolve(data)
		)));
	};

	return function(event) {
		event = schema.validate(event, schema.NewEvent);

		return storeEvent(event).catch((err) => {
			if (err.code === 'ResourceNotFoundException') {
				return createTableForEvent(event).then(() => storeEvent(event));
			} else {
				throw err;
			}
		});
	};

};
