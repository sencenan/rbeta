'use strict';

const schema = require('./schema');

var rbeta = {

	config: {},

	updateConfig: function(config) {
		config.namespace = schema.Namespace.check(config.namespace);

		rbeta.config = Object.assign(rbeta.config, config);
	},

	tableName: require('./table-name'),
	emit: require('./emit'),
	events: require('./events'),
	lastEvent: require('./last-event'),
	lastReducedEvent: require('./last-reduced-event'),
	track: require('./track')
};

module.exports = rbeta;
