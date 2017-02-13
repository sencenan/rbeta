'use strict';

const bluebird = require('bluebird');

describe('last-events', function() {

	before(function(done) {
		// create table with data
		rbeta
			.emit({
				group: 'lastEventTest',
				aggregate: 'a',
				type: 'update',
				seq: 0,
				data: { value: 0 }
			})
			.then(() => bluebird.map(
				[1, 2],
				(v) => rbeta.emit({
					group: 'lastEventTest',
					aggregate: 'a',
					type: 'update',
					seq: v,
					data: { value: v }
				})
			))
			.then(() => done()).catch(done);
	});

	it('fetch empty aggregate', function(done) {
		rbeta
			.lastEvent('lastEventTest', 'empty')
			.then(e => assert.equal(e, undefined))
			.then(() => done()).catch(done);
	});

	it('fetch last event', function(done) {
		rbeta
			.lastEvent('lastEventTest', 'a')
			.then(e => assert.equal(e.data.value, 2))
			.then(() => done()).catch(done);
	});

	it('fetch from nonexistent group', function(done) {
		rbeta.lastEvent('non', 'a').catch(() => done());
	});

});
