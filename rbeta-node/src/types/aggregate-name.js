'use strict';

const ST = require('./schematic-type');

module.exports = class AggregateName extends ST.SV {

	static get schema() {
		return ST.joi.string()
			.label('aggregate')
			.trim().min(1)
			.regex(/^[a-zA-Z0-9-_]*$/);
	}

};
