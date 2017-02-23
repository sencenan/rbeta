'use strict';

const
	Command = require('./command'),
	ST = require('../types/schematic-type'),
	GroupName = require('../types/group-name'),
	AggregateName = require('../types/aggregate-name'),
	SequenceNumber = require('../types/sequence-number'),
	TableName = require('../types/table-name');

module.exports = class FetchEvents extends Command {

	static get schema() {
		return ST.joi.object().keys({
			group: ST.joi.st(GroupName).required(),
			aggregate: ST.joi.st(AggregateName).required(),
			fromSeq: ST.joi.st(SequenceNumber).default(new SequenceNumber(0)),
			toSeq: ST.joi.st(SequenceNumber)
		}).required().label('parameter');
	}

	makeParam(ctx, exclusiveStartKey) {
		const param = {
			TableName: new TableName({
				namespace: ctx.namespace, groupName: this.group
			}).toString(),
			Select: 'ALL_ATTRIBUTES',
			KeyConditionExpression: '#a = :a',
			ExpressionAttributeNames: { '#a': 'aggregate', '#s': 'seq' },
			ExpressionAttributeValues: { ':a': this.aggregate.toString() },
			ScanIndexForward: true
		};

		if (this.toSeq) {
			param.KeyConditionExpression += ' AND (#s BETWEEN :lo AND :hi)';
			param.ExpressionAttributeValues[':lo'] = this.fromSeq.value;
			param.ExpressionAttributeValues[':hi'] = this.toSeq.value;
		} else {
			param.KeyConditionExpression += ' AND #s >= :s';
			param.ExpressionAttributeValues[':s'] = this.fromSeq.value;
		}

		if (exclusiveStartKey) {
			param.ExclusiveStartKey = exclusiveStartKey;
		}

		return param;
	}

	run(ctx) {
		const
			ddoc = new ctx.AWS.DynamoDB.DocumentClient(),
			inst = this;

		var items = [];

		return new Promise((resolve, reject) => ddoc.query(
			inst.makeParam(ctx),
			function handler(err, data) {
				if (err) {
					reject(err);
				} else {
					items = items.concat(data.Items);

					data.LastEvaluatedKey
						? ddoc.query(
							inst.makeParam(ctx, data.LastEvaluatedKey), handler
						)
						: resolve(items);
				}
			}
		));
	}

};
