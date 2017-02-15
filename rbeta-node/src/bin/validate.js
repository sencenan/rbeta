'use strict';

const path = require('path');

module.exports = function(opts) {
	return new Promise((resolve, reject) => {
		const reducer = require(path.resolve(opts.output, opts.name));
		console.log(reducer);

		/**
		 * Testing invariants
		 *
		 * - pump::S -> IO(S)
		 * 0) not tested, causes IO
		 *
		 * - state::a -> S
		 * 0) not tested, no data.
		 *
		 * - reduce::S -> E -> S
		 * 0) mock pump and state function implementation supplied
		 * 1) Be able to handle gaps in events:
		 * 	state at S[n-i], E is at E[n], i > 0, still produce S[n]
		 * 2) Be able to handle old events:
		 * 	State at S[n], E is at E[n-i], i >=0 , still produce S[n]
		 */
	});
};
