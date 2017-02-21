'use strict';

const
	rbeta = require('./rbeta'),
	schema = require('./schema');

const fromGroup = function(group) {
	console.log(rbeta);

	return [
		'rbeta',
		rbeta.config.namespace,
		'ddb',
		schema.GroupName.check(group)
	].join('_');
};

const fromEvent = function(event) {
	return fromGroup(event.group);
};

const trackingName = function(tableName) {
	return tableName.trim() + '_tracking';
};

module.exports = {
	fromEvent: fromEvent,
	fromGroup: fromGroup,
	trackingName: trackingName
};
