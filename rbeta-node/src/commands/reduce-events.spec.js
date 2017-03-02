'use strict';

const
	bluebird = require('bluebird'),
	EmitEvent = require('./emit-event'),
	ReduceEvents = require('./reduce-events'),
	FetchLastReduction = require('./fetch-last-reduction');

describe('reduce event streams', function() {

	const
		db = {},
		mockReducer = {
			name: 'mock-reducer',
			persist: (group, aggregate, state) => db[aggregate] = state,
			state: (aggregate) => db[aggregate],
			reduce: (state, event) => ({
				value: (state ? state.value : 0) + event.data.value
			})
		},
		group = 'reduceEventsTest',
		testCtx = {
			AWS: AWS,
			namespace: 'test'
		},
		mkEvent = seq => ({
			group: group,
			aggregate: 'a',
			type: 'update',
			seq: seq,
			data: { value: seq + 1 }
		}),
		checkValue = seq => (seq + 2) * (seq + 1) / 2;

	before(function(done) {
		// create table with data
		new EmitEvent(mkEvent(0))
			.run(testCtx)
			.then(() => bluebird.map(
				[1, 2, 3, 4, 5, 6, 7, 8, 9],
				(v) => new EmitEvent(mkEvent(v)).run(testCtx)
			))
			.then(() => done()).catch(done);
	});

	it('validate parameters', () => {
		assert.throws(() => new ReduceEvents(), /"parameter" is required/);
		assert.throws(() => new ReduceEvents({}), /"reducer" is required/);
		assert.throws(() => new ReduceEvents({
			reducer: {}
		}), /must conform to schema of type ReducerObj/);
		assert.throws(() => new ReduceEvents({
			reducer: mockReducer
		}), /"events" is required/);
		assert.throws(() => new ReduceEvents({
			reducer: mockReducer,
			events: [{}]
		}), /conform to schema of type NewEvent/);
		assert.throws(() => new ReduceEvents({
			reducer: mockReducer,
			events: []
		}), /no events to be reduced/);

		new ReduceEvents({
			reducer: mockReducer,
			events: [{
				group: group,
				aggregate: 'a',
				type: 'update',
				seq: 0
			}]
		});
	});

	it('enforce events are in the same aggregate and group', () => {
		assert.throws(() => new ReduceEvents({
			reducer: mockReducer,
			events: [
				{
					group: group,
					aggregate: 'a',
					type: 'update',
					seq: 0
				},
				{
					group: group,
					aggregate: 'b',
					type: 'update',
					seq: 0
				}
			]
		}), /Events must have the same aggregate and group/);

		assert.throws(() => new ReduceEvents({
			reducer: mockReducer,
			events: [
				{
					group: group,
					aggregate: 'a',
					type: 'update',
					seq: 0
				},
				{
					group: group + 'x',
					aggregate: 'a',
					type: 'update',
					seq: 0
				}
			]
		}), /Events must have the same aggregate and group/);

		assert.throws(() => new ReduceEvents({
			reducer: mockReducer,
			events: [
				{
					group: group,
					aggregate: 'a',
					type: 'update',
					seq: 0
				},
				{
					group: group + 'x',
					aggregate: 'b',
					type: 'update',
					seq: 0
				}
			]
		}), /Events must have the same aggregate and group/);

		assert.throws(() => new ReduceEvents({
			reducer: mockReducer,
			events: [
				{
					group: group,
					aggregate: 'a',
					type: 'update',
					seq: 0
				},
				{
					group: group,
					aggregate: 'a',
					type: 'update',
					seq: 0
				}
			]
		}), /Events must have unique seq value/);

		new ReduceEvents({
			reducer: mockReducer,
			events: [
				{
					group: group,
					aggregate: 'a',
					type: 'update',
					seq: 0
				},
				{
					group: group,
					aggregate: 'a',
					type: 'update',
					seq: 1
				}
			]
		});

		// sparse seq is allowed
		new ReduceEvents({
			reducer: mockReducer,
			events: [
				{
					group: group,
					aggregate: 'a',
					type: 'update',
					seq: 0
				},
				{
					group: group,
					aggregate: 'a',
					type: 'update',
					seq: 10
				}
			]
		});
	});

	it('reduce for non existent group', (cb) => {
		new ReduceEvents({
			reducer: mockReducer,
			events: [ {
				group: 'foo',
				aggregate: 'a',
				type: 'update',
				seq: 0
			} ]
		})
			.run(testCtx)
			.catch(() => cb());
	});

	it('reduce events', (cb) => {
		new ReduceEvents({
			reducer: mockReducer,
			events: [ mkEvent(0), mkEvent(1) ]
		})
			.run(testCtx)
			.then(data => assert.equal(data.value, checkValue(1)))
			.then(
				() => new FetchLastReduction({
					group: group,
					reducerName: 'mock-reducer',
					aggregate: 'a'
				}).run(testCtx).then(e => assert.deepEqual(e, mkEvent(1)))
			)
			.then(() => assert.equal(mockReducer.state('a').value, checkValue(1)))
			.then(
				// gaps in events
				() => new ReduceEvents({
					reducer: mockReducer,
					events: [ mkEvent(3), mkEvent(4), mkEvent(5) ]
				}).run(testCtx)
			)
			.then(data => assert.equal(data.value, checkValue(5)))
			.then(() => assert.equal(mockReducer.state('a').value, checkValue(5)))
			.then(
				// stale events
				() => new ReduceEvents({
					reducer: mockReducer,
					events: [ mkEvent(4), mkEvent(5), mkEvent(6), mkEvent(7) ]
				}).run(testCtx)
			)
			.then(data => assert.equal(data.value, checkValue(7)))
			.then(() => assert.equal(mockReducer.state('a').value, checkValue(7)))
			.then(
				// entirely staled events
				() => new ReduceEvents({
					reducer: mockReducer,
					events: [ mkEvent(4), mkEvent(5), mkEvent(6), mkEvent(7) ]
				}).run(testCtx)
			)
			.catch(err => assert.equal(err, ReduceEvents.ERROR_NO_OP))
			.then(() => assert.equal(mockReducer.state('a').value, checkValue(7)))
			.then(() => cb()).catch(cb);
	});

});
