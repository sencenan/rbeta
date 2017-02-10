'use strict';

describe('Test emit', function() {
	this.slow(150);

	it('test validating event object', function() {
		assert.throws(
			() => rbeta.emit({}),
			/"group" is required/
		);

		assert.throws(
			() => rbeta.emit({ group: '' }),
			/"group" is not allowed to be empty/
		);

		assert.throws(
			() => rbeta.emit({ group: 1 }),
			/"group" must be a string/
		);

		assert.throws(
			() => rbeta.emit({ group: '1' }),
			/"group" length must be at least 3/
		);

		assert.throws(
			() => rbeta.emit({ group: '123' }),
			/"aggregate" is required/
		);

		assert.throws(
			() => rbeta.emit({ group: '123', aggregate: '' }),
			/"aggregate" is not allowed to be empty/
		);

		assert.throws(
			() => rbeta.emit({ group: '123', aggregate: 1 }),
			/"aggregate" must be a string/
		);

		assert.throws(
			() => rbeta.emit({ group: '123', aggregate: '1', type: '1' }),
			/"seq" is required/
		);

		assert.throws(
			() => rbeta.emit(
				{ group: '123', aggregate: '1', type: '1', seq: '' }
			),
			/"seq" must be a number/
		);

		assert.throws(
			() => rbeta.emit(
				{ group: '123', aggregate: '1', type: '1', seq: -1 }
			),
			/"seq" must be greater than -1/
		);

		assert.throws(
			() => rbeta.emit({ group: '123', seq: 0, aggregate: '1' }),
			/"type" is required/
		);

		assert.throws(
			() => rbeta.emit({ group: '123', seq: 0, aggregate: '1', type: '' }),
			/"type" is not allowed to be empty/
		);

		assert.throws(
			() => rbeta.emit({ group: '123', seq: 0, aggregate: '1', type: 1 }),
			/"type" must be a string/
		);

		assert.throws(
			() => rbeta.emit(
				{ group: '123', aggregate: '1', type: '1', seq: 0, foo: { r: 1 } }
			),
			/"foo" is not allowed/
		);

		assert.throws(
			() => rbeta.emit(
				{
					group: '123', aggregate: '1', type: '1', seq: 0, foo: { r: 1 },
					timestamp: 123
				}
			),
			/"timestamp" is not allowed/
		);
	});

	it('test creating group if does not exist', function(done) {
		const ddb = new AWS.DynamoDB();

		ddb.describeTable(
			{ TableName: rbeta.tableName.fromGroup('123') },
			(err, data) => {
				assert.equal(err.code, 'ResourceNotFoundException');

				rbeta
					.emit({
						group: '123',
						aggregate: '1',
						type: '1',
						seq: 0,
						data: { r: 1 }
					})
					.then((data) => {
						ddb.describeTable(
							{ TableName: rbeta.tableName.fromGroup('123') },
							(err, data) => {
								assert(data.Table.StreamSpecification.StreamEnabled);
								assert.equal(
									data.Table.StreamSpecification.StreamViewType,
									'NEW_IMAGE'
								);

								done(err);
							}
						);
					})
					.catch(done);
			}
		);
	});

	it('test not allow emitting event of duplicated event', function(done) {
		rbeta
			.emit({
				group: 'group1',
				aggregate: '1',
				type: '1',
				seq: 0
			})
			.then(
				() => rbeta.emit({
					group: 'group1',
					aggregate: '1',
					type: '2',
					seq: 0
				})
			)
			.then(() => done(new Error('error exepected')))
			.catch((err) => {
				assert.equal(err.code, 'ConditionalCheckFailedException');
				done();
			});
	});

	it('test emitting events', function(done) {
		rbeta
			.emit({
				group: 'group2',
				aggregate: '1',
				type: '1',
				seq: 0
			})
			.then(
				() => rbeta.emit({
					group: 'group2',
					aggregate: '1',
					type: '2',
					seq: 1
				})
			)
			.then(() => done())
			.catch(done);
	});

});
