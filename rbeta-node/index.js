'use strict';

module.exports = function(opts) {
	const rbeta = {
		AWS: opts.AWS,
		namespace: opts.namespace,
		ns: opts.namespace
	};

	rbeta.emit = require('./src/emit.js').bind(rbeta);

	return rbeta;
};
