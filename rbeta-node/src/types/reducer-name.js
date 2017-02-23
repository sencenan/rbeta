'use strict';

const ST = require('./schematic-type');

module.exports = class ReducerName extends ST.SV {

	static get schema() {
		return ST.joi.string()
			.label('reducerName')
			.trim().min(1)
			.regex(/^[a-zA-Z0-9-_]*$/);
	}

};
