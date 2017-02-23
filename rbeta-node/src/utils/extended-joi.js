'use strict';

const joi = require('joi');

const extensions = [
	{
		name: 'array',
		base: joi.array(),
		language: {
			first: 'first element of array failed validation. error: {{e}}'
		},
		rules: [
			{
				name: 'first',
				params: {
					schema: joi.object({
						isJoi: joi.boolean().required().only(true)
					}).required().unknown(true)
				},
				validate: function(params, value, state, options) {
					try {
						value[0] = joi.attempt(value[0], params.schema);
						return value;
					} catch(ex) {
						return this.createError(
							'array.first',
							{
								e: ex
							},
							state,
							options
						);
					}
				}
			}
		]
	}
];

module.exports = extensions.reduce(
	(joi, extension) => joi.extend(extension), joi
);
