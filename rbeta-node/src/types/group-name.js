'use strict';

const ST = require('./schematic-type');

module.exports = class GroupName extends ST.SV {

	static get schema() {
		return ST.joi.string()
			.label('GroupName')
			.trim().min(3)
			.regex(/^[a-zA-Z0-9-_]*$/);
	}

};
