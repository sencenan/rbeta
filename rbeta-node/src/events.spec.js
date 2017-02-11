'use strict';

const bluebird = require('bluebird');

describe('events', function() {

	it('validates paramters', function() {
		assert.throws(
			() => rbeta.events().next(),
			/"group" is required/
		);

		assert.throws(
			() => rbeta.events('group').next(),
			/"aggregate" is required/
		);

		rbeta.events('group', 'a').next();
		rbeta.events('group', 'a', 4).next();
	});

	it('dummy test', function(done) {
		rbeta
			.emit({
				group: 'eventsTest',
				aggregate: 'a',
				type: 'update',
				seq: 0,
				data: { value: 0 }
			})
			.then(() => bluebird.map(
				[1, 2, 3, 4, 5, 6, 7, 8],
				(v) => rbeta.emit({
					group: 'eventsTest',
					aggregate: 'a',
					type: 'update',
					seq: v,
					data: {
						value: v
					}
				})
			))
			.then(function(data) {
				done();
			}).catch(done);
	});

});
