'use strict';

const bluebird = require('bluebird');

describe('events', function() {

	before(function(done) {
		// create table with data
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
			.then(() => done()).catch(done);
	});

	it('validates paramters', function() {
		assert.throws(
			() => rbeta.events(),
			/"group" is required/
		);

		assert.throws(
			() => rbeta.events('group'),
			/"aggregate" is required/
		);

		rbeta.events('group', 'a');
		rbeta.events('group', 'a', 4);
	});

	it('fetch events without paging', function(done) {
		rbeta
			.events('eventsTest', 'a')
			.then(
				(it) => {
					let i = 0;

					for (let item of it) {
						assert.equal(item.data.value, i++);
					}
				}
			)
			.then(() => done()).catch(done);
	});

});
