'use strict';

describe('emit', function() {
	this.slow(150);

	it('validates event object', function() {
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
			() => rbeta.emit(
				{ group: '123', aggregate: '1', type: '1', seq: 1.2 }
			),
			/"seq" must be an integer/
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

	it.only('creates group if does not exist', function(done) {
		this.slow(2000); // slow because it waits for table creation

		const ddb = new AWS.DynamoDB();

		ddb.describeTable(
			{ TableName: rbeta.tableName.fromGroup('emitTest') },
			(err, data) => {
				assert.equal(err.code, 'ResourceNotFoundException');

				rbeta
					.emit({
						group: 'emitTest',
						aggregate: '1',
						type: '1',
						seq: 0,
						data: { r: 1 }
					})
					.then((data) => {
						ddb.describeTable(
							{ TableName: rbeta.tableName.fromGroup('emitTest') },
							(err, data) => {
								assert(data.Table.StreamSpecification.StreamEnabled);
								assert.equal(
									data.Table.StreamSpecification.StreamViewType,
									'NEW_IMAGE'
								);

								// check that tracking table is created
								ddb.describeTable(
									{
										TableName: rbeta.tableName.trackingName(
											rbeta.tableName.fromGroup('emitTest')
										)
									},
									(err, data) => {
										assert(data);
										done(err);
									}
								);
							}
						);
					})
					.catch(done);
			}
		);
	});

	it('does not allow emitting event of duplicated event', function(done) {
		rbeta
			.emit({
				group: 'emitTest',
				aggregate: 'test1',
				type: '1',
				seq: 0
			})
			.then(
				() => rbeta.emit({
					group: 'emitTest',
					aggregate: 'test1',
					type: '2',
					seq: 0
				})
			)
			.catch((err) => {
				assert.equal(err.code, 'ConditionalCheckFailedException');
				done();
			});
	});

	it('test emitting events', function(done) {
		rbeta
			.emit({
				group: 'emitTest',
				aggregate: 'test2',
				type: '1',
				seq: 0
			})
			.then(
				() => rbeta.emit({
					group: 'emitTest',
					aggregate: 'test2',
					type: '2',
					seq: 1
				})
			)
			.then(() => done())
			.catch(done);
	});

});
