'use strict';

const ST = require('./schematic-type');

module.exports = class SequenceNumber extends ST.SV {

	static get schema() {
		return ST.joi.number().integer().label('seq').integer().greater(-1);
	}

};
