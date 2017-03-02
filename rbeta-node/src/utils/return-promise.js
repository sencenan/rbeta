'use strict';

module.exports = function(v) {
	if (v instanceof Promise) {
		return v;
	} else if (
		v && typeof v.then === 'function' && typeof v.catch === 'function'
	) {
		return new Promise((resolve, reject) => v.then(resolve).catch(reject));
	} else if (v instanceof Error) {
		return new Promise((resolve, reject) => reject(v));
	} else {
		return new Promise(resolve => resolve(v));
	}
};
