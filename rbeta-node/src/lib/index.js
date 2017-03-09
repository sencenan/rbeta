'use strict';

module.exports = {
	ddb: {
		createStreamProcessor: require('./ddb/create-stream-processor'),
		groupEvents: require('./ddb/group-events'),
		unmarshalItem: require('./ddb/unmarshal-item')
	},
	createContext: require('./create-context')
};
