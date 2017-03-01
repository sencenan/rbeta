'use strict';

const
	Command = require('./command'),
	ST = require('../types/schematic-type'),
	NewEvent = require('../types/new-event'),
	ReducerObj = require('../types/reducer-obj');

module.exports = class ReduceEvents extends Command {

	static get schema() {
		return ST.joi.object().keys({
			reducer: ST.joi.st(ReducerObj).required(),
			events: ST.joi.array().items(ST.joi.st(NewEvent)).required()
		}).required().label('parameter');
	}

	constructor(param) {
		super(param);

		if (
			Object.keys(
				this.events.reduce((a, e) => (a[e.aggregate] = true, a), {})
			).length > 1
		) {
			throw new Error('All Events must belong to the same aggregate');
		}
	}

	run(ctx) {
	}

};
