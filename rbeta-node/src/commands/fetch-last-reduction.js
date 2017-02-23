'use strict';

const
	Command = require('./command'),
	ST = require('../types/schematic-type'),
	GroupName = require('../types/group-name'),
	ReducerName = require('../types/reducer-name'),
	AggregateName = require('../types/aggregate-name'),
	TableName = require('../types/table-name');

module.exports = class FetchLastReduction extends Command {

	static get schema() {
		return ST.joi.object().keys({
			group: ST.joi.st(GroupName).required(),
			reducerName: ST.joi.st(ReducerName).required(),
			aggregate: ST.joi.st(AggregateName).required()
		}).required().label('parameter');
	}

	makeParam(ctx) {
		return {
			TableName: new TableName({
				namespace: ctx.namespace,
				group: this.group
			}).trackingName,
			Select: 'ALL_ATTRIBUTES',
			KeyConditionExpression: '#a = :a AND #s = :s',
			ExpressionAttributeNames: { '#a': 'aggregate', '#s': 'reducerName' },
			ExpressionAttributeValues: {
				':a': this.aggregate.toPrimitive(),
				':s': this.reducerName.toPrimitive()
			},
			Limit: 1
		};
	}

	run(ctx) {
		return new Promise(
			(resolve, reject) => new ctx.AWS.DynamoDB.DocumentClient().query(
				this.makeParam(ctx),
				(err, data) => err
					? reject(err)
					: resolve(data.Items[0] && data.Items[0].event)
			)
		);
	}

};
