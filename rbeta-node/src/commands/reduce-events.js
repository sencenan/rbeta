'use strict';

const
	bluebird = require('bluebird'),

	Command = require('./command'),
	FetchLastReduction = require('./fetch-last-reduction'),

	ST = require('../types/schematic-type'),
	NewEvent = require('../types/new-event'),
	ReducerObj = require('../types/reducer-obj'),

	returnp = require('../utils/return-promise');

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
			).length > 1 || Object.keys(
				this.events.reduce((a, e) => (a[e.group] = true, a), {})
			).length > 1
		) {
			throw new Error('Events must have the same aggregate and group');
		}
	}

	run(ctx) {
		if (!this.events.length) {
			return new Promise(resolve => resolve([]));
		}

		const
			group = this.events[0].group,
			aggregate = this.events[0].aggregate;

		return bluebird
			.all([
				returnp(this.reducer.state(aggregate)),
				new FetchLastReduction({
					group: group,
					reducerName: this.reducer.name,
					aggregate: aggregate
				}).run(ctx)
			])
			.spread((state, lastReduction) => {
				console.log(state);
				console.log(lastReduction);
				console.log(group);
				console.log(aggregate);
			});
	}

};
