'use strict';

const ST = require('./schematic-type');

module.exports = class Namespace extends ST.SV {

	static get schema() {
		return ST.joi.string().label('Namespace').regex(/^[a-zA-Z][a-zA-Z0-9]*$/);
	}

};
