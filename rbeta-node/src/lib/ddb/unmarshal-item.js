'use strict';

const AWS = require('aws-sdk');

module.exports = function(ddbItem) {
	const docCli = new AWS.DynamoDB.DocumentClient();

	return docCli.getTranslator().translateOutput(
		{ Item: ddbItem },
		docCli.service.api.operations.getItem.output
	).Item;
};
