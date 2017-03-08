'use strict';

const unmarshalItem = require('./unmarshal-item');

const
	eventComparator = (a, b) => a.dynamodb.Keys.seq.N - b.dynamodb.Keys.seq.N,
	eventFilter = e => e.eventName === 'INSERT' || e.eventName === 'MODIFY';

/*
 * event { Records[{ eventName: '', dynamodb: { NewImage: {} } }] }
 *
 * eventName: MODIFY | INSERT are treated the same
 * eventName: REMOVE is dropped
 */
module.exports = function(ctx, rawEvent) {
	const grouped = rawEvent
		.Records
		.filter(eventFilter)
		.reduce((a, r) => {
			const
				aggregate = r.dynamodb.Keys.aggregate.S,
				group = r.dynamodb.NewImage.group.S;

			if (!a[group]) {
				a[group] = {};
			}

			if (!a[group][aggregate]) {
				a[group][aggregate] = [];
			}

			a[group][aggregate].push(r);
			return a;
		}, {})

	return Object.keys(grouped).sort().reduce(
		(list, g) => {
			Object.keys(grouped[g]).sort().map(
				a => list.push(
					grouped[g][a]
						.sort(eventComparator)
						.map(e => unmarshalItem(ctx, e.dynamodb.NewImage))
				)
			);

			return list;
		},
		[]
	);
};
