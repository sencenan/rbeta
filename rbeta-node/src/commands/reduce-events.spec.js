'use strict';

const ReduceEvents = require('./reduce-events');

describe('reduce event streams', function() {

	const mockReducer = {
		name: 'mock-reducer',
		persist: (state) => {},
		state: (aggregate) => {},
		reduce: (state, event) => {}
	};

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
				group: 'eventsTest',
				aggregate: 'a',
				type: 'update',
				seq: 0
			}]
		});
	});

	it('enforce events are in the same aggregate', () => {
		assert.throws(() => new ReduceEvents({
			reducer: mockReducer,
			events: [
				{
					group: 'eventsTest',
					aggregate: 'a',
					type: 'update',
					seq: 0
				},
				{
					group: 'eventsTest',
					aggregate: 'b',
					type: 'update',
					seq: 0
				}
			]
		}), /All Events must belong to the same aggregate/);
	});

});
