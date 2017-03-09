'use strict';

exports.rbeta = require('rbeta-node');
exports.reducer = require('rbeta-reducer');
exports.context = exports.rbeta.lib.createContext(exports.reducer);
exports.handler = exports.rbeta.lib.ddb.createStreamProcessor(
	exports.context, exports.reducer
);
