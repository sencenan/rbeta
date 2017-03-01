'use strict';

module.exports = function(ctx, ddbItem) {
	const docCli = new ctx.AWS.DynamoDB.DocumentClient();

	return docCli.getTranslator().translateOutput(
		{ Item: ddbItem },
		docCli.service.api.operations.getItem.output
	).Item;
};
