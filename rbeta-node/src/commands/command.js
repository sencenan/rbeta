'use strict';

const
	ST = require('../types/').ST,
	loggerFactory = require('../utils').loggerFactory;

class Command extends ST {

	get log() {
		if (this._logger) {
			return this._logger;
		} else {
			return this._logger = loggerFactory.makeForClass(this.constructor);
		}
	}

	run(context) {
		return Promise.reject(new Command.Error('Not Implemented'));
	}

};

module.exports = Command;
