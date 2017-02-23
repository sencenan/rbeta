'use strict';

const
	ST = require('./schematic-type'),
	GroupName = require('./group-name');

module.exports = class NewEvent extends ST {

	static get schema() {
		return ST.joi.object().label('event').keys({
			group: ST.joi.st(GroupName).required(),
			aggregate: ST.joi.string().label('aggregate')
				.trim().min(1).regex(/^[a-zA-Z0-9-_]*$/).required(),
			seq: ST.joi.number().integer()
				.label('seq').integer().greater(-1).required(),
			type: ST.joi.string().label('type').trim().min(1).required(),
			data: ST.joi.object().label('data').default({}).unknown(true)
		}).required();
	}

};
