'use strict';

const schema = require('./schema');

module.exports = function(config) {

	const
		tName = require('./table-name')(config),
		AWS = schema.validate(config.AWS, schema.AWSSDK);

	return function*(group, aggregate, fromSeq) {
		group = schema.validate(group, schema.GroupName);
		aggregate = schema.validate(aggregate, schema.Aggregate);

		if (arguments.length <= 2) {
			fromSeq = 0;
		}

		fromSeq = schema.validate(fromSeq, schema.SequenceNumber);

		// return a data structure that supplies data as requested
		// in 4.3.2 mode, so genertors!
		//
		yield 3;
	};

};
