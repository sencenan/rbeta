'use strict';

const joi = require('joi');

exports.AWSSDK = joi.object().unknown(true).keys({
	config: joi.object().unknown(true).keys({
		credentials: joi.object().unknown(true).required()
	}).required()
}).required();

exports.Namespace = joi.string().label('namespace').min(1).required();

exports.GroupName = joi.string().label('group').min(3).required();

exports.NewEvent = joi.object().keys({
	group: exports.GroupName,
	aggregate: joi.string().label('aggregate').min(1).required(),
	seq: joi.number().label('seq').integer().greater(-1).required(),
	type: joi.string().label('type').min(1).required(),
	data: joi.object().label('data').default({}).unknown(true)
}).required();

exports.validate = function(val, schema, opts) {
	return joi.validate(
		val,
		schema,
		opts || {},
		(err, val) => {
			if (err) {
				throw err;
			}

			return val;
		}
	);
};
