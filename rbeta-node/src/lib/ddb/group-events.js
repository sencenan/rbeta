'use strict';

const unmarshalItem = require('./unmarshal-item');

const
	eventComparator = (a, b) =>
		a.dynamodb.SequenceNumber < b.dynamodb.SequenceNumber
			? -1
			: (a.dynamodb.SequenceNumber > b.dynamodb.SequenceNumber ? 1 : 0),
	eventFilter = e => e.eventName === 'INSERT' || e.eventName === 'MODIFY';

/*
 * event { Records[{ eventName: '', dynamodb: { NewImage: {} } }] }
 *
 * eventName: MODIFY | INSERT are treated the same
 * eventName: REMOVE is dropped
 */
module.exports = function(ctx, rawEvent) {
	const grouped = rawEvent.Records.reduce((a, r) => {
		const aggregate = r.dynamodb.Keys.aggregate.S;

		if (!a[aggregate]) {
			a[aggregate] = [];
		}

		a[aggregate].push(r);
		return a;
	}, {});

	return Object.keys(grouped).sort().map(
		a => grouped[a]
			.sort(eventComparator)
			.filter(eventFilter)
			.map(e => unmarshalItem(ctx, e.dynamodb.NewImage))
	);
};
