'use strict';

const rbeta = require('rbeta-node');

const db = {};

module.exports = {
	name: 'example-reducer',
	aws: () => require('aws-sdk'),
	// S -> IO(S)
	persist: (group, aggregate, state) => db[aggregate] = state,
	// a -> S
	state: (aggregate) => db[aggregate],
	// S -> E -> S
	reduce: (state, event) => ({
		value: (state ? state.value : 0) + event.data.value
	})
};
