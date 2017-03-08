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
				groupEvents(ctx, lambdaEvent).map(
					events => new ReduceEvents({
						reducer: this.reducer,
						events: events
					})
						.then(state => ({ state: state }))
						.catch(err => ({ error: err }))
				)
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
		processor(ctx, event, callback);
	};

};
