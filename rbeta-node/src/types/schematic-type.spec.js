'use strict';

const
	assert = require('assert');

describe('Type SchematicType', function() {

	const ST = require('./schematic-type');

	class T extends ST {

		static get schema() {
			return ST.joi.object({
				x: ST.joi.number(),
				g: ST.joi.st().type(G).required()
			});
		}

		bar() {
			return (this.x || 0) + 1;
		}

	};

	class G extends T {

		static get schema() {
			return ST.joi.object({
				value: ST.joi.number().required().label('G.value'),
				child: ST.joi.st(G).optional(),
				children: ST.joi.array().optional().items(
					ST.joi.st(G), ST.joi.st(T)
				)
			});
		}

		foo() {
			return this.value * 2;
		}

	};

	class V extends ST.SV {

		static get schema() {
			return ST.joi.string().required();
		}

	};

	class N extends ST.SV {

		static get schema() {
			return ST.joi.number().required();
		}

	};

	it('default to joi.any()', function() {
		const schema = ST.joi.any();

		class A extends ST { static get schema() { return schema; } };

		assert.deepEqual(A.schema, ST.schema);
	});

	it('create value based ST', function() {
		const v = new V('v');

		assert.throws(() => new V(1), /must be a string/);
		assert.throws(() => new V(), /is required/);
		assert.throws(() => new V({}), /must be a string/);
		assert.equal(v.value, 'v');
		assert(v instanceof ST.SV);
		assert(v instanceof ST);
	});

	it('creation by schema, recusive creation by schema', function() {
		var t = new T(
			{
				x: -1,
				g: {
					value: 1,
					child: { value: 2 },
					children: [
						{ value: 4 },
						{
							x: 3,
							g: { value: 3 }
						}
					]
				}
			}
		);

		assert(t.g.children[0] instanceof G);
		assert(t.g.children[1] instanceof T);
		assert(t.g.child instanceof G);
		assert(t.g instanceof G);
		assert(t instanceof T);

		assert.equal(t.g.foo(), 2);
		assert.equal(t.g.child.foo(), 4);
		assert.equal(t.g.children[0].foo(), 8);
		assert.equal(t.g.children[0].bar(), 1);
		assert.equal(t.g.children[1].g.foo(), 6);
		assert.equal(t.g.children[1].bar(), 4);
	});

	it('schema are not inherited', function() {
		var
			g = new G({ value: 3 }), // ok
			t = new T({ x: 1, g: { value: 2} }); // ok

		assert(g instanceof G); // verify inheritance
		assert(g instanceof T);
		assert(t instanceof T);

		assert.throws( // schema are not inhertied
			() => new G({ x: 1, value: 3 }),
			/"x" is not allowed/
		);
	});

	it('supports pojo/type duality', function() {
		var
			t1 = new T({
				g: { value: 1}
			}),
			t2 = new T({
				g: new G({value: 1})
			});

		assert(t1.g instanceof G);
		assert(t2.g instanceof G);
		assert.deepEqual(t1, t2);
	});

	it('only 1st parameter is used to initialize object', function() {
		let t = new T({
			x: 1,
			g: { value: 1 }
		}, {
			additional: 'x'
		});

		assert.equal(t.additional, undefined);

		assert.throws(
			() => new T({ x: 1 }, { g: { value: 1 } }),
			/"g" is required/
		);
	});

	it('create many empty list', function() {
		assert.deepEqual(G.many([]), []);
		assert.deepEqual(G.manyWithNulls([]), []);
	});

	it('create many', function() {
		assert.deepEqual(
			G.many([{ value: 1 }, { value: 2 }, { value: 3 }]),
			[new G({ value: 1 }), new G({ value: 2 }), new G({ value: 3 })]
		);
	});

	it('create many fails with nulls ', function() {
		assert.throws(
			() => G.many([{ value: 1 }, null, { value: 3 }]),
			/"value" must be an object/
		);
	});

	it('create many with nulls', function() {
		assert.deepEqual(
			G.manyWithNulls([
				null, { value: 1 }, { value: 2 },
				undefined, { value: 3 }
			]),
			[
				null, new G({ value: 1 }), new G({ value: 2 }),
				undefined, new G({ value: 3 })
			]
		);
	});

	it('with extra schema', function() {
		assert.throws(
			() => ST.joi.attempt(
				new G({
					value: 1,
					child: {
						value: 1
					}
				}),
				ST.joi.st(G).extra(
					ST.joi.object({
						value: ST.joi.number().min(2)
					}).unknown(true)
				)
			),
			/"value" must be larger than or equal to 2/
		);

		var
			g1 = new G({
				value: 3,
				child: {
					value: 1
				}
			}),
			g2 = ST.joi.attempt(
				g1,
				ST.joi.st(G).extra(
					ST.joi.object({
						value: ST.joi.number().min(2)
					}).unknown(true)
				)
			);

		assert(g2 instanceof G); // does not change the type
	});

	it('validation for first element of array', function() {
		assert.throws(
			() => ST.joi.attempt(
				[],
				ST.joi.array().first()
			),
			/"schema" is required/
		);

		assert.throws(
			() => ST.joi.attempt(
				[],
				ST.joi.array().first(ST.joi.any().required())
			),
			/"value" is required/
		);

		assert.throws(
			() => ST.joi.attempt(
				[1, 1, 1],
				ST.joi.array().first(ST.joi.number().min(3))
			),
			/"value" must be larger than or equal to 3/
		);

		assert.deepEqual(
			ST.joi.attempt(
				[3, 1, 1],
				ST.joi.array().first(ST.joi.number().min(3))
			),
			[3, 1, 1]
		);
	});

	it('ST throw ST Error types ', function() {
		try {
			new G({ x: 1, value: 3 })
		} catch(ex) {
			assert(ex instanceof G.Error);
			assert(G.Error === G.Error);
			assert(T.Error);
			assert(G.Error !== T.Error);
			assert(ex.type === G);
			assert(ex.wrappedError.isJoi);
		}
	});

	it('ST instance schema', function() {
		class NGram extends ST {

			get schema() {
				return ST.joi.object().keys({
					n: ST.joi.number().integer(),
					v: ST.joi.string().min(this.n).max(this.n).required()
				});
			}

		};

		assert.throws(
			() => new NGram({ v: 'abc', n: 1 }),
			/"v" length must be less than or equal to 1 characters long/
		);

		new NGram({ v: 'abc', n: 3 });
	});

	it('ST to primitive', function() {
		class H extends ST {

			static get schema() {
				return ST.joi.object().keys({
					g: ST.joi.st(G).required(),
					v: ST.joi.st(V).required(),
					n: ST.joi.st(N).required(),
					m: ST.joi.object().keys({
						g: ST.joi.st(G).required(),
						n: ST.joi.st(N).required()
					}).required()
				}).unknown(true);
			}

		};

		const b = new Buffer('buffer');

		assert.deepEqual(
			new H({
				g: { value: 3 },
				v: 'p',
				n: 2,
				m: {
					g: { value: 3 },
					n: 3
				},
				b: b
			}).toPrimitive(),
			{
				g: { value: 3 },
				v: 'p',
				n: 2,
				m: {
					g: { value: 3 },
					n: 3
				},
				b: b
			}
		);
	});

	it('ST to JSON', function() {
		class H extends ST {

			static get schema() {
				return ST.joi.object().keys({
					g: ST.joi.st(G).required(),
					v: ST.joi.st(V).required(),
					n: ST.joi.st(N).required(),
					m: ST.joi.object().keys({
						g: ST.joi.st(G).required(),
						n: ST.joi.st(N).required()
					}).required()
				}).unknown(true);
			}

		};

		const b = new Buffer('buffer');

		assert.deepEqual(
			JSON.stringify(
				new H({
					g: { value: 3 },
					v: 'p',
					n: 2,
					m: {
						g: { value: 3 },
						n: 3
					},
					b: b
				})
			),
			JSON.stringify(
				{
					g: { value: 3 },
					v: 'p',
					n: 2,
					m: {
						g: { value: 3 },
						n: 3
					},
					b: b
				}
			)
		);
	});

});
