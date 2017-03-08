'use strict';

const
	ST = require('./schematic-type'),
	AggregateName = require('./aggregate-name'),
	GroupName = require('./group-name'),
	SequenceNumber = require('./sequence-number');

module.exports = class StoredEvent extends ST {

	static get schema() {
		return ST.joi.object().label('event').keys({
			group: ST.joi.st(GroupName).required(),
			aggregate: ST.joi.st(AggregateName).required(),
			seq: ST.joi.st(SequenceNumber).required(),
			type: ST.joi.string().label('type').trim().min(1).required(),
			data: ST.joi.object().label('data').default({}).unknown(true),
			timestamp: ST.joi.string().label('timestamp').trim().min(1).required()
		}).required();
	}

};
