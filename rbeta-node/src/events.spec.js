'use strict';

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

	it('dummy test', function() {
		assert.equal(rbeta.events('group', 'a').next().value, 3);
	});

});
