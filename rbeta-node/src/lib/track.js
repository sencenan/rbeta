'use strict';

const schema = require('./schema');

module.exports = function(config) {

	const
		tName = require('./table-name')(config),
		AWS = schema.AWSSDK.check(config.AWS);

	return function(group, reducerName, event) {
		group = schema.GroupName.check(group);
		reducerName = schema.ReducerName.check(reducerName);
		event = schema.NewEvent.check(event);

		return new Promise(
			(resolve, reject) => new AWS.DynamoDB.DocumentClient().put(
				{
					TableName: tName.trackingName(tName.fromGroup(group)),
					Item: {
						aggregate: event.aggregate,
						reducerName: reducerName,
						event: event,
						timestamp: new Date().toISOString()
					}
				},
				(err, data) => err ? reject(err) : resolve(event)
			)
		);
	};

};
