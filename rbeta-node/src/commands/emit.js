'use strict';

const
	Command = require('./command'),
	ST = require('../types/schematic-type'),
	NewEvent = require('../types/new-event'),
	TableName = require('../types/table-name');

const
	CREATE_TABLE_PARAMS = require('./create-table.tmplt.json'),
	CREATE_TRACKING_TABLE_PARAMS = require('./create-tracking-table.tmplt.json');

const storeEvent = (ctx, event) => new Promise((resolve, reject) => {
	event.timestamp = new Date().toISOString();

	new ctx.AWS.DynamoDB.DocumentClient().put(
		{
			TableName: TableName.fromEvent(ctx.namespace, event).toString(),
			Item: event,
			ConditionExpression: 'attribute_not_exists(#s)',
			ExpressionAttributeNames: { '#s': 'seq' }
		},
		(err, data) => err ? reject(err) : resolve(event)
	);
});

const createAndWaitForTable = (aws, tableParam) => {
	const ddb = new aws.DynamoDB();

	return new Promise(
		(resolve, reject) => ddb.createTable(
			tableParam,
			(err, data) => err
				? /* istanbul ignore next */ reject(err) : resolve(data)
		)
	).then(
		() => new Promise((resolve, reject) => ddb.waitFor(
			'tableExists', { TableName: tableParam.TableName },
			(err, data) => err
				? /* istanbul ignore next */ reject(err) : resolve(data)
		))
	);
};

const createTableForEvent = (ctx, event) => createAndWaitForTable(
	ctx.AWS,
	Object.assign(
		{ TableName: TableName.fromEvent(ctx.namespace, event).toString() },
		CREATE_TABLE_PARAMS
	)
);

const createShadowTableForEvent = (ctx, event) => createAndWaitForTable(
	ctx.AWS,
	Object.assign(
		{ TableName: TableName.fromEvent(ctx.namespace, event).trackingName },
		CREATE_TRACKING_TABLE_PARAMS
	)
);

module.exports = class Emit extends Command {

	static get schema() {
		return ST.joi.st(NewEvent).required().label('event');
	}

	run(ctx) {
		return storeEvent(ctx, this).catch((err) => {
			if (err.code === 'ResourceNotFoundException') {
				return createTableForEvent(ctx, this)
					.then(() => createShadowTableForEvent(ctx, this))
					.then(() => storeEvent(ctx, this));
			} else {
				throw err;
			}
		});
	}

};
