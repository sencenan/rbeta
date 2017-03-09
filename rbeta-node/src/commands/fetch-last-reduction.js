'use strict';

const
	Command = require('./command'),
	Types = require('../types/');

const
	ST = Types.ST,
	GroupName = Types.GroupName,
	ReducerName = Types.ReducerName,
	AggregateName = Types.AggregateName,
	TableName = Types.TableName;

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
