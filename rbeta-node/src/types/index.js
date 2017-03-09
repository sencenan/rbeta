'use strict';

module.exports = {
	ST: require('./schematic-type'),

	SequenceNumber: require('./sequence-number'),
	TableName: require('./table-name'),
	AggregateName: require('./aggregate-name'),
	GroupName: require('./group-name'),
	Namespace: require('./namespace'),

	NewEvent: require('./new-event'),
	StoredEvent: require('./stored-event'),

	ReducerName: require('./reducer-name'),
	ReducerObj: require('./reducer-obj')
};
