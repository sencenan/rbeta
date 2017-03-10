'use strict';

const assert = require('assert');

describe('Validating reducer', function() {

	it('reducer', function() {
		assert(bundle.reducer);
		new bundle.rbeta.types.ReducerObj(bundle.reducer);
	});

	it('context aws', function() {
		assert(bundle.context);
		assert(bundle.context.AWS);
	});

	if (global.testData) {

		it('validating test data: at least 3 events and states', function() {
			assert(testData[0]);
			assert(testData[0].length >= 3);
			assert(testData[1]);
			assert(testData[1].length >= 3);
		});

		it('validating test data: same amount of events and states', function() {
			assert.equal(testData[0].length, testData[1].length);
		});

		it('validating test data: same aggregate and group', function() {
			assert.equal(
				Object.keys(
					testData.reduce((m, e) => (m[e.aggregate] = 1, m), {})
				).length,
				1
			);

			assert.equal(
				Object.keys(
					testData.reduce((m, e) => (m[e.group] = 1, m), {})
				).length,
				1
			);
		});

		it('reduce init event', function() {
			assert.deepEqual(
				bundle.reducer.reduce(undefined, testData[0][0]),
				testData[1][0]
			);
		});

		it('reduce all test events', function() {
			assert.deepEqual(
				testData[0].reduce(bundle.reducer.reduce, undefined),
				testData[1][testData[1].length - 1]
			);
		});

		it('reducer purity', function() {
			const
				mid = Math.floor(testData[0].length / 2),
				state = testData[0].slice(0, mid).reduce(
					bundle.reducer.reduce, undefined
				);

			assert.deepEqual(
				bundle.reducer.reduce(state, testData[0][mid]),
				testData[1][mid]
			);
			assert.deepEqual(
				bundle.reducer.reduce(state, testData[0][mid]),
				testData[1][mid]
			);
		});

	}

});
