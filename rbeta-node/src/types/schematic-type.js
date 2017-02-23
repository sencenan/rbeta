'use strict';

const joi = require('../utils/extended-joi');

const
	STJoi = joi.extend({
		name: 'st',
		language: {
			type: 'must conform to schema of type {{s}}. error: {{e}}',
			extra: 'failed with extra schema. error: {{e}}'
		},
		rules: [
			{
				name: 'type',
				params: {
					constructor: joi.func().required()
				},
				validate: function(params, value, state, options) {
					try {
						if (value instanceof params.constructor) {
							return value;
						} else {
							return new params.constructor(value);
						}
					} catch(ex) {
						return this.createError(
							'st.type',
							{
								s: params.constructor.name,
								e: ex
							},
							state,
							options
						);
					}
				}
			},
			{
				name: 'extra',
				params: {
					extraSchema: joi.object({
						isJoi: joi.boolean().required().only(true)
					}).required().unknown(true)
				},
				validate: function(params, value, state, options) {
					try {
						return STJoi.attempt(value, params.extraSchema);
					} catch(ex) {
						return this.createError(
							'st.extra',
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
	}),
	_oriST = STJoi.st();

STJoi.st = function() {
	var instance = _oriST;

	if (arguments.length) {
		return instance.type.apply(instance, arguments);
	} else {
		return instance;
	}
};

class STError extends Error {

	static get(st) {
		if (!STError.__derivedErrors) {
			STError.__derivedErrors = {};
		}

		let E = STError.__derivedErrors[st.name];

		if (!E) {
			E = STError.__derivedErrors[st.name] = class extends STError {
				get type() {
					return st;
				}

				static wrapError(error) {
					var err = new E(error.message);

					err.wrappedError = error;

					return err;
				}
			};
		}

		return E;
	}
};

class ST {

	constructor() {
		const T = this.constructor;

		// static schema
		STJoi.validate(
			arguments[0],
			T.schema,
			T.joiOptions,
			(err, props) => {
				if (err) {
					throw T.Error.wrapError(err);
				} else {
					T.assign(this, props);
				}
			}
		);

		// instance schema
		this.schema && STJoi.validate(
			arguments[0],
			this.schema,
			T.joiOptions,
			(err, props) => {
				if (err) {
					throw T.Error.wrapError(err);
				} else {
					T.assign(this, props);
				}
			}
		);
	}

	static assign(instance, props) {
		Object.assign(instance, props);
	}

	static get Error() {
		return STError.get(this);
	}

	static get joi() {
		return STJoi;
	}

	static get joiOptions() {
		return {};
	}

	static many(vals) {
		return vals.map((v) => new this(v));
	}

	static manyWithNulls(vals) {
		return vals.map(
			(v) => (Object.is(v, null) || Object.is(v, undefined))
				? v
				: new this(v)
		);
	}

	static get schema() {
		return ST.joi.any();
	}

	get schema() {
		return null;
	}

};

/* Schematic Value */
ST.SV = class SV extends ST {

	static assign(instance, props) {
		instance.value = props;
	}

	toString() {
		return '' + this.value;
	}

};

module.exports = ST;
