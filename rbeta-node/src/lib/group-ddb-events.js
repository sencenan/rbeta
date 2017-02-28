'use strict';

/*
 * event { Records[{ dynamodb: { NewImage: {} } }] }
 *
 * eventName: REMOVE | MODIFY | INSERT
 */
module.exports = function(rawEvent) {
	const grouped = rawEvent.Records.reduce((a, r) => {
		const aggregate = r.dynamodb.Keys.aggregate.S;

		if (!a[aggregate]) {
			a[aggregate] = [];
		}

		a[aggregate].push(r);

		return a;
	}, {});

	return Object.keys(grouped).sort().map(a => grouped[a].sort((a, b) => {
		if (a.dynamodb.SequenceNumber < b.dynamodb.SequenceNumber) {
			return -1;
		}

		if (a.dynamodb.SequenceNumber > b.dynamodb.SequenceNumber) {
			return 1;
		}

		return 0;
	}));
};
