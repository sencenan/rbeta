'use strict';

const schema = require('./src/lib/schema');

module.exports = function(config) {

	schema.validate(config.AWS, schema.AWSSDK);
	schema.validate(config.namespace, schema.Namespace);

	return {
		tableName: require('./src/lib/table-name')(config),
		emit: require('./src/lib/emit')(config),
		events: require('./src/lib/events')(config),
		lastEvent: require('./src/lib/last-event')(config)
	};
};
