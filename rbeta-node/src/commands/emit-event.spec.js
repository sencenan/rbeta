'use strict';

const EmitEvent = require('./emit-event');

describe('emit event', function() {

	const testCtx = {
		AWS: AWS,
		namespace: 'test'
	};

	it('validates event object', function() {
		assert.throws(
			() => new EmitEvent(),
			/"event" is required/
		);

		assert.throws(
			() => new EmitEvent({ group: '' }),
			/"GroupName" is not allowed to be empty/
		);

		assert.throws(
			() => new EmitEvent({ group: 1 }),
			/"GroupName" must be a string/
		);

		assert.throws(
			() => new EmitEvent({ group: '1' }),
			/"GroupName" length must be at least 3/
		);

		assert.throws(
			() => new EmitEvent({ group: '123' }),
			/"aggregate" is required/
		);

		assert.throws(
			() => new EmitEvent({ group: '123', aggregate: '' }),
			/"aggregate" is not allowed to be empty/
		);

		assert.throws(
			() => new EmitEvent({ group: '123', aggregate: 1 }),
			/"aggregate" must be a string/
		);

		assert.throws(
			() => new EmitEvent({ group: '123', aggregate: '1', type: '1' }),
			/"seq" is required/
		);

		assert.throws(
			() => new EmitEvent(
				{ group: '123', aggregate: '1', type: '1', seq: '' }
			),
			/"seq" must be a number/
		);

		assert.throws(
			() => new EmitEvent(
				{ group: '123', aggregate: '1', type: '1', seq: -1 }
			),
			/"seq" must be greater than -1/
		);

		assert.throws(
			() => new EmitEvent(
				{ group: '123', aggregate: '1', type: '1', seq: 1.2 }
			),
			/"seq" must be an integer/
		);

		assert.throws(
			() => new EmitEvent({ group: '123', seq: 0, aggregate: '1' }),
			/"type" is required/
		);

		assert.throws(
			() => new EmitEvent({ group: '123', seq: 0, aggregate: '1', type: '' }),
			/"type" is not allowed to be empty/
		);

		assert.throws(
			() => new EmitEvent({ group: '123', seq: 0, aggregate: '1', type: 1 }),
			/"type" must be a string/
		);

		assert.throws(
			() => new EmitEvent(
				{ group: '123', aggregate: '1', type: '1', seq: 0, foo: { r: 1 } }
			),
			/"foo" is not allowed/
		);

		assert.throws(
			() => new EmitEvent(
				{
					group: '123', aggregate: '1', type: '1', seq: 0, foo: { r: 1 },
					timestamp: 123
				}
			),
			/"timestamp" is not allowed/
		);
	});

	it('creates group if does not exist', function(done) {
		this.slow(2000); // slow because it waits for table creation

		const
			ddb = new AWS.DynamoDB(),
			tableName = 'rbeta_test_ddb_emitTest';

		ddb.describeTable(
			{ TableName: tableName },
			(err, data) => {
				assert.equal(err.code, 'ResourceNotFoundException');

				new EmitEvent({
						group: 'emitTest',
						aggregate: '1',
						type: '1',
						seq: 0,
						data: { r: 1 }
					})
					.run(testCtx)
					.then((data) => {
						ddb.describeTable(
							{ TableName: tableName },
							(err, data) => {
								assert(data.Table.StreamSpecification.StreamEnabled);
								assert.equal(
									data.Table.StreamSpecification.StreamViewType,
									'NEW_IMAGE'
								);

								// check that tracking table is created
								ddb.describeTable(
									{ TableName: tableName },
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
		new EmitEvent({
				group: 'emitTest',
				aggregate: 'test1',
				type: '1',
				seq: 0
			})
			.run(testCtx)
			.then(
				() => new EmitEvent({
					group: 'emitTest',
					aggregate: 'test1',
					type: '2',
					seq: 0
				}).run(testCtx)
			)
			.catch((err) => {
				assert.equal(err.code, 'ConditionalCheckFailedException');
				done();
			});
	});

	it('test emitting events', function(done) {
		new EmitEvent({
				group: 'emitTest',
				aggregate: 'test2',
				type: '1',
				seq: 0
			})
			.run(testCtx)
			.then(
				() => new EmitEvent({
					group: 'emitTest',
					aggregate: 'test2',
					type: '2',
					seq: 1
				}).run(testCtx)
			)
			.then(() => done()).catch(done);
	});

});
