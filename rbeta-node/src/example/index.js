'use strict';

const rbeta = require('rbeta-node');

module.exports = {
	name: 'example-reducer',
	// S -> IO(S)
	pump: () => {},
	// a -> S
	state: () => {},
	// S -> E -> S
	reduce: (state, event) => {}
};
