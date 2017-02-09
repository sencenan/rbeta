'use strict';

const
	AWS = require('aws-sdk'),

	ddbLocal = require('local-dynamo');

const
	assertOnce = function(fn) {
		let isCalled = false;

		return function(cb) {
			if (isCalled) {
				throw new Error('Should only call once: ' + fn.toString());
			} else {
				// call orginal function
				fn.apply(this, arguments);
				isCalled = true;
			}
		};
	},
	randomPort = function() {
		return Math.floor(Math.random() * (10000 - 4000 + 1)) + 4000;
	},
	ddbPort = randomPort();

var ddbLocalCP;

before(assertOnce(function(cb) {
	this.timeout(5000);

	AWS.config.update({
		region: 'us-east-1',
		endpoint: 'http://localhost:' + ddbPort,

		credentials: new AWS.Credentials({
			accessKeyId: '',
			secretAccessKey: ''
		})
	});

	ddbLocalCP = ddbLocal.launch(null, ddbPort);

	// give time to start local dynamodb
	setTimeout(cb, 1000);
}));

process.on('exit', function() {
	if (ddbLocalCP) {
		ddbLocalCP.kill();
		ddbLocalCP = null;
	}
});

global.assert = require('assert');
global.rbeta = require('../');
global.AWS = AWS;
