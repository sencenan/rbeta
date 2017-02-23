'use strict';

const schema = require('../types/');

const fromGroup = function(namespace, group) {
	return [
		'rbeta', schema.Namespace.check(namespace),
		'ddb', schema.GroupName.check(group)
	].join('_');
};

const fromEvent = function(namespace, event) {
	return fromGroup(namespace, event.group);
};

const trackingName = function(tableName) {
	return tableName.trim() + '_tracking';
};

module.exports = {
	fromEvent: fromEvent,
	fromGroup: fromGroup,
	trackingName: trackingName
};
