'use strict';

const Types = require('../types/');

const
	ST = Types.ST,
	Namespace = Types.Namespace,
	ReducerObj = Types.ReducerObj;

class Context extends ST {
	static get schema() {
		return ST.joi.object().keys({
			namespace: ST.joi.st(Namespace).required(),
			reducer: ST.joi.st(ReducerObj).required(),
			AWS: ST.joi.object().required()
		}).required().label('parameter');
	}
}

module.exports = function(reducer) {
	var AWS, namespace;

	if (reducer && (typeof reducer.aws === 'function')) {
		AWS = reducer.aws();
	} else {
		AWS = require('aws-sdk');
	}

	if (
		(typeof process.env.RBETA_NAMESPACE === 'string')
			&& process.env.RBETA_NAMESPACE.trim()
	) {
		namespace = process.env.RBETA_NAMESPACE;
	}

	return new Context({
		namespace: namespace,
		reducer: reducer,
		AWS: AWS
	});
};
