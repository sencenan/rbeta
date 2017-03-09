'use strict';

const
	createContext = require('./create-context');

describe('creation of execution context', function() {

	const
		reducer1 = {
			name: 'reducer1',
			persist: () => {},
			state: () => {},
			reduce: () => {}
		},
		mockAWS = {},
		reducer2 = {
			name: 'reducer2',
			aws: () => mockAWS,
			persist: () => {},
			state: () => {},
			reduce: () => {}
		};

	it('validating parameters', () => {
		assert.throws(
			() => createContext(),
			/"namespace" is required/
		);

		assert.throws(
			() => createContext(reducer1),
			/"namespace" is required/
		);

		process.env.RBETA_NAMESPACE = 'ns';
		assert.throws(
			() => createContext(),
			/"reducer" is required/
		);
		delete process.env.RBETA_NAMESPACE;

		process.env.RBETA_NAMESPACE = 'ns';
		assert.throws(
			() => createContext(),
			/"reducer" is required/
		);
		delete process.env.RBETA_NAMESPACE;

		process.env.RBETA_NAMESPACE = 'ns';
		createContext(reducer1);
		delete process.env.RBETA_NAMESPACE;
	});

	it('acquire namespace from env', () => {
		process.env.RBETA_NAMESPACE = 'ns321';
		assert.equal(
			createContext(reducer1).namespace, process.env.RBETA_NAMESPACE
		);
		delete process.env.RBETA_NAMESPACE;
	});

	it('get AWS through require', () => {
		process.env.RBETA_NAMESPACE = 'ns_789';
		assert.equal(
			createContext(reducer1).AWS, AWS
		);
		delete process.env.RBETA_NAMESPACE;
	});

	it('get AWS from reducer', () => {
		process.env.RBETA_NAMESPACE = 'ns_890';
		assert.equal(
			createContext(reducer2).AWS, mockAWS
		);
		delete process.env.RBETA_NAMESPACE;
	});

});
