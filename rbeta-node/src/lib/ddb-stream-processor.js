'use strict';

const reducer = require('./rbeta-reducer-bundle.js').reducer;

// event { Records[{ dynamodb: { NewImage: {} } }] }
exports.handler = (event, context, callback) => {
	// init reducer
	//
	// iterate each event
	// 	for each event
	// 		group events by aggregate
	// 		for each aggregate
	// 			fetch last reduced event
	// 			fetch current state from sink
	// 			if last reduced event < eldest version event,
	// 				gap in events, fetch the missing events
	// 			else if last reduced event > eldest version event,
	// 				staled events, trim the staled the events
	// 			run reduce()
	// 			run pump()
	//
	// error does not stop the entire process, try to process all events
	// errors are however collected and pass to callback as failure
};
