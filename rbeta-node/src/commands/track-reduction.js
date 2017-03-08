'use strict';

const
	Command = require('./command'),
	ST = require('../types/schematic-type'),
	GroupName = require('../types/group-name'),
	ReducerName = require('../types/reducer-name'),
	TableName = require('../types/table-name'),
	StoredEvent = require('../types/stored-event'),
	SequenceNumber = require('../types/sequence-number');

module.exports = class TrackReduction extends Command {

	static get schema() {
		return ST.joi.object().keys({
			group: ST.joi.st(GroupName).required(),
			reducerName: ST.joi.st(ReducerName).required(),
			event: ST.joi.st(StoredEvent).required(),
			previousSeq: ST.joi.st(SequenceNumber),
		}).required().label('parameter');
	}

	run(ctx) {
		return new Promise((resolve, reject) => {
			const param = {
				TableName: new TableName({
					namespace: ctx.namespace, group: this.group
				}).trackingName,
				Key: {
					aggregate: this.event.aggregate.toPrimitive(),
					reducerName: this.reducerName.toPrimitive()
				},
				UpdateExpression:'SET #e = :e, #t = :t',
				ConditionExpression:
					'attribute_not_exists(#e.seq) OR (#e.seq < :ns',
				ExpressionAttributeNames: {
					'#e': 'event',
					'#t': 'timestamp'
				},
				ExpressionAttributeValues: {
					':e': this.event.toPrimitive(),
					':t': new Date().toISOString(),
					':ns': this.event.seq.toPrimitive()
				}
			};

			if (this.previousSeq) {
				param.ConditionExpression += ' AND #e.seq = :ps';
				param.ExpressionAttributeValues[':ps']
					= this.previousSeq.toPrimitive();
			}

			param.ConditionExpression += ')';

			return new ctx.AWS.DynamoDB.DocumentClient().update(
				param,
				(err, data) => err ? reject(err) : resolve(this.event)
			);
		});
	}

};
