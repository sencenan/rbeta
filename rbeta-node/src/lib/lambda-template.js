'use strict';

const
	reducer = require('rbeta-reducer'),
	rbeta = require('rbeta-node');

const
	executionContext = rbeta.lib.createContext(reducer),
	processStream = rbeta.lib.ddb.createStreamProcessor(
		executionContext, reducer
	);

exports.reducer = reducer;
exports.handler = processStream;
