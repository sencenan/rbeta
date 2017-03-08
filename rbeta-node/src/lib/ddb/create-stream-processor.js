'use strict';

const bluebird = require('bluebird');

const
	ST = require('../../types/schematic-type'),
	ReducerObj = require('../../types/reducer-obj'),
	ReduceEvents = require('../../commands/reduce-events'),

	groupEvents = require('./group-events');

class StreamProcessor extends ST {
	static get schema() {
		return ST.joi.object().keys({
			reducer: ST.joi.st(ReducerObj).required()
		}).required().label('parameter');
	}

	process(ctx, lambdaEvent, callback) {
		bluebird
			.all(
				groupEvents(ctx, lambdaEvent).map(events => {
					const result = {
						aggregate: events[0].aggregate,
						group: events[0].group
					};

					return new ReduceEvents({
						reducer: this.reducer,
						events: events
					})
						.run(ctx)
						.then(s => (result.state = s, result))
						.catch(e => (result.error = e, result));
				})
			)
			.then(
				res => res.reduce((hasErr, r) => hasErr || !!r.error, false)
					? callback(res)
					: callback(null, res)
			)
			.catch(callback);
	}
};

module.exports = function(ctx, reducer) {
	const processor = new StreamProcessor({ reducer: reducer });

	return function(event, context, callback) {
		return processor.process(ctx, event, callback);
	};
};
