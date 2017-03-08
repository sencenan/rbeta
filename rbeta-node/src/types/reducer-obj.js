'use strict';

const
	ST = require('./schematic-type'),
	ReducerName = require('./reducer-name');

module.exports = class ReducerObj extends ST {

	static get schema() {
		return ST.joi.object().keys({
			name: ST.joi.st(ReducerName).required(),
			persist: ST.joi.func().required(),
			state: ST.joi.func().required(),
			reduce: ST.joi.func().required()
		}).label('reducer').unknown(true);
	}

};
