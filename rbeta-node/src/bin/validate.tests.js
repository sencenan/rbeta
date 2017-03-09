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

});
