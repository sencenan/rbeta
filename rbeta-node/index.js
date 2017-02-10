'use strict';

const schema = require('./src/schema');

module.exports = function(config) {

	schema.validate(config.AWS, schema.AWSSDK);
	schema.validate(config.namespace, schema.Namespace);

	return {
		tableName: require('./src/table-name')(config),
		emit: require('./src/emit')(config),
		events: require('./src/events')(config)
	};
};
