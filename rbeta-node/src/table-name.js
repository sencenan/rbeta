'use strict';

const schema = require('./schema');

module.exports = function(config) {

	schema.validate(config.namespace, schema.Namespace);

	const fromGroup = function(group) {
		return [
			'rbeta',
			config.namespace,
			'ddb',
			schema.validate(group, schema.GroupName)
		].join('_');
	};

	const fromEvent = function(event) {
		return fromGroup(event.group);
	};

	return {
		fromEvent: fromEvent,
		fromGroup: fromGroup
	};

};
