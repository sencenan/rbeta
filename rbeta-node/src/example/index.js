'use strict';

const rbeta = require('rbeta-node');

module.exports = {
	name: 'example-reducer',
	aws: () => require('aws-sdk'),
	// S -> IO(S)
	persist: (state) => {},
	// a -> S
	state: (aggregate) => {},
	// S -> E -> S
	reduce: (state, event) => {}
};
