'use strict';

const joi = require('joi');

exports.AWSSDK = joi.object().unknown(true).keys({
	config: joi.object().unknown(true).keys({
		credentials: joi.object().unknown(true).required()
	}).required()
}).required();

exports.Namespace = joi.string().label('namespace')
	.trim().min(1).regex(/^[a-zA-Z0-9-_]*$/).required();

exports.GroupName = joi.string().label('group')
	.trim().min(3).regex(/^[a-zA-Z0-9-_]*$/).required();

exports.Aggregate = joi.string().label('aggregate')
	.trim().min(1).regex(/^[a-zA-Z0-9-_]*$/).required();

exports.ReducerName = joi.string().label('reducerName')
	.trim().min(1).regex(/^[a-zA-Z0-9-_]*$/).required();

exports.SequenceNumber = joi.number().integer()
	.label('seq').integer().greater(-1).required(),

exports.NewEvent = joi.object().label('event').keys({
	group: exports.GroupName,
	aggregate: exports.Aggregate,
	seq: exports.SequenceNumber,
	type: joi.string().label('type').trim().min(1).required(),
	data: joi.object().label('data').default({}).unknown(true)
}).required();

exports.validate = function(val, schema, opts) {
	return joi.validate(val, schema, opts || {}, (err, val) => {
		if (err) {
			throw err;
		} else {
			return val;
		}
	});
};

[
	exports.AWSSDK,
	exports.Namespace,
	exports.GroupName,
	exports.Aggregate,
	exports.SequenceNumber,
	exports.ReducerName,
	exports.NewEvent
].map(schema => schema.check = (v, opts) => exports.validate(v, schema, opts));
