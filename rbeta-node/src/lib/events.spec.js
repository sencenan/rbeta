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
				data: { value: 0, filler: new Buffer(1024 * 128) }
			})
			.then(() => bluebird.map(
				[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
				(v) => rbeta.emit({
					group: 'eventsTest',
					aggregate: 'a',
					type: 'update',
					seq: v,
					data: {
						value: v,
						filler: new Buffer(1024 * 128)
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

	it('fetch all events with paging', function(done) {
		this.slow(500); // slow because data item is large

		rbeta
			.events('eventsTest', 'a')
			.then((items) => {
				let i = 0;

				items.map(item => assert.equal(item.data.value, i++));
				assert.equal(i, 11);
			})
			.then(() => done()).catch(done);
	});

	it('fetch all events starting from N', function(done) {
		this.slow(500); // slow because data item is large

		rbeta
			.events('eventsTest', 'a', 7)
			.then((items) => {
				let i = 7;

				items.map(item => assert.equal(item.data.value, i++));
				assert.equal(i, 11);
			})
			.then(() => done()).catch(done);
	});

	it('fetch empty aggregate', function(done) {
		this.slow(500); // slow because data item is large

		rbeta
			.events('eventsTest', 'empty')
			.then((items) => assert.deepEqual(items, []))
			.then(() => done()).catch(done);
	});

	it('fetch from nonexistent group', function(done) {
		rbeta.events('non', 'a').catch(() => done());
	});

});
