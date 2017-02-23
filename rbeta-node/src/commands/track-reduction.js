'use strict';

const
	Command = require('./command'),
	ST = require('../types/schematic-type'),
	GroupName = require('../types/group-name'),
	ReducerName = require('../types/reducer-name'),
	TableName = require('../types/table-name'),
	NewEvent = require('../types/new-event');

module.exports = class TrackEvent extends Command {

	static get schema() {
		return ST.joi.object().keys({
			group: ST.joi.st(GroupName).required(),
			reducerName: ST.joi.st(ReducerName).required(),
			event: ST.joi.st(NewEvent).required()
		}).required().label('parameter');
	}

	run(ctx) {
		return new Promise(
			(resolve, reject) => new ctx.AWS.DynamoDB.DocumentClient().put(
				{
					TableName: new TableName({
						namespace: ctx.namespace, groupName: this.group
					}).trackingName,
					Item: {
						aggregate: this.event.aggregate,
						reducerName: this.reducerName.toPrimitive(),
						event: this.event.toPrimitive(),
						timestamp: new Date().toISOString()
					}
				},
				(err, data) => err ? reject(err) : resolve(this.event)
			)
		);
	}

};
