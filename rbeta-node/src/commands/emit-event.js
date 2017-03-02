'use strict';

const
	Command = require('./command'),
	ST = require('../types/schematic-type'),
	NewEvent = require('../types/new-event'),
	TableName = require('../types/table-name');

const
	storeEvent = (ctx, event) => new Promise((resolve, reject) => {
		event.timestamp = new Date().toISOString();

		new ctx.AWS.DynamoDB.DocumentClient().put(
			{
				TableName: TableName.fromEvent(ctx.namespace, event).toString(),
				Item: event.toPrimitive(),
				ConditionExpression: 'attribute_not_exists(#s)',
				ExpressionAttributeNames: { '#s': 'seq' }
			},
			(err, data) => err ? reject(err) : resolve(event)
		);
	}),
	createAndWaitForTable = (aws, tableParam) => {
		const ddb = new aws.DynamoDB();

		return new Promise((resolve, reject) => ddb.createTable(
			tableParam,
			(err, data) => err
				? /* istanbul ignore next */ reject(err) : resolve(data)
		)).then(() => new Promise((resolve, reject) => ddb.waitFor(
			'tableExists', { TableName: tableParam.TableName },
			(err, data) => err
				? /* istanbul ignore next */ reject(err) : resolve(data)
		)));
	},
	createTableForEvent = (ctx, event) => createAndWaitForTable(
		ctx.AWS,
		Object.assign(
			{ TableName: TableName.fromEvent(ctx.namespace, event).toString() },
			require('./create-table.tmplt.json')
		)
	),
	createShadowTableForEvent = (ctx, event) => createAndWaitForTable(
		ctx.AWS,
		Object.assign(
			{ TableName: TableName.fromEvent(ctx.namespace, event).trackingName },
			require('./create-tracking-table.tmplt.json')
		)
	);

module.exports = class EmitEvent extends Command {

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
