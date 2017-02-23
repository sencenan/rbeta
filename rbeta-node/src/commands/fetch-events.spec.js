'use strict';

const
	bluebird = require('bluebird'),
	EmitEvent = require('./emit-event'),
	FetchEvents = require('./fetch-events');

describe('events', function() {

	const testCtx = {
		AWS: AWS,
		namespace: 'test'
	};

	before(function(done) {
		// create table with data
		new EmitEvent({
				group: 'eventsTest',
				aggregate: 'a',
				type: 'update',
				seq: 0,
				data: { value: 0, filler: new Buffer(1024 * 128) }
			})
			.run(testCtx)
			.then(() => bluebird.map(
				[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
				(v) => new EmitEvent({
					group: 'eventsTest',
					aggregate: 'a',
					type: 'update',
					seq: v,
					data: {
						value: v,
						filler: new Buffer(1024 * 128)
					}
				}).run(testCtx)
			))
			.then(() => done()).catch(done);
	});

	it('validates paramters', function() {
		assert.throws(
			() => new FetchEvents(),
			/"parameter" is required/
		);

		assert.throws(
			() => new FetchEvents({}),
			/"group" is required/
		);

		assert.throws(
			() => new FetchEvents({ group: 'group' }),
			/"aggregate" is required/
		);

		new FetchEvents({ group: 'group', aggregate: 'a' });
		new FetchEvents({ group: 'group', aggregate: 'a', fromSeq: 4 });
	});

	it('fetch all events with paging', function(done) {
		this.slow(500); // slow because data item is large

		new FetchEvents({
			group: 'eventsTest',
			aggregate: 'a'
		})
			.run(testCtx)
			.then((items) => {
				let i = 0;

				items.map(item => assert.equal(item.data.value, i++));
				assert.equal(i, 11);
			})
			.then(() => done()).catch(done);
	});

	it('fetch all events starting from N', function(done) {
		this.slow(500); // slow because data item is large

		new FetchEvents({
			group: 'eventsTest',
			aggregate: 'a',
			fromSeq: 7
		})
			.run(testCtx)
			.then((items) => {
				let i = 7;

				items.map(item => assert.equal(item.data.value, i++));
				assert.equal(i, 11);
			})
			.then(() => done()).catch(done);
	});

	it('fetch all events starting from N to M', function(done) {
		this.slow(500); // slow because data item is large

		let lo = 2, hi = 7;

		new FetchEvents({
			group: 'eventsTest',
			aggregate: 'a',
			fromSeq: 2,
			toSeq: 7
		})
			.run(testCtx)
			.then((items) => {
				let i = lo;

				items.map(item => assert.equal(item.data.value, i++));
				assert.equal(i, hi + 1);
			})
			.then(() => done()).catch(done);
	});

	it('fetch empty aggregate', function(done) {
		this.slow(500); // slow because data item is large

		new FetchEvents({
			group: 'eventsTest',
			aggregate: 'empty'
		})
			.run(testCtx)
			.then((items) => assert.deepEqual(items, []))
			.then(() => done()).catch(done);
	});

	it('fetch from nonexistent group', function(done) {
		new FetchEvents({
			group: 'non',
			aggregate: 'a'
		}).run(testCtx).catch(() => done());
	});

});
