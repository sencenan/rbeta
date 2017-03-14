'use strict';

const
	ST = require('./schematic-type'),
	Namespace = require('./namespace'),
	GroupName = require('./group-name');

module.exports = class TableName extends ST {

	static fromEvent(namespace, event) {
		return new TableName({
			namespace: namespace,
			group: event.group
		});
	}

	static get schema() {
		return ST.joi.object().keys({
			namespace: ST.joi.st(Namespace).required(),
			group: ST.joi.st(GroupName).required()
		}).required().label('parameter');
	}

	get trackingName() {
		return ['rbeta', 'ddb', 'tracking', this.namespace, this.group].join('_');
	}

	toString() {
		return ['rbeta', 'ddb', this.namespace, this.group].join('_');
	}

};
