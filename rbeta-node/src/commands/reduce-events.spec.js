'use strict';

const
	EmitEvent = require('./emit-event'),
	ReduceEvents = require('./reduce-events');

describe('reduce event streams', function() {

	const
		db = {},
		mockReducer = {
			name: 'mock-reducer',
			persist: (state) => {},
			state: (aggregate) => db[aggregate],
			reduce: (state, event) => {}
		},
		group = 'reduceEventsTest',
		testCtx = {
			AWS: AWS,
			namespace: 'test'
		};

	before(function(done) {
		// create table with data
		new EmitEvent({
				group: group,
				aggregate: 'a',
				type: 'update',
				seq: 0,
				data: { value: 0 }
			})
			.run(testCtx)
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

		new ReduceEvents({
			reducer: mockReducer,
			events: []
		});
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
					seq: 0
				}
			]
		});
	});

	it('reduce events', (cb) => {
		new ReduceEvents({
			reducer: mockReducer,
			events: []
		})
			.run(testCtx)
			.then(data => {
				assert.deepEqual(data, []);
				cb();
			})
			.catch(cb)
	});

	it('reduce events', (cb) => {
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
					seq: 0
				}
			]
		})
			.run(testCtx)
			.then((data) => {
				cb();
			})
			.catch(cb);
	});

});
