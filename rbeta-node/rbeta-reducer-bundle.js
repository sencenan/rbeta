(function(e, a) { for(var i in a) e[i] = a[i]; }(this, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 98);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var es5 = __webpack_require__(7);
var canEvaluate = typeof navigator == "undefined";

var errorObj = {e: {}};
var tryCatchTarget;
var globalObject = typeof self !== "undefined" ? self :
    typeof window !== "undefined" ? window :
    typeof global !== "undefined" ? global :
    this !== undefined ? this : null;

function tryCatcher() {
    try {
        var target = tryCatchTarget;
        tryCatchTarget = null;
        return target.apply(this, arguments);
    } catch (e) {
        errorObj.e = e;
        return errorObj;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}

var inherits = function(Child, Parent) {
    var hasProp = {}.hasOwnProperty;

    function T() {
        this.constructor = Child;
        this.constructor$ = Parent;
        for (var propertyName in Parent.prototype) {
            if (hasProp.call(Parent.prototype, propertyName) &&
                propertyName.charAt(propertyName.length-1) !== "$"
           ) {
                this[propertyName + "$"] = Parent.prototype[propertyName];
            }
        }
    }
    T.prototype = Parent.prototype;
    Child.prototype = new T();
    return Child.prototype;
};


function isPrimitive(val) {
    return val == null || val === true || val === false ||
        typeof val === "string" || typeof val === "number";

}

function isObject(value) {
    return typeof value === "function" ||
           typeof value === "object" && value !== null;
}

function maybeWrapAsError(maybeError) {
    if (!isPrimitive(maybeError)) return maybeError;

    return new Error(safeToString(maybeError));
}

function withAppended(target, appendee) {
    var len = target.length;
    var ret = new Array(len + 1);
    var i;
    for (i = 0; i < len; ++i) {
        ret[i] = target[i];
    }
    ret[i] = appendee;
    return ret;
}

function getDataPropertyOrDefault(obj, key, defaultValue) {
    if (es5.isES5) {
        var desc = Object.getOwnPropertyDescriptor(obj, key);

        if (desc != null) {
            return desc.get == null && desc.set == null
                    ? desc.value
                    : defaultValue;
        }
    } else {
        return {}.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
    }
}

function notEnumerableProp(obj, name, value) {
    if (isPrimitive(obj)) return obj;
    var descriptor = {
        value: value,
        configurable: true,
        enumerable: false,
        writable: true
    };
    es5.defineProperty(obj, name, descriptor);
    return obj;
}

function thrower(r) {
    throw r;
}

var inheritedDataKeys = (function() {
    var excludedPrototypes = [
        Array.prototype,
        Object.prototype,
        Function.prototype
    ];

    var isExcludedProto = function(val) {
        for (var i = 0; i < excludedPrototypes.length; ++i) {
            if (excludedPrototypes[i] === val) {
                return true;
            }
        }
        return false;
    };

    if (es5.isES5) {
        var getKeys = Object.getOwnPropertyNames;
        return function(obj) {
            var ret = [];
            var visitedKeys = Object.create(null);
            while (obj != null && !isExcludedProto(obj)) {
                var keys;
                try {
                    keys = getKeys(obj);
                } catch (e) {
                    return ret;
                }
                for (var i = 0; i < keys.length; ++i) {
                    var key = keys[i];
                    if (visitedKeys[key]) continue;
                    visitedKeys[key] = true;
                    var desc = Object.getOwnPropertyDescriptor(obj, key);
                    if (desc != null && desc.get == null && desc.set == null) {
                        ret.push(key);
                    }
                }
                obj = es5.getPrototypeOf(obj);
            }
            return ret;
        };
    } else {
        var hasProp = {}.hasOwnProperty;
        return function(obj) {
            if (isExcludedProto(obj)) return [];
            var ret = [];

            /*jshint forin:false */
            enumeration: for (var key in obj) {
                if (hasProp.call(obj, key)) {
                    ret.push(key);
                } else {
                    for (var i = 0; i < excludedPrototypes.length; ++i) {
                        if (hasProp.call(excludedPrototypes[i], key)) {
                            continue enumeration;
                        }
                    }
                    ret.push(key);
                }
            }
            return ret;
        };
    }

})();

var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
function isClass(fn) {
    try {
        if (typeof fn === "function") {
            var keys = es5.names(fn.prototype);

            var hasMethods = es5.isES5 && keys.length > 1;
            var hasMethodsOtherThanConstructor = keys.length > 0 &&
                !(keys.length === 1 && keys[0] === "constructor");
            var hasThisAssignmentAndStaticMethods =
                thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;

            if (hasMethods || hasMethodsOtherThanConstructor ||
                hasThisAssignmentAndStaticMethods) {
                return true;
            }
        }
        return false;
    } catch (e) {
        return false;
    }
}

function toFastProperties(obj) {
    /*jshint -W027,-W055,-W031*/
    function FakeConstructor() {}
    FakeConstructor.prototype = obj;
    var l = 8;
    while (l--) new FakeConstructor();
    return obj;
    eval(obj);
}

var rident = /^[a-z$_][a-z$_0-9]*$/i;
function isIdentifier(str) {
    return rident.test(str);
}

function filledRange(count, prefix, suffix) {
    var ret = new Array(count);
    for(var i = 0; i < count; ++i) {
        ret[i] = prefix + i + suffix;
    }
    return ret;
}

function safeToString(obj) {
    try {
        return obj + "";
    } catch (e) {
        return "[no string representation]";
    }
}

function isError(obj) {
    return obj !== null &&
           typeof obj === "object" &&
           typeof obj.message === "string" &&
           typeof obj.name === "string";
}

function markAsOriginatingFromRejection(e) {
    try {
        notEnumerableProp(e, "isOperational", true);
    }
    catch(ignore) {}
}

function originatesFromRejection(e) {
    if (e == null) return false;
    return ((e instanceof Error["__BluebirdErrorTypes__"].OperationalError) ||
        e["isOperational"] === true);
}

function canAttachTrace(obj) {
    return isError(obj) && es5.propertyIsWritable(obj, "stack");
}

var ensureErrorObject = (function() {
    if (!("stack" in new Error())) {
        return function(value) {
            if (canAttachTrace(value)) return value;
            try {throw new Error(safeToString(value));}
            catch(err) {return err;}
        };
    } else {
        return function(value) {
            if (canAttachTrace(value)) return value;
            return new Error(safeToString(value));
        };
    }
})();

function classString(obj) {
    return {}.toString.call(obj);
}

function copyDescriptors(from, to, filter) {
    var keys = es5.names(from);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if (filter(key)) {
            try {
                es5.defineProperty(to, key, es5.getDescriptor(from, key));
            } catch (ignore) {}
        }
    }
}

var asArray = function(v) {
    if (es5.isArray(v)) {
        return v;
    }
    return null;
};

if (typeof Symbol !== "undefined" && Symbol.iterator) {
    var ArrayFrom = typeof Array.from === "function" ? function(v) {
        return Array.from(v);
    } : function(v) {
        var ret = [];
        var it = v[Symbol.iterator]();
        var itResult;
        while (!((itResult = it.next()).done)) {
            ret.push(itResult.value);
        }
        return ret;
    };

    asArray = function(v) {
        if (es5.isArray(v)) {
            return v;
        } else if (v != null && typeof v[Symbol.iterator] === "function") {
            return ArrayFrom(v);
        }
        return null;
    };
}

var isNode = typeof process !== "undefined" &&
        classString(process).toLowerCase() === "[object process]";

var hasEnvVariables = typeof process !== "undefined" &&
    typeof process.env !== "undefined";

function env(key) {
    return hasEnvVariables ? process.env[key] : undefined;
}

function getNativePromise() {
    if (typeof Promise === "function") {
        try {
            var promise = new Promise(function(){});
            if ({}.toString.call(promise) === "[object Promise]") {
                return Promise;
            }
        } catch (e) {}
    }
}

function domainBind(self, cb) {
    return self.bind(cb);
}

var ret = {
    isClass: isClass,
    isIdentifier: isIdentifier,
    inheritedDataKeys: inheritedDataKeys,
    getDataPropertyOrDefault: getDataPropertyOrDefault,
    thrower: thrower,
    isArray: es5.isArray,
    asArray: asArray,
    notEnumerableProp: notEnumerableProp,
    isPrimitive: isPrimitive,
    isObject: isObject,
    isError: isError,
    canEvaluate: canEvaluate,
    errorObj: errorObj,
    tryCatch: tryCatch,
    inherits: inherits,
    withAppended: withAppended,
    maybeWrapAsError: maybeWrapAsError,
    toFastProperties: toFastProperties,
    filledRange: filledRange,
    toString: safeToString,
    canAttachTrace: canAttachTrace,
    ensureErrorObject: ensureErrorObject,
    originatesFromRejection: originatesFromRejection,
    markAsOriginatingFromRejection: markAsOriginatingFromRejection,
    classString: classString,
    copyDescriptors: copyDescriptors,
    hasDevTools: typeof chrome !== "undefined" && chrome &&
                 typeof chrome.loadTimes === "function",
    isNode: isNode,
    hasEnvVariables: hasEnvVariables,
    env: env,
    global: globalObject,
    getNativePromise: getNativePromise,
    domainBind: domainBind
};
ret.isRecentNode = ret.isNode && (function() {
    var version = process.versions.node.split(".").map(Number);
    return (version[0] === 0 && version[1] > 10) || (version[0] > 0);
})();

if (ret.isNode) ret.toFastProperties(process);

try {throw new Error(); } catch (e) {ret.lastLineError = e;}
module.exports = ret;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Crypto = __webpack_require__(94);
const Path = __webpack_require__(97);
const Util = __webpack_require__(37);
const Escape = __webpack_require__(77);


// Declare internals

const internals = {};


// Clone object or array

exports.clone = function (obj, seen) {

    if (typeof obj !== 'object' ||
        obj === null) {

        return obj;
    }

    seen = seen || new Map();

    const lookup = seen.get(obj);
    if (lookup) {
        return lookup;
    }

    let newObj;
    let cloneDeep = false;

    if (!Array.isArray(obj)) {
        if (Buffer.isBuffer(obj)) {
            newObj = new Buffer(obj);
        }
        else if (obj instanceof Date) {
            newObj = new Date(obj.getTime());
        }
        else if (obj instanceof RegExp) {
            newObj = new RegExp(obj);
        }
        else {
            const proto = Object.getPrototypeOf(obj);
            if (proto &&
                proto.isImmutable) {

                newObj = obj;
            }
            else {
                newObj = Object.create(proto);
                cloneDeep = true;
            }
        }
    }
    else {
        newObj = [];
        cloneDeep = true;
    }

    seen.set(obj, newObj);

    if (cloneDeep) {
        const keys = Object.getOwnPropertyNames(obj);
        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            const descriptor = Object.getOwnPropertyDescriptor(obj, key);
            if (descriptor &&
                (descriptor.get ||
                 descriptor.set)) {

                Object.defineProperty(newObj, key, descriptor);
            }
            else {
                newObj[key] = exports.clone(obj[key], seen);
            }
        }
    }

    return newObj;
};


// Merge all the properties of source into target, source wins in conflict, and by default null and undefined from source are applied

/*eslint-disable */
exports.merge = function (target, source, isNullOverride /* = true */, isMergeArrays /* = true */) {
/*eslint-enable */

    exports.assert(target && typeof target === 'object', 'Invalid target value: must be an object');
    exports.assert(source === null || source === undefined || typeof source === 'object', 'Invalid source value: must be null, undefined, or an object');

    if (!source) {
        return target;
    }

    if (Array.isArray(source)) {
        exports.assert(Array.isArray(target), 'Cannot merge array onto an object');
        if (isMergeArrays === false) {                                                  // isMergeArrays defaults to true
            target.length = 0;                                                          // Must not change target assignment
        }

        for (let i = 0; i < source.length; ++i) {
            target.push(exports.clone(source[i]));
        }

        return target;
    }

    const keys = Object.keys(source);
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        const value = source[key];
        if (value &&
            typeof value === 'object') {

            if (!target[key] ||
                typeof target[key] !== 'object' ||
                (Array.isArray(target[key]) !== Array.isArray(value)) ||
                value instanceof Date ||
                Buffer.isBuffer(value) ||
                value instanceof RegExp) {

                target[key] = exports.clone(value);
            }
            else {
                exports.merge(target[key], value, isNullOverride, isMergeArrays);
            }
        }
        else {
            if (value !== null &&
                value !== undefined) {                              // Explicit to preserve empty strings

                target[key] = value;
            }
            else if (isNullOverride !== false) {                    // Defaults to true
                target[key] = value;
            }
        }
    }

    return target;
};


// Apply options to a copy of the defaults

exports.applyToDefaults = function (defaults, options, isNullOverride) {

    exports.assert(defaults && typeof defaults === 'object', 'Invalid defaults value: must be an object');
    exports.assert(!options || options === true || typeof options === 'object', 'Invalid options value: must be true, falsy or an object');

    if (!options) {                                                 // If no options, return null
        return null;
    }

    const copy = exports.clone(defaults);

    if (options === true) {                                         // If options is set to true, use defaults
        return copy;
    }

    return exports.merge(copy, options, isNullOverride === true, false);
};


// Clone an object except for the listed keys which are shallow copied

exports.cloneWithShallow = function (source, keys) {

    if (!source ||
        typeof source !== 'object') {

        return source;
    }

    const storage = internals.store(source, keys);    // Move shallow copy items to storage
    const copy = exports.clone(source);               // Deep copy the rest
    internals.restore(copy, source, storage);       // Shallow copy the stored items and restore
    return copy;
};


internals.store = function (source, keys) {

    const storage = {};
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        const value = exports.reach(source, key);
        if (value !== undefined) {
            storage[key] = value;
            internals.reachSet(source, key, undefined);
        }
    }

    return storage;
};


internals.restore = function (copy, source, storage) {

    const keys = Object.keys(storage);
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        internals.reachSet(copy, key, storage[key]);
        internals.reachSet(source, key, storage[key]);
    }
};


internals.reachSet = function (obj, key, value) {

    const path = key.split('.');
    let ref = obj;
    for (let i = 0; i < path.length; ++i) {
        const segment = path[i];
        if (i + 1 === path.length) {
            ref[segment] = value;
        }

        ref = ref[segment];
    }
};


// Apply options to defaults except for the listed keys which are shallow copied from option without merging

exports.applyToDefaultsWithShallow = function (defaults, options, keys) {

    exports.assert(defaults && typeof defaults === 'object', 'Invalid defaults value: must be an object');
    exports.assert(!options || options === true || typeof options === 'object', 'Invalid options value: must be true, falsy or an object');
    exports.assert(keys && Array.isArray(keys), 'Invalid keys');

    if (!options) {                                                 // If no options, return null
        return null;
    }

    const copy = exports.cloneWithShallow(defaults, keys);

    if (options === true) {                                         // If options is set to true, use defaults
        return copy;
    }

    const storage = internals.store(options, keys);   // Move shallow copy items to storage
    exports.merge(copy, options, false, false);     // Deep copy the rest
    internals.restore(copy, options, storage);      // Shallow copy the stored items and restore
    return copy;
};


// Deep object or array comparison

exports.deepEqual = function (obj, ref, options, seen) {

    options = options || { prototype: true };

    const type = typeof obj;

    if (type !== typeof ref) {
        return false;
    }

    if (type !== 'object' ||
        obj === null ||
        ref === null) {

        if (obj === ref) {                                                      // Copied from Deep-eql, copyright(c) 2013 Jake Luer, jake@alogicalparadox.com, MIT Licensed, https://github.com/chaijs/deep-eql
            return obj !== 0 || 1 / obj === 1 / ref;        // -0 / +0
        }

        return obj !== obj && ref !== ref;                  // NaN
    }

    seen = seen || [];
    if (seen.indexOf(obj) !== -1) {
        return true;                            // If previous comparison failed, it would have stopped execution
    }

    seen.push(obj);

    if (Array.isArray(obj)) {
        if (!Array.isArray(ref)) {
            return false;
        }

        if (!options.part && obj.length !== ref.length) {
            return false;
        }

        for (let i = 0; i < obj.length; ++i) {
            if (options.part) {
                let found = false;
                for (let j = 0; j < ref.length; ++j) {
                    if (exports.deepEqual(obj[i], ref[j], options)) {
                        found = true;
                        break;
                    }
                }

                return found;
            }

            if (!exports.deepEqual(obj[i], ref[i], options)) {
                return false;
            }
        }

        return true;
    }

    if (Buffer.isBuffer(obj)) {
        if (!Buffer.isBuffer(ref)) {
            return false;
        }

        if (obj.length !== ref.length) {
            return false;
        }

        for (let i = 0; i < obj.length; ++i) {
            if (obj[i] !== ref[i]) {
                return false;
            }
        }

        return true;
    }

    if (obj instanceof Date) {
        return (ref instanceof Date && obj.getTime() === ref.getTime());
    }

    if (obj instanceof RegExp) {
        return (ref instanceof RegExp && obj.toString() === ref.toString());
    }

    if (options.prototype) {
        if (Object.getPrototypeOf(obj) !== Object.getPrototypeOf(ref)) {
            return false;
        }
    }

    const keys = Object.getOwnPropertyNames(obj);

    if (!options.part && keys.length !== Object.getOwnPropertyNames(ref).length) {
        return false;
    }

    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        const descriptor = Object.getOwnPropertyDescriptor(obj, key);
        if (descriptor.get) {
            if (!exports.deepEqual(descriptor, Object.getOwnPropertyDescriptor(ref, key), options, seen)) {
                return false;
            }
        }
        else if (!exports.deepEqual(obj[key], ref[key], options, seen)) {
            return false;
        }
    }

    return true;
};


// Remove duplicate items from array

exports.unique = (array, key) => {

    let result;
    if (key) {
        result = [];
        const index = new Set();
        array.forEach((item) => {

            const identifier = item[key];
            if (!index.has(identifier)) {
                index.add(identifier);
                result.push(item);
            }
        });
    }
    else {
        result = Array.from(new Set(array));
    }

    return result;
};


// Convert array into object

exports.mapToObject = function (array, key) {

    if (!array) {
        return null;
    }

    const obj = {};
    for (let i = 0; i < array.length; ++i) {
        if (key) {
            if (array[i][key]) {
                obj[array[i][key]] = true;
            }
        }
        else {
            obj[array[i]] = true;
        }
    }

    return obj;
};


// Find the common unique items in two arrays

exports.intersect = function (array1, array2, justFirst) {

    if (!array1 || !array2) {
        return [];
    }

    const common = [];
    const hash = (Array.isArray(array1) ? exports.mapToObject(array1) : array1);
    const found = {};
    for (let i = 0; i < array2.length; ++i) {
        if (hash[array2[i]] && !found[array2[i]]) {
            if (justFirst) {
                return array2[i];
            }

            common.push(array2[i]);
            found[array2[i]] = true;
        }
    }

    return (justFirst ? null : common);
};


// Test if the reference contains the values

exports.contain = function (ref, values, options) {

    /*
        string -> string(s)
        array -> item(s)
        object -> key(s)
        object -> object (key:value)
    */

    let valuePairs = null;
    if (typeof ref === 'object' &&
        typeof values === 'object' &&
        !Array.isArray(ref) &&
        !Array.isArray(values)) {

        valuePairs = values;
        values = Object.keys(values);
    }
    else {
        values = [].concat(values);
    }

    options = options || {};            // deep, once, only, part

    exports.assert(arguments.length >= 2, 'Insufficient arguments');
    exports.assert(typeof ref === 'string' || typeof ref === 'object', 'Reference must be string or an object');
    exports.assert(values.length, 'Values array cannot be empty');

    let compare;
    let compareFlags;
    if (options.deep) {
        compare = exports.deepEqual;

        const hasOnly = options.hasOwnProperty('only');
        const hasPart = options.hasOwnProperty('part');

        compareFlags = {
            prototype: hasOnly ? options.only : hasPart ? !options.part : false,
            part: hasOnly ? !options.only : hasPart ? options.part : true
        };
    }
    else {
        compare = (a, b) => a === b;
    }

    let misses = false;
    const matches = new Array(values.length);
    for (let i = 0; i < matches.length; ++i) {
        matches[i] = 0;
    }

    if (typeof ref === 'string') {
        let pattern = '(';
        for (let i = 0; i < values.length; ++i) {
            const value = values[i];
            exports.assert(typeof value === 'string', 'Cannot compare string reference to non-string value');
            pattern += (i ? '|' : '') + exports.escapeRegex(value);
        }

        const regex = new RegExp(pattern + ')', 'g');
        const leftovers = ref.replace(regex, ($0, $1) => {

            const index = values.indexOf($1);
            ++matches[index];
            return '';          // Remove from string
        });

        misses = !!leftovers;
    }
    else if (Array.isArray(ref)) {
        for (let i = 0; i < ref.length; ++i) {
            let matched = false;
            for (let j = 0; j < values.length && matched === false; ++j) {
                matched = compare(values[j], ref[i], compareFlags) && j;
            }

            if (matched !== false) {
                ++matches[matched];
            }
            else {
                misses = true;
            }
        }
    }
    else {
        const keys = Object.getOwnPropertyNames(ref);
        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            const pos = values.indexOf(key);
            if (pos !== -1) {
                if (valuePairs &&
                    !compare(valuePairs[key], ref[key], compareFlags)) {

                    return false;
                }

                ++matches[pos];
            }
            else {
                misses = true;
            }
        }
    }

    let result = false;
    for (let i = 0; i < matches.length; ++i) {
        result = result || !!matches[i];
        if ((options.once && matches[i] > 1) ||
            (!options.part && !matches[i])) {

            return false;
        }
    }

    if (options.only &&
        misses) {

        return false;
    }

    return result;
};


// Flatten array

exports.flatten = function (array, target) {

    const result = target || [];

    for (let i = 0; i < array.length; ++i) {
        if (Array.isArray(array[i])) {
            exports.flatten(array[i], result);
        }
        else {
            result.push(array[i]);
        }
    }

    return result;
};


// Convert an object key chain string ('a.b.c') to reference (object[a][b][c])

exports.reach = function (obj, chain, options) {

    if (chain === false ||
        chain === null ||
        typeof chain === 'undefined') {

        return obj;
    }

    options = options || {};
    if (typeof options === 'string') {
        options = { separator: options };
    }

    const path = chain.split(options.separator || '.');
    let ref = obj;
    for (let i = 0; i < path.length; ++i) {
        let key = path[i];
        if (key[0] === '-' && Array.isArray(ref)) {
            key = key.slice(1, key.length);
            key = ref.length - key;
        }

        if (!ref ||
            !((typeof ref === 'object' || typeof ref === 'function') && key in ref) ||
            (typeof ref !== 'object' && options.functions === false)) {         // Only object and function can have properties

            exports.assert(!options.strict || i + 1 === path.length, 'Missing segment', key, 'in reach path ', chain);
            exports.assert(typeof ref === 'object' || options.functions === true || typeof ref !== 'function', 'Invalid segment', key, 'in reach path ', chain);
            ref = options.default;
            break;
        }

        ref = ref[key];
    }

    return ref;
};


exports.reachTemplate = function (obj, template, options) {

    return template.replace(/{([^}]+)}/g, ($0, chain) => {

        const value = exports.reach(obj, chain, options);
        return (value === undefined || value === null ? '' : value);
    });
};


exports.formatStack = function (stack) {

    const trace = [];
    for (let i = 0; i < stack.length; ++i) {
        const item = stack[i];
        trace.push([item.getFileName(), item.getLineNumber(), item.getColumnNumber(), item.getFunctionName(), item.isConstructor()]);
    }

    return trace;
};


exports.formatTrace = function (trace) {

    const display = [];

    for (let i = 0; i < trace.length; ++i) {
        const row = trace[i];
        display.push((row[4] ? 'new ' : '') + row[3] + ' (' + row[0] + ':' + row[1] + ':' + row[2] + ')');
    }

    return display;
};


exports.callStack = function (slice) {

    // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi

    const v8 = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {

        return stack;
    };

    const capture = {};
    Error.captureStackTrace(capture, this);     // arguments.callee is not supported in strict mode so we use this and slice the trace of this off the result
    const stack = capture.stack;

    Error.prepareStackTrace = v8;

    const trace = exports.formatStack(stack);

    return trace.slice(1 + slice);
};


exports.displayStack = function (slice) {

    const trace = exports.callStack(slice === undefined ? 1 : slice + 1);

    return exports.formatTrace(trace);
};


exports.abortThrow = false;


exports.abort = function (message, hideStack) {

    if (process.env.NODE_ENV === 'test' || exports.abortThrow === true) {
        throw new Error(message || 'Unknown error');
    }

    let stack = '';
    if (!hideStack) {
        stack = exports.displayStack(1).join('\n\t');
    }
    console.log('ABORT: ' + message + '\n\t' + stack);
    process.exit(1);
};


exports.assert = function (condition /*, msg1, msg2, msg3 */) {

    if (condition) {
        return;
    }

    if (arguments.length === 2 && arguments[1] instanceof Error) {
        throw arguments[1];
    }

    let msgs = [];
    for (let i = 1; i < arguments.length; ++i) {
        if (arguments[i] !== '') {
            msgs.push(arguments[i]);            // Avoids Array.slice arguments leak, allowing for V8 optimizations
        }
    }

    msgs = msgs.map((msg) => {

        return typeof msg === 'string' ? msg : msg instanceof Error ? msg.message : exports.stringify(msg);
    });

    throw new Error(msgs.join(' ') || 'Unknown error');
};


exports.Timer = function () {

    this.ts = 0;
    this.reset();
};


exports.Timer.prototype.reset = function () {

    this.ts = Date.now();
};


exports.Timer.prototype.elapsed = function () {

    return Date.now() - this.ts;
};


exports.Bench = function () {

    this.ts = 0;
    this.reset();
};


exports.Bench.prototype.reset = function () {

    this.ts = exports.Bench.now();
};


exports.Bench.prototype.elapsed = function () {

    return exports.Bench.now() - this.ts;
};


exports.Bench.now = function () {

    const ts = process.hrtime();
    return (ts[0] * 1e3) + (ts[1] / 1e6);
};


// Escape string for Regex construction

exports.escapeRegex = function (string) {

    // Escape ^$.*+-?=!:|\/()[]{},
    return string.replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, '\\$&');
};


// Base64url (RFC 4648) encode

exports.base64urlEncode = function (value, encoding) {

    exports.assert(typeof value === 'string' || Buffer.isBuffer(value), 'value must be string or buffer');
    const buf = (Buffer.isBuffer(value) ? value : new Buffer(value, encoding || 'binary'));
    return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
};


// Base64url (RFC 4648) decode

exports.base64urlDecode = function (value, encoding) {

    if (typeof value !== 'string') {

        return new Error('Value not a string');
    }

    if (!/^[\w\-]*$/.test(value)) {

        return new Error('Invalid character');
    }

    const buf = new Buffer(value, 'base64');
    return (encoding === 'buffer' ? buf : buf.toString(encoding || 'binary'));
};


// Escape attribute value for use in HTTP header

exports.escapeHeaderAttribute = function (attribute) {

    // Allowed value characters: !#$%&'()*+,-./:;<=>?@[]^_`{|}~ and space, a-z, A-Z, 0-9, \, "

    exports.assert(/^[ \w\!#\$%&'\(\)\*\+,\-\.\/\:;<\=>\?@\[\]\^`\{\|\}~\"\\]*$/.test(attribute), 'Bad attribute value (' + attribute + ')');

    return attribute.replace(/\\/g, '\\\\').replace(/\"/g, '\\"');                             // Escape quotes and slash
};


exports.escapeHtml = function (string) {

    return Escape.escapeHtml(string);
};


exports.escapeJavaScript = function (string) {

    return Escape.escapeJavaScript(string);
};


exports.nextTick = function (callback) {

    return function () {

        const args = arguments;
        process.nextTick(() => {

            callback.apply(null, args);
        });
    };
};


exports.once = function (method) {

    if (method._hoekOnce) {
        return method;
    }

    let once = false;
    const wrapped = function () {

        if (!once) {
            once = true;
            method.apply(null, arguments);
        }
    };

    wrapped._hoekOnce = true;

    return wrapped;
};


exports.isInteger = function (value) {

    return (typeof value === 'number' &&
            parseFloat(value) === parseInt(value, 10) &&
            !isNaN(value));
};


exports.ignore = function () { };


exports.inherits = Util.inherits;


exports.format = Util.format;


exports.transform = function (source, transform, options) {

    exports.assert(source === null || source === undefined || typeof source === 'object' || Array.isArray(source), 'Invalid source object: must be null, undefined, an object, or an array');
    const separator = (typeof options === 'object' && options !== null) ? (options.separator || '.') : '.';

    if (Array.isArray(source)) {
        const results = [];
        for (let i = 0; i < source.length; ++i) {
            results.push(exports.transform(source[i], transform, options));
        }
        return results;
    }

    const result = {};
    const keys = Object.keys(transform);

    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        const path = key.split(separator);
        const sourcePath = transform[key];

        exports.assert(typeof sourcePath === 'string', 'All mappings must be "." delineated strings');

        let segment;
        let res = result;

        while (path.length > 1) {
            segment = path.shift();
            if (!res[segment]) {
                res[segment] = {};
            }
            res = res[segment];
        }
        segment = path.shift();
        res[segment] = exports.reach(source, sourcePath, options);
    }

    return result;
};


exports.uniqueFilename = function (path, extension) {

    if (extension) {
        extension = extension[0] !== '.' ? '.' + extension : extension;
    }
    else {
        extension = '';
    }

    path = Path.resolve(path);
    const name = [Date.now(), process.pid, Crypto.randomBytes(8).toString('hex')].join('-') + extension;
    return Path.join(path, name);
};


exports.stringify = function () {

    try {
        return JSON.stringify.apply(null, arguments);
    }
    catch (err) {
        return '[Cannot display object: ' + err.message + ']';
    }
};


exports.shallow = function (source) {

    const target = {};
    const keys = Object.keys(source);
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        target[key] = source[key];
    }

    return target;
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(1);
const Ref = __webpack_require__(4);
const Errors = __webpack_require__(13);
let Alternatives = null;                // Delay-loaded to prevent circular dependencies
let Cast = null;


// Declare internals

const internals = {
    Set: __webpack_require__(24)
};


internals.defaults = {
    abortEarly: true,
    convert: true,
    allowUnknown: false,
    skipFunctions: false,
    stripUnknown: false,
    language: {},
    presence: 'optional',
    strip: false,
    noDefaults: false

    // context: null
};


module.exports = internals.Any = class {

    constructor() {

        Cast = Cast || __webpack_require__(9);

        this.isJoi = true;
        this._type = 'any';
        this._settings = null;
        this._valids = new internals.Set();
        this._invalids = new internals.Set();
        this._tests = [];
        this._refs = [];
        this._flags = {
            /*
             presence: 'optional',                   // optional, required, forbidden, ignore
             allowOnly: false,
             allowUnknown: undefined,
             default: undefined,
             forbidden: false,
             encoding: undefined,
             insensitive: false,
             trim: false,
             case: undefined,                        // upper, lower
             empty: undefined,
             func: false,
             raw: false
             */
        };

        this._description = null;
        this._unit = null;
        this._notes = [];
        this._tags = [];
        this._examples = [];
        this._meta = [];

        this._inner = {};                           // Hash of arrays of immutable objects
    }

    createError(type, context, state, options) {

        return Errors.create(type, context, state, options, this._flags);
    }

    checkOptions(options) {

        const Schemas = __webpack_require__(74);
        const result = Schemas.options.validate(options);
        if (result.error) {
            throw new Error(result.error.details[0].message);
        }
    }

    clone() {

        const obj = Object.create(Object.getPrototypeOf(this));

        obj.isJoi = true;
        obj._type = this._type;
        obj._settings = internals.concatSettings(this._settings);
        obj._valids = Hoek.clone(this._valids);
        obj._invalids = Hoek.clone(this._invalids);
        obj._tests = this._tests.slice();
        obj._refs = this._refs.slice();
        obj._flags = Hoek.clone(this._flags);

        obj._description = this._description;
        obj._unit = this._unit;
        obj._notes = this._notes.slice();
        obj._tags = this._tags.slice();
        obj._examples = this._examples.slice();
        obj._meta = this._meta.slice();

        obj._inner = {};
        const inners = Object.keys(this._inner);
        for (let i = 0; i < inners.length; ++i) {
            const key = inners[i];
            obj._inner[key] = this._inner[key] ? this._inner[key].slice() : null;
        }

        return obj;
    }

    concat(schema) {

        Hoek.assert(schema instanceof internals.Any, 'Invalid schema object');
        Hoek.assert(this._type === 'any' || schema._type === 'any' || schema._type === this._type, 'Cannot merge type', this._type, 'with another type:', schema._type);

        let obj = this.clone();

        if (this._type === 'any' && schema._type !== 'any') {

            // Reset values as if we were "this"
            const tmpObj = schema.clone();
            const keysToRestore = ['_settings', '_valids', '_invalids', '_tests', '_refs', '_flags', '_description', '_unit',
                '_notes', '_tags', '_examples', '_meta', '_inner'];

            for (let i = 0; i < keysToRestore.length; ++i) {
                tmpObj[keysToRestore[i]] = obj[keysToRestore[i]];
            }

            obj = tmpObj;
        }

        obj._settings = obj._settings ? internals.concatSettings(obj._settings, schema._settings) : schema._settings;
        obj._valids.merge(schema._valids, schema._invalids);
        obj._invalids.merge(schema._invalids, schema._valids);
        obj._tests = obj._tests.concat(schema._tests);
        obj._refs = obj._refs.concat(schema._refs);
        Hoek.merge(obj._flags, schema._flags);

        obj._description = schema._description || obj._description;
        obj._unit = schema._unit || obj._unit;
        obj._notes = obj._notes.concat(schema._notes);
        obj._tags = obj._tags.concat(schema._tags);
        obj._examples = obj._examples.concat(schema._examples);
        obj._meta = obj._meta.concat(schema._meta);

        const inners = Object.keys(schema._inner);
        const isObject = obj._type === 'object';
        for (let i = 0; i < inners.length; ++i) {
            const key = inners[i];
            const source = schema._inner[key];
            if (source) {
                const target = obj._inner[key];
                if (target) {
                    if (isObject && key === 'children') {
                        const keys = {};

                        for (let j = 0; j < target.length; ++j) {
                            keys[target[j].key] = j;
                        }

                        for (let j = 0; j < source.length; ++j) {
                            const sourceKey = source[j].key;
                            if (keys[sourceKey] >= 0) {
                                target[keys[sourceKey]] = {
                                    key: sourceKey,
                                    schema: target[keys[sourceKey]].schema.concat(source[j].schema)
                                };
                            }
                            else {
                                target.push(source[j]);
                            }
                        }
                    }
                    else {
                        obj._inner[key] = obj._inner[key].concat(source);
                    }
                }
                else {
                    obj._inner[key] = source.slice();
                }
            }
        }

        return obj;
    }

    _test(name, arg, func, options) {

        const obj = this.clone();
        obj._tests.push({ func, name, arg, options });
        return obj;
    }

    options(options) {

        Hoek.assert(!options.context, 'Cannot override context');
        this.checkOptions(options);

        const obj = this.clone();
        obj._settings = internals.concatSettings(obj._settings, options);
        return obj;
    }

    strict(isStrict) {

        const obj = this.clone();
        obj._settings = obj._settings || {};
        obj._settings.convert = isStrict === undefined ? false : !isStrict;
        return obj;
    }

    raw(isRaw) {

        const obj = this.clone();
        obj._flags.raw = isRaw === undefined ? true : isRaw;
        return obj;
    }

    error(err) {

        Hoek.assert(err && err instanceof Error, 'Must provide a valid Error object');

        const obj = this.clone();
        obj._flags.error = err;
        return obj;
    }

    allow() {

        const obj = this.clone();
        const values = Hoek.flatten(Array.prototype.slice.call(arguments));
        for (let i = 0; i < values.length; ++i) {
            const value = values[i];

            Hoek.assert(value !== undefined, 'Cannot call allow/valid/invalid with undefined');
            obj._invalids.remove(value);
            obj._valids.add(value, obj._refs);
        }
        return obj;
    }

    valid() {

        const obj = this.allow.apply(this, arguments);
        obj._flags.allowOnly = true;
        return obj;
    }

    invalid(value) {

        const obj = this.clone();
        const values = Hoek.flatten(Array.prototype.slice.call(arguments));
        for (let i = 0; i < values.length; ++i) {
            value = values[i];

            Hoek.assert(value !== undefined, 'Cannot call allow/valid/invalid with undefined');
            obj._valids.remove(value);
            obj._invalids.add(value, this._refs);
        }

        return obj;
    }

    required() {

        const obj = this.clone();
        obj._flags.presence = 'required';
        return obj;
    }

    optional() {

        const obj = this.clone();
        obj._flags.presence = 'optional';
        return obj;
    }


    forbidden() {

        const obj = this.clone();
        obj._flags.presence = 'forbidden';
        return obj;
    }


    strip() {

        const obj = this.clone();
        obj._flags.strip = true;
        return obj;
    }

    applyFunctionToChildren(children, fn, args, root) {

        children = [].concat(children);

        if (children.length !== 1 || children[0] !== '') {
            root = root ? (root + '.') : '';

            const extraChildren = (children[0] === '' ? children.slice(1) : children).map((child) => {

                return root + child;
            });

            throw new Error('unknown key(s) ' + extraChildren.join(', '));
        }

        return this[fn].apply(this, args);
    }

    default(value, description) {

        if (typeof value === 'function' &&
            !Ref.isRef(value)) {

            if (!value.description &&
                description) {

                value.description = description;
            }

            if (!this._flags.func) {
                Hoek.assert(typeof value.description === 'string' && value.description.length > 0, 'description must be provided when default value is a function');
            }
        }

        const obj = this.clone();
        obj._flags.default = value;
        Ref.push(obj._refs, value);
        return obj;
    }

    empty(schema) {

        const obj = this.clone();
        obj._flags.empty = schema === undefined ? undefined : Cast.schema(schema);
        return obj;
    }

    when(ref, options) {

        Hoek.assert(options && typeof options === 'object', 'Invalid options');
        Hoek.assert(options.then !== undefined || options.otherwise !== undefined, 'options must have at least one of "then" or "otherwise"');

        const then = options.hasOwnProperty('then') ? this.concat(Cast.schema(options.then)) : undefined;
        const otherwise = options.hasOwnProperty('otherwise') ? this.concat(Cast.schema(options.otherwise)) : undefined;

        Alternatives = Alternatives || __webpack_require__(11);
        const obj = Alternatives.when(ref, { is: options.is, then, otherwise });
        obj._flags.presence = 'ignore';
        obj._settings = internals.concatSettings(obj._settings, { baseType: this });

        return obj;
    }

    description(desc) {

        Hoek.assert(desc && typeof desc === 'string', 'Description must be a non-empty string');

        const obj = this.clone();
        obj._description = desc;
        return obj;
    }

    notes(notes) {

        Hoek.assert(notes && (typeof notes === 'string' || Array.isArray(notes)), 'Notes must be a non-empty string or array');

        const obj = this.clone();
        obj._notes = obj._notes.concat(notes);
        return obj;
    }

    tags(tags) {

        Hoek.assert(tags && (typeof tags === 'string' || Array.isArray(tags)), 'Tags must be a non-empty string or array');

        const obj = this.clone();
        obj._tags = obj._tags.concat(tags);
        return obj;
    }

    meta(meta) {

        Hoek.assert(meta !== undefined, 'Meta cannot be undefined');

        const obj = this.clone();
        obj._meta = obj._meta.concat(meta);
        return obj;
    }

    example(value) {

        Hoek.assert(arguments.length, 'Missing example');
        const result = this._validate(value, null, internals.defaults);
        Hoek.assert(!result.errors, 'Bad example:', result.errors && Errors.process(result.errors, value));

        const obj = this.clone();
        obj._examples.push(value);
        return obj;
    }

    unit(name) {

        Hoek.assert(name && typeof name === 'string', 'Unit name must be a non-empty string');

        const obj = this.clone();
        obj._unit = name;
        return obj;
    }

    _prepareEmptyValue(value) {

        if (typeof value === 'string' && this._flags.trim) {
            return value.trim();
        }

        return value;
    }

    _validate(value, state, options, reference) {

        const originalValue = value;

        // Setup state and settings

        state = state || { key: '', path: '', parent: null, reference };

        if (this._settings) {
            options = internals.concatSettings(options, this._settings);
        }

        let errors = [];
        const finish = () => {

            let finalValue;

            if (!this._flags.strip) {
                if (value !== undefined) {
                    finalValue = this._flags.raw ? originalValue : value;
                }
                else if (options.noDefaults) {
                    finalValue = value;
                }
                else if (Ref.isRef(this._flags.default)) {
                    finalValue = this._flags.default(state.parent, options);
                }
                else if (typeof this._flags.default === 'function' &&
                    !(this._flags.func && !this._flags.default.description)) {

                    let args;

                    if (state.parent !== null &&
                        this._flags.default.length > 0) {

                        args = [Hoek.clone(state.parent), options];
                    }

                    const defaultValue = internals._try(this._flags.default, args);
                    finalValue = defaultValue.value;
                    if (defaultValue.error) {
                        errors.push(this.createError('any.default', defaultValue.error, state, options));
                    }
                }
                else {
                    finalValue = Hoek.clone(this._flags.default);
                }
            }

            return {
                value: finalValue,
                errors: errors.length ? errors : null
            };
        };

        if (this._coerce) {
            const coerced = this._coerce.call(this, value, state, options);
            if (coerced.errors) {
                value = coerced.value;
                errors = errors.concat(coerced.errors);
                return finish();                            // Coerced error always aborts early
            }

            value = coerced.value;
        }

        if (this._flags.empty && !this._flags.empty._validate(this._prepareEmptyValue(value), null, internals.defaults).errors) {
            value = undefined;
        }

        // Check presence requirements

        const presence = this._flags.presence || options.presence;
        if (presence === 'optional') {
            if (value === undefined) {
                const isDeepDefault = this._flags.hasOwnProperty('default') && this._flags.default === undefined;
                if (isDeepDefault && this._type === 'object') {
                    value = {};
                }
                else {
                    return finish();
                }
            }
        }
        else if (presence === 'required' &&
            value === undefined) {

            errors.push(this.createError('any.required', null, state, options));
            return finish();
        }
        else if (presence === 'forbidden') {
            if (value === undefined) {
                return finish();
            }

            errors.push(this.createError('any.unknown', null, state, options));
            return finish();
        }

        // Check allowed and denied values using the original value

        if (this._valids.has(value, state, options, this._flags.insensitive)) {
            return finish();
        }

        if (this._invalids.has(value, state, options, this._flags.insensitive)) {
            errors.push(this.createError(value === '' ? 'any.empty' : 'any.invalid', null, state, options));
            if (options.abortEarly ||
                value === undefined) {          // No reason to keep validating missing value

                return finish();
            }
        }

        // Convert value and validate type

        if (this._base) {
            const base = this._base.call(this, value, state, options);
            if (base.errors) {
                value = base.value;
                errors = errors.concat(base.errors);
                return finish();                            // Base error always aborts early
            }

            if (base.value !== value) {
                value = base.value;

                // Check allowed and denied values using the converted value

                if (this._valids.has(value, state, options, this._flags.insensitive)) {
                    return finish();
                }

                if (this._invalids.has(value, state, options, this._flags.insensitive)) {
                    errors.push(this.createError(value === '' ? 'any.empty' : 'any.invalid', null, state, options));
                    if (options.abortEarly) {
                        return finish();
                    }
                }
            }
        }

        // Required values did not match

        if (this._flags.allowOnly) {
            errors.push(this.createError('any.allowOnly', { valids: this._valids.values({ stripUndefined: true }) }, state, options));
            if (options.abortEarly) {
                return finish();
            }
        }

        // Helper.validate tests

        for (let i = 0; i < this._tests.length; ++i) {
            const test = this._tests[i];
            const ret = test.func.call(this, value, state, options);
            if (ret instanceof Errors.Err) {
                errors.push(ret);
                if (options.abortEarly) {
                    return finish();
                }
            }
            else {
                value = ret;
            }
        }

        return finish();
    }

    _validateWithOptions(value, options, callback) {

        if (options) {
            this.checkOptions(options);
        }

        const settings = internals.concatSettings(internals.defaults, options);
        const result = this._validate(value, null, settings);
        const errors = Errors.process(result.errors, value);

        if (callback) {
            return callback(errors, result.value);
        }

        return { error: errors, value: result.value };
    }

    validate(value, options, callback) {

        if (typeof options === 'function') {
            return this._validateWithOptions(value, null, options);
        }

        return this._validateWithOptions(value, options, callback);
    }

    describe() {

        const description = {
            type: this._type
        };

        const flags = Object.keys(this._flags);
        if (flags.length) {
            if (['empty', 'default', 'lazy', 'label'].some((flag) => this._flags.hasOwnProperty(flag))) {
                description.flags = {};
                for (let i = 0; i < flags.length; ++i) {
                    const flag = flags[i];
                    if (flag === 'empty') {
                        description.flags[flag] = this._flags[flag].describe();
                    }
                    else if (flag === 'default') {
                        if (Ref.isRef(this._flags[flag])) {
                            description.flags[flag] = this._flags[flag].toString();
                        }
                        else if (typeof this._flags[flag] === 'function') {
                            description.flags[flag] = this._flags[flag].description;
                        }
                        else {
                            description.flags[flag] = this._flags[flag];
                        }
                    }
                    else if (flag === 'lazy' || flag === 'label') {
                        // We don't want it in the description
                    }
                    else {
                        description.flags[flag] = this._flags[flag];
                    }
                }
            }
            else {
                description.flags = this._flags;
            }
        }

        if (this._description) {
            description.description = this._description;
        }

        if (this._notes.length) {
            description.notes = this._notes;
        }

        if (this._tags.length) {
            description.tags = this._tags;
        }

        if (this._meta.length) {
            description.meta = this._meta;
        }

        if (this._examples.length) {
            description.examples = this._examples;
        }

        if (this._unit) {
            description.unit = this._unit;
        }

        const valids = this._valids.values();
        if (valids.length) {
            description.valids = valids.map((v) => {

                return Ref.isRef(v) ? v.toString() : v;
            });
        }

        const invalids = this._invalids.values();
        if (invalids.length) {
            description.invalids = invalids.map((v) => {

                return Ref.isRef(v) ? v.toString() : v;
            });
        }

        description.rules = [];

        for (let i = 0; i < this._tests.length; ++i) {
            const validator = this._tests[i];
            const item = { name: validator.name };

            if (validator.arg !== void 0) {
                item.arg = Ref.isRef(validator.arg) ? validator.arg.toString() : validator.arg;
            }

            const options = validator.options;
            if (options) {
                if (options.hasRef) {
                    item.arg = {};
                    const keys = Object.keys(validator.arg);
                    for (let j = 0; j < keys.length; ++j) {
                        const key = keys[j];
                        const value = validator.arg[key];
                        item.arg[key] = Ref.isRef(value) ? value.toString() : value;
                    }
                }

                if (typeof options.description === 'string') {
                    item.description = options.description;
                }
                else if (typeof options.description === 'function') {
                    item.description = options.description(item.arg);
                }
            }

            description.rules.push(item);
        }

        if (!description.rules.length) {
            delete description.rules;
        }

        const label = this._getLabel();
        if (label) {
            description.label = label;
        }

        return description;
    }

    label(name) {

        Hoek.assert(name && typeof name === 'string', 'Label name must be a non-empty string');

        const obj = this.clone();
        obj._flags.label = name;
        return obj;
    }

    _getLabel(def) {

        return this._flags.label || def;
    }

};


internals.Any.prototype.isImmutable = true;     // Prevents Hoek from deep cloning schema objects

// Aliases

internals.Any.prototype.only = internals.Any.prototype.equal = internals.Any.prototype.valid;
internals.Any.prototype.disallow = internals.Any.prototype.not = internals.Any.prototype.invalid;
internals.Any.prototype.exist = internals.Any.prototype.required;


internals._try = function (fn, args) {

    let err;
    let result;

    try {
        result = fn.apply(null, args);
    }
    catch (e) {
        err = e;
    }

    return {
        value: result,
        error: err
    };
};

internals.concatSettings = function (target, source) {

    // Used to avoid cloning context

    if (!target &&
        !source) {

        return null;
    }

    const obj = {};

    if (target) {
        Object.assign(obj, target);
    }

    if (source) {
        const sKeys = Object.keys(source);
        for (let i = 0; i < sKeys.length; ++i) {
            const key = sKeys[i];
            if (key !== 'language' ||
                !obj.hasOwnProperty(key)) {

                obj[key] = source[key];
            }
            else {
                obj[key] = Hoek.applyToDefaults(obj[key], source[key]);
            }
        }
    }

    return obj;
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const joi = __webpack_require__(36);

const
	STJoi = joi.extend({
		name: 'st',
		language: {
			type: 'must conform to schema of type {{s}}. error: {{e}}',
			extra: 'failed with extra schema. error: {{e}}'
		},
		rules: [
			{
				name: 'type',
				params: {
					constructor: joi.func().required()
				},
				validate: function(params, value, state, options) {
					try {
						if (value instanceof params.constructor) {
							return value;
						} else {
							return new params.constructor(value);
						}
					} catch(ex) {
						return this.createError(
							'st.type',
							{
								s: params.constructor.name,
								e: ex
							},
							state,
							options
						);
					}
				}
			},
			{
				name: 'extra',
				params: {
					extraSchema: joi.object({
						isJoi: joi.boolean().required().only(true)
					}).required().unknown(true)
				},
				validate: function(params, value, state, options) {
					try {
						return STJoi.attempt(value, params.extraSchema);
					} catch(ex) {
						return this.createError(
							'st.extra',
							{
								e: ex
							},
							state,
							options
						);
					}
				}
			}
		]
	}),
	_oriST = STJoi.st();

STJoi.st = function() {
	var instance = _oriST;

	if (arguments.length) {
		return instance.type.apply(instance, arguments);
	} else {
		return instance;
	}
};

class STError extends Error {

	static get(st) {
		if (!STError.__derivedErrors) {
			STError.__derivedErrors = {};
		}

		let E = STError.__derivedErrors[st.name];

		if (!E) {
			E = STError.__derivedErrors[st.name] = class extends STError {
				get type() {
					return st;
				}

				static wrapError(error) {
					var err = new E(error.message);

					err.wrappedError = error;

					return err;
				}
			};
		}

		return E;
	}
};

class ST {

	constructor() {
		const T = this.constructor;

		// static schema
		STJoi.validate(
			arguments[0],
			T.schema,
			T.joiOptions,
			(err, props) => {
				if (err) {
					throw T.Error.wrapError(err);
				} else {
					T.assign(this, props);
				}
			}
		);

		// instance schema
		this.schema && STJoi.validate(
			arguments[0],
			this.schema,
			T.joiOptions,
			(err, props) => {
				if (err) {
					throw T.Error.wrapError(err);
				} else {
					T.assign(this, props);
				}
			}
		);
	}

	static assign(instance, props) {
		Object.assign(instance, props);
	}

	static get Error() {
		return STError.get(this);
	}

	static get joi() {
		return STJoi;
	}

	static get joiOptions() {
		return {};
	}

	static many(vals) {
		return vals.map((v) => new this(v));
	}

	static manyWithNulls(vals) {
		return vals.map(
			(v) => (Object.is(v, null) || Object.is(v, undefined))
				? v
				: new this(v)
		);
	}

	static get schema() {
		return ST.joi.any();
	}

	get schema() {
		return null;
	}

	static toPrimitive(v) {
		const res = {};

		for (let k in v) {
			if (v[k] instanceof ST) {
				res[k] = v[k].toPrimitive();
			} else if (typeof v[k] === 'object' && v[k].constructor === Object) {
				res[k] = ST.toPrimitive(v[k]);
			} else {
				res[k] = v[k];
			}
		}

		return res;
	}

	toPrimitive() {
		return ST.toPrimitive(this);
	}

};

/* Schematic Value */
ST.SV = class SV extends ST {

	static assign(instance, props) {
		instance.value = props;
	}

	toString() {
		return '' + this.value;
	}

	toPrimitive() {
		return this.value;
	}

	toJSON() {
		return this.value;
	}

};

module.exports = ST;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(1);


// Declare internals

const internals = {};


exports.create = function (key, options) {

    Hoek.assert(typeof key === 'string', 'Invalid reference key:', key);

    const settings = Hoek.clone(options);         // options can be reused and modified

    const ref = function (value, validationOptions) {

        return Hoek.reach(ref.isContext ? validationOptions.context : value, ref.key, settings);
    };

    ref.isContext = (key[0] === ((settings && settings.contextPrefix) || '$'));
    ref.key = (ref.isContext ? key.slice(1) : key);
    ref.path = ref.key.split((settings && settings.separator) || '.');
    ref.depth = ref.path.length;
    ref.root = ref.path[0];
    ref.isJoi = true;

    ref.toString = function () {

        return (ref.isContext ? 'context:' : 'ref:') + ref.key;
    };

    return ref;
};


exports.isRef = function (ref) {

    return typeof ref === 'function' && ref.isJoi;
};


exports.push = function (array, ref) {

    if (exports.isRef(ref) &&
        !ref.isContext) {

        array.push(ref.root);
    }
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	ST: __webpack_require__(3),

	SequenceNumber: __webpack_require__(15),
	TableName: __webpack_require__(91),
	AggregateName: __webpack_require__(14),
	GroupName: __webpack_require__(10),
	Namespace: __webpack_require__(34),

	NewEvent: __webpack_require__(88),
	StoredEvent: __webpack_require__(90),

	ReducerName: __webpack_require__(35),
	ReducerObj: __webpack_require__(89)
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var es5 = __webpack_require__(7);
var Objectfreeze = es5.freeze;
var util = __webpack_require__(0);
var inherits = util.inherits;
var notEnumerableProp = util.notEnumerableProp;

function subError(nameProperty, defaultMessage) {
    function SubError(message) {
        if (!(this instanceof SubError)) return new SubError(message);
        notEnumerableProp(this, "message",
            typeof message === "string" ? message : defaultMessage);
        notEnumerableProp(this, "name", nameProperty);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        } else {
            Error.call(this);
        }
    }
    inherits(SubError, Error);
    return SubError;
}

var _TypeError, _RangeError;
var Warning = subError("Warning", "warning");
var CancellationError = subError("CancellationError", "cancellation error");
var TimeoutError = subError("TimeoutError", "timeout error");
var AggregateError = subError("AggregateError", "aggregate error");
try {
    _TypeError = TypeError;
    _RangeError = RangeError;
} catch(e) {
    _TypeError = subError("TypeError", "type error");
    _RangeError = subError("RangeError", "range error");
}

var methods = ("join pop push shift unshift slice filter forEach some " +
    "every map indexOf lastIndexOf reduce reduceRight sort reverse").split(" ");

for (var i = 0; i < methods.length; ++i) {
    if (typeof Array.prototype[methods[i]] === "function") {
        AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
    }
}

es5.defineProperty(AggregateError.prototype, "length", {
    value: 0,
    configurable: false,
    writable: true,
    enumerable: true
});
AggregateError.prototype["isOperational"] = true;
var level = 0;
AggregateError.prototype.toString = function() {
    var indent = Array(level * 4 + 1).join(" ");
    var ret = "\n" + indent + "AggregateError of:" + "\n";
    level++;
    indent = Array(level * 4 + 1).join(" ");
    for (var i = 0; i < this.length; ++i) {
        var str = this[i] === this ? "[Circular AggregateError]" : this[i] + "";
        var lines = str.split("\n");
        for (var j = 0; j < lines.length; ++j) {
            lines[j] = indent + lines[j];
        }
        str = lines.join("\n");
        ret += str + "\n";
    }
    level--;
    return ret;
};

function OperationalError(message) {
    if (!(this instanceof OperationalError))
        return new OperationalError(message);
    notEnumerableProp(this, "name", "OperationalError");
    notEnumerableProp(this, "message", message);
    this.cause = message;
    this["isOperational"] = true;

    if (message instanceof Error) {
        notEnumerableProp(this, "message", message.message);
        notEnumerableProp(this, "stack", message.stack);
    } else if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }

}
inherits(OperationalError, Error);

var errorTypes = Error["__BluebirdErrorTypes__"];
if (!errorTypes) {
    errorTypes = Objectfreeze({
        CancellationError: CancellationError,
        TimeoutError: TimeoutError,
        OperationalError: OperationalError,
        RejectionError: OperationalError,
        AggregateError: AggregateError
    });
    es5.defineProperty(Error, "__BluebirdErrorTypes__", {
        value: errorTypes,
        writable: false,
        enumerable: false,
        configurable: false
    });
}

module.exports = {
    Error: Error,
    TypeError: _TypeError,
    RangeError: _RangeError,
    CancellationError: errorTypes.CancellationError,
    OperationalError: errorTypes.OperationalError,
    TimeoutError: errorTypes.TimeoutError,
    AggregateError: errorTypes.AggregateError,
    Warning: Warning
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

var isES5 = (function(){
    "use strict";
    return this === undefined;
})();

if (isES5) {
    module.exports = {
        freeze: Object.freeze,
        defineProperty: Object.defineProperty,
        getDescriptor: Object.getOwnPropertyDescriptor,
        keys: Object.keys,
        names: Object.getOwnPropertyNames,
        getPrototypeOf: Object.getPrototypeOf,
        isArray: Array.isArray,
        isES5: isES5,
        propertyIsWritable: function(obj, prop) {
            var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
            return !!(!descriptor || descriptor.writable || descriptor.set);
        }
    };
} else {
    var has = {}.hasOwnProperty;
    var str = {}.toString;
    var proto = {}.constructor.prototype;

    var ObjectKeys = function (o) {
        var ret = [];
        for (var key in o) {
            if (has.call(o, key)) {
                ret.push(key);
            }
        }
        return ret;
    };

    var ObjectGetDescriptor = function(o, key) {
        return {value: o[key]};
    };

    var ObjectDefineProperty = function (o, key, desc) {
        o[key] = desc.value;
        return o;
    };

    var ObjectFreeze = function (obj) {
        return obj;
    };

    var ObjectGetPrototypeOf = function (obj) {
        try {
            return Object(obj).constructor.prototype;
        }
        catch (e) {
            return proto;
        }
    };

    var ArrayIsArray = function (obj) {
        try {
            return str.call(obj) === "[object Array]";
        }
        catch(e) {
            return false;
        }
    };

    module.exports = {
        isArray: ArrayIsArray,
        keys: ObjectKeys,
        names: ObjectKeys,
        defineProperty: ObjectDefineProperty,
        getDescriptor: ObjectGetDescriptor,
        freeze: ObjectFreeze,
        getPrototypeOf: ObjectGetPrototypeOf,
        isES5: isES5,
        propertyIsWritable: function() {
            return true;
        }
    };
}


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const
	ST = __webpack_require__(5).ST,
	loggerFactory = __webpack_require__(16).loggerFactory;

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


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(1);
const Ref = __webpack_require__(4);

// Type modules are delay-loaded to prevent circular dependencies


// Declare internals

const internals = {
    any: null,
    date: __webpack_require__(12),
    string: __webpack_require__(25),
    number: __webpack_require__(22),
    boolean: __webpack_require__(20),
    alt: null,
    object: null
};


exports.schema = function (config) {

    internals.any = internals.any || new (__webpack_require__(2))();
    internals.alt = internals.alt || __webpack_require__(11);
    internals.object = internals.object || __webpack_require__(23);

    if (config !== undefined && config !== null && typeof config === 'object') {

        if (config.isJoi) {
            return config;
        }

        if (Array.isArray(config)) {
            return internals.alt.try(config);
        }

        if (config instanceof RegExp) {
            return internals.string.regex(config);
        }

        if (config instanceof Date) {
            return internals.date.valid(config);
        }

        return internals.object.keys(config);
    }

    if (typeof config === 'string') {
        return internals.string.valid(config);
    }

    if (typeof config === 'number') {
        return internals.number.valid(config);
    }

    if (typeof config === 'boolean') {
        return internals.boolean.valid(config);
    }

    if (Ref.isRef(config)) {
        return internals.any.valid(config);
    }

    Hoek.assert(config === null, 'Invalid schema content:', config);

    return internals.any.valid(null);
};


exports.ref = function (id) {

    return Ref.isRef(id) ? id : Ref.create(id);
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ST = __webpack_require__(3);

module.exports = class GroupName extends ST.SV {

	static get schema() {
		return ST.joi.string()
			.label('GroupName')
			.trim().min(3)
			.regex(/^[a-zA-Z0-9-_]*$/);
	}

};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(1);
const Any = __webpack_require__(2);
const Cast = __webpack_require__(9);
const Ref = __webpack_require__(4);


// Declare internals

const internals = {};


internals.Alternatives = class extends Any {

    constructor() {

        super();
        this._type = 'alternatives';
        this._invalids.remove(null);
        this._inner.matches = [];
    }

    _base(value, state, options) {

        let errors = [];
        const il = this._inner.matches.length;
        const baseType = this._settings && this._settings.baseType;

        for (let i = 0; i < il; ++i) {
            const item = this._inner.matches[i];
            const schema = item.schema;
            if (!schema) {
                const failed = item.is._validate(item.ref(state.reference || state.parent, options), null, options, state.parent).errors;

                if (failed) {
                    if (item.otherwise) {
                        return item.otherwise._validate(value, state, options);
                    }
                    else if (baseType && i  === (il - 1)) {
                        return baseType._validate(value, state, options);
                    }
                }
                else if (item.then || baseType) {
                    return (item.then || baseType)._validate(value, state, options);
                }

                continue;
            }

            const result = schema._validate(value, state, options);
            if (!result.errors) {     // Found a valid match
                return result;
            }

            errors = errors.concat(result.errors);
        }

        return { errors: errors.length ? errors : this.createError('alternatives.base', null, state, options) };
    }

    try(/* schemas */) {

        const schemas = Hoek.flatten(Array.prototype.slice.call(arguments));
        Hoek.assert(schemas.length, 'Cannot add other alternatives without at least one schema');

        const obj = this.clone();

        for (let i = 0; i < schemas.length; ++i) {
            const cast = Cast.schema(schemas[i]);
            if (cast._refs.length) {
                obj._refs = obj._refs.concat(cast._refs);
            }
            obj._inner.matches.push({ schema: cast });
        }

        return obj;
    }

    when(ref, options) {

        Hoek.assert(Ref.isRef(ref) || typeof ref === 'string', 'Invalid reference:', ref);
        Hoek.assert(options, 'Missing options');
        Hoek.assert(typeof options === 'object', 'Invalid options');
        Hoek.assert(options.hasOwnProperty('is'), 'Missing "is" directive');
        Hoek.assert(options.then !== undefined || options.otherwise !== undefined, 'options must have at least one of "then" or "otherwise"');

        const obj = this.clone();
        let is = Cast.schema(options.is);

        if (options.is === null || !(Ref.isRef(options.is) || options.is instanceof Any)) {

            // Only apply required if this wasn't already a schema or a ref, we'll suppose people know what they're doing
            is = is.required();
        }

        const item = {
            ref: Cast.ref(ref),
            is,
            then: options.then !== undefined ? Cast.schema(options.then) : undefined,
            otherwise: options.otherwise !== undefined ? Cast.schema(options.otherwise) : undefined
        };

        if (obj._settings && obj._settings.baseType) {
            item.then = item.then && obj._settings.baseType.concat(item.then);
            item.otherwise = item.otherwise && obj._settings.baseType.concat(item.otherwise);
        }

        Ref.push(obj._refs, item.ref);
        obj._refs = obj._refs.concat(item.is._refs);

        if (item.then && item.then._refs) {
            obj._refs = obj._refs.concat(item.then._refs);
        }

        if (item.otherwise && item.otherwise._refs) {
            obj._refs = obj._refs.concat(item.otherwise._refs);
        }

        obj._inner.matches.push(item);

        return obj;
    }

    describe() {

        const description = Any.prototype.describe.call(this);
        const alternatives = [];
        for (let i = 0; i < this._inner.matches.length; ++i) {
            const item = this._inner.matches[i];
            if (item.schema) {

                // try()

                alternatives.push(item.schema.describe());
            }
            else {

                // when()

                const when = {
                    ref: item.ref.toString(),
                    is: item.is.describe()
                };

                if (item.then) {
                    when.then = item.then.describe();
                }

                if (item.otherwise) {
                    when.otherwise = item.otherwise.describe();
                }

                alternatives.push(when);
            }
        }

        description.alternatives = alternatives;
        return description;
    }

};


module.exports = new internals.Alternatives();


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Any = __webpack_require__(2);
const Ref = __webpack_require__(4);
const Hoek = __webpack_require__(1);


// Declare internals

const internals = {};

internals.isoDate = /^(?:[-+]\d{2})?(?:\d{4}(?!\d{2}\b))(?:(-?)(?:(?:0[1-9]|1[0-2])(?:\1(?:[12]\d|0[1-9]|3[01]))?|W(?:[0-4]\d|5[0-2])(?:-?[1-7])?|(?:00[1-9]|0[1-9]\d|[12]\d{2}|3(?:[0-5]\d|6[1-6])))(?![T]$|[T][\d]+Z$)(?:[T\s](?:(?:(?:[01]\d|2[0-3])(?:(:?)[0-5]\d)?|24\:?00)(?:[.,]\d+(?!:))?)(?:\2[0-5]\d(?:[.,]\d+)?)?(?:[Z]|(?:[+-])(?:[01]\d|2[0-3])(?::?[0-5]\d)?)?)?)?$/;
internals.invalidDate = new Date('');
internals.isIsoDate = (() => {

    const isoString = internals.isoDate.toString();

    return (date) => {

        return date && (date.toString() === isoString);
    };
})();

internals.Date = class extends Any {

    constructor() {

        super();
        this._type = 'date';
    }

    _base(value, state, options) {

        const result = {
            value: (options.convert && internals.Date.toDate(value, this._flags.format, this._flags.timestamp, this._flags.multiplier)) || value
        };

        if (result.value instanceof Date && !isNaN(result.value.getTime())) {
            result.errors = null;
        }
        else if (!options.convert) {
            result.errors = this.createError('date.strict', null, state, options);
        }
        else {
            let type;
            if (internals.isIsoDate(this._flags.format)) {
                type = 'isoDate';
            }
            else if (this._flags.timestamp) {
                type = `timestamp.${this._flags.timestamp}`;
            }
            else {
                type = 'base';
            }

            result.errors = this.createError(`date.${type}`, null, state, options);
        }

        return result;
    }

    static toDate(value, format, timestamp, multiplier) {

        if (value instanceof Date) {
            return value;
        }

        if (typeof value === 'string' ||
            (typeof value === 'number' && !isNaN(value) && isFinite(value))) {

            if (typeof value === 'string' &&
                /^[+-]?\d+(\.\d+)?$/.test(value)) {

                value = parseFloat(value);
            }

            let date;
            if (format && internals.isIsoDate(format)) {
                date = format.test(value) ? new Date(value) : internals.invalidDate;
            }
            else if (timestamp && multiplier) {
                date = new Date(value * multiplier);
            }
            else {
                date = new Date(value);
            }

            if (!isNaN(date.getTime())) {
                return date;
            }
        }

        return null;
    }

    iso() {

        const obj = this.clone();
        obj._flags.format = internals.isoDate;
        return obj;
    }

    timestamp(type) {

        type = type || 'javascript';

        const allowed = ['javascript', 'unix'];
        Hoek.assert(allowed.indexOf(type) !== -1, '"type" must be one of "' + allowed.join('", "') + '"');

        const obj = this.clone();
        obj._flags.timestamp = type;
        obj._flags.multiplier = type === 'unix' ? 1000 : 1;
        return obj;
    }

    _isIsoDate(value) {

        return internals.isoDate.test(value);
    }

};

internals.compare = function (type, compare) {

    return function (date) {

        const isNow = date === 'now';
        const isRef = Ref.isRef(date);

        if (!isNow && !isRef) {
            date = internals.Date.toDate(date);
        }

        Hoek.assert(date, 'Invalid date format');

        return this._test(type, date, function (value, state, options) {

            let compareTo;
            if (isNow) {
                compareTo = Date.now();
            }
            else if (isRef) {
                compareTo = internals.Date.toDate(date(state.reference || state.parent, options));

                if (!compareTo) {
                    return this.createError('date.ref', { ref: date.key }, state, options);
                }

                compareTo = compareTo.getTime();
            }
            else {
                compareTo = date.getTime();
            }

            if (compare(value.getTime(), compareTo)) {
                return value;
            }

            return this.createError('date.' + type, { limit: new Date(compareTo) }, state, options);
        });
    };
};
internals.Date.prototype.min = internals.compare('min', (value, date) => value >= date);
internals.Date.prototype.max = internals.compare('max', (value, date) => value <= date);


module.exports = new internals.Date();


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(1);
const Language = __webpack_require__(72);


// Declare internals

const internals = {};

internals.stringify = function (value, wrapArrays) {

    const type = typeof value;

    if (value === null) {
        return 'null';
    }

    if (type === 'string') {
        return value;
    }

    if (value instanceof exports.Err || type === 'function') {
        return value.toString();
    }

    if (type === 'object') {
        if (Array.isArray(value)) {
            let partial = '';

            for (let i = 0; i < value.length; ++i) {
                partial = partial + (partial.length ? ', ' : '') + internals.stringify(value[i], wrapArrays);
            }

            return wrapArrays ? '[' + partial + ']' : partial;
        }

        return value.toString();
    }

    return JSON.stringify(value);
};

exports.Err = class {

    constructor(type, context, state, options, flags) {

        this.isJoi = true;
        this.type = type;
        this.context = context || {};
        this.context.key = state.key;
        this.path = state.path;
        this.options = options;
        this.flags = flags;
    }

    toString() {

        const localized = this.options.language;

        if (this.flags.label) {
            this.context.key = this.flags.label;
        }
        else if (this.context.key === '' || this.context.key === null) {
            this.context.key = localized.root || Language.errors.root;
        }

        let format = Hoek.reach(localized, this.type) || Hoek.reach(Language.errors, this.type);
        const hasKey = /\{\{\!?key\}\}/.test(format);
        const skipKey = format.length > 2 && format[0] === '!' && format[1] === '!';

        if (skipKey) {
            format = format.slice(2);
        }

        if (!hasKey && !skipKey) {
            format = (Hoek.reach(localized, 'key') || Hoek.reach(Language.errors, 'key')) + format;
        }

        let wrapArrays = Hoek.reach(localized, 'messages.wrapArrays');
        if (typeof wrapArrays !== 'boolean') {
            wrapArrays = Language.errors.messages.wrapArrays;
        }

        return format.replace(/\{\{(\!?)([^}]+)\}\}/g, ($0, isSecure, name) => {

            const value = Hoek.reach(this.context, name);
            const normalized = internals.stringify(value, wrapArrays);
            return (isSecure ? Hoek.escapeHtml(normalized) : normalized);
        });
    }

};


exports.create = function (type, context, state, options, flags) {

    return new exports.Err(type, context, state, options, flags);
};


exports.process = function (errors, object) {

    if (!errors || !errors.length) {
        return null;
    }

    // Construct error

    let message = '';
    const details = [];

    const processErrors = function (localErrors, parent) {

        for (let i = 0; i < localErrors.length; ++i) {
            const item = localErrors[i];

            if (item.flags.error) {
                return item.flags.error;
            }

            let itemMessage;
            if (parent === undefined) {
                itemMessage = item.toString();
                message = message + (message ? '. ' : '') + itemMessage;
            }

            // Do not push intermediate errors, we're only interested in leafs

            if (item.context.reason && item.context.reason.length) {
                const override = processErrors(item.context.reason, item.path);
                if (override) {
                    return override;
                }
            }
            else {
                details.push({
                    message: itemMessage || item.toString(),
                    path: internals.getPath(item),
                    type: item.type,
                    context: item.context
                });
            }
        }
    };

    const override = processErrors(errors);
    if (override) {
        return override;
    }

    const error = new Error(message);
    error.isJoi = true;
    error.name = 'ValidationError';
    error.details = details;
    error._object = object;
    error.annotate = internals.annotate;
    return error;
};


internals.getPath = function (item) {

    return item.path || item.context.key;
};


// Inspired by json-stringify-safe
internals.safeStringify = function (obj, spaces) {

    return JSON.stringify(obj, internals.serializer(), spaces);
};

internals.serializer = function () {

    const keys = [];
    const stack = [];

    const cycleReplacer = (key, value) => {

        if (stack[0] === value) {
            return '[Circular ~]';
        }

        return '[Circular ~.' + keys.slice(0, stack.indexOf(value)).join('.') + ']';
    };

    return function (key, value) {

        if (stack.length > 0) {
            const thisPos = stack.indexOf(this);
            if (~thisPos) {
                stack.length = thisPos + 1;
                keys.length = thisPos + 1;
                keys[thisPos] = key;
            }
            else {
                stack.push(this);
                keys.push(key);
            }

            if (~stack.indexOf(value)) {
                value = cycleReplacer.call(this, key, value);
            }
        }
        else {
            stack.push(value);
        }

        if (Array.isArray(value) && value.placeholders) {
            const placeholders = value.placeholders;
            const arrWithPlaceholders = [];
            for (let i = 0; i < value.length; ++i) {
                if (placeholders[i]) {
                    arrWithPlaceholders.push(placeholders[i]);
                }
                arrWithPlaceholders.push(value[i]);
            }

            value = arrWithPlaceholders;
        }

        if (value === Infinity || value === -Infinity || Number.isNaN(value) ||
            typeof value === 'function' || typeof value === 'symbol') {
            return '[' + value.toString() + ']';
        }

        return value;
    };
};


internals.annotate = function (stripColorCodes) {

    const redFgEscape = stripColorCodes ? '' : '\u001b[31m';
    const redBgEscape = stripColorCodes ? '' : '\u001b[41m';
    const endColor = stripColorCodes ? '' : '\u001b[0m';

    if (typeof this._object !== 'object') {
        return this.details[0].message;
    }

    const obj = Hoek.clone(this._object || {});

    const lookup = {};
    for (let i = this.details.length - 1; i >= 0; --i) {        // Reverse order to process deepest child first
        const pos = i + 1;
        const error = this.details[i];
        const path = error.path.split('.');
        let ref = obj;
        for (let j = 0; j < path.length && ref; ++j) {
            const seg = path[j];
            if (j + 1 < path.length) {
                ref = ref[seg];
            }
            else {
                const value = ref[seg];
                if (Array.isArray(ref)) {
                    const arrayLabel = `_$idx$_${pos}_$end$_`;
                    if (!ref.placeholders) {
                        ref.placeholders = {};
                    }

                    if (ref.placeholders[seg]) {
                        ref.placeholders[seg] = ref.placeholders[seg].replace('_$end$_', `, ${pos}_$end$_`);
                    }
                    else {
                        ref.placeholders[seg] = arrayLabel;
                    }
                }
                else {
                    if (value !== undefined) {
                        delete ref[seg];
                        const objectLabel = `${seg}_$key$_${pos}_$end$_`;
                        ref[objectLabel] = value;
                        lookup[error.path] = objectLabel;
                    }
                    else if (lookup[error.path]) {
                        const replacement = lookup[error.path];
                        const appended = replacement.replace('_$end$_', `, ${pos}_$end$_`);
                        ref[appended] = ref[replacement];
                        lookup[error.path] = appended;
                        delete ref[replacement];
                    }
                    else {
                        ref[`_$miss$_${seg}|${pos}_$end$_`] = '__missing__';
                    }
                }
            }
        }
    }

    const replacers = {
        key: /_\$key\$_([, \d]+)_\$end\$_\"/g,
        missing: /\"_\$miss\$_([^\|]+)\|(\d+)_\$end\$_\"\: \"__missing__\"/g,
        arrayIndex: /\s*\"_\$idx\$_([, \d]+)_\$end\$_\",?\n(.*)/g,
        specials: /"\[(NaN|Symbol.*|-?Infinity|function.*|\(.*)\]"/g
    };

    let message = internals.safeStringify(obj, 2)
        .replace(replacers.key, ($0, $1) => `" ${redFgEscape}[${$1}]${endColor}`)
        .replace(replacers.missing, ($0, $1, $2) => `${redBgEscape}"${$1}"${endColor}${redFgEscape} [${$2}]: -- missing --${endColor}`)
        .replace(replacers.arrayIndex, ($0, $1, $2) => `\n${$2} ${redFgEscape}[${$1}]${endColor}`)
        .replace(replacers.specials, ($0, $1) => $1);

    message = `${message}\n${redFgEscape}`;

    for (let i = 0; i < this.details.length; ++i) {
        const pos = i + 1;
        message = `${message}\n[${pos}] ${this.details[i].message}`;
    }

    message = message + endColor;

    return message;
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ST = __webpack_require__(3);

module.exports = class AggregateName extends ST.SV {

	static get schema() {
		return ST.joi.string()
			.label('aggregate')
			.trim().min(1)
			.regex(/^[a-zA-Z0-9-_]*$/);
	}

};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ST = __webpack_require__(3);

module.exports = class SequenceNumber extends ST.SV {

	static get schema() {
		return ST.joi.number().integer().label('seq').integer().greater(-1);
	}

};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	extendedJoi: __webpack_require__(36),
	loggerFactory: __webpack_require__(92),
	returnPromise: __webpack_require__(93)
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	types: __webpack_require__(5),
	commands: __webpack_require__(30),
	lib: __webpack_require__(87),
	utils: __webpack_require__(16)
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var old;
if (typeof Promise !== "undefined") old = Promise;
function noConflict() {
    try { if (Promise === bluebird) Promise = old; }
    catch (e) {}
    return bluebird;
}
var bluebird = __webpack_require__(56)();
bluebird.noConflict = noConflict;
module.exports = bluebird;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var util = __webpack_require__(0);
var maybeWrapAsError = util.maybeWrapAsError;
var errors = __webpack_require__(6);
var OperationalError = errors.OperationalError;
var es5 = __webpack_require__(7);

function isUntypedError(obj) {
    return obj instanceof Error &&
        es5.getPrototypeOf(obj) === Error.prototype;
}

var rErrorKey = /^(?:name|message|stack|cause)$/;
function wrapAsOperationalError(obj) {
    var ret;
    if (isUntypedError(obj)) {
        ret = new OperationalError(obj);
        ret.name = obj.name;
        ret.message = obj.message;
        ret.stack = obj.stack;
        var keys = es5.keys(obj);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (!rErrorKey.test(key)) {
                ret[key] = obj[key];
            }
        }
        return ret;
    }
    util.markAsOriginatingFromRejection(obj);
    return obj;
}

function nodebackForPromise(promise, multiArgs) {
    return function(err, value) {
        if (promise === null) return;
        if (err) {
            var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
            promise._attachExtraTrace(wrapped);
            promise._reject(wrapped);
        } else if (!multiArgs) {
            promise._fulfill(value);
        } else {
            var $_len = arguments.length;var args = new Array(Math.max($_len - 1, 0)); for(var $_i = 1; $_i < $_len; ++$_i) {args[$_i - 1] = arguments[$_i];};
            promise._fulfill(args);
        }
        promise = null;
    };
}

module.exports = nodebackForPromise;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Any = __webpack_require__(2);
const Hoek = __webpack_require__(1);


// Declare internals

const internals = {
    Set: __webpack_require__(24)
};


internals.Boolean = class extends Any {
    constructor() {

        super();
        this._type = 'boolean';
        this._flags.insensitive = true;
        this._inner.truthySet = new internals.Set();
        this._inner.falsySet = new internals.Set();
    }

    _base(value, state, options) {

        const result = {
            value
        };

        if (typeof value === 'string' &&
            options.convert) {

            const normalized = this._flags.insensitive ? value.toLowerCase() : value;
            result.value = (normalized === 'true' ? true
                : (normalized === 'false' ? false : value));
        }

        if (typeof result.value !== 'boolean') {
            result.value = (this._inner.truthySet.has(value, null, null, this._flags.insensitive) ? true
                : (this._inner.falsySet.has(value, null, null, this._flags.insensitive) ? false : value));
        }

        result.errors = (typeof result.value === 'boolean') ? null : this.createError('boolean.base', null, state, options);
        return result;
    }

    truthy() {

        const obj = this.clone();
        const values = Hoek.flatten(Array.prototype.slice.call(arguments));
        for (let i = 0; i < values.length; ++i) {
            const value = values[i];

            Hoek.assert(value !== undefined, 'Cannot call truthy with undefined');
            obj._inner.truthySet.add(value);
        }
        return obj;
    }

    falsy() {

        const obj = this.clone();
        const values = Hoek.flatten(Array.prototype.slice.call(arguments));
        for (let i = 0; i < values.length; ++i) {
            const value = values[i];

            Hoek.assert(value !== undefined, 'Cannot call falsy with undefined');
            obj._inner.falsySet.add(value);
        }
        return obj;
    }

    insensitive(enabled) {

        const insensitive = enabled === undefined ? true : !!enabled;

        if (insensitive !== this._flags.insensitive) {
            const obj = this.clone();
            obj._flags.insensitive = insensitive;
            return obj;
        }

        return this;
    }

    describe() {

        const description = Any.prototype.describe.call(this);
        description.truthy = [true].concat(this._inner.truthySet.values());
        description.falsy = [false].concat(this._inner.falsySet.values());
        return description;
    }
};


module.exports = new internals.Boolean();


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(1);
const Any = __webpack_require__(2);
const Cast = __webpack_require__(9);
const Errors = __webpack_require__(13);
const Lazy = __webpack_require__(73);
const Ref = __webpack_require__(4);


// Declare internals

const internals = {
    alternatives: __webpack_require__(11),
    array: __webpack_require__(70),
    boolean: __webpack_require__(20),
    binary: __webpack_require__(71),
    date: __webpack_require__(12),
    number: __webpack_require__(22),
    object: __webpack_require__(23),
    string: __webpack_require__(25)
};


internals.root = function () {

    const any = new Any();

    const root = any.clone();
    root.any = function () {

        Hoek.assert(arguments.length === 0, 'Joi.any() does not allow arguments.');

        return any;
    };

    root.alternatives = root.alt = function () {

        return arguments.length ? internals.alternatives.try.apply(internals.alternatives, arguments) : internals.alternatives;
    };

    root.array = function () {

        Hoek.assert(arguments.length === 0, 'Joi.array() does not allow arguments.');

        return internals.array;
    };

    root.boolean = root.bool = function () {

        Hoek.assert(arguments.length === 0, 'Joi.boolean() does not allow arguments.');

        return internals.boolean;
    };

    root.binary = function () {

        Hoek.assert(arguments.length === 0, 'Joi.binary() does not allow arguments.');

        return internals.binary;
    };

    root.date = function () {

        Hoek.assert(arguments.length === 0, 'Joi.date() does not allow arguments.');

        return internals.date;
    };

    root.func = function () {

        Hoek.assert(arguments.length === 0, 'Joi.func() does not allow arguments.');

        return internals.object._func();
    };

    root.number = function () {

        Hoek.assert(arguments.length === 0, 'Joi.number() does not allow arguments.');

        return internals.number;
    };

    root.object = function () {

        return arguments.length ? internals.object.keys.apply(internals.object, arguments) : internals.object;
    };

    root.string = function () {

        Hoek.assert(arguments.length === 0, 'Joi.string() does not allow arguments.');

        return internals.string;
    };

    root.ref = function () {

        return Ref.create.apply(null, arguments);
    };

    root.isRef = function (ref) {

        return Ref.isRef(ref);
    };

    root.validate = function (value /*, [schema], [options], callback */) {

        const last = arguments[arguments.length - 1];
        const callback = typeof last === 'function' ? last : null;

        const count = arguments.length - (callback ? 1 : 0);
        if (count === 1) {
            return any.validate(value, callback);
        }

        const options = count === 3 ? arguments[2] : {};
        const schema = root.compile(arguments[1]);

        return schema._validateWithOptions(value, options, callback);
    };

    root.describe = function () {

        const schema = arguments.length ? root.compile(arguments[0]) : any;
        return schema.describe();
    };

    root.compile = function (schema) {

        try {
            return Cast.schema(schema);
        }
        catch (err) {
            if (err.hasOwnProperty('path')) {
                err.message = err.message + '(' + err.path + ')';
            }
            throw err;
        }
    };

    root.assert = function (value, schema, message) {

        root.attempt(value, schema, message);
    };

    root.attempt = function (value, schema, message) {

        const result = root.validate(value, schema);
        const error = result.error;
        if (error) {
            if (!message) {
                error.message = error.annotate();
                throw error;
            }

            if (!(message instanceof Error)) {
                error.message = message + ' ' + error.annotate();
                throw error;
            }

            throw message;
        }

        return result.value;
    };

    root.reach = function (schema, path) {

        Hoek.assert(schema && schema instanceof Any, 'you must provide a joi schema');
        Hoek.assert(typeof path === 'string', 'path must be a string');

        if (path === '') {
            return schema;
        }

        const parts = path.split('.');
        const children = schema._inner.children;
        if (!children) {
            return;
        }

        const key = parts[0];
        for (let i = 0; i < children.length; ++i) {
            const child = children[i];
            if (child.key === key) {
                return this.reach(child.schema, path.substr(key.length + 1));
            }
        }
    };

    root.lazy = function (fn) {

        return Lazy.set(fn);
    };

    root.extend = function () {

        const extensions = Hoek.flatten(Array.prototype.slice.call(arguments));
        Hoek.assert(extensions.length > 0, 'You need to provide at least one extension');

        this.assert(extensions, root.extensionsSchema);

        const joi = Object.create(this);

        for (let i = 0; i < extensions.length; ++i) {
            const extension = extensions[i];
            const base = (extension.base || this.any()).clone(); // Cloning because we're going to override language afterwards
            const ctor = base.constructor;
            const type = class extends ctor { // eslint-disable-line no-loop-func

                constructor() {

                    super();
                    if (extension.base) {
                        Object.assign(this, base);
                    }

                    this._type = extension.name;

                    if (extension.language) {
                        this._settings = this._settings || { language: {} };
                        this._settings.language = Hoek.applyToDefaults(this._settings.language, {
                            [extension.name]: extension.language
                        });
                    }
                }

            };

            if (extension.coerce) {
                type.prototype._coerce = function (value, state, options) {

                    if (ctor.prototype._coerce) {
                        const baseRet = ctor.prototype._coerce.call(this, value, state, options);

                        if (baseRet.errors) {
                            return baseRet;
                        }

                        value = baseRet.value;
                    }

                    const ret = extension.coerce.call(this, value, state, options);
                    if (ret instanceof Errors.Err) {
                        return { value, errors: ret };
                    }

                    return { value: ret };
                };
            }
            if (extension.pre) {
                type.prototype._base = function (value, state, options) {

                    if (ctor.prototype._base) {
                        const baseRet = ctor.prototype._base.call(this, value, state, options);

                        if (baseRet.errors) {
                            return baseRet;
                        }

                        value = baseRet.value;
                    }

                    const ret = extension.pre.call(this, value, state, options);
                    if (ret instanceof Errors.Err) {
                        return { value, errors: ret };
                    }

                    return { value: ret };
                };
            }

            if (extension.rules) {
                for (let j = 0; j < extension.rules.length; ++j) {
                    const rule = extension.rules[j];
                    const ruleArgs = rule.params ?
                        (rule.params instanceof Any ? rule.params._inner.children.map((k) => k.key) : Object.keys(rule.params)) :
                        [];
                    const validateArgs = rule.params ? Cast.schema(rule.params) : null;

                    type.prototype[rule.name] = function () { // eslint-disable-line no-loop-func

                        if (arguments.length > ruleArgs.length) {
                            throw new Error('Unexpected number of arguments');
                        }

                        const args = Array.prototype.slice.call(arguments);
                        let hasRef = false;
                        let arg = {};

                        for (let k = 0; k < ruleArgs.length; ++k) {
                            arg[ruleArgs[k]] = args[k];
                            if (!hasRef && Ref.isRef(args[k])) {
                                hasRef = true;
                            }
                        }

                        if (validateArgs) {
                            arg = joi.attempt(arg, validateArgs);
                        }

                        let schema;
                        if (rule.validate) {
                            const validate = function (value, state, options) {

                                return rule.validate.call(this, arg, value, state, options);
                            };

                            schema = this._test(rule.name, arg, validate, {
                                description: rule.description,
                                hasRef
                            });
                        }
                        else {
                            schema = this.clone();
                        }

                        if (rule.setup) {
                            rule.setup.call(schema, arg);
                        }

                        return schema;
                    };
                }
            }

            if (extension.describe) {
                type.prototype.describe = function () {

                    const description = ctor.prototype.describe.call(this);
                    return extension.describe.call(this, description);
                };
            }

            const instance = new type();
            joi[extension.name] = function () {

                return instance;
            };
        }

        return joi;
    };

    root.extensionsSchema = internals.array.items(internals.object.keys({
        base: internals.object.type(Any, 'Joi object'),
        name: internals.string.required(),
        coerce: internals.object._func().arity(3),
        pre: internals.object._func().arity(3),
        language: internals.object,
        describe: internals.object._func().arity(1),
        rules: internals.array.items(internals.object.keys({
            name: internals.string.required(),
            setup: internals.object._func().arity(1),
            validate: internals.object._func().arity(4),
            params: [
                internals.object.pattern(/.*/, internals.object.type(Any, 'Joi object')),
                internals.object.type(internals.object.constructor, 'Joi object')
            ],
            description: [internals.string, internals.object._func().arity(1)]
        }).or('setup', 'validate'))
    })).strict();

    root.version = __webpack_require__(80).version;

    return root;
};


module.exports = internals.root();


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Any = __webpack_require__(2);
const Ref = __webpack_require__(4);
const Hoek = __webpack_require__(1);


// Declare internals

const internals = {
    precisionRx: /(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/
};


internals.Number = class extends Any {

    constructor() {

        super();
        this._type = 'number';
        this._invalids.add(Infinity);
        this._invalids.add(-Infinity);
    }

    _base(value, state, options) {

        const result = {
            errors: null,
            value
        };

        if (typeof value === 'string' &&
            options.convert) {

            const number = parseFloat(value);
            result.value = (isNaN(number) || !isFinite(value)) ? NaN : number;
        }

        const isNumber = typeof result.value === 'number' && !isNaN(result.value);

        if (options.convert && 'precision' in this._flags && isNumber) {

            // This is conceptually equivalent to using toFixed but it should be much faster
            const precision = Math.pow(10, this._flags.precision);
            result.value = Math.round(result.value * precision) / precision;
        }

        result.errors = isNumber ? null : this.createError('number.base', null, state, options);
        return result;
    }

    multiple(base) {

        const isRef = Ref.isRef(base);

        if (!isRef) {
            Hoek.assert(typeof base === 'number' && isFinite(base), 'multiple must be a number');
            Hoek.assert(base > 0, 'multiple must be greater than 0');
        }

        return this._test('multiple', base, function (value, state, options) {

            const divisor = isRef ? base(state.reference || state.parent, options) : base;

            if (isRef && (typeof divisor !== 'number' || !isFinite(divisor))) {
                return this.createError('number.ref', { ref: base.key }, state, options);
            }

            if (value % divisor === 0) {
                return value;
            }

            return this.createError('number.multiple', { multiple: base, value }, state, options);
        });
    }

    integer() {

        return this._test('integer', undefined, function (value, state, options) {

            return Hoek.isInteger(value) ? value : this.createError('number.integer', { value }, state, options);
        });
    }

    negative() {

        return this._test('negative', undefined, function (value, state, options) {

            if (value < 0) {
                return value;
            }

            return this.createError('number.negative', { value }, state, options);
        });
    }

    positive() {

        return this._test('positive', undefined, function (value, state, options) {

            if (value > 0) {
                return value;
            }

            return this.createError('number.positive', { value }, state, options);
        });
    }

    precision(limit) {

        Hoek.assert(Hoek.isInteger(limit), 'limit must be an integer');
        Hoek.assert(!('precision' in this._flags), 'precision already set');

        const obj = this._test('precision', limit, function (value, state, options) {

            const places = value.toString().match(internals.precisionRx);
            const decimals = Math.max((places[1] ? places[1].length : 0) - (places[2] ? parseInt(places[2], 10) : 0), 0);
            if (decimals <= limit) {
                return value;
            }

            return this.createError('number.precision', { limit, value }, state, options);
        });

        obj._flags.precision = limit;
        return obj;
    }

};


internals.compare = function (type, compare) {

    return function (limit) {

        const isRef = Ref.isRef(limit);
        const isNumber = typeof limit === 'number' && !isNaN(limit);

        Hoek.assert(isNumber || isRef, 'limit must be a number or reference');

        return this._test(type, limit, function (value, state, options) {

            let compareTo;
            if (isRef) {
                compareTo = limit(state.reference || state.parent, options);

                if (!(typeof compareTo === 'number' && !isNaN(compareTo))) {
                    return this.createError('number.ref', { ref: limit.key }, state, options);
                }
            }
            else {
                compareTo = limit;
            }

            if (compare(value, compareTo)) {
                return value;
            }

            return this.createError('number.' + type, { limit: compareTo, value }, state, options);
        });
    };
};


internals.Number.prototype.min = internals.compare('min', (value, limit) => value >= limit);
internals.Number.prototype.max = internals.compare('max', (value, limit) => value <= limit);
internals.Number.prototype.greater = internals.compare('greater', (value, limit) => value > limit);
internals.Number.prototype.less = internals.compare('less', (value, limit) => value < limit);


module.exports = new internals.Number();


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(1);
const Topo = __webpack_require__(79);
const Any = __webpack_require__(2);
const Errors = __webpack_require__(13);
const Cast = __webpack_require__(9);
const Ref = __webpack_require__(4);


// Declare internals

const internals = {};


internals.Object = class extends Any {

    constructor() {

        super();
        this._type = 'object';
        this._inner.children = null;
        this._inner.renames = [];
        this._inner.dependencies = [];
        this._inner.patterns = [];
    }

    _base(value, state, options) {

        let target = value;
        const errors = [];
        const finish = () => {

            return {
                value: target,
                errors: errors.length ? errors : null
            };
        };

        if (typeof value === 'string' &&
            options.convert) {

            value = internals.safeParse(value);
        }

        const type = this._flags.func ? 'function' : 'object';
        if (!value ||
            typeof value !== type ||
            Array.isArray(value)) {

            errors.push(this.createError(type + '.base', null, state, options));
            return finish();
        }

        // Skip if there are no other rules to test

        if (!this._inner.renames.length &&
            !this._inner.dependencies.length &&
            !this._inner.children &&                    // null allows any keys
            !this._inner.patterns.length) {

            target = value;
            return finish();
        }

        // Ensure target is a local copy (parsed) or shallow copy

        if (target === value) {
            if (type === 'object') {
                target = Object.create(Object.getPrototypeOf(value));
            }
            else {
                target = function () {

                    return value.apply(this, arguments);
                };

                target.prototype = Hoek.clone(value.prototype);
            }

            const valueKeys = Object.keys(value);
            for (let i = 0; i < valueKeys.length; ++i) {
                target[valueKeys[i]] = value[valueKeys[i]];
            }
        }
        else {
            target = value;
        }

        // Rename keys

        const renamed = {};
        for (let i = 0; i < this._inner.renames.length; ++i) {
            const rename = this._inner.renames[i];

            if (rename.options.ignoreUndefined && target[rename.from] === undefined) {
                continue;
            }

            if (!rename.options.multiple &&
                renamed[rename.to]) {

                errors.push(this.createError('object.rename.multiple', { from: rename.from, to: rename.to }, state, options));
                if (options.abortEarly) {
                    return finish();
                }
            }

            if (Object.prototype.hasOwnProperty.call(target, rename.to) &&
                !rename.options.override &&
                !renamed[rename.to]) {

                errors.push(this.createError('object.rename.override', { from: rename.from, to: rename.to }, state, options));
                if (options.abortEarly) {
                    return finish();
                }
            }

            if (target[rename.from] === undefined) {
                delete target[rename.to];
            }
            else {
                target[rename.to] = target[rename.from];
            }

            renamed[rename.to] = true;

            if (!rename.options.alias) {
                delete target[rename.from];
            }
        }

        // Validate schema

        if (!this._inner.children &&            // null allows any keys
            !this._inner.patterns.length &&
            !this._inner.dependencies.length) {

            return finish();
        }

        const unprocessed = Hoek.mapToObject(Object.keys(target));

        if (this._inner.children) {
            for (let i = 0; i < this._inner.children.length; ++i) {
                const child = this._inner.children[i];
                const key = child.key;
                const item = target[key];

                delete unprocessed[key];

                const localState = { key, path: (state.path || '') + (state.path && key ? '.' : '') + key, parent: target, reference: state.reference };
                const result = child.schema._validate(item, localState, options);
                if (result.errors) {
                    errors.push(this.createError('object.child', { key, child: child.schema._getLabel(key), reason: result.errors }, localState, options));

                    if (options.abortEarly) {
                        return finish();
                    }
                }

                if (child.schema._flags.strip || (result.value === undefined && result.value !== item)) {
                    delete target[key];
                }
                else if (result.value !== undefined) {
                    target[key] = result.value;
                }
            }
        }

        // Unknown keys

        let unprocessedKeys = Object.keys(unprocessed);
        if (unprocessedKeys.length &&
            this._inner.patterns.length) {

            for (let i = 0; i < unprocessedKeys.length; ++i) {
                const key = unprocessedKeys[i];
                const localState = { key, path: (state.path ? state.path + '.' : '') + key, parent: target, reference: state.reference };
                const item = target[key];

                for (let j = 0; j < this._inner.patterns.length; ++j) {
                    const pattern = this._inner.patterns[j];

                    if (pattern.regex.test(key)) {
                        delete unprocessed[key];

                        const result = pattern.rule._validate(item, localState, options);
                        if (result.errors) {
                            errors.push(this.createError('object.child', { key, child: pattern.rule._getLabel(key), reason: result.errors }, localState, options));

                            if (options.abortEarly) {
                                return finish();
                            }
                        }

                        if (result.value !== undefined) {
                            target[key] = result.value;
                        }
                    }
                }
            }

            unprocessedKeys = Object.keys(unprocessed);
        }

        if ((this._inner.children || this._inner.patterns.length) && unprocessedKeys.length) {
            if (options.stripUnknown ||
                options.skipFunctions) {

                const stripUnknown = options.stripUnknown
                    ? (options.stripUnknown === true ? true : !!options.stripUnknown.objects)
                    : false;


                for (let i = 0; i < unprocessedKeys.length; ++i) {
                    const key = unprocessedKeys[i];

                    if (stripUnknown) {
                        delete target[key];
                        delete unprocessed[key];
                    }
                    else if (typeof target[key] === 'function') {
                        delete unprocessed[key];
                    }
                }

                unprocessedKeys = Object.keys(unprocessed);
            }

            if (unprocessedKeys.length &&
                (this._flags.allowUnknown !== undefined ? !this._flags.allowUnknown : !options.allowUnknown)) {

                for (let i = 0; i < unprocessedKeys.length; ++i) {
                    const unprocessedKey = unprocessedKeys[i];
                    errors.push(this.createError('object.allowUnknown', { child: unprocessedKey }, { key: unprocessedKey, path: state.path + (state.path ? '.' : '') + unprocessedKey }, options));
                }
            }
        }

        // Validate dependencies

        for (let i = 0; i < this._inner.dependencies.length; ++i) {
            const dep = this._inner.dependencies[i];
            const err = internals[dep.type].call(this, dep.key !== null && target[dep.key], dep.peers, target, { key: dep.key, path: (state.path || '') + (dep.key ? '.' + dep.key : '') }, options);
            if (err instanceof Errors.Err) {
                errors.push(err);
                if (options.abortEarly) {
                    return finish();
                }
            }
        }

        return finish();
    }

    _func() {

        const obj = this.clone();
        obj._flags.func = true;
        return obj;
    }

    keys(schema) {

        Hoek.assert(schema === null || schema === undefined || typeof schema === 'object', 'Object schema must be a valid object');
        Hoek.assert(!schema || !(schema instanceof Any), 'Object schema cannot be a joi schema');

        const obj = this.clone();

        if (!schema) {
            obj._inner.children = null;
            return obj;
        }

        const children = Object.keys(schema);

        if (!children.length) {
            obj._inner.children = [];
            return obj;
        }

        const topo = new Topo();
        if (obj._inner.children) {
            for (let i = 0; i < obj._inner.children.length; ++i) {
                const child = obj._inner.children[i];

                // Only add the key if we are not going to replace it later
                if (children.indexOf(child.key) === -1) {
                    topo.add(child, { after: child._refs, group: child.key });
                }
            }
        }

        for (let i = 0; i < children.length; ++i) {
            const key = children[i];
            const child = schema[key];
            try {
                const cast = Cast.schema(child);
                topo.add({ key, schema: cast }, { after: cast._refs, group: key });
            }
            catch (castErr) {
                if (castErr.hasOwnProperty('path')) {
                    castErr.path = key + '.' + castErr.path;
                }
                else {
                    castErr.path = key;
                }
                throw castErr;
            }
        }

        obj._inner.children = topo.nodes;

        return obj;
    }

    unknown(allow) {

        const obj = this.clone();
        obj._flags.allowUnknown = (allow !== false);
        return obj;
    }

    length(limit) {

        Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

        return this._test('length', limit, function (value, state, options) {

            if (Object.keys(value).length === limit) {
                return value;
            }

            return this.createError('object.length', { limit }, state, options);
        });
    }

    arity(n) {

        Hoek.assert(Hoek.isInteger(n) && n >= 0, 'n must be a positive integer');

        return this._test('arity', n, function (value, state, options) {

            if (value.length === n) {
                return value;
            }

            return this.createError('function.arity', { n }, state, options);
        });
    }

    minArity(n) {

        Hoek.assert(Hoek.isInteger(n) && n > 0, 'n must be a strict positive integer');

        return this._test('minArity', n, function (value, state, options) {

            if (value.length >= n) {
                return value;
            }

            return this.createError('function.minArity', { n }, state, options);
        });
    }

    maxArity(n) {

        Hoek.assert(Hoek.isInteger(n) && n >= 0, 'n must be a positive integer');

        return this._test('maxArity', n, function (value, state, options) {

            if (value.length <= n) {
                return value;
            }

            return this.createError('function.maxArity', { n }, state, options);
        });
    }

    min(limit) {

        Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

        return this._test('min', limit, function (value, state, options) {

            if (Object.keys(value).length >= limit) {
                return value;
            }

            return this.createError('object.min', { limit }, state, options);
        });
    }

    max(limit) {

        Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

        return this._test('max', limit, function (value, state, options) {

            if (Object.keys(value).length <= limit) {
                return value;
            }

            return this.createError('object.max', { limit }, state, options);
        });
    }

    pattern(pattern, schema) {

        Hoek.assert(pattern instanceof RegExp, 'Invalid regular expression');
        Hoek.assert(schema !== undefined, 'Invalid rule');

        pattern = new RegExp(pattern.source, pattern.ignoreCase ? 'i' : undefined);         // Future version should break this and forbid unsupported regex flags

        try {
            schema = Cast.schema(schema);
        }
        catch (castErr) {
            if (castErr.hasOwnProperty('path')) {
                castErr.message = castErr.message + '(' + castErr.path + ')';
            }

            throw castErr;
        }


        const obj = this.clone();
        obj._inner.patterns.push({ regex: pattern, rule: schema });
        return obj;
    }

    schema() {

        return this._test('schema', null, function (value, state, options) {

            if (value instanceof Any) {
                return value;
            }

            return this.createError('object.schema', null, state, options);
        });
    }

    with(key, peers) {

        return this._dependency('with', key, peers);
    }

    without(key, peers) {

        return this._dependency('without', key, peers);
    }

    xor() {

        const peers = Hoek.flatten(Array.prototype.slice.call(arguments));
        return this._dependency('xor', null, peers);
    }

    or() {

        const peers = Hoek.flatten(Array.prototype.slice.call(arguments));
        return this._dependency('or', null, peers);
    }

    and() {

        const peers = Hoek.flatten(Array.prototype.slice.call(arguments));
        return this._dependency('and', null, peers);
    }

    nand() {

        const peers = Hoek.flatten(Array.prototype.slice.call(arguments));
        return this._dependency('nand', null, peers);
    }

    requiredKeys(children) {

        children = Hoek.flatten(Array.prototype.slice.call(arguments));
        return this.applyFunctionToChildren(children, 'required');
    }

    optionalKeys(children) {

        children = Hoek.flatten(Array.prototype.slice.call(arguments));
        return this.applyFunctionToChildren(children, 'optional');
    }

    rename(from, to, options) {

        Hoek.assert(typeof from === 'string', 'Rename missing the from argument');
        Hoek.assert(typeof to === 'string', 'Rename missing the to argument');
        Hoek.assert(to !== from, 'Cannot rename key to same name:', from);

        for (let i = 0; i < this._inner.renames.length; ++i) {
            Hoek.assert(this._inner.renames[i].from !== from, 'Cannot rename the same key multiple times');
        }

        const obj = this.clone();

        obj._inner.renames.push({
            from,
            to,
            options: Hoek.applyToDefaults(internals.renameDefaults, options || {})
        });

        return obj;
    }

    applyFunctionToChildren(children, fn, args, root) {

        children = [].concat(children);
        Hoek.assert(children.length > 0, 'expected at least one children');

        const groupedChildren = internals.groupChildren(children);
        let obj;

        if ('' in groupedChildren) {
            obj = this[fn].apply(this, args);
            delete groupedChildren[''];
        }
        else {
            obj = this.clone();
        }

        if (obj._inner.children) {
            root = root ? (root + '.') : '';

            for (let i = 0; i < obj._inner.children.length; ++i) {
                const child = obj._inner.children[i];
                const group = groupedChildren[child.key];

                if (group) {
                    obj._inner.children[i] = {
                        key: child.key,
                        _refs: child._refs,
                        schema: child.schema.applyFunctionToChildren(group, fn, args, root + child.key)
                    };

                    delete groupedChildren[child.key];
                }
            }
        }

        const remaining = Object.keys(groupedChildren);
        Hoek.assert(remaining.length === 0, 'unknown key(s)', remaining.join(', '));

        return obj;
    }

    _dependency(type, key, peers) {

        peers = [].concat(peers);
        for (let i = 0; i < peers.length; ++i) {
            Hoek.assert(typeof peers[i] === 'string', type, 'peers must be a string or array of strings');
        }

        const obj = this.clone();
        obj._inner.dependencies.push({ type, key, peers });
        return obj;
    }

    describe(shallow) {

        const description = Any.prototype.describe.call(this);

        if (description.rules) {
            for (let i = 0; i < description.rules.length; ++i) {
                const rule = description.rules[i];
                // Coverage off for future-proof descriptions, only object().assert() is use right now
                if (/* $lab:coverage:off$ */rule.arg &&
                    typeof rule.arg === 'object' &&
                    rule.arg.schema &&
                    rule.arg.ref /* $lab:coverage:on$ */) {
                    rule.arg = {
                        schema: rule.arg.schema.describe(),
                        ref: rule.arg.ref.toString()
                    };
                }
            }
        }

        if (this._inner.children &&
            !shallow) {

            description.children = {};
            for (let i = 0; i < this._inner.children.length; ++i) {
                const child = this._inner.children[i];
                description.children[child.key] = child.schema.describe();
            }
        }

        if (this._inner.dependencies.length) {
            description.dependencies = Hoek.clone(this._inner.dependencies);
        }

        if (this._inner.patterns.length) {
            description.patterns = [];

            for (let i = 0; i < this._inner.patterns.length; ++i) {
                const pattern = this._inner.patterns[i];
                description.patterns.push({ regex: pattern.regex.toString(), rule: pattern.rule.describe() });
            }
        }

        if (this._inner.renames.length > 0) {
            description.renames = Hoek.clone(this._inner.renames);
        }

        return description;
    }

    assert(ref, schema, message) {

        ref = Cast.ref(ref);
        Hoek.assert(ref.isContext || ref.depth > 1, 'Cannot use assertions for root level references - use direct key rules instead');
        message = message || 'pass the assertion test';

        try {
            schema = Cast.schema(schema);
        }
        catch (castErr) {
            if (castErr.hasOwnProperty('path')) {
                castErr.message = castErr.message + '(' + castErr.path + ')';
            }

            throw castErr;
        }

        const key = ref.path[ref.path.length - 1];
        const path = ref.path.join('.');

        return this._test('assert', { schema, ref }, function (value, state, options) {

            const result = schema._validate(ref(value), null, options, value);
            if (!result.errors) {
                return value;
            }

            const localState = Hoek.merge({}, state);
            localState.key = key;
            localState.path = path;
            return this.createError('object.assert', { ref: localState.path, message }, localState, options);
        });
    }

    type(constructor, name) {

        Hoek.assert(typeof constructor === 'function', 'type must be a constructor function');
        const typeData = {
            name: name || constructor.name,
            ctor: constructor
        };

        return this._test('type', typeData, function (value, state, options) {

            if (value instanceof constructor) {
                return value;
            }

            return this.createError('object.type', { type: typeData.name }, state, options);
        });
    }

    ref() {

        return this._test('ref', null, function (value, state, options) {

            if (Ref.isRef(value)) {
                return value;
            }

            return this.createError('function.ref', null, state, options);
        });
    }
};

internals.safeParse = function (value) {

    try {
        return JSON.parse(value);
    }
    catch (parseErr) {}

    return value;
};


internals.renameDefaults = {
    alias: false,                   // Keep old value in place
    multiple: false,                // Allow renaming multiple keys into the same target
    override: false                 // Overrides an existing key
};


internals.groupChildren = function (children) {

    children.sort();

    const grouped = {};

    for (let i = 0; i < children.length; ++i) {
        const child = children[i];
        Hoek.assert(typeof child === 'string', 'children must be strings');
        const group = child.split('.')[0];
        const childGroup = grouped[group] = (grouped[group] || []);
        childGroup.push(child.substring(group.length + 1));
    }

    return grouped;
};


internals.with = function (value, peers, parent, state, options) {

    if (value === undefined) {
        return value;
    }

    for (let i = 0; i < peers.length; ++i) {
        const peer = peers[i];
        if (!Object.prototype.hasOwnProperty.call(parent, peer) ||
            parent[peer] === undefined) {

            return this.createError('object.with', { peer }, state, options);
        }
    }

    return value;
};


internals.without = function (value, peers, parent, state, options) {

    if (value === undefined) {
        return value;
    }

    for (let i = 0; i < peers.length; ++i) {
        const peer = peers[i];
        if (Object.prototype.hasOwnProperty.call(parent, peer) &&
            parent[peer] !== undefined) {

            return this.createError('object.without', { peer }, state, options);
        }
    }

    return value;
};


internals.xor = function (value, peers, parent, state, options) {

    const present = [];
    for (let i = 0; i < peers.length; ++i) {
        const peer = peers[i];
        if (Object.prototype.hasOwnProperty.call(parent, peer) &&
            parent[peer] !== undefined) {

            present.push(peer);
        }
    }

    if (present.length === 1) {
        return value;
    }

    if (present.length === 0) {
        return this.createError('object.missing', { peers }, state, options);
    }

    return this.createError('object.xor', { peers }, state, options);
};


internals.or = function (value, peers, parent, state, options) {

    for (let i = 0; i < peers.length; ++i) {
        const peer = peers[i];
        if (Object.prototype.hasOwnProperty.call(parent, peer) &&
            parent[peer] !== undefined) {
            return value;
        }
    }

    return this.createError('object.missing', { peers }, state, options);
};


internals.and = function (value, peers, parent, state, options) {

    const missing = [];
    const present = [];
    const count = peers.length;
    for (let i = 0; i < count; ++i) {
        const peer = peers[i];
        if (!Object.prototype.hasOwnProperty.call(parent, peer) ||
            parent[peer] === undefined) {

            missing.push(peer);
        }
        else {
            present.push(peer);
        }
    }

    const aon = (missing.length === count || present.length === count);
    return !aon ? this.createError('object.and', { present, missing }, state, options) : null;
};


internals.nand = function (value, peers, parent, state, options) {

    const present = [];
    for (let i = 0; i < peers.length; ++i) {
        const peer = peers[i];
        if (Object.prototype.hasOwnProperty.call(parent, peer) &&
            parent[peer] !== undefined) {

            present.push(peer);
        }
    }

    const values = Hoek.clone(peers);
    const main = values.splice(0, 1)[0];
    const allPresent = (present.length === peers.length);
    return allPresent ? this.createError('object.nand', { main, peers: values }, state, options) : null;
};


module.exports = new internals.Object();


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Ref = __webpack_require__(4);

module.exports = class Set {

    constructor() {

        this._set = [];
    }

    add(value, refs) {

        if (!Ref.isRef(value) && this.has(value, null, null, false)) {

            return;
        }

        if (refs !== undefined) { // If it's a merge, we don't have any refs
            Ref.push(refs, value);
        }

        this._set.push(value);
        return this;
    }

    merge(add, remove) {

        for (let i = 0; i < add._set.length; ++i) {
            this.add(add._set[i]);
        }

        for (let i = 0; i < remove._set.length; ++i) {
            this.remove(remove._set[i]);
        }

        return this;
    }

    remove(value) {

        this._set = this._set.filter((item) => value !== item);
        return this;
    }

    has(value, state, options, insensitive) {

        for (let i = 0; i < this._set.length; ++i) {
            let items = this._set[i];

            if (state && Ref.isRef(items)) { // Only resolve references if there is a state, otherwise it's a merge
                items = items(state.reference || state.parent, options);
            }

            if (!Array.isArray(items)) {
                items = [items];
            }

            for (let j = 0; j < items.length; ++j) {
                const item = items[j];
                if (typeof value !== typeof item) {
                    continue;
                }

                if (value === item ||
                    (value instanceof Date && item instanceof Date && value.getTime() === item.getTime()) ||
                    (insensitive && typeof value === 'string' && value.toLowerCase() === item.toLowerCase()) ||
                    (Buffer.isBuffer(value) && Buffer.isBuffer(item) && value.length === item.length && value.toString('binary') === item.toString('binary'))) {

                    return true;
                }
            }
        }

        return false;
    }

    values(options) {

        if (options && options.stripUndefined) {
            const values = [];

            for (let i = 0; i < this._set.length; ++i) {
                const item = this._set[i];
                if (item !== undefined) {
                    values.push(item);
                }
            }

            return values;
        }

        return this._set.slice();
    }

    slice() {

        const newSet = new Set();
        newSet._set = this._set.slice();

        return newSet;
    }

    concat(source) {

        const newSet = new Set();
        newSet._set = this._set.concat(source._set);

        return newSet;
    }
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Net = __webpack_require__(96);
const Hoek = __webpack_require__(1);
const Isemail = __webpack_require__(78);
const Any = __webpack_require__(2);
const Ref = __webpack_require__(4);
const JoiDate = __webpack_require__(12);
const Uri = __webpack_require__(76);
const Ip = __webpack_require__(75);

// Declare internals

const internals = {
    uriRegex: Uri.createUriRegex(),
    ipRegex: Ip.createIpRegex(['ipv4', 'ipv6', 'ipvfuture'], 'optional')
};

internals.String = class extends Any {

    constructor() {

        super();
        this._type = 'string';
        this._invalids.add('');
    }

    _base(value, state, options) {

        if (typeof value === 'string' &&
            options.convert) {

            if (this._flags.case) {
                value = (this._flags.case === 'upper' ? value.toLocaleUpperCase() : value.toLocaleLowerCase());
            }

            if (this._flags.trim) {
                value = value.trim();
            }

            if (this._inner.replacements) {

                for (let i = 0; i < this._inner.replacements.length; ++i) {
                    const replacement = this._inner.replacements[i];
                    value = value.replace(replacement.pattern, replacement.replacement);
                }
            }

            if (this._flags.truncate) {
                for (let i = 0; i < this._tests.length; ++i) {
                    const test = this._tests[i];
                    if (test.name === 'max') {
                        value = value.slice(0, test.arg);
                        break;
                    }
                }
            }
        }

        return {
            value,
            errors: (typeof value === 'string') ? null : this.createError('string.base', { value }, state, options)
        };
    }

    insensitive() {

        const obj = this.clone();
        obj._flags.insensitive = true;
        return obj;
    }

    creditCard() {

        return this._test('creditCard', undefined, function (value, state, options) {

            let i = value.length;
            let sum = 0;
            let mul = 1;

            while (i--) {
                const char = value.charAt(i) * mul;
                sum = sum + (char - (char > 9) * 9);
                mul = mul ^ 3;
            }

            const check = (sum % 10 === 0) && (sum > 0);
            return check ? value : this.createError('string.creditCard', { value }, state, options);
        });
    }

    regex(pattern, patternOptions) {

        Hoek.assert(pattern instanceof RegExp, 'pattern must be a RegExp');

        const patternObject = {
            pattern: new RegExp(pattern.source, pattern.ignoreCase ? 'i' : undefined)         // Future version should break this and forbid unsupported regex flags
        };

        if (typeof patternOptions === 'string') {
            patternObject.name = patternOptions;
        }
        else if (typeof patternOptions === 'object') {
            patternObject.invert = !!patternOptions.invert;

            if (patternOptions.name) {
                patternObject.name = patternOptions.name;
            }
        }

        const errorCode = ['string.regex', patternObject.invert ? '.invert' : '', patternObject.name ? '.name' : '.base'].join('');

        return this._test('regex', patternObject, function (value, state, options) {

            const patternMatch = patternObject.pattern.test(value);

            if (patternMatch ^ patternObject.invert) {
                return value;
            }

            return this.createError(errorCode, { name: patternObject.name, pattern: patternObject.pattern, value }, state, options);
        });
    }

    alphanum() {

        return this._test('alphanum', undefined, function (value, state, options) {

            if (/^[a-zA-Z0-9]+$/.test(value)) {
                return value;
            }

            return this.createError('string.alphanum', { value }, state, options);
        });
    }

    token() {

        return this._test('token', undefined, function (value, state, options) {

            if (/^\w+$/.test(value)) {
                return value;
            }

            return this.createError('string.token', { value }, state, options);
        });
    }

    email(isEmailOptions) {

        if (isEmailOptions) {
            Hoek.assert(typeof isEmailOptions === 'object', 'email options must be an object');
            Hoek.assert(typeof isEmailOptions.checkDNS === 'undefined', 'checkDNS option is not supported');
            Hoek.assert(typeof isEmailOptions.tldWhitelist === 'undefined' ||
                typeof isEmailOptions.tldWhitelist === 'object', 'tldWhitelist must be an array or object');
            Hoek.assert(typeof isEmailOptions.minDomainAtoms === 'undefined' ||
                Hoek.isInteger(isEmailOptions.minDomainAtoms) && isEmailOptions.minDomainAtoms > 0,
                'minDomainAtoms must be a positive integer');
            Hoek.assert(typeof isEmailOptions.errorLevel === 'undefined' || typeof isEmailOptions.errorLevel === 'boolean' ||
                (Hoek.isInteger(isEmailOptions.errorLevel) && isEmailOptions.errorLevel >= 0),
                'errorLevel must be a non-negative integer or boolean');
        }

        return this._test('email', isEmailOptions, function (value, state, options) {

            try {
                const result = Isemail.validate(value, isEmailOptions);
                if (result === true || result === 0) {
                    return value;
                }
            }
            catch (e) { }

            return this.createError('string.email', { value }, state, options);
        });
    }

    ip(ipOptions) {

        let regex = internals.ipRegex;
        ipOptions = ipOptions || {};
        Hoek.assert(typeof ipOptions === 'object', 'options must be an object');

        if (ipOptions.cidr) {
            Hoek.assert(typeof ipOptions.cidr === 'string', 'cidr must be a string');
            ipOptions.cidr = ipOptions.cidr.toLowerCase();

            Hoek.assert(ipOptions.cidr in Ip.cidrs, 'cidr must be one of ' + Object.keys(Ip.cidrs).join(', '));

            // If we only received a `cidr` setting, create a regex for it. But we don't need to create one if `cidr` is "optional" since that is the default
            if (!ipOptions.version && ipOptions.cidr !== 'optional') {
                regex = Ip.createIpRegex(['ipv4', 'ipv6', 'ipvfuture'], ipOptions.cidr);
            }
        }
        else {

            // Set our default cidr strategy
            ipOptions.cidr = 'optional';
        }

        let versions;
        if (ipOptions.version) {
            if (!Array.isArray(ipOptions.version)) {
                ipOptions.version = [ipOptions.version];
            }

            Hoek.assert(ipOptions.version.length >= 1, 'version must have at least 1 version specified');

            versions = [];
            for (let i = 0; i < ipOptions.version.length; ++i) {
                let version = ipOptions.version[i];
                Hoek.assert(typeof version === 'string', 'version at position ' + i + ' must be a string');
                version = version.toLowerCase();
                Hoek.assert(Ip.versions[version], 'version at position ' + i + ' must be one of ' + Object.keys(Ip.versions).join(', '));
                versions.push(version);
            }

            // Make sure we have a set of versions
            versions = Hoek.unique(versions);

            regex = Ip.createIpRegex(versions, ipOptions.cidr);
        }

        return this._test('ip', ipOptions, function (value, state, options) {

            if (regex.test(value)) {
                return value;
            }

            if (versions) {
                return this.createError('string.ipVersion', { value, cidr: ipOptions.cidr, version: versions }, state, options);
            }

            return this.createError('string.ip', { value, cidr: ipOptions.cidr }, state, options);
        });
    }

    uri(uriOptions) {

        let customScheme = '';
        let allowRelative = false;
        let relativeOnly = false;
        let regex = internals.uriRegex;

        if (uriOptions) {
            Hoek.assert(typeof uriOptions === 'object', 'options must be an object');

            if (uriOptions.scheme) {
                Hoek.assert(uriOptions.scheme instanceof RegExp || typeof uriOptions.scheme === 'string' || Array.isArray(uriOptions.scheme), 'scheme must be a RegExp, String, or Array');

                if (!Array.isArray(uriOptions.scheme)) {
                    uriOptions.scheme = [uriOptions.scheme];
                }

                Hoek.assert(uriOptions.scheme.length >= 1, 'scheme must have at least 1 scheme specified');

                // Flatten the array into a string to be used to match the schemes.
                for (let i = 0; i < uriOptions.scheme.length; ++i) {
                    const scheme = uriOptions.scheme[i];
                    Hoek.assert(scheme instanceof RegExp || typeof scheme === 'string', 'scheme at position ' + i + ' must be a RegExp or String');

                    // Add OR separators if a value already exists
                    customScheme = customScheme + (customScheme ? '|' : '');

                    // If someone wants to match HTTP or HTTPS for example then we need to support both RegExp and String so we don't escape their pattern unknowingly.
                    if (scheme instanceof RegExp) {
                        customScheme = customScheme + scheme.source;
                    }
                    else {
                        Hoek.assert(/[a-zA-Z][a-zA-Z0-9+-\.]*/.test(scheme), 'scheme at position ' + i + ' must be a valid scheme');
                        customScheme = customScheme + Hoek.escapeRegex(scheme);
                    }
                }
            }

            if (uriOptions.allowRelative) {
                allowRelative = true;
            }

            if (uriOptions.relativeOnly) {
                relativeOnly = true;
            }
        }

        if (customScheme || allowRelative || relativeOnly) {
            regex = Uri.createUriRegex(customScheme, allowRelative, relativeOnly);
        }

        return this._test('uri', uriOptions, function (value, state, options) {

            if (regex.test(value)) {
                return value;
            }

            if (relativeOnly) {
                return this.createError('string.uriRelativeOnly', { value }, state, options);
            }

            if (customScheme) {
                return this.createError('string.uriCustomScheme', { scheme: customScheme, value }, state, options);
            }

            return this.createError('string.uri', { value }, state, options);
        });
    }

    isoDate() {

        return this._test('isoDate', undefined, function (value, state, options) {

            if (JoiDate._isIsoDate(value)) {
                return value;
            }

            return this.createError('string.isoDate', { value }, state, options);
        });
    }

    guid(guidOptions) {

        const brackets = {
            '{': '}', '[': ']', '(': ')', '': ''
        };

        const uuids = {
            'uuidv1': '1',
            'uuidv2': '2',
            'uuidv3': '3',
            'uuidv4': '4',
            'uuidv5': '5'
        };

        const versions = [];

        if (guidOptions && guidOptions.version) {
            if (!Array.isArray(guidOptions.version)) {
                guidOptions.version = [guidOptions.version];
            }

            Hoek.assert(guidOptions.version.length >= 1, 'version must have at least 1 valid version specified');

            for (let i = 0; i < guidOptions.version.length; ++i) {
                let version = guidOptions.version[i];
                Hoek.assert(typeof version === 'string', 'version at position ' + i + ' must be a string');
                version = version.toLowerCase();
                Hoek.assert(uuids[version], 'version at position ' + i + ' must be one of ' + Object.keys(uuids).join(', '));
                Hoek.assert(versions.indexOf(version) === -1, 'version at position ' + i + ' must not be a duplicate.');
                versions.push(version);
            }
        }

        const regex = /^([\[{\(]?)([0-9A-F]{8})([:-]?)([0-9A-F]{4})([:-]?)([0-9A-F]{4})([:-]?)([0-9A-F]{4})([:-]?)([0-9A-F]{12})([\]}\)]?)$/i;

        return this._test('guid', guidOptions, function (value, state, options) {

            const results = regex.exec(value);

            if (!results) {
                return this.createError('string.guid', { value }, state, options);
            }

            // Matching braces
            if (brackets[results[1]] !== results[11]) {
                return this.createError('string.guid', { value }, state, options);
            }

            // Matching separators
            if (results[3] !== results[5] || results[3] !== results[7] || results[3] !== results[9]) {
                return this.createError('string.guid', { value }, state, options);
            }

            // Specific UUID versions
            if (versions.length) {
                const validVersions = versions.some((uuidVersion) => {

                    return results[6][0] === uuids[uuidVersion];
                });

                // Valid version and 89AB check
                if (!(validVersions && /[89AB]/i.test(results[8][0]))) {
                    return this.createError('string.guid', { value }, state, options);
                }
            }

            return value;
        });
    }

    hex() {

        const regex = /^[a-f0-9]+$/i;

        return this._test('hex', regex, function (value, state, options) {

            if (regex.test(value)) {
                return value;
            }

            return this.createError('string.hex', { value }, state, options);
        });
    }

    base64() {

        const regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;

        return this._test('base64', regex, function (value, state, options) {

            if (regex.test(value)) {
                return value;
            }

            return this.createError('string.base64', { value }, state, options);
        });
    }

    hostname() {

        const regex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;

        return this._test('hostname', undefined, function (value, state, options) {

            if ((value.length <= 255 && regex.test(value)) ||
                Net.isIPv6(value)) {

                return value;
            }

            return this.createError('string.hostname', { value }, state, options);
        });
    }

    lowercase() {

        const obj = this._test('lowercase', undefined, function (value, state, options) {

            if (options.convert ||
                value === value.toLocaleLowerCase()) {

                return value;
            }

            return this.createError('string.lowercase', { value }, state, options);
        });

        obj._flags.case = 'lower';
        return obj;
    }

    uppercase() {

        const obj = this._test('uppercase', undefined, function (value, state, options) {

            if (options.convert ||
                value === value.toLocaleUpperCase()) {

                return value;
            }

            return this.createError('string.uppercase', { value }, state, options);
        });

        obj._flags.case = 'upper';
        return obj;
    }

    trim() {

        const obj = this._test('trim', undefined, function (value, state, options) {

            if (options.convert ||
                value === value.trim()) {

                return value;
            }

            return this.createError('string.trim', { value }, state, options);
        });

        obj._flags.trim = true;
        return obj;
    }

    replace(pattern, replacement) {

        if (typeof pattern === 'string') {
            pattern = new RegExp(Hoek.escapeRegex(pattern), 'g');
        }

        Hoek.assert(pattern instanceof RegExp, 'pattern must be a RegExp');
        Hoek.assert(typeof replacement === 'string', 'replacement must be a String');

        // This can not be considere a test like trim, we can't "reject"
        // anything from this rule, so just clone the current object
        const obj = this.clone();

        if (!obj._inner.replacements) {
            obj._inner.replacements = [];
        }

        obj._inner.replacements.push({
            pattern,
            replacement
        });

        return obj;
    }

    truncate(enabled) {

        const obj = this.clone();
        obj._flags.truncate = enabled === undefined ? true : !!enabled;
        return obj;
    }

};

internals.compare = function (type, compare) {

    return function (limit, encoding) {

        const isRef = Ref.isRef(limit);

        Hoek.assert((Hoek.isInteger(limit) && limit >= 0) || isRef, 'limit must be a positive integer or reference');
        Hoek.assert(!encoding || Buffer.isEncoding(encoding), 'Invalid encoding:', encoding);

        return this._test(type, limit, function (value, state, options) {

            let compareTo;
            if (isRef) {
                compareTo = limit(state.reference || state.parent, options);

                if (!Hoek.isInteger(compareTo)) {
                    return this.createError('string.ref', { ref: limit.key }, state, options);
                }
            }
            else {
                compareTo = limit;
            }

            if (compare(value, compareTo, encoding)) {
                return value;
            }

            return this.createError('string.' + type, { limit: compareTo, value, encoding }, state, options);
        });
    };
};


internals.String.prototype.min = internals.compare('min', (value, limit, encoding) => {

    const length = encoding ? Buffer.byteLength(value, encoding) : value.length;
    return length >= limit;
});


internals.String.prototype.max = internals.compare('max', (value, limit, encoding) => {

    const length = encoding ? Buffer.byteLength(value, encoding) : value.length;
    return length <= limit;
});


internals.String.prototype.length = internals.compare('length', (value, limit, encoding) => {

    const length = encoding ? Buffer.byteLength(value, encoding) : value.length;
    return length === limit;
});

// Aliases

internals.String.prototype.uuid = internals.String.prototype.guid;

module.exports = new internals.String();


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules


// Delcare internals

const internals = {
    rfc3986: {}
};


internals.generate = function () {

    /**
     * elements separated by forward slash ("/") are alternatives.
     */
    const or = '|';

    /**
     * DIGIT = %x30-39 ; 0-9
     */
    const digit = '0-9';
    const digitOnly = '[' + digit + ']';

    /**
     * ALPHA = %x41-5A / %x61-7A   ; A-Z / a-z
     */
    const alpha = 'a-zA-Z';
    const alphaOnly = '[' + alpha + ']';

    /**
     * cidr       = DIGIT                ; 0-9
     *            / %x31-32 DIGIT         ; 10-29
     *            / "3" %x30-32           ; 30-32
     */
    internals.rfc3986.cidr = digitOnly + or + '[1-2]' + digitOnly + or + '3' + '[0-2]';

    /**
     * HEXDIG = DIGIT / "A" / "B" / "C" / "D" / "E" / "F"
     */
    const hexDigit = digit + 'A-Fa-f';
    const hexDigitOnly = '[' + hexDigit + ']';

    /**
     * unreserved = ALPHA / DIGIT / "-" / "." / "_" / "~"
     */
    const unreserved = alpha + digit + '-\\._~';

    /**
     * sub-delims = "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
     */
    const subDelims = '!\\$&\'\\(\\)\\*\\+,;=';

    /**
     * pct-encoded = "%" HEXDIG HEXDIG
     */
    const pctEncoded = '%' + hexDigit;

    /**
     * pchar = unreserved / pct-encoded / sub-delims / ":" / "@"
     */
    const pchar = unreserved + pctEncoded + subDelims + ':@';
    const pcharOnly = '[' + pchar + ']';

    /**
     * Rule to support zero-padded addresses.
     */
    const zeroPad = '0?';

    /**
     * dec-octet   = DIGIT                 ; 0-9
     *            / %x31-39 DIGIT         ; 10-99
     *            / "1" 2DIGIT            ; 100-199
     *            / "2" %x30-34 DIGIT     ; 200-249
     *            / "25" %x30-35          ; 250-255
     */
    const decOctect = '(?:' + zeroPad + zeroPad + digitOnly + or + zeroPad + '[1-9]' + digitOnly + or + '1' + digitOnly + digitOnly + or + '2' + '[0-4]' + digitOnly + or + '25' + '[0-5])';

    /**
     * IPv4address = dec-octet "." dec-octet "." dec-octet "." dec-octet
     */
    internals.rfc3986.IPv4address = '(?:' + decOctect + '\\.){3}' + decOctect;

    /**
     * h16 = 1*4HEXDIG ; 16 bits of address represented in hexadecimal
     * ls32 = ( h16 ":" h16 ) / IPv4address ; least-significant 32 bits of address
     * IPv6address =                            6( h16 ":" ) ls32
     *             /                       "::" 5( h16 ":" ) ls32
     *             / [               h16 ] "::" 4( h16 ":" ) ls32
     *             / [ *1( h16 ":" ) h16 ] "::" 3( h16 ":" ) ls32
     *             / [ *2( h16 ":" ) h16 ] "::" 2( h16 ":" ) ls32
     *             / [ *3( h16 ":" ) h16 ] "::"    h16 ":"   ls32
     *             / [ *4( h16 ":" ) h16 ] "::"              ls32
     *             / [ *5( h16 ":" ) h16 ] "::"              h16
     *             / [ *6( h16 ":" ) h16 ] "::"
     */
    const h16 = hexDigitOnly + '{1,4}';
    const ls32 = '(?:' + h16 + ':' + h16 + '|' + internals.rfc3986.IPv4address + ')';
    const IPv6SixHex = '(?:' + h16 + ':){6}' + ls32;
    const IPv6FiveHex = '::(?:' + h16 + ':){5}' + ls32;
    const IPv6FourHex = '(?:' + h16 + ')?::(?:' + h16 + ':){4}' + ls32;
    const IPv6ThreeHex = '(?:(?:' + h16 + ':){0,1}' + h16 + ')?::(?:' + h16 + ':){3}' + ls32;
    const IPv6TwoHex = '(?:(?:' + h16 + ':){0,2}' + h16 + ')?::(?:' + h16 + ':){2}' + ls32;
    const IPv6OneHex = '(?:(?:' + h16 + ':){0,3}' + h16 + ')?::' + h16 + ':' + ls32;
    const IPv6NoneHex = '(?:(?:' + h16 + ':){0,4}' + h16 + ')?::' + ls32;
    const IPv6NoneHex2 = '(?:(?:' + h16 + ':){0,5}' + h16 + ')?::' + h16;
    const IPv6NoneHex3 = '(?:(?:' + h16 + ':){0,6}' + h16 + ')?::';
    internals.rfc3986.IPv6address = '(?:' + IPv6SixHex + or + IPv6FiveHex + or + IPv6FourHex + or + IPv6ThreeHex + or + IPv6TwoHex + or + IPv6OneHex + or + IPv6NoneHex + or + IPv6NoneHex2 + or + IPv6NoneHex3 + ')';

    /**
     * IPvFuture = "v" 1*HEXDIG "." 1*( unreserved / sub-delims / ":" )
     */
    internals.rfc3986.IPvFuture = 'v' + hexDigitOnly + '+\\.[' + unreserved + subDelims + ':]+';

    /**
     * scheme = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
     */
    internals.rfc3986.scheme = alphaOnly + '[' + alpha + digit + '+-\\.]*';

    /**
     * userinfo = *( unreserved / pct-encoded / sub-delims / ":" )
     */
    const userinfo = '[' + unreserved + pctEncoded + subDelims + ':]*';

    /**
     * IP-literal = "[" ( IPv6address / IPvFuture  ) "]"
     */
    const IPLiteral = '\\[(?:' + internals.rfc3986.IPv6address + or + internals.rfc3986.IPvFuture + ')\\]';

    /**
     * reg-name = *( unreserved / pct-encoded / sub-delims )
     */
    const regName = '[' + unreserved + pctEncoded + subDelims + ']{0,255}';

    /**
     * host = IP-literal / IPv4address / reg-name
     */
    const host = '(?:' + IPLiteral + or + internals.rfc3986.IPv4address + or + regName + ')';

    /**
     * port = *DIGIT
     */
    const port = digitOnly + '*';

    /**
     * authority   = [ userinfo "@" ] host [ ":" port ]
     */
    const authority = '(?:' + userinfo + '@)?' + host + '(?::' + port + ')?';

    /**
     * segment       = *pchar
     * segment-nz    = 1*pchar
     * path          = path-abempty    ; begins with "/" or is empty
     *               / path-absolute   ; begins with "/" but not "//"
     *               / path-noscheme   ; begins with a non-colon segment
     *               / path-rootless   ; begins with a segment
     *               / path-empty      ; zero characters
     * path-abempty  = *( "/" segment )
     * path-absolute = "/" [ segment-nz *( "/" segment ) ]
     * path-rootless = segment-nz *( "/" segment )
     */
    const segment = pcharOnly + '*';
    const segmentNz = pcharOnly + '+';
    const segmentNzNc = '[' + unreserved + pctEncoded + subDelims + '@' + ']+';
    const pathEmpty = '';
    const pathAbEmpty = '(?:\\/' + segment + ')*';
    const pathAbsolute = '\\/(?:' + segmentNz + pathAbEmpty + ')?';
    const pathRootless = segmentNz + pathAbEmpty;
    const pathNoScheme = segmentNzNc + pathAbEmpty;

    /**
     * hier-part = "//" authority path
     */
    internals.rfc3986.hierPart = '(?:' + '(?:\\/\\/' + authority + pathAbEmpty + ')' + or + pathAbsolute + or + pathRootless + ')';

    /**
     * relative-part = "//" authority path-abempty
     *                 / path-absolute
     *                 / path-noscheme
     *                 / path-empty
     */
    internals.rfc3986.relativeRef = '(?:' + '(?:\\/\\/' + authority + pathAbEmpty  + ')' + or + pathAbsolute + or + pathNoScheme + or + pathEmpty + ')';

    /**
     * query = *( pchar / "/" / "?" )
     */
    internals.rfc3986.query = '[' + pchar + '\\/\\?]*(?=#|$)'; //Finish matching either at the fragment part or end of the line.

    /**
     * fragment = *( pchar / "/" / "?" )
     */
    internals.rfc3986.fragment = '[' + pchar + '\\/\\?]*';
};


internals.generate();

module.exports = internals.rfc3986;


/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require('aws-sdk');


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const
	Command = __webpack_require__(8),
	Types = __webpack_require__(5);

const
	ST = Types.ST,
	GroupName = Types.GroupName,
	AggregateName = Types.AggregateName,
	SequenceNumber = Types.SequenceNumber,
	TableName = Types.TableName;

module.exports = class FetchEvents extends Command {

	static get schema() {
		return ST.joi.object().keys({
			group: ST.joi.st(GroupName).required(),
			aggregate: ST.joi.st(AggregateName).required(),
			fromSeq: ST.joi.st(SequenceNumber).default(new SequenceNumber(0)),
			toSeq: ST.joi.st(SequenceNumber)
		}).required().label('parameter');
	}

	makeParam(ctx, exclusiveStartKey) {
		const param = {
			TableName: new TableName({
				namespace: ctx.namespace, group: this.group
			}).toString(),
			Select: 'ALL_ATTRIBUTES',
			KeyConditionExpression: '#a = :a',
			ExpressionAttributeNames: { '#a': 'aggregate', '#s': 'seq' },
			ExpressionAttributeValues: { ':a': this.aggregate.toPrimitive() },
			ScanIndexForward: true
		};

		if (this.toSeq) {
			param.KeyConditionExpression += ' AND (#s BETWEEN :lo AND :hi)';
			param.ExpressionAttributeValues[':lo'] = this.fromSeq.value;
			param.ExpressionAttributeValues[':hi'] = this.toSeq.value;
		} else {
			param.KeyConditionExpression += ' AND #s >= :s';
			param.ExpressionAttributeValues[':s'] = this.fromSeq.value;
		}

		if (exclusiveStartKey) {
			param.ExclusiveStartKey = exclusiveStartKey;
		}

		return param;
	}

	run(ctx) {
		const
			ddoc = new ctx.AWS.DynamoDB.DocumentClient(),
			inst = this;

		var items = [];

		return new Promise((resolve, reject) => ddoc.query(
			inst.makeParam(ctx),
			function handler(err, data) {
				if (err) {
					reject(err);
				} else {
					items = items.concat(data.Items);

					data.LastEvaluatedKey
						? ddoc.query(
							inst.makeParam(ctx, data.LastEvaluatedKey), handler
						)
						: resolve(items);
				}
			}
		));
	}

};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const
	Command = __webpack_require__(8),
	Types = __webpack_require__(5);

const
	ST = Types.ST,
	GroupName = Types.GroupName,
	ReducerName = Types.ReducerName,
	AggregateName = Types.AggregateName,
	TableName = Types.TableName;

module.exports = class FetchLastReduction extends Command {

	static get schema() {
		return ST.joi.object().keys({
			group: ST.joi.st(GroupName).required(),
			reducerName: ST.joi.st(ReducerName).required(),
			aggregate: ST.joi.st(AggregateName).required()
		}).required().label('parameter');
	}

	makeParam(ctx) {
		return {
			TableName: new TableName({
				namespace: ctx.namespace,
				group: this.group
			}).trackingName,
			Select: 'ALL_ATTRIBUTES',
			KeyConditionExpression: '#a = :a AND #s = :s',
			ExpressionAttributeNames: { '#a': 'aggregate', '#s': 'reducerName' },
			ExpressionAttributeValues: {
				':a': this.aggregate.toPrimitive(),
				':s': this.reducerName.toPrimitive()
			},
			Limit: 1
		};
	}

	run(ctx) {
		return new Promise(
			(resolve, reject) => new ctx.AWS.DynamoDB.DocumentClient().query(
				this.makeParam(ctx),
				(err, data) => err
					? reject(err)
					: resolve(data.Items[0] && data.Items[0].event)
			)
		);
	}

};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	Command: __webpack_require__(8),
	EmitEvent: __webpack_require__(83),
	FetchEvents: __webpack_require__(28),
	FetchLastReduction: __webpack_require__(29),
	ReduceEvents: __webpack_require__(84),
	TrackReduction: __webpack_require__(31)
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const
	Command = __webpack_require__(8),
	Types = __webpack_require__(5);

const
	ST = Types.ST,
	GroupName = Types.GroupName,
	ReducerName = Types.ReducerName,
	TableName = Types.TableName,
	StoredEvent = Types.StoredEvent,
	SequenceNumber = Types.SequenceNumber;

module.exports = class TrackReduction extends Command {

	static get schema() {
		return ST.joi.object().keys({
			group: ST.joi.st(GroupName).required(),
			reducerName: ST.joi.st(ReducerName).required(),
			event: ST.joi.st(StoredEvent).required(),
			previousSeq: ST.joi.st(SequenceNumber),
		}).required().label('parameter');
	}

	run(ctx) {
		return new Promise((resolve, reject) => {
			const param = {
				TableName: new TableName({
					namespace: ctx.namespace, group: this.group
				}).trackingName,
				Key: {
					aggregate: this.event.aggregate.toPrimitive(),
					reducerName: this.reducerName.toPrimitive()
				},
				UpdateExpression:'SET #e = :e, #t = :t',
				ConditionExpression:
					'attribute_not_exists(#e.seq) OR (#e.seq < :ns',
				ExpressionAttributeNames: {
					'#e': 'event',
					'#t': 'timestamp'
				},
				ExpressionAttributeValues: {
					':e': this.event.toPrimitive(),
					':t': new Date().toISOString(),
					':ns': this.event.seq.toPrimitive()
				}
			};

			if (this.previousSeq) {
				param.ConditionExpression += ' AND #e.seq = :ps';
				param.ExpressionAttributeValues[':ps']
					= this.previousSeq.toPrimitive();
			}

			param.ConditionExpression += ')';

			return new ctx.AWS.DynamoDB.DocumentClient().update(
				param,
				(err, data) => err ? reject(err) : resolve(this.event)
			);
		});
	}

};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const unmarshalItem = __webpack_require__(33);

const
	eventComparator = (a, b) => a.dynamodb.Keys.seq.N - b.dynamodb.Keys.seq.N,
	eventFilter = e => e.eventName === 'INSERT' || e.eventName === 'MODIFY';

/*
 * event { Records[{ eventName: '', dynamodb: { NewImage: {} } }] }
 *
 * eventName: MODIFY | INSERT are treated the same
 * eventName: REMOVE is dropped
 */
module.exports = function(ctx, rawEvent) {
	const grouped = rawEvent
		.Records
		.filter(eventFilter)
		.reduce((a, r) => {
			const
				aggregate = r.dynamodb.Keys.aggregate.S,
				group = r.dynamodb.NewImage.group.S;

			if (!a[group]) {
				a[group] = {};
			}

			if (!a[group][aggregate]) {
				a[group][aggregate] = [];
			}

			a[group][aggregate].push(r);
			return a;
		}, {})

	return Object.keys(grouped).sort().reduce(
		(list, g) => {
			Object.keys(grouped[g]).sort().map(
				a => list.push(
					grouped[g][a]
						.sort(eventComparator)
						.map(e => unmarshalItem(ctx, e.dynamodb.NewImage))
				)
			);

			return list;
		},
		[]
	);
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function(ctx, ddbItem) {
	const docCli = new ctx.AWS.DynamoDB.DocumentClient();

	return docCli.getTranslator().translateOutput(
		{ Item: ddbItem },
		docCli.service.api.operations.getItem.output
	).Item;
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ST = __webpack_require__(3);

module.exports = class Namespace extends ST.SV {

	static get schema() {
		return ST.joi.string()
			.label('Namespace')
			.trim().min(1)
			.regex(/^[a-zA-Z0-9-_]*$/);
	}

};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ST = __webpack_require__(3);

module.exports = class ReducerName extends ST.SV {

	static get schema() {
		return ST.joi.string()
			.label('reducerName')
			.trim().min(1)
			.regex(/^[a-zA-Z0-9-_]*$/);
	}

};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const joi = __webpack_require__(21);

const extensions = [
	{
		name: 'array',
		base: joi.array(),
		language: {
			first: 'first element of array failed validation. error: {{e}}'
		},
		rules: [
			{
				name: 'first',
				params: {
					schema: joi.object({
						isJoi: joi.boolean().required().only(true)
					}).required().unknown(true)
				},
				validate: function(params, value, state, options) {
					try {
						value[0] = joi.attempt(value[0], params.schema);
						return value;
					} catch(ex) {
						return this.createError(
							'array.first',
							{
								e: ex
							},
							state,
							options
						);
					}
				}
			}
		]
	}
];

module.exports = extensions.reduce(
	(joi, extension) => joi.extend(extension), joi
);


/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const rbeta = __webpack_require__(17);

module.exports = {
	name: 'example-reducer',
	aws: () => __webpack_require__(27),
	// S -> IO(S)
	persist: (state) => {},
	// a -> S
	state: (aggregate) => {},
	// S -> E -> S
	reduce: (state, event) => {}
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise) {
var SomePromiseArray = Promise._SomePromiseArray;
function any(promises) {
    var ret = new SomePromiseArray(promises);
    var promise = ret.promise();
    ret.setHowMany(1);
    ret.setUnwrap();
    ret.init();
    return promise;
}

Promise.any = function (promises) {
    return any(promises);
};

Promise.prototype.any = function () {
    return any(this);
};

};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var firstLineError;
try {throw new Error(); } catch (e) {firstLineError = e;}
var schedule = __webpack_require__(63);
var Queue = __webpack_require__(60);
var util = __webpack_require__(0);

function Async() {
    this._customScheduler = false;
    this._isTickUsed = false;
    this._lateQueue = new Queue(16);
    this._normalQueue = new Queue(16);
    this._haveDrainedQueues = false;
    this._trampolineEnabled = true;
    var self = this;
    this.drainQueues = function () {
        self._drainQueues();
    };
    this._schedule = schedule;
}

Async.prototype.setScheduler = function(fn) {
    var prev = this._schedule;
    this._schedule = fn;
    this._customScheduler = true;
    return prev;
};

Async.prototype.hasCustomScheduler = function() {
    return this._customScheduler;
};

Async.prototype.enableTrampoline = function() {
    this._trampolineEnabled = true;
};

Async.prototype.disableTrampolineIfNecessary = function() {
    if (util.hasDevTools) {
        this._trampolineEnabled = false;
    }
};

Async.prototype.haveItemsQueued = function () {
    return this._isTickUsed || this._haveDrainedQueues;
};


Async.prototype.fatalError = function(e, isNode) {
    if (isNode) {
        process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) +
            "\n");
        process.exit(2);
    } else {
        this.throwLater(e);
    }
};

Async.prototype.throwLater = function(fn, arg) {
    if (arguments.length === 1) {
        arg = fn;
        fn = function () { throw arg; };
    }
    if (typeof setTimeout !== "undefined") {
        setTimeout(function() {
            fn(arg);
        }, 0);
    } else try {
        this._schedule(function() {
            fn(arg);
        });
    } catch (e) {
        throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
};

function AsyncInvokeLater(fn, receiver, arg) {
    this._lateQueue.push(fn, receiver, arg);
    this._queueTick();
}

function AsyncInvoke(fn, receiver, arg) {
    this._normalQueue.push(fn, receiver, arg);
    this._queueTick();
}

function AsyncSettlePromises(promise) {
    this._normalQueue._pushOne(promise);
    this._queueTick();
}

if (!util.hasDevTools) {
    Async.prototype.invokeLater = AsyncInvokeLater;
    Async.prototype.invoke = AsyncInvoke;
    Async.prototype.settlePromises = AsyncSettlePromises;
} else {
    Async.prototype.invokeLater = function (fn, receiver, arg) {
        if (this._trampolineEnabled) {
            AsyncInvokeLater.call(this, fn, receiver, arg);
        } else {
            this._schedule(function() {
                setTimeout(function() {
                    fn.call(receiver, arg);
                }, 100);
            });
        }
    };

    Async.prototype.invoke = function (fn, receiver, arg) {
        if (this._trampolineEnabled) {
            AsyncInvoke.call(this, fn, receiver, arg);
        } else {
            this._schedule(function() {
                fn.call(receiver, arg);
            });
        }
    };

    Async.prototype.settlePromises = function(promise) {
        if (this._trampolineEnabled) {
            AsyncSettlePromises.call(this, promise);
        } else {
            this._schedule(function() {
                promise._settlePromises();
            });
        }
    };
}

Async.prototype._drainQueue = function(queue) {
    while (queue.length() > 0) {
        var fn = queue.shift();
        if (typeof fn !== "function") {
            fn._settlePromises();
            continue;
        }
        var receiver = queue.shift();
        var arg = queue.shift();
        fn.call(receiver, arg);
    }
};

Async.prototype._drainQueues = function () {
    this._drainQueue(this._normalQueue);
    this._reset();
    this._haveDrainedQueues = true;
    this._drainQueue(this._lateQueue);
};

Async.prototype._queueTick = function () {
    if (!this._isTickUsed) {
        this._isTickUsed = true;
        this._schedule(this.drainQueues);
    }
};

Async.prototype._reset = function () {
    this._isTickUsed = false;
};

module.exports = Async;
module.exports.firstLineError = firstLineError;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, INTERNAL, tryConvertToPromise, debug) {
var calledBind = false;
var rejectThis = function(_, e) {
    this._reject(e);
};

var targetRejected = function(e, context) {
    context.promiseRejectionQueued = true;
    context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
};

var bindingResolved = function(thisArg, context) {
    if (((this._bitField & 50397184) === 0)) {
        this._resolveCallback(context.target);
    }
};

var bindingRejected = function(e, context) {
    if (!context.promiseRejectionQueued) this._reject(e);
};

Promise.prototype.bind = function (thisArg) {
    if (!calledBind) {
        calledBind = true;
        Promise.prototype._propagateFrom = debug.propagateFromFunction();
        Promise.prototype._boundValue = debug.boundValueFunction();
    }
    var maybePromise = tryConvertToPromise(thisArg);
    var ret = new Promise(INTERNAL);
    ret._propagateFrom(this, 1);
    var target = this._target();
    ret._setBoundTo(maybePromise);
    if (maybePromise instanceof Promise) {
        var context = {
            promiseRejectionQueued: false,
            promise: ret,
            target: target,
            bindingPromise: maybePromise
        };
        target._then(INTERNAL, targetRejected, undefined, ret, context);
        maybePromise._then(
            bindingResolved, bindingRejected, undefined, ret, context);
        ret._setOnCancel(maybePromise);
    } else {
        ret._resolveCallback(target);
    }
    return ret;
};

Promise.prototype._setBoundTo = function (obj) {
    if (obj !== undefined) {
        this._bitField = this._bitField | 2097152;
        this._boundTo = obj;
    } else {
        this._bitField = this._bitField & (~2097152);
    }
};

Promise.prototype._isBound = function () {
    return (this._bitField & 2097152) === 2097152;
};

Promise.bind = function (thisArg, value) {
    return Promise.resolve(value).bind(thisArg);
};
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var cr = Object.create;
if (cr) {
    var callerCache = cr(null);
    var getterCache = cr(null);
    callerCache[" size"] = getterCache[" size"] = 0;
}

module.exports = function(Promise) {
var util = __webpack_require__(0);
var canEvaluate = util.canEvaluate;
var isIdentifier = util.isIdentifier;

var getMethodCaller;
var getGetter;
if (true) {
var makeMethodCaller = function (methodName) {
    return new Function("ensureMethod", "                                    \n\
        return function(obj) {                                               \n\
            'use strict'                                                     \n\
            var len = this.length;                                           \n\
            ensureMethod(obj, 'methodName');                                 \n\
            switch(len) {                                                    \n\
                case 1: return obj.methodName(this[0]);                      \n\
                case 2: return obj.methodName(this[0], this[1]);             \n\
                case 3: return obj.methodName(this[0], this[1], this[2]);    \n\
                case 0: return obj.methodName();                             \n\
                default:                                                     \n\
                    return obj.methodName.apply(obj, this);                  \n\
            }                                                                \n\
        };                                                                   \n\
        ".replace(/methodName/g, methodName))(ensureMethod);
};

var makeGetter = function (propertyName) {
    return new Function("obj", "                                             \n\
        'use strict';                                                        \n\
        return obj.propertyName;                                             \n\
        ".replace("propertyName", propertyName));
};

var getCompiled = function(name, compiler, cache) {
    var ret = cache[name];
    if (typeof ret !== "function") {
        if (!isIdentifier(name)) {
            return null;
        }
        ret = compiler(name);
        cache[name] = ret;
        cache[" size"]++;
        if (cache[" size"] > 512) {
            var keys = Object.keys(cache);
            for (var i = 0; i < 256; ++i) delete cache[keys[i]];
            cache[" size"] = keys.length - 256;
        }
    }
    return ret;
};

getMethodCaller = function(name) {
    return getCompiled(name, makeMethodCaller, callerCache);
};

getGetter = function(name) {
    return getCompiled(name, makeGetter, getterCache);
};
}

function ensureMethod(obj, methodName) {
    var fn;
    if (obj != null) fn = obj[methodName];
    if (typeof fn !== "function") {
        var message = "Object " + util.classString(obj) + " has no method '" +
            util.toString(methodName) + "'";
        throw new Promise.TypeError(message);
    }
    return fn;
}

function caller(obj) {
    var methodName = this.pop();
    var fn = ensureMethod(obj, methodName);
    return fn.apply(obj, this);
}
Promise.prototype.call = function (methodName) {
    var $_len = arguments.length;var args = new Array(Math.max($_len - 1, 0)); for(var $_i = 1; $_i < $_len; ++$_i) {args[$_i - 1] = arguments[$_i];};
    if (true) {
        if (canEvaluate) {
            var maybeCaller = getMethodCaller(methodName);
            if (maybeCaller !== null) {
                return this._then(
                    maybeCaller, undefined, undefined, args, undefined);
            }
        }
    }
    args.push(methodName);
    return this._then(caller, undefined, undefined, args, undefined);
};

function namedGetter(obj) {
    return obj[this];
}
function indexedGetter(obj) {
    var index = +this;
    if (index < 0) index = Math.max(0, index + obj.length);
    return obj[index];
}
Promise.prototype.get = function (propertyName) {
    var isIndex = (typeof propertyName === "number");
    var getter;
    if (!isIndex) {
        if (canEvaluate) {
            var maybeGetter = getGetter(propertyName);
            getter = maybeGetter !== null ? maybeGetter : namedGetter;
        } else {
            getter = namedGetter;
        }
    } else {
        getter = indexedGetter;
    }
    return this._then(getter, undefined, undefined, propertyName, undefined);
};
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, PromiseArray, apiRejection, debug) {
var util = __webpack_require__(0);
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
var async = Promise._async;

Promise.prototype["break"] = Promise.prototype.cancel = function() {
    if (!debug.cancellation()) return this._warn("cancellation is disabled");

    var promise = this;
    var child = promise;
    while (promise._isCancellable()) {
        if (!promise._cancelBy(child)) {
            if (child._isFollowing()) {
                child._followee().cancel();
            } else {
                child._cancelBranched();
            }
            break;
        }

        var parent = promise._cancellationParent;
        if (parent == null || !parent._isCancellable()) {
            if (promise._isFollowing()) {
                promise._followee().cancel();
            } else {
                promise._cancelBranched();
            }
            break;
        } else {
            if (promise._isFollowing()) promise._followee().cancel();
            promise._setWillBeCancelled();
            child = promise;
            promise = parent;
        }
    }
};

Promise.prototype._branchHasCancelled = function() {
    this._branchesRemainingToCancel--;
};

Promise.prototype._enoughBranchesHaveCancelled = function() {
    return this._branchesRemainingToCancel === undefined ||
           this._branchesRemainingToCancel <= 0;
};

Promise.prototype._cancelBy = function(canceller) {
    if (canceller === this) {
        this._branchesRemainingToCancel = 0;
        this._invokeOnCancel();
        return true;
    } else {
        this._branchHasCancelled();
        if (this._enoughBranchesHaveCancelled()) {
            this._invokeOnCancel();
            return true;
        }
    }
    return false;
};

Promise.prototype._cancelBranched = function() {
    if (this._enoughBranchesHaveCancelled()) {
        this._cancel();
    }
};

Promise.prototype._cancel = function() {
    if (!this._isCancellable()) return;
    this._setCancelled();
    async.invoke(this._cancelPromises, this, undefined);
};

Promise.prototype._cancelPromises = function() {
    if (this._length() > 0) this._settlePromises();
};

Promise.prototype._unsetOnCancel = function() {
    this._onCancelField = undefined;
};

Promise.prototype._isCancellable = function() {
    return this.isPending() && !this._isCancelled();
};

Promise.prototype.isCancellable = function() {
    return this.isPending() && !this.isCancelled();
};

Promise.prototype._doInvokeOnCancel = function(onCancelCallback, internalOnly) {
    if (util.isArray(onCancelCallback)) {
        for (var i = 0; i < onCancelCallback.length; ++i) {
            this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
        }
    } else if (onCancelCallback !== undefined) {
        if (typeof onCancelCallback === "function") {
            if (!internalOnly) {
                var e = tryCatch(onCancelCallback).call(this._boundValue());
                if (e === errorObj) {
                    this._attachExtraTrace(e.e);
                    async.throwLater(e.e);
                }
            }
        } else {
            onCancelCallback._resultCancelled(this);
        }
    }
};

Promise.prototype._invokeOnCancel = function() {
    var onCancelCallback = this._onCancel();
    this._unsetOnCancel();
    async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
};

Promise.prototype._invokeInternalOnCancel = function() {
    if (this._isCancellable()) {
        this._doInvokeOnCancel(this._onCancel(), true);
        this._unsetOnCancel();
    }
};

Promise.prototype._resultCancelled = function() {
    this.cancel();
};

};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(NEXT_FILTER) {
var util = __webpack_require__(0);
var getKeys = __webpack_require__(7).keys;
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;

function catchFilter(instances, cb, promise) {
    return function(e) {
        var boundTo = promise._boundValue();
        predicateLoop: for (var i = 0; i < instances.length; ++i) {
            var item = instances[i];

            if (item === Error ||
                (item != null && item.prototype instanceof Error)) {
                if (e instanceof item) {
                    return tryCatch(cb).call(boundTo, e);
                }
            } else if (typeof item === "function") {
                var matchesPredicate = tryCatch(item).call(boundTo, e);
                if (matchesPredicate === errorObj) {
                    return matchesPredicate;
                } else if (matchesPredicate) {
                    return tryCatch(cb).call(boundTo, e);
                }
            } else if (util.isObject(e)) {
                var keys = getKeys(item);
                for (var j = 0; j < keys.length; ++j) {
                    var key = keys[j];
                    if (item[key] != e[key]) {
                        continue predicateLoop;
                    }
                }
                return tryCatch(cb).call(boundTo, e);
            }
        }
        return NEXT_FILTER;
    };
}

return catchFilter;
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise) {
var longStackTraces = false;
var contextStack = [];

Promise.prototype._promiseCreated = function() {};
Promise.prototype._pushContext = function() {};
Promise.prototype._popContext = function() {return null;};
Promise._peekContext = Promise.prototype._peekContext = function() {};

function Context() {
    this._trace = new Context.CapturedTrace(peekContext());
}
Context.prototype._pushContext = function () {
    if (this._trace !== undefined) {
        this._trace._promiseCreated = null;
        contextStack.push(this._trace);
    }
};

Context.prototype._popContext = function () {
    if (this._trace !== undefined) {
        var trace = contextStack.pop();
        var ret = trace._promiseCreated;
        trace._promiseCreated = null;
        return ret;
    }
    return null;
};

function createContext() {
    if (longStackTraces) return new Context();
}

function peekContext() {
    var lastIndex = contextStack.length - 1;
    if (lastIndex >= 0) {
        return contextStack[lastIndex];
    }
    return undefined;
}
Context.CapturedTrace = null;
Context.create = createContext;
Context.deactivateLongStackTraces = function() {};
Context.activateLongStackTraces = function() {
    var Promise_pushContext = Promise.prototype._pushContext;
    var Promise_popContext = Promise.prototype._popContext;
    var Promise_PeekContext = Promise._peekContext;
    var Promise_peekContext = Promise.prototype._peekContext;
    var Promise_promiseCreated = Promise.prototype._promiseCreated;
    Context.deactivateLongStackTraces = function() {
        Promise.prototype._pushContext = Promise_pushContext;
        Promise.prototype._popContext = Promise_popContext;
        Promise._peekContext = Promise_PeekContext;
        Promise.prototype._peekContext = Promise_peekContext;
        Promise.prototype._promiseCreated = Promise_promiseCreated;
        longStackTraces = false;
    };
    longStackTraces = true;
    Promise.prototype._pushContext = Context.prototype._pushContext;
    Promise.prototype._popContext = Context.prototype._popContext;
    Promise._peekContext = Promise.prototype._peekContext = peekContext;
    Promise.prototype._promiseCreated = function() {
        var ctx = this._peekContext();
        if (ctx && ctx._promiseCreated == null) ctx._promiseCreated = this;
    };
};
return Context;
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, Context) {
var getDomain = Promise._getDomain;
var async = Promise._async;
var Warning = __webpack_require__(6).Warning;
var util = __webpack_require__(0);
var canAttachTrace = util.canAttachTrace;
var unhandledRejectionHandled;
var possiblyUnhandledRejection;
var bluebirdFramePattern =
    /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
var nodeFramePattern = /\((?:timers\.js):\d+:\d+\)/;
var parseLinePattern = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/;
var stackFramePattern = null;
var formatStack = null;
var indentStackFrames = false;
var printWarning;
var debugging = !!(util.env("BLUEBIRD_DEBUG") != 0 &&
                        (false ||
                         util.env("BLUEBIRD_DEBUG") ||
                         util.env("NODE_ENV") === "development"));

var warnings = !!(util.env("BLUEBIRD_WARNINGS") != 0 &&
    (debugging || util.env("BLUEBIRD_WARNINGS")));

var longStackTraces = !!(util.env("BLUEBIRD_LONG_STACK_TRACES") != 0 &&
    (debugging || util.env("BLUEBIRD_LONG_STACK_TRACES")));

var wForgottenReturn = util.env("BLUEBIRD_W_FORGOTTEN_RETURN") != 0 &&
    (warnings || !!util.env("BLUEBIRD_W_FORGOTTEN_RETURN"));

Promise.prototype.suppressUnhandledRejections = function() {
    var target = this._target();
    target._bitField = ((target._bitField & (~1048576)) |
                      524288);
};

Promise.prototype._ensurePossibleRejectionHandled = function () {
    if ((this._bitField & 524288) !== 0) return;
    this._setRejectionIsUnhandled();
    async.invokeLater(this._notifyUnhandledRejection, this, undefined);
};

Promise.prototype._notifyUnhandledRejectionIsHandled = function () {
    fireRejectionEvent("rejectionHandled",
                                  unhandledRejectionHandled, undefined, this);
};

Promise.prototype._setReturnedNonUndefined = function() {
    this._bitField = this._bitField | 268435456;
};

Promise.prototype._returnedNonUndefined = function() {
    return (this._bitField & 268435456) !== 0;
};

Promise.prototype._notifyUnhandledRejection = function () {
    if (this._isRejectionUnhandled()) {
        var reason = this._settledValue();
        this._setUnhandledRejectionIsNotified();
        fireRejectionEvent("unhandledRejection",
                                      possiblyUnhandledRejection, reason, this);
    }
};

Promise.prototype._setUnhandledRejectionIsNotified = function () {
    this._bitField = this._bitField | 262144;
};

Promise.prototype._unsetUnhandledRejectionIsNotified = function () {
    this._bitField = this._bitField & (~262144);
};

Promise.prototype._isUnhandledRejectionNotified = function () {
    return (this._bitField & 262144) > 0;
};

Promise.prototype._setRejectionIsUnhandled = function () {
    this._bitField = this._bitField | 1048576;
};

Promise.prototype._unsetRejectionIsUnhandled = function () {
    this._bitField = this._bitField & (~1048576);
    if (this._isUnhandledRejectionNotified()) {
        this._unsetUnhandledRejectionIsNotified();
        this._notifyUnhandledRejectionIsHandled();
    }
};

Promise.prototype._isRejectionUnhandled = function () {
    return (this._bitField & 1048576) > 0;
};

Promise.prototype._warn = function(message, shouldUseOwnTrace, promise) {
    return warn(message, shouldUseOwnTrace, promise || this);
};

Promise.onPossiblyUnhandledRejection = function (fn) {
    var domain = getDomain();
    possiblyUnhandledRejection =
        typeof fn === "function" ? (domain === null ?
                                            fn : util.domainBind(domain, fn))
                                 : undefined;
};

Promise.onUnhandledRejectionHandled = function (fn) {
    var domain = getDomain();
    unhandledRejectionHandled =
        typeof fn === "function" ? (domain === null ?
                                            fn : util.domainBind(domain, fn))
                                 : undefined;
};

var disableLongStackTraces = function() {};
Promise.longStackTraces = function () {
    if (async.haveItemsQueued() && !config.longStackTraces) {
        throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    if (!config.longStackTraces && longStackTracesIsSupported()) {
        var Promise_captureStackTrace = Promise.prototype._captureStackTrace;
        var Promise_attachExtraTrace = Promise.prototype._attachExtraTrace;
        config.longStackTraces = true;
        disableLongStackTraces = function() {
            if (async.haveItemsQueued() && !config.longStackTraces) {
                throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
            }
            Promise.prototype._captureStackTrace = Promise_captureStackTrace;
            Promise.prototype._attachExtraTrace = Promise_attachExtraTrace;
            Context.deactivateLongStackTraces();
            async.enableTrampoline();
            config.longStackTraces = false;
        };
        Promise.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
        Promise.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
        Context.activateLongStackTraces();
        async.disableTrampolineIfNecessary();
    }
};

Promise.hasLongStackTraces = function () {
    return config.longStackTraces && longStackTracesIsSupported();
};

var fireDomEvent = (function() {
    try {
        if (typeof CustomEvent === "function") {
            var event = new CustomEvent("CustomEvent");
            util.global.dispatchEvent(event);
            return function(name, event) {
                var domEvent = new CustomEvent(name.toLowerCase(), {
                    detail: event,
                    cancelable: true
                });
                return !util.global.dispatchEvent(domEvent);
            };
        } else if (typeof Event === "function") {
            var event = new Event("CustomEvent");
            util.global.dispatchEvent(event);
            return function(name, event) {
                var domEvent = new Event(name.toLowerCase(), {
                    cancelable: true
                });
                domEvent.detail = event;
                return !util.global.dispatchEvent(domEvent);
            };
        } else {
            var event = document.createEvent("CustomEvent");
            event.initCustomEvent("testingtheevent", false, true, {});
            util.global.dispatchEvent(event);
            return function(name, event) {
                var domEvent = document.createEvent("CustomEvent");
                domEvent.initCustomEvent(name.toLowerCase(), false, true,
                    event);
                return !util.global.dispatchEvent(domEvent);
            };
        }
    } catch (e) {}
    return function() {
        return false;
    };
})();

var fireGlobalEvent = (function() {
    if (util.isNode) {
        return function() {
            return process.emit.apply(process, arguments);
        };
    } else {
        if (!util.global) {
            return function() {
                return false;
            };
        }
        return function(name) {
            var methodName = "on" + name.toLowerCase();
            var method = util.global[methodName];
            if (!method) return false;
            method.apply(util.global, [].slice.call(arguments, 1));
            return true;
        };
    }
})();

function generatePromiseLifecycleEventObject(name, promise) {
    return {promise: promise};
}

var eventToObjectGenerator = {
    promiseCreated: generatePromiseLifecycleEventObject,
    promiseFulfilled: generatePromiseLifecycleEventObject,
    promiseRejected: generatePromiseLifecycleEventObject,
    promiseResolved: generatePromiseLifecycleEventObject,
    promiseCancelled: generatePromiseLifecycleEventObject,
    promiseChained: function(name, promise, child) {
        return {promise: promise, child: child};
    },
    warning: function(name, warning) {
        return {warning: warning};
    },
    unhandledRejection: function (name, reason, promise) {
        return {reason: reason, promise: promise};
    },
    rejectionHandled: generatePromiseLifecycleEventObject
};

var activeFireEvent = function (name) {
    var globalEventFired = false;
    try {
        globalEventFired = fireGlobalEvent.apply(null, arguments);
    } catch (e) {
        async.throwLater(e);
        globalEventFired = true;
    }

    var domEventFired = false;
    try {
        domEventFired = fireDomEvent(name,
                    eventToObjectGenerator[name].apply(null, arguments));
    } catch (e) {
        async.throwLater(e);
        domEventFired = true;
    }

    return domEventFired || globalEventFired;
};

Promise.config = function(opts) {
    opts = Object(opts);
    if ("longStackTraces" in opts) {
        if (opts.longStackTraces) {
            Promise.longStackTraces();
        } else if (!opts.longStackTraces && Promise.hasLongStackTraces()) {
            disableLongStackTraces();
        }
    }
    if ("warnings" in opts) {
        var warningsOption = opts.warnings;
        config.warnings = !!warningsOption;
        wForgottenReturn = config.warnings;

        if (util.isObject(warningsOption)) {
            if ("wForgottenReturn" in warningsOption) {
                wForgottenReturn = !!warningsOption.wForgottenReturn;
            }
        }
    }
    if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
        if (async.haveItemsQueued()) {
            throw new Error(
                "cannot enable cancellation after promises are in use");
        }
        Promise.prototype._clearCancellationData =
            cancellationClearCancellationData;
        Promise.prototype._propagateFrom = cancellationPropagateFrom;
        Promise.prototype._onCancel = cancellationOnCancel;
        Promise.prototype._setOnCancel = cancellationSetOnCancel;
        Promise.prototype._attachCancellationCallback =
            cancellationAttachCancellationCallback;
        Promise.prototype._execute = cancellationExecute;
        propagateFromFunction = cancellationPropagateFrom;
        config.cancellation = true;
    }
    if ("monitoring" in opts) {
        if (opts.monitoring && !config.monitoring) {
            config.monitoring = true;
            Promise.prototype._fireEvent = activeFireEvent;
        } else if (!opts.monitoring && config.monitoring) {
            config.monitoring = false;
            Promise.prototype._fireEvent = defaultFireEvent;
        }
    }
    return Promise;
};

function defaultFireEvent() { return false; }

Promise.prototype._fireEvent = defaultFireEvent;
Promise.prototype._execute = function(executor, resolve, reject) {
    try {
        executor(resolve, reject);
    } catch (e) {
        return e;
    }
};
Promise.prototype._onCancel = function () {};
Promise.prototype._setOnCancel = function (handler) { ; };
Promise.prototype._attachCancellationCallback = function(onCancel) {
    ;
};
Promise.prototype._captureStackTrace = function () {};
Promise.prototype._attachExtraTrace = function () {};
Promise.prototype._clearCancellationData = function() {};
Promise.prototype._propagateFrom = function (parent, flags) {
    ;
    ;
};

function cancellationExecute(executor, resolve, reject) {
    var promise = this;
    try {
        executor(resolve, reject, function(onCancel) {
            if (typeof onCancel !== "function") {
                throw new TypeError("onCancel must be a function, got: " +
                                    util.toString(onCancel));
            }
            promise._attachCancellationCallback(onCancel);
        });
    } catch (e) {
        return e;
    }
}

function cancellationAttachCancellationCallback(onCancel) {
    if (!this._isCancellable()) return this;

    var previousOnCancel = this._onCancel();
    if (previousOnCancel !== undefined) {
        if (util.isArray(previousOnCancel)) {
            previousOnCancel.push(onCancel);
        } else {
            this._setOnCancel([previousOnCancel, onCancel]);
        }
    } else {
        this._setOnCancel(onCancel);
    }
}

function cancellationOnCancel() {
    return this._onCancelField;
}

function cancellationSetOnCancel(onCancel) {
    this._onCancelField = onCancel;
}

function cancellationClearCancellationData() {
    this._cancellationParent = undefined;
    this._onCancelField = undefined;
}

function cancellationPropagateFrom(parent, flags) {
    if ((flags & 1) !== 0) {
        this._cancellationParent = parent;
        var branchesRemainingToCancel = parent._branchesRemainingToCancel;
        if (branchesRemainingToCancel === undefined) {
            branchesRemainingToCancel = 0;
        }
        parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
    }
    if ((flags & 2) !== 0 && parent._isBound()) {
        this._setBoundTo(parent._boundTo);
    }
}

function bindingPropagateFrom(parent, flags) {
    if ((flags & 2) !== 0 && parent._isBound()) {
        this._setBoundTo(parent._boundTo);
    }
}
var propagateFromFunction = bindingPropagateFrom;

function boundValueFunction() {
    var ret = this._boundTo;
    if (ret !== undefined) {
        if (ret instanceof Promise) {
            if (ret.isFulfilled()) {
                return ret.value();
            } else {
                return undefined;
            }
        }
    }
    return ret;
}

function longStackTracesCaptureStackTrace() {
    this._trace = new CapturedTrace(this._peekContext());
}

function longStackTracesAttachExtraTrace(error, ignoreSelf) {
    if (canAttachTrace(error)) {
        var trace = this._trace;
        if (trace !== undefined) {
            if (ignoreSelf) trace = trace._parent;
        }
        if (trace !== undefined) {
            trace.attachExtraTrace(error);
        } else if (!error.__stackCleaned__) {
            var parsed = parseStackAndMessage(error);
            util.notEnumerableProp(error, "stack",
                parsed.message + "\n" + parsed.stack.join("\n"));
            util.notEnumerableProp(error, "__stackCleaned__", true);
        }
    }
}

function checkForgottenReturns(returnValue, promiseCreated, name, promise,
                               parent) {
    if (returnValue === undefined && promiseCreated !== null &&
        wForgottenReturn) {
        if (parent !== undefined && parent._returnedNonUndefined()) return;
        if ((promise._bitField & 65535) === 0) return;

        if (name) name = name + " ";
        var handlerLine = "";
        var creatorLine = "";
        if (promiseCreated._trace) {
            var traceLines = promiseCreated._trace.stack.split("\n");
            var stack = cleanStack(traceLines);
            for (var i = stack.length - 1; i >= 0; --i) {
                var line = stack[i];
                if (!nodeFramePattern.test(line)) {
                    var lineMatches = line.match(parseLinePattern);
                    if (lineMatches) {
                        handlerLine  = "at " + lineMatches[1] +
                            ":" + lineMatches[2] + ":" + lineMatches[3] + " ";
                    }
                    break;
                }
            }

            if (stack.length > 0) {
                var firstUserLine = stack[0];
                for (var i = 0; i < traceLines.length; ++i) {

                    if (traceLines[i] === firstUserLine) {
                        if (i > 0) {
                            creatorLine = "\n" + traceLines[i - 1];
                        }
                        break;
                    }
                }

            }
        }
        var msg = "a promise was created in a " + name +
            "handler " + handlerLine + "but was not returned from it, " +
            "see http://goo.gl/rRqMUw" +
            creatorLine;
        promise._warn(msg, true, promiseCreated);
    }
}

function deprecated(name, replacement) {
    var message = name +
        " is deprecated and will be removed in a future version.";
    if (replacement) message += " Use " + replacement + " instead.";
    return warn(message);
}

function warn(message, shouldUseOwnTrace, promise) {
    if (!config.warnings) return;
    var warning = new Warning(message);
    var ctx;
    if (shouldUseOwnTrace) {
        promise._attachExtraTrace(warning);
    } else if (config.longStackTraces && (ctx = Promise._peekContext())) {
        ctx.attachExtraTrace(warning);
    } else {
        var parsed = parseStackAndMessage(warning);
        warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
    }

    if (!activeFireEvent("warning", warning)) {
        formatAndLogError(warning, "", true);
    }
}

function reconstructStack(message, stacks) {
    for (var i = 0; i < stacks.length - 1; ++i) {
        stacks[i].push("From previous event:");
        stacks[i] = stacks[i].join("\n");
    }
    if (i < stacks.length) {
        stacks[i] = stacks[i].join("\n");
    }
    return message + "\n" + stacks.join("\n");
}

function removeDuplicateOrEmptyJumps(stacks) {
    for (var i = 0; i < stacks.length; ++i) {
        if (stacks[i].length === 0 ||
            ((i + 1 < stacks.length) && stacks[i][0] === stacks[i+1][0])) {
            stacks.splice(i, 1);
            i--;
        }
    }
}

function removeCommonRoots(stacks) {
    var current = stacks[0];
    for (var i = 1; i < stacks.length; ++i) {
        var prev = stacks[i];
        var currentLastIndex = current.length - 1;
        var currentLastLine = current[currentLastIndex];
        var commonRootMeetPoint = -1;

        for (var j = prev.length - 1; j >= 0; --j) {
            if (prev[j] === currentLastLine) {
                commonRootMeetPoint = j;
                break;
            }
        }

        for (var j = commonRootMeetPoint; j >= 0; --j) {
            var line = prev[j];
            if (current[currentLastIndex] === line) {
                current.pop();
                currentLastIndex--;
            } else {
                break;
            }
        }
        current = prev;
    }
}

function cleanStack(stack) {
    var ret = [];
    for (var i = 0; i < stack.length; ++i) {
        var line = stack[i];
        var isTraceLine = "    (No stack trace)" === line ||
            stackFramePattern.test(line);
        var isInternalFrame = isTraceLine && shouldIgnore(line);
        if (isTraceLine && !isInternalFrame) {
            if (indentStackFrames && line.charAt(0) !== " ") {
                line = "    " + line;
            }
            ret.push(line);
        }
    }
    return ret;
}

function stackFramesAsArray(error) {
    var stack = error.stack.replace(/\s+$/g, "").split("\n");
    for (var i = 0; i < stack.length; ++i) {
        var line = stack[i];
        if ("    (No stack trace)" === line || stackFramePattern.test(line)) {
            break;
        }
    }
    if (i > 0 && error.name != "SyntaxError") {
        stack = stack.slice(i);
    }
    return stack;
}

function parseStackAndMessage(error) {
    var stack = error.stack;
    var message = error.toString();
    stack = typeof stack === "string" && stack.length > 0
                ? stackFramesAsArray(error) : ["    (No stack trace)"];
    return {
        message: message,
        stack: error.name == "SyntaxError" ? stack : cleanStack(stack)
    };
}

function formatAndLogError(error, title, isSoft) {
    if (typeof console !== "undefined") {
        var message;
        if (util.isObject(error)) {
            var stack = error.stack;
            message = title + formatStack(stack, error);
        } else {
            message = title + String(error);
        }
        if (typeof printWarning === "function") {
            printWarning(message, isSoft);
        } else if (typeof console.log === "function" ||
            typeof console.log === "object") {
            console.log(message);
        }
    }
}

function fireRejectionEvent(name, localHandler, reason, promise) {
    var localEventFired = false;
    try {
        if (typeof localHandler === "function") {
            localEventFired = true;
            if (name === "rejectionHandled") {
                localHandler(promise);
            } else {
                localHandler(reason, promise);
            }
        }
    } catch (e) {
        async.throwLater(e);
    }

    if (name === "unhandledRejection") {
        if (!activeFireEvent(name, reason, promise) && !localEventFired) {
            formatAndLogError(reason, "Unhandled rejection ");
        }
    } else {
        activeFireEvent(name, promise);
    }
}

function formatNonError(obj) {
    var str;
    if (typeof obj === "function") {
        str = "[function " +
            (obj.name || "anonymous") +
            "]";
    } else {
        str = obj && typeof obj.toString === "function"
            ? obj.toString() : util.toString(obj);
        var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
        if (ruselessToString.test(str)) {
            try {
                var newStr = JSON.stringify(obj);
                str = newStr;
            }
            catch(e) {

            }
        }
        if (str.length === 0) {
            str = "(empty array)";
        }
    }
    return ("(<" + snip(str) + ">, no stack trace)");
}

function snip(str) {
    var maxChars = 41;
    if (str.length < maxChars) {
        return str;
    }
    return str.substr(0, maxChars - 3) + "...";
}

function longStackTracesIsSupported() {
    return typeof captureStackTrace === "function";
}

var shouldIgnore = function() { return false; };
var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
function parseLineInfo(line) {
    var matches = line.match(parseLineInfoRegex);
    if (matches) {
        return {
            fileName: matches[1],
            line: parseInt(matches[2], 10)
        };
    }
}

function setBounds(firstLineError, lastLineError) {
    if (!longStackTracesIsSupported()) return;
    var firstStackLines = firstLineError.stack.split("\n");
    var lastStackLines = lastLineError.stack.split("\n");
    var firstIndex = -1;
    var lastIndex = -1;
    var firstFileName;
    var lastFileName;
    for (var i = 0; i < firstStackLines.length; ++i) {
        var result = parseLineInfo(firstStackLines[i]);
        if (result) {
            firstFileName = result.fileName;
            firstIndex = result.line;
            break;
        }
    }
    for (var i = 0; i < lastStackLines.length; ++i) {
        var result = parseLineInfo(lastStackLines[i]);
        if (result) {
            lastFileName = result.fileName;
            lastIndex = result.line;
            break;
        }
    }
    if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName ||
        firstFileName !== lastFileName || firstIndex >= lastIndex) {
        return;
    }

    shouldIgnore = function(line) {
        if (bluebirdFramePattern.test(line)) return true;
        var info = parseLineInfo(line);
        if (info) {
            if (info.fileName === firstFileName &&
                (firstIndex <= info.line && info.line <= lastIndex)) {
                return true;
            }
        }
        return false;
    };
}

function CapturedTrace(parent) {
    this._parent = parent;
    this._promisesCreated = 0;
    var length = this._length = 1 + (parent === undefined ? 0 : parent._length);
    captureStackTrace(this, CapturedTrace);
    if (length > 32) this.uncycle();
}
util.inherits(CapturedTrace, Error);
Context.CapturedTrace = CapturedTrace;

CapturedTrace.prototype.uncycle = function() {
    var length = this._length;
    if (length < 2) return;
    var nodes = [];
    var stackToIndex = {};

    for (var i = 0, node = this; node !== undefined; ++i) {
        nodes.push(node);
        node = node._parent;
    }
    length = this._length = i;
    for (var i = length - 1; i >= 0; --i) {
        var stack = nodes[i].stack;
        if (stackToIndex[stack] === undefined) {
            stackToIndex[stack] = i;
        }
    }
    for (var i = 0; i < length; ++i) {
        var currentStack = nodes[i].stack;
        var index = stackToIndex[currentStack];
        if (index !== undefined && index !== i) {
            if (index > 0) {
                nodes[index - 1]._parent = undefined;
                nodes[index - 1]._length = 1;
            }
            nodes[i]._parent = undefined;
            nodes[i]._length = 1;
            var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;

            if (index < length - 1) {
                cycleEdgeNode._parent = nodes[index + 1];
                cycleEdgeNode._parent.uncycle();
                cycleEdgeNode._length =
                    cycleEdgeNode._parent._length + 1;
            } else {
                cycleEdgeNode._parent = undefined;
                cycleEdgeNode._length = 1;
            }
            var currentChildLength = cycleEdgeNode._length + 1;
            for (var j = i - 2; j >= 0; --j) {
                nodes[j]._length = currentChildLength;
                currentChildLength++;
            }
            return;
        }
    }
};

CapturedTrace.prototype.attachExtraTrace = function(error) {
    if (error.__stackCleaned__) return;
    this.uncycle();
    var parsed = parseStackAndMessage(error);
    var message = parsed.message;
    var stacks = [parsed.stack];

    var trace = this;
    while (trace !== undefined) {
        stacks.push(cleanStack(trace.stack.split("\n")));
        trace = trace._parent;
    }
    removeCommonRoots(stacks);
    removeDuplicateOrEmptyJumps(stacks);
    util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
    util.notEnumerableProp(error, "__stackCleaned__", true);
};

var captureStackTrace = (function stackDetection() {
    var v8stackFramePattern = /^\s*at\s*/;
    var v8stackFormatter = function(stack, error) {
        if (typeof stack === "string") return stack;

        if (error.name !== undefined &&
            error.message !== undefined) {
            return error.toString();
        }
        return formatNonError(error);
    };

    if (typeof Error.stackTraceLimit === "number" &&
        typeof Error.captureStackTrace === "function") {
        Error.stackTraceLimit += 6;
        stackFramePattern = v8stackFramePattern;
        formatStack = v8stackFormatter;
        var captureStackTrace = Error.captureStackTrace;

        shouldIgnore = function(line) {
            return bluebirdFramePattern.test(line);
        };
        return function(receiver, ignoreUntil) {
            Error.stackTraceLimit += 6;
            captureStackTrace(receiver, ignoreUntil);
            Error.stackTraceLimit -= 6;
        };
    }
    var err = new Error();

    if (typeof err.stack === "string" &&
        err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
        stackFramePattern = /@/;
        formatStack = v8stackFormatter;
        indentStackFrames = true;
        return function captureStackTrace(o) {
            o.stack = new Error().stack;
        };
    }

    var hasStackAfterThrow;
    try { throw new Error(); }
    catch(e) {
        hasStackAfterThrow = ("stack" in e);
    }
    if (!("stack" in err) && hasStackAfterThrow &&
        typeof Error.stackTraceLimit === "number") {
        stackFramePattern = v8stackFramePattern;
        formatStack = v8stackFormatter;
        return function captureStackTrace(o) {
            Error.stackTraceLimit += 6;
            try { throw new Error(); }
            catch(e) { o.stack = e.stack; }
            Error.stackTraceLimit -= 6;
        };
    }

    formatStack = function(stack, error) {
        if (typeof stack === "string") return stack;

        if ((typeof error === "object" ||
            typeof error === "function") &&
            error.name !== undefined &&
            error.message !== undefined) {
            return error.toString();
        }
        return formatNonError(error);
    };

    return null;

})([]);

if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
    printWarning = function (message) {
        console.warn(message);
    };
    if (util.isNode && process.stderr.isTTY) {
        printWarning = function(message, isSoft) {
            var color = isSoft ? "\u001b[33m" : "\u001b[31m";
            console.warn(color + message + "\u001b[0m\n");
        };
    } else if (!util.isNode && typeof (new Error().stack) === "string") {
        printWarning = function(message, isSoft) {
            console.warn("%c" + message,
                        isSoft ? "color: darkorange" : "color: red");
        };
    }
}

var config = {
    warnings: warnings,
    longStackTraces: false,
    cancellation: false,
    monitoring: false
};

if (longStackTraces) Promise.longStackTraces();

return {
    longStackTraces: function() {
        return config.longStackTraces;
    },
    warnings: function() {
        return config.warnings;
    },
    cancellation: function() {
        return config.cancellation;
    },
    monitoring: function() {
        return config.monitoring;
    },
    propagateFromFunction: function() {
        return propagateFromFunction;
    },
    boundValueFunction: function() {
        return boundValueFunction;
    },
    checkForgottenReturns: checkForgottenReturns,
    setBounds: setBounds,
    warn: warn,
    deprecated: deprecated,
    CapturedTrace: CapturedTrace,
    fireDomEvent: fireDomEvent,
    fireGlobalEvent: fireGlobalEvent
};
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise) {
function returner() {
    return this.value;
}
function thrower() {
    throw this.reason;
}

Promise.prototype["return"] =
Promise.prototype.thenReturn = function (value) {
    if (value instanceof Promise) value.suppressUnhandledRejections();
    return this._then(
        returner, undefined, undefined, {value: value}, undefined);
};

Promise.prototype["throw"] =
Promise.prototype.thenThrow = function (reason) {
    return this._then(
        thrower, undefined, undefined, {reason: reason}, undefined);
};

Promise.prototype.catchThrow = function (reason) {
    if (arguments.length <= 1) {
        return this._then(
            undefined, thrower, undefined, {reason: reason}, undefined);
    } else {
        var _reason = arguments[1];
        var handler = function() {throw _reason;};
        return this.caught(reason, handler);
    }
};

Promise.prototype.catchReturn = function (value) {
    if (arguments.length <= 1) {
        if (value instanceof Promise) value.suppressUnhandledRejections();
        return this._then(
            undefined, returner, undefined, {value: value}, undefined);
    } else {
        var _value = arguments[1];
        if (_value instanceof Promise) _value.suppressUnhandledRejections();
        var handler = function() {return _value;};
        return this.caught(value, handler);
    }
};
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, INTERNAL) {
var PromiseReduce = Promise.reduce;
var PromiseAll = Promise.all;

function promiseAllThis() {
    return PromiseAll(this);
}

function PromiseMapSeries(promises, fn) {
    return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
}

Promise.prototype.each = function (fn) {
    return PromiseReduce(this, fn, INTERNAL, 0)
              ._then(promiseAllThis, undefined, undefined, this, undefined);
};

Promise.prototype.mapSeries = function (fn) {
    return PromiseReduce(this, fn, INTERNAL, INTERNAL);
};

Promise.each = function (promises, fn) {
    return PromiseReduce(promises, fn, INTERNAL, 0)
              ._then(promiseAllThis, undefined, undefined, promises, undefined);
};

Promise.mapSeries = PromiseMapSeries;
};



/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, INTERNAL) {
var PromiseMap = Promise.map;

Promise.prototype.filter = function (fn, options) {
    return PromiseMap(this, fn, options, INTERNAL);
};

Promise.filter = function (promises, fn, options) {
    return PromiseMap(promises, fn, options, INTERNAL);
};
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, tryConvertToPromise) {
var util = __webpack_require__(0);
var CancellationError = Promise.CancellationError;
var errorObj = util.errorObj;

function PassThroughHandlerContext(promise, type, handler) {
    this.promise = promise;
    this.type = type;
    this.handler = handler;
    this.called = false;
    this.cancelPromise = null;
}

PassThroughHandlerContext.prototype.isFinallyHandler = function() {
    return this.type === 0;
};

function FinallyHandlerCancelReaction(finallyHandler) {
    this.finallyHandler = finallyHandler;
}

FinallyHandlerCancelReaction.prototype._resultCancelled = function() {
    checkCancel(this.finallyHandler);
};

function checkCancel(ctx, reason) {
    if (ctx.cancelPromise != null) {
        if (arguments.length > 1) {
            ctx.cancelPromise._reject(reason);
        } else {
            ctx.cancelPromise._cancel();
        }
        ctx.cancelPromise = null;
        return true;
    }
    return false;
}

function succeed() {
    return finallyHandler.call(this, this.promise._target()._settledValue());
}
function fail(reason) {
    if (checkCancel(this, reason)) return;
    errorObj.e = reason;
    return errorObj;
}
function finallyHandler(reasonOrValue) {
    var promise = this.promise;
    var handler = this.handler;

    if (!this.called) {
        this.called = true;
        var ret = this.isFinallyHandler()
            ? handler.call(promise._boundValue())
            : handler.call(promise._boundValue(), reasonOrValue);
        if (ret !== undefined) {
            promise._setReturnedNonUndefined();
            var maybePromise = tryConvertToPromise(ret, promise);
            if (maybePromise instanceof Promise) {
                if (this.cancelPromise != null) {
                    if (maybePromise._isCancelled()) {
                        var reason =
                            new CancellationError("late cancellation observer");
                        promise._attachExtraTrace(reason);
                        errorObj.e = reason;
                        return errorObj;
                    } else if (maybePromise.isPending()) {
                        maybePromise._attachCancellationCallback(
                            new FinallyHandlerCancelReaction(this));
                    }
                }
                return maybePromise._then(
                    succeed, fail, undefined, this, undefined);
            }
        }
    }

    if (promise.isRejected()) {
        checkCancel(this);
        errorObj.e = reasonOrValue;
        return errorObj;
    } else {
        checkCancel(this);
        return reasonOrValue;
    }
}

Promise.prototype._passThrough = function(handler, type, success, fail) {
    if (typeof handler !== "function") return this.then();
    return this._then(success,
                      fail,
                      undefined,
                      new PassThroughHandlerContext(this, type, handler),
                      undefined);
};

Promise.prototype.lastly =
Promise.prototype["finally"] = function (handler) {
    return this._passThrough(handler,
                             0,
                             finallyHandler,
                             finallyHandler);
};

Promise.prototype.tap = function (handler) {
    return this._passThrough(handler, 1, finallyHandler);
};

return PassThroughHandlerContext;
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise,
                          apiRejection,
                          INTERNAL,
                          tryConvertToPromise,
                          Proxyable,
                          debug) {
var errors = __webpack_require__(6);
var TypeError = errors.TypeError;
var util = __webpack_require__(0);
var errorObj = util.errorObj;
var tryCatch = util.tryCatch;
var yieldHandlers = [];

function promiseFromYieldHandler(value, yieldHandlers, traceParent) {
    for (var i = 0; i < yieldHandlers.length; ++i) {
        traceParent._pushContext();
        var result = tryCatch(yieldHandlers[i])(value);
        traceParent._popContext();
        if (result === errorObj) {
            traceParent._pushContext();
            var ret = Promise.reject(errorObj.e);
            traceParent._popContext();
            return ret;
        }
        var maybePromise = tryConvertToPromise(result, traceParent);
        if (maybePromise instanceof Promise) return maybePromise;
    }
    return null;
}

function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
    if (debug.cancellation()) {
        var internal = new Promise(INTERNAL);
        var _finallyPromise = this._finallyPromise = new Promise(INTERNAL);
        this._promise = internal.lastly(function() {
            return _finallyPromise;
        });
        internal._captureStackTrace();
        internal._setOnCancel(this);
    } else {
        var promise = this._promise = new Promise(INTERNAL);
        promise._captureStackTrace();
    }
    this._stack = stack;
    this._generatorFunction = generatorFunction;
    this._receiver = receiver;
    this._generator = undefined;
    this._yieldHandlers = typeof yieldHandler === "function"
        ? [yieldHandler].concat(yieldHandlers)
        : yieldHandlers;
    this._yieldedPromise = null;
    this._cancellationPhase = false;
}
util.inherits(PromiseSpawn, Proxyable);

PromiseSpawn.prototype._isResolved = function() {
    return this._promise === null;
};

PromiseSpawn.prototype._cleanup = function() {
    this._promise = this._generator = null;
    if (debug.cancellation() && this._finallyPromise !== null) {
        this._finallyPromise._fulfill();
        this._finallyPromise = null;
    }
};

PromiseSpawn.prototype._promiseCancelled = function() {
    if (this._isResolved()) return;
    var implementsReturn = typeof this._generator["return"] !== "undefined";

    var result;
    if (!implementsReturn) {
        var reason = new Promise.CancellationError(
            "generator .return() sentinel");
        Promise.coroutine.returnSentinel = reason;
        this._promise._attachExtraTrace(reason);
        this._promise._pushContext();
        result = tryCatch(this._generator["throw"]).call(this._generator,
                                                         reason);
        this._promise._popContext();
    } else {
        this._promise._pushContext();
        result = tryCatch(this._generator["return"]).call(this._generator,
                                                          undefined);
        this._promise._popContext();
    }
    this._cancellationPhase = true;
    this._yieldedPromise = null;
    this._continue(result);
};

PromiseSpawn.prototype._promiseFulfilled = function(value) {
    this._yieldedPromise = null;
    this._promise._pushContext();
    var result = tryCatch(this._generator.next).call(this._generator, value);
    this._promise._popContext();
    this._continue(result);
};

PromiseSpawn.prototype._promiseRejected = function(reason) {
    this._yieldedPromise = null;
    this._promise._attachExtraTrace(reason);
    this._promise._pushContext();
    var result = tryCatch(this._generator["throw"])
        .call(this._generator, reason);
    this._promise._popContext();
    this._continue(result);
};

PromiseSpawn.prototype._resultCancelled = function() {
    if (this._yieldedPromise instanceof Promise) {
        var promise = this._yieldedPromise;
        this._yieldedPromise = null;
        promise.cancel();
    }
};

PromiseSpawn.prototype.promise = function () {
    return this._promise;
};

PromiseSpawn.prototype._run = function () {
    this._generator = this._generatorFunction.call(this._receiver);
    this._receiver =
        this._generatorFunction = undefined;
    this._promiseFulfilled(undefined);
};

PromiseSpawn.prototype._continue = function (result) {
    var promise = this._promise;
    if (result === errorObj) {
        this._cleanup();
        if (this._cancellationPhase) {
            return promise.cancel();
        } else {
            return promise._rejectCallback(result.e, false);
        }
    }

    var value = result.value;
    if (result.done === true) {
        this._cleanup();
        if (this._cancellationPhase) {
            return promise.cancel();
        } else {
            return promise._resolveCallback(value);
        }
    } else {
        var maybePromise = tryConvertToPromise(value, this._promise);
        if (!(maybePromise instanceof Promise)) {
            maybePromise =
                promiseFromYieldHandler(maybePromise,
                                        this._yieldHandlers,
                                        this._promise);
            if (maybePromise === null) {
                this._promiseRejected(
                    new TypeError(
                        "A value %s was yielded that could not be treated as a promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a\u000a".replace("%s", value) +
                        "From coroutine:\u000a" +
                        this._stack.split("\n").slice(1, -7).join("\n")
                    )
                );
                return;
            }
        }
        maybePromise = maybePromise._target();
        var bitField = maybePromise._bitField;
        ;
        if (((bitField & 50397184) === 0)) {
            this._yieldedPromise = maybePromise;
            maybePromise._proxy(this, null);
        } else if (((bitField & 33554432) !== 0)) {
            Promise._async.invoke(
                this._promiseFulfilled, this, maybePromise._value()
            );
        } else if (((bitField & 16777216) !== 0)) {
            Promise._async.invoke(
                this._promiseRejected, this, maybePromise._reason()
            );
        } else {
            this._promiseCancelled();
        }
    }
};

Promise.coroutine = function (generatorFunction, options) {
    if (typeof generatorFunction !== "function") {
        throw new TypeError("generatorFunction must be a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    var yieldHandler = Object(options).yieldHandler;
    var PromiseSpawn$ = PromiseSpawn;
    var stack = new Error().stack;
    return function () {
        var generator = generatorFunction.apply(this, arguments);
        var spawn = new PromiseSpawn$(undefined, undefined, yieldHandler,
                                      stack);
        var ret = spawn.promise();
        spawn._generator = generator;
        spawn._promiseFulfilled(undefined);
        return ret;
    };
};

Promise.coroutine.addYieldHandler = function(fn) {
    if (typeof fn !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(fn));
    }
    yieldHandlers.push(fn);
};

Promise.spawn = function (generatorFunction) {
    debug.deprecated("Promise.spawn()", "Promise.coroutine()");
    if (typeof generatorFunction !== "function") {
        return apiRejection("generatorFunction must be a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    var spawn = new PromiseSpawn(generatorFunction, this);
    var ret = spawn.promise();
    spawn._run(Promise.spawn);
    return ret;
};
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports =
function(Promise, PromiseArray, tryConvertToPromise, INTERNAL, async,
         getDomain) {
var util = __webpack_require__(0);
var canEvaluate = util.canEvaluate;
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
var reject;

if (true) {
if (canEvaluate) {
    var thenCallback = function(i) {
        return new Function("value", "holder", "                             \n\
            'use strict';                                                    \n\
            holder.pIndex = value;                                           \n\
            holder.checkFulfillment(this);                                   \n\
            ".replace(/Index/g, i));
    };

    var promiseSetter = function(i) {
        return new Function("promise", "holder", "                           \n\
            'use strict';                                                    \n\
            holder.pIndex = promise;                                         \n\
            ".replace(/Index/g, i));
    };

    var generateHolderClass = function(total) {
        var props = new Array(total);
        for (var i = 0; i < props.length; ++i) {
            props[i] = "this.p" + (i+1);
        }
        var assignment = props.join(" = ") + " = null;";
        var cancellationCode= "var promise;\n" + props.map(function(prop) {
            return "                                                         \n\
                promise = " + prop + ";                                      \n\
                if (promise instanceof Promise) {                            \n\
                    promise.cancel();                                        \n\
                }                                                            \n\
            ";
        }).join("\n");
        var passedArguments = props.join(", ");
        var name = "Holder$" + total;


        var code = "return function(tryCatch, errorObj, Promise, async) {    \n\
            'use strict';                                                    \n\
            function [TheName](fn) {                                         \n\
                [TheProperties]                                              \n\
                this.fn = fn;                                                \n\
                this.asyncNeeded = true;                                     \n\
                this.now = 0;                                                \n\
            }                                                                \n\
                                                                             \n\
            [TheName].prototype._callFunction = function(promise) {          \n\
                promise._pushContext();                                      \n\
                var ret = tryCatch(this.fn)([ThePassedArguments]);           \n\
                promise._popContext();                                       \n\
                if (ret === errorObj) {                                      \n\
                    promise._rejectCallback(ret.e, false);                   \n\
                } else {                                                     \n\
                    promise._resolveCallback(ret);                           \n\
                }                                                            \n\
            };                                                               \n\
                                                                             \n\
            [TheName].prototype.checkFulfillment = function(promise) {       \n\
                var now = ++this.now;                                        \n\
                if (now === [TheTotal]) {                                    \n\
                    if (this.asyncNeeded) {                                  \n\
                        async.invoke(this._callFunction, this, promise);     \n\
                    } else {                                                 \n\
                        this._callFunction(promise);                         \n\
                    }                                                        \n\
                                                                             \n\
                }                                                            \n\
            };                                                               \n\
                                                                             \n\
            [TheName].prototype._resultCancelled = function() {              \n\
                [CancellationCode]                                           \n\
            };                                                               \n\
                                                                             \n\
            return [TheName];                                                \n\
        }(tryCatch, errorObj, Promise, async);                               \n\
        ";

        code = code.replace(/\[TheName\]/g, name)
            .replace(/\[TheTotal\]/g, total)
            .replace(/\[ThePassedArguments\]/g, passedArguments)
            .replace(/\[TheProperties\]/g, assignment)
            .replace(/\[CancellationCode\]/g, cancellationCode);

        return new Function("tryCatch", "errorObj", "Promise", "async", code)
                           (tryCatch, errorObj, Promise, async);
    };

    var holderClasses = [];
    var thenCallbacks = [];
    var promiseSetters = [];

    for (var i = 0; i < 8; ++i) {
        holderClasses.push(generateHolderClass(i + 1));
        thenCallbacks.push(thenCallback(i + 1));
        promiseSetters.push(promiseSetter(i + 1));
    }

    reject = function (reason) {
        this._reject(reason);
    };
}}

Promise.join = function () {
    var last = arguments.length - 1;
    var fn;
    if (last > 0 && typeof arguments[last] === "function") {
        fn = arguments[last];
        if (true) {
            if (last <= 8 && canEvaluate) {
                var ret = new Promise(INTERNAL);
                ret._captureStackTrace();
                var HolderClass = holderClasses[last - 1];
                var holder = new HolderClass(fn);
                var callbacks = thenCallbacks;

                for (var i = 0; i < last; ++i) {
                    var maybePromise = tryConvertToPromise(arguments[i], ret);
                    if (maybePromise instanceof Promise) {
                        maybePromise = maybePromise._target();
                        var bitField = maybePromise._bitField;
                        ;
                        if (((bitField & 50397184) === 0)) {
                            maybePromise._then(callbacks[i], reject,
                                               undefined, ret, holder);
                            promiseSetters[i](maybePromise, holder);
                            holder.asyncNeeded = false;
                        } else if (((bitField & 33554432) !== 0)) {
                            callbacks[i].call(ret,
                                              maybePromise._value(), holder);
                        } else if (((bitField & 16777216) !== 0)) {
                            ret._reject(maybePromise._reason());
                        } else {
                            ret._cancel();
                        }
                    } else {
                        callbacks[i].call(ret, maybePromise, holder);
                    }
                }

                if (!ret._isFateSealed()) {
                    if (holder.asyncNeeded) {
                        var domain = getDomain();
                        if (domain !== null) {
                            holder.fn = util.domainBind(domain, holder.fn);
                        }
                    }
                    ret._setAsyncGuaranteed();
                    ret._setOnCancel(holder);
                }
                return ret;
            }
        }
    }
    var $_len = arguments.length;var args = new Array($_len); for(var $_i = 0; $_i < $_len; ++$_i) {args[$_i] = arguments[$_i];};
    if (fn) args.pop();
    var ret = new PromiseArray(args).promise();
    return fn !== undefined ? ret.spread(fn) : ret;
};

};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise,
                          PromiseArray,
                          apiRejection,
                          tryConvertToPromise,
                          INTERNAL,
                          debug) {
var getDomain = Promise._getDomain;
var util = __webpack_require__(0);
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;
var async = Promise._async;

function MappingPromiseArray(promises, fn, limit, _filter) {
    this.constructor$(promises);
    this._promise._captureStackTrace();
    var domain = getDomain();
    this._callback = domain === null ? fn : util.domainBind(domain, fn);
    this._preservedValues = _filter === INTERNAL
        ? new Array(this.length())
        : null;
    this._limit = limit;
    this._inFlight = 0;
    this._queue = [];
    async.invoke(this._asyncInit, this, undefined);
}
util.inherits(MappingPromiseArray, PromiseArray);

MappingPromiseArray.prototype._asyncInit = function() {
    this._init$(undefined, -2);
};

MappingPromiseArray.prototype._init = function () {};

MappingPromiseArray.prototype._promiseFulfilled = function (value, index) {
    var values = this._values;
    var length = this.length();
    var preservedValues = this._preservedValues;
    var limit = this._limit;

    if (index < 0) {
        index = (index * -1) - 1;
        values[index] = value;
        if (limit >= 1) {
            this._inFlight--;
            this._drainQueue();
            if (this._isResolved()) return true;
        }
    } else {
        if (limit >= 1 && this._inFlight >= limit) {
            values[index] = value;
            this._queue.push(index);
            return false;
        }
        if (preservedValues !== null) preservedValues[index] = value;

        var promise = this._promise;
        var callback = this._callback;
        var receiver = promise._boundValue();
        promise._pushContext();
        var ret = tryCatch(callback).call(receiver, value, index, length);
        var promiseCreated = promise._popContext();
        debug.checkForgottenReturns(
            ret,
            promiseCreated,
            preservedValues !== null ? "Promise.filter" : "Promise.map",
            promise
        );
        if (ret === errorObj) {
            this._reject(ret.e);
            return true;
        }

        var maybePromise = tryConvertToPromise(ret, this._promise);
        if (maybePromise instanceof Promise) {
            maybePromise = maybePromise._target();
            var bitField = maybePromise._bitField;
            ;
            if (((bitField & 50397184) === 0)) {
                if (limit >= 1) this._inFlight++;
                values[index] = maybePromise;
                maybePromise._proxy(this, (index + 1) * -1);
                return false;
            } else if (((bitField & 33554432) !== 0)) {
                ret = maybePromise._value();
            } else if (((bitField & 16777216) !== 0)) {
                this._reject(maybePromise._reason());
                return true;
            } else {
                this._cancel();
                return true;
            }
        }
        values[index] = ret;
    }
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= length) {
        if (preservedValues !== null) {
            this._filter(values, preservedValues);
        } else {
            this._resolve(values);
        }
        return true;
    }
    return false;
};

MappingPromiseArray.prototype._drainQueue = function () {
    var queue = this._queue;
    var limit = this._limit;
    var values = this._values;
    while (queue.length > 0 && this._inFlight < limit) {
        if (this._isResolved()) return;
        var index = queue.pop();
        this._promiseFulfilled(values[index], index);
    }
};

MappingPromiseArray.prototype._filter = function (booleans, values) {
    var len = values.length;
    var ret = new Array(len);
    var j = 0;
    for (var i = 0; i < len; ++i) {
        if (booleans[i]) ret[j++] = values[i];
    }
    ret.length = j;
    this._resolve(ret);
};

MappingPromiseArray.prototype.preservedValues = function () {
    return this._preservedValues;
};

function map(promises, fn, options, _filter) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }

    var limit = 0;
    if (options !== undefined) {
        if (typeof options === "object" && options !== null) {
            if (typeof options.concurrency !== "number") {
                return Promise.reject(
                    new TypeError("'concurrency' must be a number but it is " +
                                    util.classString(options.concurrency)));
            }
            limit = options.concurrency;
        } else {
            return Promise.reject(new TypeError(
                            "options argument must be an object but it is " +
                             util.classString(options)));
        }
    }
    limit = typeof limit === "number" &&
        isFinite(limit) && limit >= 1 ? limit : 0;
    return new MappingPromiseArray(promises, fn, limit, _filter).promise();
}

Promise.prototype.map = function (fn, options) {
    return map(this, fn, options, null);
};

Promise.map = function (promises, fn, options, _filter) {
    return map(promises, fn, options, _filter);
};


};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports =
function(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug) {
var util = __webpack_require__(0);
var tryCatch = util.tryCatch;

Promise.method = function (fn) {
    if (typeof fn !== "function") {
        throw new Promise.TypeError("expecting a function but got " + util.classString(fn));
    }
    return function () {
        var ret = new Promise(INTERNAL);
        ret._captureStackTrace();
        ret._pushContext();
        var value = tryCatch(fn).apply(this, arguments);
        var promiseCreated = ret._popContext();
        debug.checkForgottenReturns(
            value, promiseCreated, "Promise.method", ret);
        ret._resolveFromSyncValue(value);
        return ret;
    };
};

Promise.attempt = Promise["try"] = function (fn) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    ret._pushContext();
    var value;
    if (arguments.length > 1) {
        debug.deprecated("calling Promise.try with more than 1 argument");
        var arg = arguments[1];
        var ctx = arguments[2];
        value = util.isArray(arg) ? tryCatch(fn).apply(ctx, arg)
                                  : tryCatch(fn).call(ctx, arg);
    } else {
        value = tryCatch(fn)();
    }
    var promiseCreated = ret._popContext();
    debug.checkForgottenReturns(
        value, promiseCreated, "Promise.try", ret);
    ret._resolveFromSyncValue(value);
    return ret;
};

Promise.prototype._resolveFromSyncValue = function (value) {
    if (value === util.errorObj) {
        this._rejectCallback(value.e, false);
    } else {
        this._resolveCallback(value, true);
    }
};
};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise) {
var util = __webpack_require__(0);
var async = Promise._async;
var tryCatch = util.tryCatch;
var errorObj = util.errorObj;

function spreadAdapter(val, nodeback) {
    var promise = this;
    if (!util.isArray(val)) return successAdapter.call(promise, val, nodeback);
    var ret =
        tryCatch(nodeback).apply(promise._boundValue(), [null].concat(val));
    if (ret === errorObj) {
        async.throwLater(ret.e);
    }
}

function successAdapter(val, nodeback) {
    var promise = this;
    var receiver = promise._boundValue();
    var ret = val === undefined
        ? tryCatch(nodeback).call(receiver, null)
        : tryCatch(nodeback).call(receiver, null, val);
    if (ret === errorObj) {
        async.throwLater(ret.e);
    }
}
function errorAdapter(reason, nodeback) {
    var promise = this;
    if (!reason) {
        var newReason = new Error(reason + "");
        newReason.cause = reason;
        reason = newReason;
    }
    var ret = tryCatch(nodeback).call(promise._boundValue(), reason);
    if (ret === errorObj) {
        async.throwLater(ret.e);
    }
}

Promise.prototype.asCallback = Promise.prototype.nodeify = function (nodeback,
                                                                     options) {
    if (typeof nodeback == "function") {
        var adapter = successAdapter;
        if (options !== undefined && Object(options).spread) {
            adapter = spreadAdapter;
        }
        this._then(
            adapter,
            errorAdapter,
            undefined,
            this,
            nodeback
        );
    }
    return this;
};
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function() {
var makeSelfResolutionError = function () {
    return new TypeError("circular promise resolution chain\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
};
var reflectHandler = function() {
    return new Promise.PromiseInspection(this._target());
};
var apiRejection = function(msg) {
    return Promise.reject(new TypeError(msg));
};
function Proxyable() {}
var UNDEFINED_BINDING = {};
var util = __webpack_require__(0);

var getDomain;
if (util.isNode) {
    getDomain = function() {
        var ret = process.domain;
        if (ret === undefined) ret = null;
        return ret;
    };
} else {
    getDomain = function() {
        return null;
    };
}
util.notEnumerableProp(Promise, "_getDomain", getDomain);

var es5 = __webpack_require__(7);
var Async = __webpack_require__(40);
var async = new Async();
es5.defineProperty(Promise, "_async", {value: async});
var errors = __webpack_require__(6);
var TypeError = Promise.TypeError = errors.TypeError;
Promise.RangeError = errors.RangeError;
var CancellationError = Promise.CancellationError = errors.CancellationError;
Promise.TimeoutError = errors.TimeoutError;
Promise.OperationalError = errors.OperationalError;
Promise.RejectionError = errors.OperationalError;
Promise.AggregateError = errors.AggregateError;
var INTERNAL = function(){};
var APPLY = {};
var NEXT_FILTER = {};
var tryConvertToPromise = __webpack_require__(67)(Promise, INTERNAL);
var PromiseArray =
    __webpack_require__(57)(Promise, INTERNAL,
                               tryConvertToPromise, apiRejection, Proxyable);
var Context = __webpack_require__(45)(Promise);
 /*jshint unused:false*/
var createContext = Context.create;
var debug = __webpack_require__(46)(Promise, Context);
var CapturedTrace = debug.CapturedTrace;
var PassThroughHandlerContext =
    __webpack_require__(50)(Promise, tryConvertToPromise);
var catchFilter = __webpack_require__(44)(NEXT_FILTER);
var nodebackForPromise = __webpack_require__(19);
var errorObj = util.errorObj;
var tryCatch = util.tryCatch;
function check(self, executor) {
    if (typeof executor !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(executor));
    }
    if (self.constructor !== Promise) {
        throw new TypeError("the promise constructor cannot be invoked directly\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
}

function Promise(executor) {
    this._bitField = 0;
    this._fulfillmentHandler0 = undefined;
    this._rejectionHandler0 = undefined;
    this._promise0 = undefined;
    this._receiver0 = undefined;
    if (executor !== INTERNAL) {
        check(this, executor);
        this._resolveFromExecutor(executor);
    }
    this._promiseCreated();
    this._fireEvent("promiseCreated", this);
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.caught = Promise.prototype["catch"] = function (fn) {
    var len = arguments.length;
    if (len > 1) {
        var catchInstances = new Array(len - 1),
            j = 0, i;
        for (i = 0; i < len - 1; ++i) {
            var item = arguments[i];
            if (util.isObject(item)) {
                catchInstances[j++] = item;
            } else {
                return apiRejection("expecting an object but got " +
                    "A catch statement predicate " + util.classString(item));
            }
        }
        catchInstances.length = j;
        fn = arguments[i];
        return this.then(undefined, catchFilter(catchInstances, fn, this));
    }
    return this.then(undefined, fn);
};

Promise.prototype.reflect = function () {
    return this._then(reflectHandler,
        reflectHandler, undefined, this, undefined);
};

Promise.prototype.then = function (didFulfill, didReject) {
    if (debug.warnings() && arguments.length > 0 &&
        typeof didFulfill !== "function" &&
        typeof didReject !== "function") {
        var msg = ".then() only accepts functions but was passed: " +
                util.classString(didFulfill);
        if (arguments.length > 1) {
            msg += ", " + util.classString(didReject);
        }
        this._warn(msg);
    }
    return this._then(didFulfill, didReject, undefined, undefined, undefined);
};

Promise.prototype.done = function (didFulfill, didReject) {
    var promise =
        this._then(didFulfill, didReject, undefined, undefined, undefined);
    promise._setIsFinal();
};

Promise.prototype.spread = function (fn) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }
    return this.all()._then(fn, undefined, undefined, APPLY, undefined);
};

Promise.prototype.toJSON = function () {
    var ret = {
        isFulfilled: false,
        isRejected: false,
        fulfillmentValue: undefined,
        rejectionReason: undefined
    };
    if (this.isFulfilled()) {
        ret.fulfillmentValue = this.value();
        ret.isFulfilled = true;
    } else if (this.isRejected()) {
        ret.rejectionReason = this.reason();
        ret.isRejected = true;
    }
    return ret;
};

Promise.prototype.all = function () {
    if (arguments.length > 0) {
        this._warn(".all() was passed arguments but it does not take any");
    }
    return new PromiseArray(this).promise();
};

Promise.prototype.error = function (fn) {
    return this.caught(util.originatesFromRejection, fn);
};

Promise.getNewLibraryCopy = module.exports;

Promise.is = function (val) {
    return val instanceof Promise;
};

Promise.fromNode = Promise.fromCallback = function(fn) {
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs
                                         : false;
    var result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
    if (result === errorObj) {
        ret._rejectCallback(result.e, true);
    }
    if (!ret._isFateSealed()) ret._setAsyncGuaranteed();
    return ret;
};

Promise.all = function (promises) {
    return new PromiseArray(promises).promise();
};

Promise.cast = function (obj) {
    var ret = tryConvertToPromise(obj);
    if (!(ret instanceof Promise)) {
        ret = new Promise(INTERNAL);
        ret._captureStackTrace();
        ret._setFulfilled();
        ret._rejectionHandler0 = obj;
    }
    return ret;
};

Promise.resolve = Promise.fulfilled = Promise.cast;

Promise.reject = Promise.rejected = function (reason) {
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    ret._rejectCallback(reason, true);
    return ret;
};

Promise.setScheduler = function(fn) {
    if (typeof fn !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(fn));
    }
    return async.setScheduler(fn);
};

Promise.prototype._then = function (
    didFulfill,
    didReject,
    _,    receiver,
    internalData
) {
    var haveInternalData = internalData !== undefined;
    var promise = haveInternalData ? internalData : new Promise(INTERNAL);
    var target = this._target();
    var bitField = target._bitField;

    if (!haveInternalData) {
        promise._propagateFrom(this, 3);
        promise._captureStackTrace();
        if (receiver === undefined &&
            ((this._bitField & 2097152) !== 0)) {
            if (!((bitField & 50397184) === 0)) {
                receiver = this._boundValue();
            } else {
                receiver = target === this ? undefined : this._boundTo;
            }
        }
        this._fireEvent("promiseChained", this, promise);
    }

    var domain = getDomain();
    if (!((bitField & 50397184) === 0)) {
        var handler, value, settler = target._settlePromiseCtx;
        if (((bitField & 33554432) !== 0)) {
            value = target._rejectionHandler0;
            handler = didFulfill;
        } else if (((bitField & 16777216) !== 0)) {
            value = target._fulfillmentHandler0;
            handler = didReject;
            target._unsetRejectionIsUnhandled();
        } else {
            settler = target._settlePromiseLateCancellationObserver;
            value = new CancellationError("late cancellation observer");
            target._attachExtraTrace(value);
            handler = didReject;
        }

        async.invoke(settler, target, {
            handler: domain === null ? handler
                : (typeof handler === "function" &&
                    util.domainBind(domain, handler)),
            promise: promise,
            receiver: receiver,
            value: value
        });
    } else {
        target._addCallbacks(didFulfill, didReject, promise, receiver, domain);
    }

    return promise;
};

Promise.prototype._length = function () {
    return this._bitField & 65535;
};

Promise.prototype._isFateSealed = function () {
    return (this._bitField & 117506048) !== 0;
};

Promise.prototype._isFollowing = function () {
    return (this._bitField & 67108864) === 67108864;
};

Promise.prototype._setLength = function (len) {
    this._bitField = (this._bitField & -65536) |
        (len & 65535);
};

Promise.prototype._setFulfilled = function () {
    this._bitField = this._bitField | 33554432;
    this._fireEvent("promiseFulfilled", this);
};

Promise.prototype._setRejected = function () {
    this._bitField = this._bitField | 16777216;
    this._fireEvent("promiseRejected", this);
};

Promise.prototype._setFollowing = function () {
    this._bitField = this._bitField | 67108864;
    this._fireEvent("promiseResolved", this);
};

Promise.prototype._setIsFinal = function () {
    this._bitField = this._bitField | 4194304;
};

Promise.prototype._isFinal = function () {
    return (this._bitField & 4194304) > 0;
};

Promise.prototype._unsetCancelled = function() {
    this._bitField = this._bitField & (~65536);
};

Promise.prototype._setCancelled = function() {
    this._bitField = this._bitField | 65536;
    this._fireEvent("promiseCancelled", this);
};

Promise.prototype._setWillBeCancelled = function() {
    this._bitField = this._bitField | 8388608;
};

Promise.prototype._setAsyncGuaranteed = function() {
    if (async.hasCustomScheduler()) return;
    this._bitField = this._bitField | 134217728;
};

Promise.prototype._receiverAt = function (index) {
    var ret = index === 0 ? this._receiver0 : this[
            index * 4 - 4 + 3];
    if (ret === UNDEFINED_BINDING) {
        return undefined;
    } else if (ret === undefined && this._isBound()) {
        return this._boundValue();
    }
    return ret;
};

Promise.prototype._promiseAt = function (index) {
    return this[
            index * 4 - 4 + 2];
};

Promise.prototype._fulfillmentHandlerAt = function (index) {
    return this[
            index * 4 - 4 + 0];
};

Promise.prototype._rejectionHandlerAt = function (index) {
    return this[
            index * 4 - 4 + 1];
};

Promise.prototype._boundValue = function() {};

Promise.prototype._migrateCallback0 = function (follower) {
    var bitField = follower._bitField;
    var fulfill = follower._fulfillmentHandler0;
    var reject = follower._rejectionHandler0;
    var promise = follower._promise0;
    var receiver = follower._receiverAt(0);
    if (receiver === undefined) receiver = UNDEFINED_BINDING;
    this._addCallbacks(fulfill, reject, promise, receiver, null);
};

Promise.prototype._migrateCallbackAt = function (follower, index) {
    var fulfill = follower._fulfillmentHandlerAt(index);
    var reject = follower._rejectionHandlerAt(index);
    var promise = follower._promiseAt(index);
    var receiver = follower._receiverAt(index);
    if (receiver === undefined) receiver = UNDEFINED_BINDING;
    this._addCallbacks(fulfill, reject, promise, receiver, null);
};

Promise.prototype._addCallbacks = function (
    fulfill,
    reject,
    promise,
    receiver,
    domain
) {
    var index = this._length();

    if (index >= 65535 - 4) {
        index = 0;
        this._setLength(0);
    }

    if (index === 0) {
        this._promise0 = promise;
        this._receiver0 = receiver;
        if (typeof fulfill === "function") {
            this._fulfillmentHandler0 =
                domain === null ? fulfill : util.domainBind(domain, fulfill);
        }
        if (typeof reject === "function") {
            this._rejectionHandler0 =
                domain === null ? reject : util.domainBind(domain, reject);
        }
    } else {
        var base = index * 4 - 4;
        this[base + 2] = promise;
        this[base + 3] = receiver;
        if (typeof fulfill === "function") {
            this[base + 0] =
                domain === null ? fulfill : util.domainBind(domain, fulfill);
        }
        if (typeof reject === "function") {
            this[base + 1] =
                domain === null ? reject : util.domainBind(domain, reject);
        }
    }
    this._setLength(index + 1);
    return index;
};

Promise.prototype._proxy = function (proxyable, arg) {
    this._addCallbacks(undefined, undefined, arg, proxyable, null);
};

Promise.prototype._resolveCallback = function(value, shouldBind) {
    if (((this._bitField & 117506048) !== 0)) return;
    if (value === this)
        return this._rejectCallback(makeSelfResolutionError(), false);
    var maybePromise = tryConvertToPromise(value, this);
    if (!(maybePromise instanceof Promise)) return this._fulfill(value);

    if (shouldBind) this._propagateFrom(maybePromise, 2);

    var promise = maybePromise._target();

    if (promise === this) {
        this._reject(makeSelfResolutionError());
        return;
    }

    var bitField = promise._bitField;
    if (((bitField & 50397184) === 0)) {
        var len = this._length();
        if (len > 0) promise._migrateCallback0(this);
        for (var i = 1; i < len; ++i) {
            promise._migrateCallbackAt(this, i);
        }
        this._setFollowing();
        this._setLength(0);
        this._setFollowee(promise);
    } else if (((bitField & 33554432) !== 0)) {
        this._fulfill(promise._value());
    } else if (((bitField & 16777216) !== 0)) {
        this._reject(promise._reason());
    } else {
        var reason = new CancellationError("late cancellation observer");
        promise._attachExtraTrace(reason);
        this._reject(reason);
    }
};

Promise.prototype._rejectCallback =
function(reason, synchronous, ignoreNonErrorWarnings) {
    var trace = util.ensureErrorObject(reason);
    var hasStack = trace === reason;
    if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
        var message = "a promise was rejected with a non-error: " +
            util.classString(reason);
        this._warn(message, true);
    }
    this._attachExtraTrace(trace, synchronous ? hasStack : false);
    this._reject(reason);
};

Promise.prototype._resolveFromExecutor = function (executor) {
    var promise = this;
    this._captureStackTrace();
    this._pushContext();
    var synchronous = true;
    var r = this._execute(executor, function(value) {
        promise._resolveCallback(value);
    }, function (reason) {
        promise._rejectCallback(reason, synchronous);
    });
    synchronous = false;
    this._popContext();

    if (r !== undefined) {
        promise._rejectCallback(r, true);
    }
};

Promise.prototype._settlePromiseFromHandler = function (
    handler, receiver, value, promise
) {
    var bitField = promise._bitField;
    if (((bitField & 65536) !== 0)) return;
    promise._pushContext();
    var x;
    if (receiver === APPLY) {
        if (!value || typeof value.length !== "number") {
            x = errorObj;
            x.e = new TypeError("cannot .spread() a non-array: " +
                                    util.classString(value));
        } else {
            x = tryCatch(handler).apply(this._boundValue(), value);
        }
    } else {
        x = tryCatch(handler).call(receiver, value);
    }
    var promiseCreated = promise._popContext();
    bitField = promise._bitField;
    if (((bitField & 65536) !== 0)) return;

    if (x === NEXT_FILTER) {
        promise._reject(value);
    } else if (x === errorObj) {
        promise._rejectCallback(x.e, false);
    } else {
        debug.checkForgottenReturns(x, promiseCreated, "",  promise, this);
        promise._resolveCallback(x);
    }
};

Promise.prototype._target = function() {
    var ret = this;
    while (ret._isFollowing()) ret = ret._followee();
    return ret;
};

Promise.prototype._followee = function() {
    return this._rejectionHandler0;
};

Promise.prototype._setFollowee = function(promise) {
    this._rejectionHandler0 = promise;
};

Promise.prototype._settlePromise = function(promise, handler, receiver, value) {
    var isPromise = promise instanceof Promise;
    var bitField = this._bitField;
    var asyncGuaranteed = ((bitField & 134217728) !== 0);
    if (((bitField & 65536) !== 0)) {
        if (isPromise) promise._invokeInternalOnCancel();

        if (receiver instanceof PassThroughHandlerContext &&
            receiver.isFinallyHandler()) {
            receiver.cancelPromise = promise;
            if (tryCatch(handler).call(receiver, value) === errorObj) {
                promise._reject(errorObj.e);
            }
        } else if (handler === reflectHandler) {
            promise._fulfill(reflectHandler.call(receiver));
        } else if (receiver instanceof Proxyable) {
            receiver._promiseCancelled(promise);
        } else if (isPromise || promise instanceof PromiseArray) {
            promise._cancel();
        } else {
            receiver.cancel();
        }
    } else if (typeof handler === "function") {
        if (!isPromise) {
            handler.call(receiver, value, promise);
        } else {
            if (asyncGuaranteed) promise._setAsyncGuaranteed();
            this._settlePromiseFromHandler(handler, receiver, value, promise);
        }
    } else if (receiver instanceof Proxyable) {
        if (!receiver._isResolved()) {
            if (((bitField & 33554432) !== 0)) {
                receiver._promiseFulfilled(value, promise);
            } else {
                receiver._promiseRejected(value, promise);
            }
        }
    } else if (isPromise) {
        if (asyncGuaranteed) promise._setAsyncGuaranteed();
        if (((bitField & 33554432) !== 0)) {
            promise._fulfill(value);
        } else {
            promise._reject(value);
        }
    }
};

Promise.prototype._settlePromiseLateCancellationObserver = function(ctx) {
    var handler = ctx.handler;
    var promise = ctx.promise;
    var receiver = ctx.receiver;
    var value = ctx.value;
    if (typeof handler === "function") {
        if (!(promise instanceof Promise)) {
            handler.call(receiver, value, promise);
        } else {
            this._settlePromiseFromHandler(handler, receiver, value, promise);
        }
    } else if (promise instanceof Promise) {
        promise._reject(value);
    }
};

Promise.prototype._settlePromiseCtx = function(ctx) {
    this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
};

Promise.prototype._settlePromise0 = function(handler, value, bitField) {
    var promise = this._promise0;
    var receiver = this._receiverAt(0);
    this._promise0 = undefined;
    this._receiver0 = undefined;
    this._settlePromise(promise, handler, receiver, value);
};

Promise.prototype._clearCallbackDataAtIndex = function(index) {
    var base = index * 4 - 4;
    this[base + 2] =
    this[base + 3] =
    this[base + 0] =
    this[base + 1] = undefined;
};

Promise.prototype._fulfill = function (value) {
    var bitField = this._bitField;
    if (((bitField & 117506048) >>> 16)) return;
    if (value === this) {
        var err = makeSelfResolutionError();
        this._attachExtraTrace(err);
        return this._reject(err);
    }
    this._setFulfilled();
    this._rejectionHandler0 = value;

    if ((bitField & 65535) > 0) {
        if (((bitField & 134217728) !== 0)) {
            this._settlePromises();
        } else {
            async.settlePromises(this);
        }
    }
};

Promise.prototype._reject = function (reason) {
    var bitField = this._bitField;
    if (((bitField & 117506048) >>> 16)) return;
    this._setRejected();
    this._fulfillmentHandler0 = reason;

    if (this._isFinal()) {
        return async.fatalError(reason, util.isNode);
    }

    if ((bitField & 65535) > 0) {
        async.settlePromises(this);
    } else {
        this._ensurePossibleRejectionHandled();
    }
};

Promise.prototype._fulfillPromises = function (len, value) {
    for (var i = 1; i < len; i++) {
        var handler = this._fulfillmentHandlerAt(i);
        var promise = this._promiseAt(i);
        var receiver = this._receiverAt(i);
        this._clearCallbackDataAtIndex(i);
        this._settlePromise(promise, handler, receiver, value);
    }
};

Promise.prototype._rejectPromises = function (len, reason) {
    for (var i = 1; i < len; i++) {
        var handler = this._rejectionHandlerAt(i);
        var promise = this._promiseAt(i);
        var receiver = this._receiverAt(i);
        this._clearCallbackDataAtIndex(i);
        this._settlePromise(promise, handler, receiver, reason);
    }
};

Promise.prototype._settlePromises = function () {
    var bitField = this._bitField;
    var len = (bitField & 65535);

    if (len > 0) {
        if (((bitField & 16842752) !== 0)) {
            var reason = this._fulfillmentHandler0;
            this._settlePromise0(this._rejectionHandler0, reason, bitField);
            this._rejectPromises(len, reason);
        } else {
            var value = this._rejectionHandler0;
            this._settlePromise0(this._fulfillmentHandler0, value, bitField);
            this._fulfillPromises(len, value);
        }
        this._setLength(0);
    }
    this._clearCancellationData();
};

Promise.prototype._settledValue = function() {
    var bitField = this._bitField;
    if (((bitField & 33554432) !== 0)) {
        return this._rejectionHandler0;
    } else if (((bitField & 16777216) !== 0)) {
        return this._fulfillmentHandler0;
    }
};

function deferResolve(v) {this.promise._resolveCallback(v);}
function deferReject(v) {this.promise._rejectCallback(v, false);}

Promise.defer = Promise.pending = function() {
    debug.deprecated("Promise.defer", "new Promise");
    var promise = new Promise(INTERNAL);
    return {
        promise: promise,
        resolve: deferResolve,
        reject: deferReject
    };
};

util.notEnumerableProp(Promise,
                       "_makeSelfResolutionError",
                       makeSelfResolutionError);

__webpack_require__(54)(Promise, INTERNAL, tryConvertToPromise, apiRejection,
    debug);
__webpack_require__(41)(Promise, INTERNAL, tryConvertToPromise, debug);
__webpack_require__(43)(Promise, PromiseArray, apiRejection, debug);
__webpack_require__(47)(Promise);
__webpack_require__(66)(Promise);
__webpack_require__(52)(
    Promise, PromiseArray, tryConvertToPromise, INTERNAL, async, getDomain);
Promise.Promise = Promise;
Promise.version = "3.4.7";
__webpack_require__(53)(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
__webpack_require__(42)(Promise);
__webpack_require__(69)(Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug);
__webpack_require__(68)(Promise, INTERNAL, debug);
__webpack_require__(51)(Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug);
__webpack_require__(55)(Promise);
__webpack_require__(58)(Promise, INTERNAL);
__webpack_require__(59)(Promise, PromiseArray, tryConvertToPromise, apiRejection);
__webpack_require__(61)(Promise, INTERNAL, tryConvertToPromise, apiRejection);
__webpack_require__(62)(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
__webpack_require__(64)(Promise, PromiseArray, debug);
__webpack_require__(65)(Promise, PromiseArray, apiRejection);
__webpack_require__(49)(Promise, INTERNAL);
__webpack_require__(48)(Promise, INTERNAL);
__webpack_require__(39)(Promise);
                                                         
    util.toFastProperties(Promise);                                          
    util.toFastProperties(Promise.prototype);                                
    function fillTypes(value) {                                              
        var p = new Promise(INTERNAL);                                       
        p._fulfillmentHandler0 = value;                                      
        p._rejectionHandler0 = value;                                        
        p._promise0 = value;                                                 
        p._receiver0 = value;                                                
    }                                                                        
    // Complete slack tracking, opt out of field-type tracking and           
    // stabilize map                                                         
    fillTypes({a: 1});                                                       
    fillTypes({b: 2});                                                       
    fillTypes({c: 3});                                                       
    fillTypes(1);                                                            
    fillTypes(function(){});                                                 
    fillTypes(undefined);                                                    
    fillTypes(false);                                                        
    fillTypes(new Promise(INTERNAL));                                        
    debug.setBounds(Async.firstLineError, util.lastLineError);               
    return Promise;                                                          

};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, INTERNAL, tryConvertToPromise,
    apiRejection, Proxyable) {
var util = __webpack_require__(0);
var isArray = util.isArray;

function toResolutionValue(val) {
    switch(val) {
    case -2: return [];
    case -3: return {};
    }
}

function PromiseArray(values) {
    var promise = this._promise = new Promise(INTERNAL);
    if (values instanceof Promise) {
        promise._propagateFrom(values, 3);
    }
    promise._setOnCancel(this);
    this._values = values;
    this._length = 0;
    this._totalResolved = 0;
    this._init(undefined, -2);
}
util.inherits(PromiseArray, Proxyable);

PromiseArray.prototype.length = function () {
    return this._length;
};

PromiseArray.prototype.promise = function () {
    return this._promise;
};

PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
    var values = tryConvertToPromise(this._values, this._promise);
    if (values instanceof Promise) {
        values = values._target();
        var bitField = values._bitField;
        ;
        this._values = values;

        if (((bitField & 50397184) === 0)) {
            this._promise._setAsyncGuaranteed();
            return values._then(
                init,
                this._reject,
                undefined,
                this,
                resolveValueIfEmpty
           );
        } else if (((bitField & 33554432) !== 0)) {
            values = values._value();
        } else if (((bitField & 16777216) !== 0)) {
            return this._reject(values._reason());
        } else {
            return this._cancel();
        }
    }
    values = util.asArray(values);
    if (values === null) {
        var err = apiRejection(
            "expecting an array or an iterable object but got " + util.classString(values)).reason();
        this._promise._rejectCallback(err, false);
        return;
    }

    if (values.length === 0) {
        if (resolveValueIfEmpty === -5) {
            this._resolveEmptyArray();
        }
        else {
            this._resolve(toResolutionValue(resolveValueIfEmpty));
        }
        return;
    }
    this._iterate(values);
};

PromiseArray.prototype._iterate = function(values) {
    var len = this.getActualLength(values.length);
    this._length = len;
    this._values = this.shouldCopyValues() ? new Array(len) : this._values;
    var result = this._promise;
    var isResolved = false;
    var bitField = null;
    for (var i = 0; i < len; ++i) {
        var maybePromise = tryConvertToPromise(values[i], result);

        if (maybePromise instanceof Promise) {
            maybePromise = maybePromise._target();
            bitField = maybePromise._bitField;
        } else {
            bitField = null;
        }

        if (isResolved) {
            if (bitField !== null) {
                maybePromise.suppressUnhandledRejections();
            }
        } else if (bitField !== null) {
            if (((bitField & 50397184) === 0)) {
                maybePromise._proxy(this, i);
                this._values[i] = maybePromise;
            } else if (((bitField & 33554432) !== 0)) {
                isResolved = this._promiseFulfilled(maybePromise._value(), i);
            } else if (((bitField & 16777216) !== 0)) {
                isResolved = this._promiseRejected(maybePromise._reason(), i);
            } else {
                isResolved = this._promiseCancelled(i);
            }
        } else {
            isResolved = this._promiseFulfilled(maybePromise, i);
        }
    }
    if (!isResolved) result._setAsyncGuaranteed();
};

PromiseArray.prototype._isResolved = function () {
    return this._values === null;
};

PromiseArray.prototype._resolve = function (value) {
    this._values = null;
    this._promise._fulfill(value);
};

PromiseArray.prototype._cancel = function() {
    if (this._isResolved() || !this._promise._isCancellable()) return;
    this._values = null;
    this._promise._cancel();
};

PromiseArray.prototype._reject = function (reason) {
    this._values = null;
    this._promise._rejectCallback(reason, false);
};

PromiseArray.prototype._promiseFulfilled = function (value, index) {
    this._values[index] = value;
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= this._length) {
        this._resolve(this._values);
        return true;
    }
    return false;
};

PromiseArray.prototype._promiseCancelled = function() {
    this._cancel();
    return true;
};

PromiseArray.prototype._promiseRejected = function (reason) {
    this._totalResolved++;
    this._reject(reason);
    return true;
};

PromiseArray.prototype._resultCancelled = function() {
    if (this._isResolved()) return;
    var values = this._values;
    this._cancel();
    if (values instanceof Promise) {
        values.cancel();
    } else {
        for (var i = 0; i < values.length; ++i) {
            if (values[i] instanceof Promise) {
                values[i].cancel();
            }
        }
    }
};

PromiseArray.prototype.shouldCopyValues = function () {
    return true;
};

PromiseArray.prototype.getActualLength = function (len) {
    return len;
};

return PromiseArray;
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, INTERNAL) {
var THIS = {};
var util = __webpack_require__(0);
var nodebackForPromise = __webpack_require__(19);
var withAppended = util.withAppended;
var maybeWrapAsError = util.maybeWrapAsError;
var canEvaluate = util.canEvaluate;
var TypeError = __webpack_require__(6).TypeError;
var defaultSuffix = "Async";
var defaultPromisified = {__isPromisified__: true};
var noCopyProps = [
    "arity",    "length",
    "name",
    "arguments",
    "caller",
    "callee",
    "prototype",
    "__isPromisified__"
];
var noCopyPropsPattern = new RegExp("^(?:" + noCopyProps.join("|") + ")$");

var defaultFilter = function(name) {
    return util.isIdentifier(name) &&
        name.charAt(0) !== "_" &&
        name !== "constructor";
};

function propsFilter(key) {
    return !noCopyPropsPattern.test(key);
}

function isPromisified(fn) {
    try {
        return fn.__isPromisified__ === true;
    }
    catch (e) {
        return false;
    }
}

function hasPromisified(obj, key, suffix) {
    var val = util.getDataPropertyOrDefault(obj, key + suffix,
                                            defaultPromisified);
    return val ? isPromisified(val) : false;
}
function checkValid(ret, suffix, suffixRegexp) {
    for (var i = 0; i < ret.length; i += 2) {
        var key = ret[i];
        if (suffixRegexp.test(key)) {
            var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
            for (var j = 0; j < ret.length; j += 2) {
                if (ret[j] === keyWithoutAsyncSuffix) {
                    throw new TypeError("Cannot promisify an API that has normal methods with '%s'-suffix\u000a\u000a    See http://goo.gl/MqrFmX\u000a"
                        .replace("%s", suffix));
                }
            }
        }
    }
}

function promisifiableMethods(obj, suffix, suffixRegexp, filter) {
    var keys = util.inheritedDataKeys(obj);
    var ret = [];
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var value = obj[key];
        var passesDefaultFilter = filter === defaultFilter
            ? true : defaultFilter(key, value, obj);
        if (typeof value === "function" &&
            !isPromisified(value) &&
            !hasPromisified(obj, key, suffix) &&
            filter(key, value, obj, passesDefaultFilter)) {
            ret.push(key, value);
        }
    }
    checkValid(ret, suffix, suffixRegexp);
    return ret;
}

var escapeIdentRegex = function(str) {
    return str.replace(/([$])/, "\\$");
};

var makeNodePromisifiedEval;
if (true) {
var switchCaseArgumentOrder = function(likelyArgumentCount) {
    var ret = [likelyArgumentCount];
    var min = Math.max(0, likelyArgumentCount - 1 - 3);
    for(var i = likelyArgumentCount - 1; i >= min; --i) {
        ret.push(i);
    }
    for(var i = likelyArgumentCount + 1; i <= 3; ++i) {
        ret.push(i);
    }
    return ret;
};

var argumentSequence = function(argumentCount) {
    return util.filledRange(argumentCount, "_arg", "");
};

var parameterDeclaration = function(parameterCount) {
    return util.filledRange(
        Math.max(parameterCount, 3), "_arg", "");
};

var parameterCount = function(fn) {
    if (typeof fn.length === "number") {
        return Math.max(Math.min(fn.length, 1023 + 1), 0);
    }
    return 0;
};

makeNodePromisifiedEval =
function(callback, receiver, originalName, fn, _, multiArgs) {
    var newParameterCount = Math.max(0, parameterCount(fn) - 1);
    var argumentOrder = switchCaseArgumentOrder(newParameterCount);
    var shouldProxyThis = typeof callback === "string" || receiver === THIS;

    function generateCallForArgumentCount(count) {
        var args = argumentSequence(count).join(", ");
        var comma = count > 0 ? ", " : "";
        var ret;
        if (shouldProxyThis) {
            ret = "ret = callback.call(this, {{args}}, nodeback); break;\n";
        } else {
            ret = receiver === undefined
                ? "ret = callback({{args}}, nodeback); break;\n"
                : "ret = callback.call(receiver, {{args}}, nodeback); break;\n";
        }
        return ret.replace("{{args}}", args).replace(", ", comma);
    }

    function generateArgumentSwitchCase() {
        var ret = "";
        for (var i = 0; i < argumentOrder.length; ++i) {
            ret += "case " + argumentOrder[i] +":" +
                generateCallForArgumentCount(argumentOrder[i]);
        }

        ret += "                                                             \n\
        default:                                                             \n\
            var args = new Array(len + 1);                                   \n\
            var i = 0;                                                       \n\
            for (var i = 0; i < len; ++i) {                                  \n\
               args[i] = arguments[i];                                       \n\
            }                                                                \n\
            args[i] = nodeback;                                              \n\
            [CodeForCall]                                                    \n\
            break;                                                           \n\
        ".replace("[CodeForCall]", (shouldProxyThis
                                ? "ret = callback.apply(this, args);\n"
                                : "ret = callback.apply(receiver, args);\n"));
        return ret;
    }

    var getFunctionCode = typeof callback === "string"
                                ? ("this != null ? this['"+callback+"'] : fn")
                                : "fn";
    var body = "'use strict';                                                \n\
        var ret = function (Parameters) {                                    \n\
            'use strict';                                                    \n\
            var len = arguments.length;                                      \n\
            var promise = new Promise(INTERNAL);                             \n\
            promise._captureStackTrace();                                    \n\
            var nodeback = nodebackForPromise(promise, " + multiArgs + ");   \n\
            var ret;                                                         \n\
            var callback = tryCatch([GetFunctionCode]);                      \n\
            switch(len) {                                                    \n\
                [CodeForSwitchCase]                                          \n\
            }                                                                \n\
            if (ret === errorObj) {                                          \n\
                promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n\
            }                                                                \n\
            if (!promise._isFateSealed()) promise._setAsyncGuaranteed();     \n\
            return promise;                                                  \n\
        };                                                                   \n\
        notEnumerableProp(ret, '__isPromisified__', true);                   \n\
        return ret;                                                          \n\
    ".replace("[CodeForSwitchCase]", generateArgumentSwitchCase())
        .replace("[GetFunctionCode]", getFunctionCode);
    body = body.replace("Parameters", parameterDeclaration(newParameterCount));
    return new Function("Promise",
                        "fn",
                        "receiver",
                        "withAppended",
                        "maybeWrapAsError",
                        "nodebackForPromise",
                        "tryCatch",
                        "errorObj",
                        "notEnumerableProp",
                        "INTERNAL",
                        body)(
                    Promise,
                    fn,
                    receiver,
                    withAppended,
                    maybeWrapAsError,
                    nodebackForPromise,
                    util.tryCatch,
                    util.errorObj,
                    util.notEnumerableProp,
                    INTERNAL);
};
}

function makeNodePromisifiedClosure(callback, receiver, _, fn, __, multiArgs) {
    var defaultThis = (function() {return this;})();
    var method = callback;
    if (typeof method === "string") {
        callback = fn;
    }
    function promisified() {
        var _receiver = receiver;
        if (receiver === THIS) _receiver = this;
        var promise = new Promise(INTERNAL);
        promise._captureStackTrace();
        var cb = typeof method === "string" && this !== defaultThis
            ? this[method] : callback;
        var fn = nodebackForPromise(promise, multiArgs);
        try {
            cb.apply(_receiver, withAppended(arguments, fn));
        } catch(e) {
            promise._rejectCallback(maybeWrapAsError(e), true, true);
        }
        if (!promise._isFateSealed()) promise._setAsyncGuaranteed();
        return promise;
    }
    util.notEnumerableProp(promisified, "__isPromisified__", true);
    return promisified;
}

var makeNodePromisified = canEvaluate
    ? makeNodePromisifiedEval
    : makeNodePromisifiedClosure;

function promisifyAll(obj, suffix, filter, promisifier, multiArgs) {
    var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
    var methods =
        promisifiableMethods(obj, suffix, suffixRegexp, filter);

    for (var i = 0, len = methods.length; i < len; i+= 2) {
        var key = methods[i];
        var fn = methods[i+1];
        var promisifiedKey = key + suffix;
        if (promisifier === makeNodePromisified) {
            obj[promisifiedKey] =
                makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
        } else {
            var promisified = promisifier(fn, function() {
                return makeNodePromisified(key, THIS, key,
                                           fn, suffix, multiArgs);
            });
            util.notEnumerableProp(promisified, "__isPromisified__", true);
            obj[promisifiedKey] = promisified;
        }
    }
    util.toFastProperties(obj);
    return obj;
}

function promisify(callback, receiver, multiArgs) {
    return makeNodePromisified(callback, receiver, undefined,
                                callback, null, multiArgs);
}

Promise.promisify = function (fn, options) {
    if (typeof fn !== "function") {
        throw new TypeError("expecting a function but got " + util.classString(fn));
    }
    if (isPromisified(fn)) {
        return fn;
    }
    options = Object(options);
    var receiver = options.context === undefined ? THIS : options.context;
    var multiArgs = !!options.multiArgs;
    var ret = promisify(fn, receiver, multiArgs);
    util.copyDescriptors(fn, ret, propsFilter);
    return ret;
};

Promise.promisifyAll = function (target, options) {
    if (typeof target !== "function" && typeof target !== "object") {
        throw new TypeError("the target of promisifyAll must be an object or a function\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    options = Object(options);
    var multiArgs = !!options.multiArgs;
    var suffix = options.suffix;
    if (typeof suffix !== "string") suffix = defaultSuffix;
    var filter = options.filter;
    if (typeof filter !== "function") filter = defaultFilter;
    var promisifier = options.promisifier;
    if (typeof promisifier !== "function") promisifier = makeNodePromisified;

    if (!util.isIdentifier(suffix)) {
        throw new RangeError("suffix must be a valid identifier\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }

    var keys = util.inheritedDataKeys(target);
    for (var i = 0; i < keys.length; ++i) {
        var value = target[keys[i]];
        if (keys[i] !== "constructor" &&
            util.isClass(value)) {
            promisifyAll(value.prototype, suffix, filter, promisifier,
                multiArgs);
            promisifyAll(value, suffix, filter, promisifier, multiArgs);
        }
    }

    return promisifyAll(target, suffix, filter, promisifier, multiArgs);
};
};



/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(
    Promise, PromiseArray, tryConvertToPromise, apiRejection) {
var util = __webpack_require__(0);
var isObject = util.isObject;
var es5 = __webpack_require__(7);
var Es6Map;
if (typeof Map === "function") Es6Map = Map;

var mapToEntries = (function() {
    var index = 0;
    var size = 0;

    function extractEntry(value, key) {
        this[index] = value;
        this[index + size] = key;
        index++;
    }

    return function mapToEntries(map) {
        size = map.size;
        index = 0;
        var ret = new Array(map.size * 2);
        map.forEach(extractEntry, ret);
        return ret;
    };
})();

var entriesToMap = function(entries) {
    var ret = new Es6Map();
    var length = entries.length / 2 | 0;
    for (var i = 0; i < length; ++i) {
        var key = entries[length + i];
        var value = entries[i];
        ret.set(key, value);
    }
    return ret;
};

function PropertiesPromiseArray(obj) {
    var isMap = false;
    var entries;
    if (Es6Map !== undefined && obj instanceof Es6Map) {
        entries = mapToEntries(obj);
        isMap = true;
    } else {
        var keys = es5.keys(obj);
        var len = keys.length;
        entries = new Array(len * 2);
        for (var i = 0; i < len; ++i) {
            var key = keys[i];
            entries[i] = obj[key];
            entries[i + len] = key;
        }
    }
    this.constructor$(entries);
    this._isMap = isMap;
    this._init$(undefined, -3);
}
util.inherits(PropertiesPromiseArray, PromiseArray);

PropertiesPromiseArray.prototype._init = function () {};

PropertiesPromiseArray.prototype._promiseFulfilled = function (value, index) {
    this._values[index] = value;
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= this._length) {
        var val;
        if (this._isMap) {
            val = entriesToMap(this._values);
        } else {
            val = {};
            var keyOffset = this.length();
            for (var i = 0, len = this.length(); i < len; ++i) {
                val[this._values[i + keyOffset]] = this._values[i];
            }
        }
        this._resolve(val);
        return true;
    }
    return false;
};

PropertiesPromiseArray.prototype.shouldCopyValues = function () {
    return false;
};

PropertiesPromiseArray.prototype.getActualLength = function (len) {
    return len >> 1;
};

function props(promises) {
    var ret;
    var castValue = tryConvertToPromise(promises);

    if (!isObject(castValue)) {
        return apiRejection("cannot await properties of a non-object\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    } else if (castValue instanceof Promise) {
        ret = castValue._then(
            Promise.props, undefined, undefined, undefined, undefined);
    } else {
        ret = new PropertiesPromiseArray(castValue).promise();
    }

    if (castValue instanceof Promise) {
        ret._propagateFrom(castValue, 2);
    }
    return ret;
}

Promise.prototype.props = function () {
    return props(this);
};

Promise.props = function (promises) {
    return props(promises);
};
};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function arrayMove(src, srcIndex, dst, dstIndex, len) {
    for (var j = 0; j < len; ++j) {
        dst[j + dstIndex] = src[j + srcIndex];
        src[j + srcIndex] = void 0;
    }
}

function Queue(capacity) {
    this._capacity = capacity;
    this._length = 0;
    this._front = 0;
}

Queue.prototype._willBeOverCapacity = function (size) {
    return this._capacity < size;
};

Queue.prototype._pushOne = function (arg) {
    var length = this.length();
    this._checkCapacity(length + 1);
    var i = (this._front + length) & (this._capacity - 1);
    this[i] = arg;
    this._length = length + 1;
};

Queue.prototype.push = function (fn, receiver, arg) {
    var length = this.length() + 3;
    if (this._willBeOverCapacity(length)) {
        this._pushOne(fn);
        this._pushOne(receiver);
        this._pushOne(arg);
        return;
    }
    var j = this._front + length - 3;
    this._checkCapacity(length);
    var wrapMask = this._capacity - 1;
    this[(j + 0) & wrapMask] = fn;
    this[(j + 1) & wrapMask] = receiver;
    this[(j + 2) & wrapMask] = arg;
    this._length = length;
};

Queue.prototype.shift = function () {
    var front = this._front,
        ret = this[front];

    this[front] = undefined;
    this._front = (front + 1) & (this._capacity - 1);
    this._length--;
    return ret;
};

Queue.prototype.length = function () {
    return this._length;
};

Queue.prototype._checkCapacity = function (size) {
    if (this._capacity < size) {
        this._resizeTo(this._capacity << 1);
    }
};

Queue.prototype._resizeTo = function (capacity) {
    var oldCapacity = this._capacity;
    this._capacity = capacity;
    var front = this._front;
    var length = this._length;
    var moveItemsCount = (front + length) & (oldCapacity - 1);
    arrayMove(this, 0, this, oldCapacity, moveItemsCount);
};

module.exports = Queue;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(
    Promise, INTERNAL, tryConvertToPromise, apiRejection) {
var util = __webpack_require__(0);

var raceLater = function (promise) {
    return promise.then(function(array) {
        return race(array, promise);
    });
};

function race(promises, parent) {
    var maybePromise = tryConvertToPromise(promises);

    if (maybePromise instanceof Promise) {
        return raceLater(maybePromise);
    } else {
        promises = util.asArray(promises);
        if (promises === null)
            return apiRejection("expecting an array or an iterable object but got " + util.classString(promises));
    }

    var ret = new Promise(INTERNAL);
    if (parent !== undefined) {
        ret._propagateFrom(parent, 3);
    }
    var fulfill = ret._fulfill;
    var reject = ret._reject;
    for (var i = 0, len = promises.length; i < len; ++i) {
        var val = promises[i];

        if (val === undefined && !(i in promises)) {
            continue;
        }

        Promise.cast(val)._then(fulfill, reject, undefined, ret, null);
    }
    return ret;
}

Promise.race = function (promises) {
    return race(promises, undefined);
};

Promise.prototype.race = function () {
    return race(this, undefined);
};

};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise,
                          PromiseArray,
                          apiRejection,
                          tryConvertToPromise,
                          INTERNAL,
                          debug) {
var getDomain = Promise._getDomain;
var util = __webpack_require__(0);
var tryCatch = util.tryCatch;

function ReductionPromiseArray(promises, fn, initialValue, _each) {
    this.constructor$(promises);
    var domain = getDomain();
    this._fn = domain === null ? fn : util.domainBind(domain, fn);
    if (initialValue !== undefined) {
        initialValue = Promise.resolve(initialValue);
        initialValue._attachCancellationCallback(this);
    }
    this._initialValue = initialValue;
    this._currentCancellable = null;
    if(_each === INTERNAL) {
        this._eachValues = Array(this._length);
    } else if (_each === 0) {
        this._eachValues = null;
    } else {
        this._eachValues = undefined;
    }
    this._promise._captureStackTrace();
    this._init$(undefined, -5);
}
util.inherits(ReductionPromiseArray, PromiseArray);

ReductionPromiseArray.prototype._gotAccum = function(accum) {
    if (this._eachValues !== undefined && 
        this._eachValues !== null && 
        accum !== INTERNAL) {
        this._eachValues.push(accum);
    }
};

ReductionPromiseArray.prototype._eachComplete = function(value) {
    if (this._eachValues !== null) {
        this._eachValues.push(value);
    }
    return this._eachValues;
};

ReductionPromiseArray.prototype._init = function() {};

ReductionPromiseArray.prototype._resolveEmptyArray = function() {
    this._resolve(this._eachValues !== undefined ? this._eachValues
                                                 : this._initialValue);
};

ReductionPromiseArray.prototype.shouldCopyValues = function () {
    return false;
};

ReductionPromiseArray.prototype._resolve = function(value) {
    this._promise._resolveCallback(value);
    this._values = null;
};

ReductionPromiseArray.prototype._resultCancelled = function(sender) {
    if (sender === this._initialValue) return this._cancel();
    if (this._isResolved()) return;
    this._resultCancelled$();
    if (this._currentCancellable instanceof Promise) {
        this._currentCancellable.cancel();
    }
    if (this._initialValue instanceof Promise) {
        this._initialValue.cancel();
    }
};

ReductionPromiseArray.prototype._iterate = function (values) {
    this._values = values;
    var value;
    var i;
    var length = values.length;
    if (this._initialValue !== undefined) {
        value = this._initialValue;
        i = 0;
    } else {
        value = Promise.resolve(values[0]);
        i = 1;
    }

    this._currentCancellable = value;

    if (!value.isRejected()) {
        for (; i < length; ++i) {
            var ctx = {
                accum: null,
                value: values[i],
                index: i,
                length: length,
                array: this
            };
            value = value._then(gotAccum, undefined, undefined, ctx, undefined);
        }
    }

    if (this._eachValues !== undefined) {
        value = value
            ._then(this._eachComplete, undefined, undefined, this, undefined);
    }
    value._then(completed, completed, undefined, value, this);
};

Promise.prototype.reduce = function (fn, initialValue) {
    return reduce(this, fn, initialValue, null);
};

Promise.reduce = function (promises, fn, initialValue, _each) {
    return reduce(promises, fn, initialValue, _each);
};

function completed(valueOrReason, array) {
    if (this.isFulfilled()) {
        array._resolve(valueOrReason);
    } else {
        array._reject(valueOrReason);
    }
}

function reduce(promises, fn, initialValue, _each) {
    if (typeof fn !== "function") {
        return apiRejection("expecting a function but got " + util.classString(fn));
    }
    var array = new ReductionPromiseArray(promises, fn, initialValue, _each);
    return array.promise();
}

function gotAccum(accum) {
    this.accum = accum;
    this.array._gotAccum(accum);
    var value = tryConvertToPromise(this.value, this.array._promise);
    if (value instanceof Promise) {
        this.array._currentCancellable = value;
        return value._then(gotValue, undefined, undefined, this, undefined);
    } else {
        return gotValue.call(this, value);
    }
}

function gotValue(value) {
    var array = this.array;
    var promise = array._promise;
    var fn = tryCatch(array._fn);
    promise._pushContext();
    var ret;
    if (array._eachValues !== undefined) {
        ret = fn.call(promise._boundValue(), value, this.index, this.length);
    } else {
        ret = fn.call(promise._boundValue(),
                              this.accum, value, this.index, this.length);
    }
    if (ret instanceof Promise) {
        array._currentCancellable = ret;
    }
    var promiseCreated = promise._popContext();
    debug.checkForgottenReturns(
        ret,
        promiseCreated,
        array._eachValues !== undefined ? "Promise.each" : "Promise.reduce",
        promise
    );
    return ret;
}
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var util = __webpack_require__(0);
var schedule;
var noAsyncScheduler = function() {
    throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
};
var NativePromise = util.getNativePromise();
if (util.isNode && typeof MutationObserver === "undefined") {
    var GlobalSetImmediate = global.setImmediate;
    var ProcessNextTick = process.nextTick;
    schedule = util.isRecentNode
                ? function(fn) { GlobalSetImmediate.call(global, fn); }
                : function(fn) { ProcessNextTick.call(process, fn); };
} else if (typeof NativePromise === "function" &&
           typeof NativePromise.resolve === "function") {
    var nativePromise = NativePromise.resolve();
    schedule = function(fn) {
        nativePromise.then(fn);
    };
} else if ((typeof MutationObserver !== "undefined") &&
          !(typeof window !== "undefined" &&
            window.navigator &&
            (window.navigator.standalone || window.cordova))) {
    schedule = (function() {
        var div = document.createElement("div");
        var opts = {attributes: true};
        var toggleScheduled = false;
        var div2 = document.createElement("div");
        var o2 = new MutationObserver(function() {
            div.classList.toggle("foo");
            toggleScheduled = false;
        });
        o2.observe(div2, opts);

        var scheduleToggle = function() {
            if (toggleScheduled) return;
                toggleScheduled = true;
                div2.classList.toggle("foo");
            };

            return function schedule(fn) {
            var o = new MutationObserver(function() {
                o.disconnect();
                fn();
            });
            o.observe(div, opts);
            scheduleToggle();
        };
    })();
} else if (typeof setImmediate !== "undefined") {
    schedule = function (fn) {
        setImmediate(fn);
    };
} else if (typeof setTimeout !== "undefined") {
    schedule = function (fn) {
        setTimeout(fn, 0);
    };
} else {
    schedule = noAsyncScheduler;
}
module.exports = schedule;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports =
    function(Promise, PromiseArray, debug) {
var PromiseInspection = Promise.PromiseInspection;
var util = __webpack_require__(0);

function SettledPromiseArray(values) {
    this.constructor$(values);
}
util.inherits(SettledPromiseArray, PromiseArray);

SettledPromiseArray.prototype._promiseResolved = function (index, inspection) {
    this._values[index] = inspection;
    var totalResolved = ++this._totalResolved;
    if (totalResolved >= this._length) {
        this._resolve(this._values);
        return true;
    }
    return false;
};

SettledPromiseArray.prototype._promiseFulfilled = function (value, index) {
    var ret = new PromiseInspection();
    ret._bitField = 33554432;
    ret._settledValueField = value;
    return this._promiseResolved(index, ret);
};
SettledPromiseArray.prototype._promiseRejected = function (reason, index) {
    var ret = new PromiseInspection();
    ret._bitField = 16777216;
    ret._settledValueField = reason;
    return this._promiseResolved(index, ret);
};

Promise.settle = function (promises) {
    debug.deprecated(".settle()", ".reflect()");
    return new SettledPromiseArray(promises).promise();
};

Promise.prototype.settle = function () {
    return Promise.settle(this);
};
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports =
function(Promise, PromiseArray, apiRejection) {
var util = __webpack_require__(0);
var RangeError = __webpack_require__(6).RangeError;
var AggregateError = __webpack_require__(6).AggregateError;
var isArray = util.isArray;
var CANCELLATION = {};


function SomePromiseArray(values) {
    this.constructor$(values);
    this._howMany = 0;
    this._unwrap = false;
    this._initialized = false;
}
util.inherits(SomePromiseArray, PromiseArray);

SomePromiseArray.prototype._init = function () {
    if (!this._initialized) {
        return;
    }
    if (this._howMany === 0) {
        this._resolve([]);
        return;
    }
    this._init$(undefined, -5);
    var isArrayResolved = isArray(this._values);
    if (!this._isResolved() &&
        isArrayResolved &&
        this._howMany > this._canPossiblyFulfill()) {
        this._reject(this._getRangeError(this.length()));
    }
};

SomePromiseArray.prototype.init = function () {
    this._initialized = true;
    this._init();
};

SomePromiseArray.prototype.setUnwrap = function () {
    this._unwrap = true;
};

SomePromiseArray.prototype.howMany = function () {
    return this._howMany;
};

SomePromiseArray.prototype.setHowMany = function (count) {
    this._howMany = count;
};

SomePromiseArray.prototype._promiseFulfilled = function (value) {
    this._addFulfilled(value);
    if (this._fulfilled() === this.howMany()) {
        this._values.length = this.howMany();
        if (this.howMany() === 1 && this._unwrap) {
            this._resolve(this._values[0]);
        } else {
            this._resolve(this._values);
        }
        return true;
    }
    return false;

};
SomePromiseArray.prototype._promiseRejected = function (reason) {
    this._addRejected(reason);
    return this._checkOutcome();
};

SomePromiseArray.prototype._promiseCancelled = function () {
    if (this._values instanceof Promise || this._values == null) {
        return this._cancel();
    }
    this._addRejected(CANCELLATION);
    return this._checkOutcome();
};

SomePromiseArray.prototype._checkOutcome = function() {
    if (this.howMany() > this._canPossiblyFulfill()) {
        var e = new AggregateError();
        for (var i = this.length(); i < this._values.length; ++i) {
            if (this._values[i] !== CANCELLATION) {
                e.push(this._values[i]);
            }
        }
        if (e.length > 0) {
            this._reject(e);
        } else {
            this._cancel();
        }
        return true;
    }
    return false;
};

SomePromiseArray.prototype._fulfilled = function () {
    return this._totalResolved;
};

SomePromiseArray.prototype._rejected = function () {
    return this._values.length - this.length();
};

SomePromiseArray.prototype._addRejected = function (reason) {
    this._values.push(reason);
};

SomePromiseArray.prototype._addFulfilled = function (value) {
    this._values[this._totalResolved++] = value;
};

SomePromiseArray.prototype._canPossiblyFulfill = function () {
    return this.length() - this._rejected();
};

SomePromiseArray.prototype._getRangeError = function (count) {
    var message = "Input array must contain at least " +
            this._howMany + " items but contains only " + count + " items";
    return new RangeError(message);
};

SomePromiseArray.prototype._resolveEmptyArray = function () {
    this._reject(this._getRangeError(0));
};

function some(promises, howMany) {
    if ((howMany | 0) !== howMany || howMany < 0) {
        return apiRejection("expecting a positive integer\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    var ret = new SomePromiseArray(promises);
    var promise = ret.promise();
    ret.setHowMany(howMany);
    ret.init();
    return promise;
}

Promise.some = function (promises, howMany) {
    return some(promises, howMany);
};

Promise.prototype.some = function (howMany) {
    return some(this, howMany);
};

Promise._SomePromiseArray = SomePromiseArray;
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise) {
function PromiseInspection(promise) {
    if (promise !== undefined) {
        promise = promise._target();
        this._bitField = promise._bitField;
        this._settledValueField = promise._isFateSealed()
            ? promise._settledValue() : undefined;
    }
    else {
        this._bitField = 0;
        this._settledValueField = undefined;
    }
}

PromiseInspection.prototype._settledValue = function() {
    return this._settledValueField;
};

var value = PromiseInspection.prototype.value = function () {
    if (!this.isFulfilled()) {
        throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    return this._settledValue();
};

var reason = PromiseInspection.prototype.error =
PromiseInspection.prototype.reason = function () {
    if (!this.isRejected()) {
        throw new TypeError("cannot get rejection reason of a non-rejected promise\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
    return this._settledValue();
};

var isFulfilled = PromiseInspection.prototype.isFulfilled = function() {
    return (this._bitField & 33554432) !== 0;
};

var isRejected = PromiseInspection.prototype.isRejected = function () {
    return (this._bitField & 16777216) !== 0;
};

var isPending = PromiseInspection.prototype.isPending = function () {
    return (this._bitField & 50397184) === 0;
};

var isResolved = PromiseInspection.prototype.isResolved = function () {
    return (this._bitField & 50331648) !== 0;
};

PromiseInspection.prototype.isCancelled = function() {
    return (this._bitField & 8454144) !== 0;
};

Promise.prototype.__isCancelled = function() {
    return (this._bitField & 65536) === 65536;
};

Promise.prototype._isCancelled = function() {
    return this._target().__isCancelled();
};

Promise.prototype.isCancelled = function() {
    return (this._target()._bitField & 8454144) !== 0;
};

Promise.prototype.isPending = function() {
    return isPending.call(this._target());
};

Promise.prototype.isRejected = function() {
    return isRejected.call(this._target());
};

Promise.prototype.isFulfilled = function() {
    return isFulfilled.call(this._target());
};

Promise.prototype.isResolved = function() {
    return isResolved.call(this._target());
};

Promise.prototype.value = function() {
    return value.call(this._target());
};

Promise.prototype.reason = function() {
    var target = this._target();
    target._unsetRejectionIsUnhandled();
    return reason.call(target);
};

Promise.prototype._value = function() {
    return this._settledValue();
};

Promise.prototype._reason = function() {
    this._unsetRejectionIsUnhandled();
    return this._settledValue();
};

Promise.PromiseInspection = PromiseInspection;
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, INTERNAL) {
var util = __webpack_require__(0);
var errorObj = util.errorObj;
var isObject = util.isObject;

function tryConvertToPromise(obj, context) {
    if (isObject(obj)) {
        if (obj instanceof Promise) return obj;
        var then = getThen(obj);
        if (then === errorObj) {
            if (context) context._pushContext();
            var ret = Promise.reject(then.e);
            if (context) context._popContext();
            return ret;
        } else if (typeof then === "function") {
            if (isAnyBluebirdPromise(obj)) {
                var ret = new Promise(INTERNAL);
                obj._then(
                    ret._fulfill,
                    ret._reject,
                    undefined,
                    ret,
                    null
                );
                return ret;
            }
            return doThenable(obj, then, context);
        }
    }
    return obj;
}

function doGetThen(obj) {
    return obj.then;
}

function getThen(obj) {
    try {
        return doGetThen(obj);
    } catch (e) {
        errorObj.e = e;
        return errorObj;
    }
}

var hasProp = {}.hasOwnProperty;
function isAnyBluebirdPromise(obj) {
    try {
        return hasProp.call(obj, "_promise0");
    } catch (e) {
        return false;
    }
}

function doThenable(x, then, context) {
    var promise = new Promise(INTERNAL);
    var ret = promise;
    if (context) context._pushContext();
    promise._captureStackTrace();
    if (context) context._popContext();
    var synchronous = true;
    var result = util.tryCatch(then).call(x, resolve, reject);
    synchronous = false;

    if (promise && result === errorObj) {
        promise._rejectCallback(result.e, true, true);
        promise = null;
    }

    function resolve(value) {
        if (!promise) return;
        promise._resolveCallback(value);
        promise = null;
    }

    function reject(reason) {
        if (!promise) return;
        promise._rejectCallback(reason, synchronous, true);
        promise = null;
    }
    return ret;
}

return tryConvertToPromise;
};


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function(Promise, INTERNAL, debug) {
var util = __webpack_require__(0);
var TimeoutError = Promise.TimeoutError;

function HandleWrapper(handle)  {
    this.handle = handle;
}

HandleWrapper.prototype._resultCancelled = function() {
    clearTimeout(this.handle);
};

var afterValue = function(value) { return delay(+this).thenReturn(value); };
var delay = Promise.delay = function (ms, value) {
    var ret;
    var handle;
    if (value !== undefined) {
        ret = Promise.resolve(value)
                ._then(afterValue, null, null, ms, undefined);
        if (debug.cancellation() && value instanceof Promise) {
            ret._setOnCancel(value);
        }
    } else {
        ret = new Promise(INTERNAL);
        handle = setTimeout(function() { ret._fulfill(); }, +ms);
        if (debug.cancellation()) {
            ret._setOnCancel(new HandleWrapper(handle));
        }
        ret._captureStackTrace();
    }
    ret._setAsyncGuaranteed();
    return ret;
};

Promise.prototype.delay = function (ms) {
    return delay(ms, this);
};

var afterTimeout = function (promise, message, parent) {
    var err;
    if (typeof message !== "string") {
        if (message instanceof Error) {
            err = message;
        } else {
            err = new TimeoutError("operation timed out");
        }
    } else {
        err = new TimeoutError(message);
    }
    util.markAsOriginatingFromRejection(err);
    promise._attachExtraTrace(err);
    promise._reject(err);

    if (parent != null) {
        parent.cancel();
    }
};

function successClear(value) {
    clearTimeout(this.handle);
    return value;
}

function failureClear(reason) {
    clearTimeout(this.handle);
    throw reason;
}

Promise.prototype.timeout = function (ms, message) {
    ms = +ms;
    var ret, parent;

    var handleWrapper = new HandleWrapper(setTimeout(function timeoutTimeout() {
        if (ret.isPending()) {
            afterTimeout(ret, message, parent);
        }
    }, ms));

    if (debug.cancellation()) {
        parent = this.then();
        ret = parent._then(successClear, failureClear,
                            undefined, handleWrapper, undefined);
        ret._setOnCancel(handleWrapper);
    } else {
        ret = this._then(successClear, failureClear,
                            undefined, handleWrapper, undefined);
    }

    return ret;
};

};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (Promise, apiRejection, tryConvertToPromise,
    createContext, INTERNAL, debug) {
    var util = __webpack_require__(0);
    var TypeError = __webpack_require__(6).TypeError;
    var inherits = __webpack_require__(0).inherits;
    var errorObj = util.errorObj;
    var tryCatch = util.tryCatch;
    var NULL = {};

    function thrower(e) {
        setTimeout(function(){throw e;}, 0);
    }

    function castPreservingDisposable(thenable) {
        var maybePromise = tryConvertToPromise(thenable);
        if (maybePromise !== thenable &&
            typeof thenable._isDisposable === "function" &&
            typeof thenable._getDisposer === "function" &&
            thenable._isDisposable()) {
            maybePromise._setDisposable(thenable._getDisposer());
        }
        return maybePromise;
    }
    function dispose(resources, inspection) {
        var i = 0;
        var len = resources.length;
        var ret = new Promise(INTERNAL);
        function iterator() {
            if (i >= len) return ret._fulfill();
            var maybePromise = castPreservingDisposable(resources[i++]);
            if (maybePromise instanceof Promise &&
                maybePromise._isDisposable()) {
                try {
                    maybePromise = tryConvertToPromise(
                        maybePromise._getDisposer().tryDispose(inspection),
                        resources.promise);
                } catch (e) {
                    return thrower(e);
                }
                if (maybePromise instanceof Promise) {
                    return maybePromise._then(iterator, thrower,
                                              null, null, null);
                }
            }
            iterator();
        }
        iterator();
        return ret;
    }

    function Disposer(data, promise, context) {
        this._data = data;
        this._promise = promise;
        this._context = context;
    }

    Disposer.prototype.data = function () {
        return this._data;
    };

    Disposer.prototype.promise = function () {
        return this._promise;
    };

    Disposer.prototype.resource = function () {
        if (this.promise().isFulfilled()) {
            return this.promise().value();
        }
        return NULL;
    };

    Disposer.prototype.tryDispose = function(inspection) {
        var resource = this.resource();
        var context = this._context;
        if (context !== undefined) context._pushContext();
        var ret = resource !== NULL
            ? this.doDispose(resource, inspection) : null;
        if (context !== undefined) context._popContext();
        this._promise._unsetDisposable();
        this._data = null;
        return ret;
    };

    Disposer.isDisposer = function (d) {
        return (d != null &&
                typeof d.resource === "function" &&
                typeof d.tryDispose === "function");
    };

    function FunctionDisposer(fn, promise, context) {
        this.constructor$(fn, promise, context);
    }
    inherits(FunctionDisposer, Disposer);

    FunctionDisposer.prototype.doDispose = function (resource, inspection) {
        var fn = this.data();
        return fn.call(resource, resource, inspection);
    };

    function maybeUnwrapDisposer(value) {
        if (Disposer.isDisposer(value)) {
            this.resources[this.index]._setDisposable(value);
            return value.promise();
        }
        return value;
    }

    function ResourceList(length) {
        this.length = length;
        this.promise = null;
        this[length-1] = null;
    }

    ResourceList.prototype._resultCancelled = function() {
        var len = this.length;
        for (var i = 0; i < len; ++i) {
            var item = this[i];
            if (item instanceof Promise) {
                item.cancel();
            }
        }
    };

    Promise.using = function () {
        var len = arguments.length;
        if (len < 2) return apiRejection(
                        "you must pass at least 2 arguments to Promise.using");
        var fn = arguments[len - 1];
        if (typeof fn !== "function") {
            return apiRejection("expecting a function but got " + util.classString(fn));
        }
        var input;
        var spreadArgs = true;
        if (len === 2 && Array.isArray(arguments[0])) {
            input = arguments[0];
            len = input.length;
            spreadArgs = false;
        } else {
            input = arguments;
            len--;
        }
        var resources = new ResourceList(len);
        for (var i = 0; i < len; ++i) {
            var resource = input[i];
            if (Disposer.isDisposer(resource)) {
                var disposer = resource;
                resource = resource.promise();
                resource._setDisposable(disposer);
            } else {
                var maybePromise = tryConvertToPromise(resource);
                if (maybePromise instanceof Promise) {
                    resource =
                        maybePromise._then(maybeUnwrapDisposer, null, null, {
                            resources: resources,
                            index: i
                    }, undefined);
                }
            }
            resources[i] = resource;
        }

        var reflectedResources = new Array(resources.length);
        for (var i = 0; i < reflectedResources.length; ++i) {
            reflectedResources[i] = Promise.resolve(resources[i]).reflect();
        }

        var resultPromise = Promise.all(reflectedResources)
            .then(function(inspections) {
                for (var i = 0; i < inspections.length; ++i) {
                    var inspection = inspections[i];
                    if (inspection.isRejected()) {
                        errorObj.e = inspection.error();
                        return errorObj;
                    } else if (!inspection.isFulfilled()) {
                        resultPromise.cancel();
                        return;
                    }
                    inspections[i] = inspection.value();
                }
                promise._pushContext();

                fn = tryCatch(fn);
                var ret = spreadArgs
                    ? fn.apply(undefined, inspections) : fn(inspections);
                var promiseCreated = promise._popContext();
                debug.checkForgottenReturns(
                    ret, promiseCreated, "Promise.using", promise);
                return ret;
            });

        var promise = resultPromise.lastly(function() {
            var inspection = new Promise.PromiseInspection(resultPromise);
            return dispose(resources, inspection);
        });
        resources.promise = promise;
        promise._setOnCancel(resources);
        return promise;
    };

    Promise.prototype._setDisposable = function (disposer) {
        this._bitField = this._bitField | 131072;
        this._disposer = disposer;
    };

    Promise.prototype._isDisposable = function () {
        return (this._bitField & 131072) > 0;
    };

    Promise.prototype._getDisposer = function () {
        return this._disposer;
    };

    Promise.prototype._unsetDisposable = function () {
        this._bitField = this._bitField & (~131072);
        this._disposer = undefined;
    };

    Promise.prototype.disposer = function (fn) {
        if (typeof fn === "function") {
            return new FunctionDisposer(fn, this, createContext());
        }
        throw new TypeError();
    };

};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Any = __webpack_require__(2);
const Cast = __webpack_require__(9);
const Hoek = __webpack_require__(1);


// Declare internals

const internals = {};


internals.fastSplice = function (arr, i) {

    let pos = i;
    while (pos < arr.length) {
        arr[pos++] = arr[pos];
    }

    --arr.length;
};


internals.Array = class extends Any {

    constructor() {

        super();
        this._type = 'array';
        this._inner.items = [];
        this._inner.ordereds = [];
        this._inner.inclusions = [];
        this._inner.exclusions = [];
        this._inner.requireds = [];
        this._flags.sparse = false;
    }

    _base(value, state, options) {

        const result = {
            value
        };

        if (typeof value === 'string' &&
            options.convert) {

            internals.safeParse(value, result);
        }

        let isArray = Array.isArray(result.value);
        const wasArray = isArray;
        if (options.convert && this._flags.single && !isArray) {
            result.value = [result.value];
            isArray = true;
        }

        if (!isArray) {
            result.errors = this.createError('array.base', null, state, options);
            return result;
        }

        if (this._inner.inclusions.length ||
            this._inner.exclusions.length ||
            this._inner.requireds.length ||
            this._inner.ordereds.length ||
            !this._flags.sparse) {

            // Clone the array so that we don't modify the original
            if (wasArray) {
                result.value = result.value.slice(0);
            }

            result.errors = this._checkItems.call(this, result.value, wasArray, state, options);

            if (result.errors && wasArray && options.convert && this._flags.single) {

                // Attempt a 2nd pass by putting the array inside one.
                const previousErrors = result.errors;

                result.value = [result.value];
                result.errors = this._checkItems.call(this, result.value, wasArray, state, options);

                if (result.errors) {

                    // Restore previous errors and value since this didn't validate either.
                    result.errors = previousErrors;
                    result.value = result.value[0];
                }
            }
        }

        return result;
    }

    _checkItems(items, wasArray, state, options) {

        const errors = [];
        let errored;

        const requireds = this._inner.requireds.slice();
        const ordereds = this._inner.ordereds.slice();
        const inclusions = this._inner.inclusions.concat(requireds);

        let il = items.length;
        for (let i = 0; i < il; ++i) {
            errored = false;
            const item = items[i];
            let isValid = false;
            const key = wasArray ? i : state.key;
            const path = wasArray ? (state.path ? state.path + '.' : '') + i : state.path;
            const localState = { key, path, parent: state.parent, reference: state.reference };
            let res;

            // Sparse

            if (!this._flags.sparse && item === undefined) {
                errors.push(this.createError('array.sparse', null, { key: state.key, path: localState.path, pos: i }, options));

                if (options.abortEarly) {
                    return errors;
                }

                continue;
            }

            // Exclusions

            for (let j = 0; j < this._inner.exclusions.length; ++j) {
                res = this._inner.exclusions[j]._validate(item, localState, {});                // Not passing options to use defaults

                if (!res.errors) {
                    errors.push(this.createError(wasArray ? 'array.excludes' : 'array.excludesSingle', { pos: i, value: item }, { key: state.key, path: localState.path }, options));
                    errored = true;

                    if (options.abortEarly) {
                        return errors;
                    }

                    break;
                }
            }

            if (errored) {
                continue;
            }

            // Ordered
            if (this._inner.ordereds.length) {
                if (ordereds.length > 0) {
                    const ordered = ordereds.shift();
                    res = ordered._validate(item, localState, options);
                    if (!res.errors) {
                        if (ordered._flags.strip) {
                            internals.fastSplice(items, i);
                            --i;
                            --il;
                        }
                        else if (!this._flags.sparse && res.value === undefined) {
                            errors.push(this.createError('array.sparse', null, { key: state.key, path: localState.path, pos: i }, options));

                            if (options.abortEarly) {
                                return errors;
                            }

                            continue;
                        }
                        else {
                            items[i] = res.value;
                        }
                    }
                    else {
                        errors.push(this.createError('array.ordered', { pos: i, reason: res.errors, value: item }, { key: state.key, path: localState.path }, options));
                        if (options.abortEarly) {
                            return errors;
                        }
                    }
                    continue;
                }
                else if (!this._inner.items.length) {
                    errors.push(this.createError('array.orderedLength', { pos: i, limit: this._inner.ordereds.length }, { key: state.key, path: localState.path }, options));
                    if (options.abortEarly) {
                        return errors;
                    }
                    continue;
                }
            }

            // Requireds

            const requiredChecks = [];
            let jl = requireds.length;
            for (let j = 0; j < jl; ++j) {
                res = requiredChecks[j] = requireds[j]._validate(item, localState, options);
                if (!res.errors) {
                    items[i] = res.value;
                    isValid = true;
                    internals.fastSplice(requireds, j);
                    --j;
                    --jl;

                    if (!this._flags.sparse && res.value === undefined) {
                        errors.push(this.createError('array.sparse', null, { key: state.key, path: localState.path, pos: i }, options));

                        if (options.abortEarly) {
                            return errors;
                        }
                    }

                    break;
                }
            }

            if (isValid) {
                continue;
            }

            // Inclusions

            const stripUnknown = options.stripUnknown
                ? (options.stripUnknown === true ? true : !!options.stripUnknown.arrays)
                : false;

            jl = inclusions.length;
            for (let j = 0; j < jl; ++j) {
                const inclusion = inclusions[j];

                // Avoid re-running requireds that already didn't match in the previous loop
                const previousCheck = requireds.indexOf(inclusion);
                if (previousCheck !== -1) {
                    res = requiredChecks[previousCheck];
                }
                else {
                    res = inclusion._validate(item, localState, options);

                    if (!res.errors) {
                        if (inclusion._flags.strip) {
                            internals.fastSplice(items, i);
                            --i;
                            --il;
                        }
                        else if (!this._flags.sparse && res.value === undefined) {
                            errors.push(this.createError('array.sparse', null, { key: state.key, path: localState.path, pos: i }, options));
                            errored = true;
                        }
                        else {
                            items[i] = res.value;
                        }
                        isValid = true;
                        break;
                    }
                }

                // Return the actual error if only one inclusion defined
                if (jl === 1) {
                    if (stripUnknown) {
                        internals.fastSplice(items, i);
                        --i;
                        --il;
                        isValid = true;
                        break;
                    }

                    errors.push(this.createError(wasArray ? 'array.includesOne' : 'array.includesOneSingle', { pos: i, reason: res.errors, value: item }, { key: state.key, path: localState.path }, options));
                    errored = true;

                    if (options.abortEarly) {
                        return errors;
                    }

                    break;
                }
            }

            if (errored) {
                continue;
            }

            if (this._inner.inclusions.length && !isValid) {
                if (stripUnknown) {
                    internals.fastSplice(items, i);
                    --i;
                    --il;
                    continue;
                }

                errors.push(this.createError(wasArray ? 'array.includes' : 'array.includesSingle', { pos: i, value: item }, { key: state.key, path: localState.path }, options));

                if (options.abortEarly) {
                    return errors;
                }
            }
        }

        if (requireds.length) {
            this._fillMissedErrors.call(this, errors, requireds, state, options);
        }

        if (ordereds.length) {
            this._fillOrderedErrors.call(this, errors, ordereds, state, options);
        }

        return errors.length ? errors : null;
    }

    describe() {

        const description = Any.prototype.describe.call(this);

        if (this._inner.ordereds.length) {
            description.orderedItems = [];

            for (let i = 0; i < this._inner.ordereds.length; ++i) {
                description.orderedItems.push(this._inner.ordereds[i].describe());
            }
        }

        if (this._inner.items.length) {
            description.items = [];

            for (let i = 0; i < this._inner.items.length; ++i) {
                description.items.push(this._inner.items[i].describe());
            }
        }

        return description;
    }

    items() {

        const obj = this.clone();

        Hoek.flatten(Array.prototype.slice.call(arguments)).forEach((type, index) => {

            try {
                type = Cast.schema(type);
            }
            catch (castErr) {
                if (castErr.hasOwnProperty('path')) {
                    castErr.path = index + '.' + castErr.path;
                }
                else {
                    castErr.path = index;
                }
                castErr.message = castErr.message + '(' + castErr.path + ')';
                throw castErr;
            }

            obj._inner.items.push(type);

            if (type._flags.presence === 'required') {
                obj._inner.requireds.push(type);
            }
            else if (type._flags.presence === 'forbidden') {
                obj._inner.exclusions.push(type.optional());
            }
            else {
                obj._inner.inclusions.push(type);
            }
        });

        return obj;
    }

    ordered() {

        const obj = this.clone();

        Hoek.flatten(Array.prototype.slice.call(arguments)).forEach((type, index) => {

            try {
                type = Cast.schema(type);
            }
            catch (castErr) {
                if (castErr.hasOwnProperty('path')) {
                    castErr.path = index + '.' + castErr.path;
                }
                else {
                    castErr.path = index;
                }
                castErr.message = castErr.message + '(' + castErr.path + ')';
                throw castErr;
            }
            obj._inner.ordereds.push(type);
        });

        return obj;
    }

    min(limit) {

        Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

        return this._test('min', limit, function (value, state, options) {

            if (value.length >= limit) {
                return value;
            }

            return this.createError('array.min', { limit, value }, state, options);
        });
    }

    max(limit) {

        Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

        return this._test('max', limit, function (value, state, options) {

            if (value.length <= limit) {
                return value;
            }

            return this.createError('array.max', { limit, value }, state, options);
        });
    }

    length(limit) {

        Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

        return this._test('length', limit, function (value, state, options) {

            if (value.length === limit) {
                return value;
            }

            return this.createError('array.length', { limit, value }, state, options);
        });
    }

    unique(comparator) {

        Hoek.assert(comparator === undefined ||
            typeof comparator === 'function' ||
            typeof comparator === 'string', 'comparator must be a function or a string');

        const settings = {};

        if (typeof comparator === 'string') {
            settings.path = comparator;
        }
        else if (typeof comparator === 'function') {
            settings.comparator = comparator;
        }

        return this._test('unique', settings, function (value, state, options) {

            const found = {
                string: {},
                number: {},
                undefined: {},
                boolean: {},
                object: new Map(),
                function: new Map(),
                custom: new Map()
            };

            const compare = settings.comparator || Hoek.deepEqual;

            for (let i = 0; i < value.length; ++i) {
                const item = settings.path ? Hoek.reach(value[i], settings.path) : value[i];
                const records = settings.comparator ? found.custom : found[typeof item];

                // All available types are supported, so it's not possible to reach 100% coverage without ignoring this line.
                // I still want to keep the test for future js versions with new types (eg. Symbol).
                if (/* $lab:coverage:off$ */ records /* $lab:coverage:on$ */) {
                    if (records instanceof Map) {
                        const entries = records.entries();
                        let current;
                        while (!(current = entries.next()).done) {
                            if (compare(current.value[0], item)) {
                                const localState = {
                                    key: state.key,
                                    path: (state.path ? state.path + '.' : '') + i,
                                    parent: state.parent,
                                    reference: state.reference
                                };

                                const context = {
                                    pos: i,
                                    value: value[i],
                                    dupePos: current.value[1],
                                    dupeValue: value[current.value[1]]
                                };

                                if (settings.path) {
                                    context.path = settings.path;
                                }

                                return this.createError('array.unique', context, localState, options);
                            }
                        }

                        records.set(item, i);
                    }
                    else {
                        if (records[item] !== undefined) {
                            const localState = {
                                key: state.key,
                                path: (state.path ? state.path + '.' : '') + i,
                                parent: state.parent,
                                reference: state.reference
                            };

                            const context = {
                                pos: i,
                                value: value[i],
                                dupePos: records[item],
                                dupeValue: value[records[item]]
                            };

                            if (settings.path) {
                                context.path = settings.path;
                            }

                            return this.createError('array.unique', context, localState, options);
                        }

                        records[item] = i;
                    }
                }
            }

            return value;
        });
    }

    sparse(enabled) {

        const obj = this.clone();
        obj._flags.sparse = enabled === undefined ? true : !!enabled;
        return obj;
    }

    single(enabled) {

        const obj = this.clone();
        obj._flags.single = enabled === undefined ? true : !!enabled;
        return obj;
    }

    _fillMissedErrors(errors, requireds, state, options) {

        const knownMisses = [];
        let unknownMisses = 0;
        for (let i = 0; i < requireds.length; ++i) {
            const label = requireds[i]._getLabel();
            if (label) {
                knownMisses.push(label);
            }
            else {
                ++unknownMisses;
            }
        }

        if (knownMisses.length) {
            if (unknownMisses) {
                errors.push(this.createError('array.includesRequiredBoth', { knownMisses, unknownMisses }, { key: state.key, path: state.path }, options));
            }
            else {
                errors.push(this.createError('array.includesRequiredKnowns', { knownMisses }, { key: state.key, path: state.path }, options));
            }
        }
        else {
            errors.push(this.createError('array.includesRequiredUnknowns', { unknownMisses }, { key: state.key, path: state.path }, options));
        }
    }


    _fillOrderedErrors(errors, ordereds, state, options) {

        const requiredOrdereds = [];

        for (let i = 0; i < ordereds.length; ++i) {
            const presence = Hoek.reach(ordereds[i], '_flags.presence');
            if (presence === 'required') {
                requiredOrdereds.push(ordereds[i]);
            }
        }

        if (requiredOrdereds.length) {
            this._fillMissedErrors.call(this, errors, requiredOrdereds, state, options);
        }
    }

};


internals.safeParse = function (value, result) {

    try {
        const converted = JSON.parse(value);
        if (Array.isArray(converted)) {
            result.value = converted;
        }
    }
    catch (e) { }
};


module.exports = new internals.Array();


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Any = __webpack_require__(2);
const Hoek = __webpack_require__(1);


// Declare internals

const internals = {};


internals.Binary = class extends Any {

    constructor() {

        super();
        this._type = 'binary';
    }

    _base(value, state, options) {

        const result = {
            value
        };

        if (typeof value === 'string' &&
            options.convert) {

            try {
                result.value = new Buffer(value, this._flags.encoding);
            }
            catch (e) {
            }
        }

        result.errors = Buffer.isBuffer(result.value) ? null : this.createError('binary.base', null, state, options);
        return result;
    }

    encoding(encoding) {

        Hoek.assert(Buffer.isEncoding(encoding), 'Invalid encoding:', encoding);

        const obj = this.clone();
        obj._flags.encoding = encoding;
        return obj;
    }

    min(limit) {

        Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

        return this._test('min', limit, function (value, state, options) {

            if (value.length >= limit) {
                return value;
            }

            return this.createError('binary.min', { limit, value }, state, options);
        });
    }

    max(limit) {

        Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

        return this._test('max', limit, function (value, state, options) {

            if (value.length <= limit) {
                return value;
            }

            return this.createError('binary.max', { limit, value }, state, options);
        });
    }

    length(limit) {

        Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

        return this._test('length', limit, function (value, state, options) {

            if (value.length === limit) {
                return value;
            }

            return this.createError('binary.length', { limit, value }, state, options);
        });
    }

};


module.exports = new internals.Binary();


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules


// Declare internals

const internals = {};


exports.errors = {
    root: 'value',
    key: '"{{!key}}" ',
    messages: {
        wrapArrays: true
    },
    any: {
        unknown: 'is not allowed',
        invalid: 'contains an invalid value',
        empty: 'is not allowed to be empty',
        required: 'is required',
        allowOnly: 'must be one of {{valids}}',
        default: 'threw an error when running default method'
    },
    alternatives: {
        base: 'not matching any of the allowed alternatives'
    },
    array: {
        base: 'must be an array',
        includes: 'at position {{pos}} does not match any of the allowed types',
        includesSingle: 'single value of "{{!key}}" does not match any of the allowed types',
        includesOne: 'at position {{pos}} fails because {{reason}}',
        includesOneSingle: 'single value of "{{!key}}" fails because {{reason}}',
        includesRequiredUnknowns: 'does not contain {{unknownMisses}} required value(s)',
        includesRequiredKnowns: 'does not contain {{knownMisses}}',
        includesRequiredBoth: 'does not contain {{knownMisses}} and {{unknownMisses}} other required value(s)',
        excludes: 'at position {{pos}} contains an excluded value',
        excludesSingle: 'single value of "{{!key}}" contains an excluded value',
        min: 'must contain at least {{limit}} items',
        max: 'must contain less than or equal to {{limit}} items',
        length: 'must contain {{limit}} items',
        ordered: 'at position {{pos}} fails because {{reason}}',
        orderedLength: 'at position {{pos}} fails because array must contain at most {{limit}} items',
        sparse: 'must not be a sparse array',
        unique: 'position {{pos}} contains a duplicate value'
    },
    boolean: {
        base: 'must be a boolean'
    },
    binary: {
        base: 'must be a buffer or a string',
        min: 'must be at least {{limit}} bytes',
        max: 'must be less than or equal to {{limit}} bytes',
        length: 'must be {{limit}} bytes'
    },
    date: {
        base: 'must be a number of milliseconds or valid date string',
        format: 'must be a string with one of the following formats {{format}}',
        strict: 'must be a valid date',
        min: 'must be larger than or equal to "{{limit}}"',
        max: 'must be less than or equal to "{{limit}}"',
        isoDate: 'must be a valid ISO 8601 date',
        timestamp: {
            javascript: 'must be a valid timestamp or number of milliseconds',
            unix: 'must be a valid timestamp or number of seconds'
        },
        ref: 'references "{{ref}}" which is not a date'
    },
    function: {
        base: 'must be a Function',
        arity: 'must have an arity of {{n}}',
        minArity: 'must have an arity greater or equal to {{n}}',
        maxArity: 'must have an arity lesser or equal to {{n}}',
        ref: 'must be a Joi reference'
    },
    lazy: {
        base: '!!schema error: lazy schema must be set',
        schema: '!!schema error: lazy schema function must return a schema'
    },
    object: {
        base: 'must be an object',
        child: '!!child "{{!child}}" fails because {{reason}}',
        min: 'must have at least {{limit}} children',
        max: 'must have less than or equal to {{limit}} children',
        length: 'must have {{limit}} children',
        allowUnknown: '!!"{{!child}}" is not allowed',
        with: 'missing required peer "{{peer}}"',
        without: 'conflict with forbidden peer "{{peer}}"',
        missing: 'must contain at least one of {{peers}}',
        xor: 'contains a conflict between exclusive peers {{peers}}',
        or: 'must contain at least one of {{peers}}',
        and: 'contains {{present}} without its required peers {{missing}}',
        nand: '!!"{{main}}" must not exist simultaneously with {{peers}}',
        assert: '!!"{{ref}}" validation failed because "{{ref}}" failed to {{message}}',
        rename: {
            multiple: 'cannot rename child "{{from}}" because multiple renames are disabled and another key was already renamed to "{{to}}"',
            override: 'cannot rename child "{{from}}" because override is disabled and target "{{to}}" exists'
        },
        type: 'must be an instance of "{{type}}"',
        schema: 'must be a Joi instance'
    },
    number: {
        base: 'must be a number',
        min: 'must be larger than or equal to {{limit}}',
        max: 'must be less than or equal to {{limit}}',
        less: 'must be less than {{limit}}',
        greater: 'must be greater than {{limit}}',
        float: 'must be a float or double',
        integer: 'must be an integer',
        negative: 'must be a negative number',
        positive: 'must be a positive number',
        precision: 'must have no more than {{limit}} decimal places',
        ref: 'references "{{ref}}" which is not a number',
        multiple: 'must be a multiple of {{multiple}}'
    },
    string: {
        base: 'must be a string',
        min: 'length must be at least {{limit}} characters long',
        max: 'length must be less than or equal to {{limit}} characters long',
        length: 'length must be {{limit}} characters long',
        alphanum: 'must only contain alpha-numeric characters',
        token: 'must only contain alpha-numeric and underscore characters',
        regex: {
            base: 'with value "{{!value}}" fails to match the required pattern: {{pattern}}',
            name: 'with value "{{!value}}" fails to match the {{name}} pattern',
            invert: {
                base: 'with value "{{!value}}" matches the inverted pattern: {{pattern}}',
                name: 'with value "{{!value}}" matches the inverted {{name}} pattern'
            }
        },
        email: 'must be a valid email',
        uri: 'must be a valid uri',
        uriRelativeOnly: 'must be a valid relative uri',
        uriCustomScheme: 'must be a valid uri with a scheme matching the {{scheme}} pattern',
        isoDate: 'must be a valid ISO 8601 date',
        guid: 'must be a valid GUID',
        hex: 'must only contain hexadecimal characters',
        base64: 'must be a valid base64 string',
        hostname: 'must be a valid hostname',
        lowercase: 'must only contain lowercase characters',
        uppercase: 'must only contain uppercase characters',
        trim: 'must not have leading or trailing whitespace',
        creditCard: 'must be a credit card',
        ref: 'references "{{ref}}" which is not a number',
        ip: 'must be a valid ip address with a {{cidr}} CIDR',
        ipVersion: 'must be a valid ip address of one of the following versions {{version}} with a {{cidr}} CIDR'
    }
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Any = __webpack_require__(2);
const Hoek = __webpack_require__(1);


// Declare internals

const internals = {};


internals.Lazy = class extends Any {

    constructor() {

        super();
        this._type = 'lazy';
    }

    _base(value, state, options) {

        const result = { value };
        const lazy = this._flags.lazy;

        if (!lazy) {
            result.errors = this.createError('lazy.base', null, state, options);
            return result;
        }

        const schema = lazy();

        if (!(schema instanceof Any)) {
            result.errors = this.createError('lazy.schema', null, state, options);
            return result;
        }

        return schema._validate(value, state, options);
    }

    set(fn) {

        Hoek.assert(typeof fn === 'function', 'You must provide a function as first argument');

        const obj = this.clone();
        obj._flags.lazy = fn;
        return obj;
    }

};

module.exports = new internals.Lazy();


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Joi = __webpack_require__(21);


// Declare internals

const internals = {};

exports.options = Joi.object({
    abortEarly: Joi.boolean(),
    convert: Joi.boolean(),
    allowUnknown: Joi.boolean(),
    skipFunctions: Joi.boolean(),
    stripUnknown: [Joi.boolean(), Joi.object({ arrays: Joi.boolean(), objects: Joi.boolean() }).or('arrays', 'objects')],
    language: Joi.object(),
    presence: Joi.string().only('required', 'optional', 'forbidden', 'ignore'),
    raw: Joi.boolean(),
    context: Joi.object(),
    strip: Joi.boolean(),
    noDefaults: Joi.boolean()
}).strict();


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const RFC3986 = __webpack_require__(26);


// Declare internals

const internals = {
    Ip: {
        cidrs: {
            required: '\\/(?:' + RFC3986.cidr + ')',
            optional: '(?:\\/(?:' + RFC3986.cidr + '))?',
            forbidden: ''
        },
        versions: {
            ipv4: RFC3986.IPv4address,
            ipv6: RFC3986.IPv6address,
            ipvfuture: RFC3986.IPvFuture
        }
    }
};


internals.Ip.createIpRegex = function (versions, cidr) {

    let regex;
    for (let i = 0; i < versions.length; ++i) {
        const version = versions[i];
        if (!regex) {
            regex = '^(?:' + internals.Ip.versions[version];
        }
        regex = regex + '|' + internals.Ip.versions[version];
    }

    return new RegExp(regex + ')' + internals.Ip.cidrs[cidr] + '$');
};

module.exports = internals.Ip;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load Modules

const RFC3986 = __webpack_require__(26);


// Declare internals

const internals = {
    Uri: {
        createUriRegex: function (optionalScheme, allowRelative, relativeOnly) {

            let scheme = RFC3986.scheme;
            let prefix;

            if (relativeOnly) {
                prefix = '(?:' + RFC3986.relativeRef + ')';
            }
            else {
                // If we were passed a scheme, use it instead of the generic one
                if (optionalScheme) {

                    // Have to put this in a non-capturing group to handle the OR statements
                    scheme = '(?:' + optionalScheme + ')';
                }

                const withScheme = '(?:' + scheme + ':' + RFC3986.hierPart + ')';

                prefix = allowRelative ? '(?:' + withScheme + '|' + RFC3986.relativeRef + ')' : withScheme;
            }

            /**
             * URI = scheme ":" hier-part [ "?" query ] [ "#" fragment ]
             *
             * OR
             *
             * relative-ref = relative-part [ "?" query ] [ "#" fragment ]
             */
            return new RegExp('^' + prefix + '(?:\\?' + RFC3986.query + ')?' + '(?:#' + RFC3986.fragment + ')?$');
        }
    }
};


module.exports = internals.Uri;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Declare internals

const internals = {};


exports.escapeJavaScript = function (input) {

    if (!input) {
        return '';
    }

    let escaped = '';

    for (let i = 0; i < input.length; ++i) {

        const charCode = input.charCodeAt(i);

        if (internals.isSafe(charCode)) {
            escaped += input[i];
        }
        else {
            escaped += internals.escapeJavaScriptChar(charCode);
        }
    }

    return escaped;
};


exports.escapeHtml = function (input) {

    if (!input) {
        return '';
    }

    let escaped = '';

    for (let i = 0; i < input.length; ++i) {

        const charCode = input.charCodeAt(i);

        if (internals.isSafe(charCode)) {
            escaped += input[i];
        }
        else {
            escaped += internals.escapeHtmlChar(charCode);
        }
    }

    return escaped;
};


internals.escapeJavaScriptChar = function (charCode) {

    if (charCode >= 256) {
        return '\\u' + internals.padLeft('' + charCode, 4);
    }

    const hexValue = new Buffer(String.fromCharCode(charCode), 'ascii').toString('hex');
    return '\\x' + internals.padLeft(hexValue, 2);
};


internals.escapeHtmlChar = function (charCode) {

    const namedEscape = internals.namedHtml[charCode];
    if (typeof namedEscape !== 'undefined') {
        return namedEscape;
    }

    if (charCode >= 256) {
        return '&#' + charCode + ';';
    }

    const hexValue = new Buffer(String.fromCharCode(charCode), 'ascii').toString('hex');
    return '&#x' + internals.padLeft(hexValue, 2) + ';';
};


internals.padLeft = function (str, len) {

    while (str.length < len) {
        str = '0' + str;
    }

    return str;
};


internals.isSafe = function (charCode) {

    return (typeof internals.safeCharCodes[charCode] !== 'undefined');
};


internals.namedHtml = {
    '38': '&amp;',
    '60': '&lt;',
    '62': '&gt;',
    '34': '&quot;',
    '160': '&nbsp;',
    '162': '&cent;',
    '163': '&pound;',
    '164': '&curren;',
    '169': '&copy;',
    '174': '&reg;'
};


internals.safeCharCodes = (function () {

    const safe = {};

    for (let i = 32; i < 123; ++i) {

        if ((i >= 97) ||                    // a-z
            (i >= 65 && i <= 90) ||         // A-Z
            (i >= 48 && i <= 57) ||         // 0-9
            i === 32 ||                     // space
            i === 46 ||                     // .
            i === 44 ||                     // ,
            i === 45 ||                     // -
            i === 58 ||                     // :
            i === 95) {                     // _

            safe[i] = null;
        }
    }

    return safe;
}());


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Dns = __webpack_require__(95);


// Declare internals

const internals = {
    hasOwn: Object.prototype.hasOwnProperty,
    indexOf: Array.prototype.indexOf,
    defaultThreshold: 16,
    maxIPv6Groups: 8,

    categories: {
        valid: 1,
        dnsWarn: 7,
        rfc5321: 15,
        cfws: 31,
        deprecated: 63,
        rfc5322: 127,
        error: 255
    },

    diagnoses: {

        // Address is valid

        valid: 0,

        // Address is valid, but the DNS check failed

        dnsWarnNoMXRecord: 5,
        dnsWarnNoRecord: 6,

        // Address is valid for SMTP but has unusual elements

        rfc5321TLD: 9,
        rfc5321TLDNumeric: 10,
        rfc5321QuotedString: 11,
        rfc5321AddressLiteral: 12,

        // Address is valid for message, but must be modified for envelope

        cfwsComment: 17,
        cfwsFWS: 18,

        // Address contains deprecated elements, but may still be valid in some contexts

        deprecatedLocalPart: 33,
        deprecatedFWS: 34,
        deprecatedQTEXT: 35,
        deprecatedQP: 36,
        deprecatedComment: 37,
        deprecatedCTEXT: 38,
        deprecatedIPv6: 39,
        deprecatedCFWSNearAt: 49,

        // Address is only valid according to broad definition in RFC 5322, but is otherwise invalid

        rfc5322Domain: 65,
        rfc5322TooLong: 66,
        rfc5322LocalTooLong: 67,
        rfc5322DomainTooLong: 68,
        rfc5322LabelTooLong: 69,
        rfc5322DomainLiteral: 70,
        rfc5322DomainLiteralOBSDText: 71,
        rfc5322IPv6GroupCount: 72,
        rfc5322IPv62x2xColon: 73,
        rfc5322IPv6BadCharacter: 74,
        rfc5322IPv6MaxGroups: 75,
        rfc5322IPv6ColonStart: 76,
        rfc5322IPv6ColonEnd: 77,

        // Address is invalid for any purpose

        errExpectingDTEXT: 129,
        errNoLocalPart: 130,
        errNoDomain: 131,
        errConsecutiveDots: 132,
        errATEXTAfterCFWS: 133,
        errATEXTAfterQS: 134,
        errATEXTAfterDomainLiteral: 135,
        errExpectingQPair: 136,
        errExpectingATEXT: 137,
        errExpectingQTEXT: 138,
        errExpectingCTEXT: 139,
        errBackslashEnd: 140,
        errDotStart: 141,
        errDotEnd: 142,
        errDomainHyphenStart: 143,
        errDomainHyphenEnd: 144,
        errUnclosedQuotedString: 145,
        errUnclosedComment: 146,
        errUnclosedDomainLiteral: 147,
        errFWSCRLFx2: 148,
        errFWSCRLFEnd: 149,
        errCRNoLF: 150,
        errUnknownTLD: 160,
        errDomainTooShort: 161
    },

    components: {
        localpart: 0,
        domain: 1,
        literal: 2,
        contextComment: 3,
        contextFWS: 4,
        contextQuotedString: 5,
        contextQuotedPair: 6
    }
};


// $lab:coverage:off$
internals.defer = typeof process !== 'undefined' && process && typeof process.nextTick === 'function' ?
    process.nextTick.bind(process) :
    function (callback) {

        return setTimeout(callback, 0);
    };
// $lab:coverage:on$


internals.specials = function () {

    const specials = '()<>[]:;@\\,."';        // US-ASCII visible characters not valid for atext (http://tools.ietf.org/html/rfc5322#section-3.2.3)
    const lookup = new Array(0x100);
    for (let i = 0xff; i >= 0; --i) {
        lookup[i] = false;
    }

    for (let i = 0; i < specials.length; ++i) {
        lookup[specials.charCodeAt(i)] = true;
    }

    return function (code) {

        return lookup[code];
    };
}();


internals.regex = {
    ipV4: /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
    ipV6: /^[a-fA-F\d]{0,4}$/
};


internals.checkIpV6 = function (items) {

    return items.every((value) => internals.regex.ipV6.test(value));
};


internals.validDomain = function (tldAtom, options) {

    if (options.tldBlacklist) {
        if (Array.isArray(options.tldBlacklist)) {
            return internals.indexOf.call(options.tldBlacklist, tldAtom) === -1;
        }

        return !internals.hasOwn.call(options.tldBlacklist, tldAtom);
    }

    if (Array.isArray(options.tldWhitelist)) {
        return internals.indexOf.call(options.tldWhitelist, tldAtom) !== -1;
    }

    return internals.hasOwn.call(options.tldWhitelist, tldAtom);
};


/**
 * Check that an email address conforms to RFCs 5321, 5322 and others
 *
 * We distinguish clearly between a Mailbox as defined by RFC 5321 and an
 * addr-spec as defined by RFC 5322. Depending on the context, either can be
 * regarded as a valid email address. The RFC 5321 Mailbox specification is
 * more restrictive (comments, white space and obsolete forms are not allowed).
 *
 * @param {string} email The email address to check. See README for specifics.
 * @param {Object} options The (optional) options:
 *   {boolean} checkDNS If true then will check DNS for MX records. If
 *     true this call to isEmail _will_ be asynchronous.
 *   {*} errorLevel Determines the boundary between valid and invalid
 *     addresses.
 *   {*} tldBlacklist The set of domains to consider invalid.
 *   {*} tldWhitelist The set of domains to consider valid.
 *   {*} minDomainAtoms The minimum number of domain atoms which must be present
 *     for the address to be valid.
 * @param {function(number|boolean)} callback The (optional) callback handler.
 * @return {*}
 */

exports.validate = internals.validate = function (email, options, callback) {

    options = options || {};

    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    if (typeof callback !== 'function') {
        if (options.checkDNS) {
            throw new TypeError('expected callback function for checkDNS option');
        }

        callback = null;
    }

    let diagnose;
    let threshold;

    if (typeof options.errorLevel === 'number') {
        diagnose = true;
        threshold = options.errorLevel;
    }
    else {
        diagnose = !!options.errorLevel;
        threshold = internals.diagnoses.valid;
    }

    if (options.tldWhitelist) {
        if (typeof options.tldWhitelist === 'string') {
            options.tldWhitelist = [options.tldWhitelist];
        }
        else if (typeof options.tldWhitelist !== 'object') {
            throw new TypeError('expected array or object tldWhitelist');
        }
    }

    if (options.tldBlacklist) {
        if (typeof options.tldBlacklist === 'string') {
            options.tldBlacklist = [options.tldBlacklist];
        }
        else if (typeof options.tldBlacklist !== 'object') {
            throw new TypeError('expected array or object tldBlacklist');
        }
    }

    if (options.minDomainAtoms && (options.minDomainAtoms !== ((+options.minDomainAtoms) | 0) || options.minDomainAtoms < 0)) {
        throw new TypeError('expected positive integer minDomainAtoms');
    }

    let maxResult = internals.diagnoses.valid;
    const updateResult = (value) => {

        if (value > maxResult) {
            maxResult = value;
        }
    };

    const context = {
        now: internals.components.localpart,
        prev: internals.components.localpart,
        stack: [internals.components.localpart]
    };

    let prevToken = '';

    const parseData = {
        local: '',
        domain: ''
    };
    const atomData = {
        locals: [''],
        domains: ['']
    };

    let elementCount = 0;
    let elementLength = 0;
    let crlfCount = 0;
    let charCode;

    let hyphenFlag = false;
    let assertEnd = false;

    const emailLength = email.length;

    let token;                                      // Token is used outside the loop, must declare similarly
    for (let i = 0; i < emailLength; ++i) {
        token = email[i];

        switch (context.now) {
            // Local-part
            case internals.components.localpart:
                // http://tools.ietf.org/html/rfc5322#section-3.4.1
                //   local-part      =   dot-atom / quoted-string / obs-local-part
                //
                //   dot-atom        =   [CFWS] dot-atom-text [CFWS]
                //
                //   dot-atom-text   =   1*atext *("." 1*atext)
                //
                //   quoted-string   =   [CFWS]
                //                       DQUOTE *([FWS] qcontent) [FWS] DQUOTE
                //                       [CFWS]
                //
                //   obs-local-part  =   word *("." word)
                //
                //   word            =   atom / quoted-string
                //
                //   atom            =   [CFWS] 1*atext [CFWS]
                switch (token) {
                    // Comment
                    case '(':
                        if (elementLength === 0) {
                            // Comments are OK at the beginning of an element
                            updateResult(elementCount === 0 ? internals.diagnoses.cfwsComment : internals.diagnoses.deprecatedComment);
                        }
                        else {
                            updateResult(internals.diagnoses.cfwsComment);
                            // Cannot start a comment in an element, should be end
                            assertEnd = true;
                        }

                        context.stack.push(context.now);
                        context.now = internals.components.contextComment;
                        break;

                        // Next dot-atom element
                    case '.':
                        if (elementLength === 0) {
                            // Another dot, already?
                            updateResult(elementCount === 0 ? internals.diagnoses.errDotStart : internals.diagnoses.errConsecutiveDots);
                        }
                        else {
                            // The entire local-part can be a quoted string for RFC 5321; if one atom is quoted it's an RFC 5322 obsolete form
                            if (assertEnd) {
                                updateResult(internals.diagnoses.deprecatedLocalPart);
                            }

                            // CFWS & quoted strings are OK again now we're at the beginning of an element (although they are obsolete forms)
                            assertEnd = false;
                            elementLength = 0;
                            ++elementCount;
                            parseData.local += token;
                            atomData.locals[elementCount] = '';
                        }

                        break;

                        // Quoted string
                    case '"':
                        if (elementLength === 0) {
                            // The entire local-part can be a quoted string for RFC 5321; if one atom is quoted it's an RFC 5322 obsolete form
                            updateResult(elementCount === 0 ? internals.diagnoses.rfc5321QuotedString : internals.diagnoses.deprecatedLocalPart);

                            parseData.local += token;
                            atomData.locals[elementCount] += token;
                            ++elementLength;

                            // Quoted string must be the entire element
                            assertEnd = true;
                            context.stack.push(context.now);
                            context.now = internals.components.contextQuotedString;
                        }
                        else {
                            updateResult(internals.diagnoses.errExpectingATEXT);
                        }

                        break;

                        // Folding white space
                    case '\r':
                        if (emailLength === ++i || email[i] !== '\n') {
                            // Fatal error
                            updateResult(internals.diagnoses.errCRNoLF);
                            break;
                        }

                        // Fallthrough

                    case ' ':
                    case '\t':
                        if (elementLength === 0) {
                            updateResult(elementCount === 0 ? internals.diagnoses.cfwsFWS : internals.diagnoses.deprecatedFWS);
                        }
                        else {
                            // We can't start FWS in the middle of an element, better be end
                            assertEnd = true;
                        }

                        context.stack.push(context.now);
                        context.now = internals.components.contextFWS;
                        prevToken = token;
                        break;

                    case '@':
                        // At this point we should have a valid local-part
                        // $lab:coverage:off$
                        if (context.stack.length !== 1) {
                            throw new Error('unexpected item on context stack');
                        }
                        // $lab:coverage:on$

                        if (parseData.local.length === 0) {
                            // Fatal error
                            updateResult(internals.diagnoses.errNoLocalPart);
                        }
                        else if (elementLength === 0) {
                            // Fatal error
                            updateResult(internals.diagnoses.errDotEnd);
                        }
                            // http://tools.ietf.org/html/rfc5321#section-4.5.3.1.1 the maximum total length of a user name or other local-part is 64
                            //    octets
                        else if (parseData.local.length > 64) {
                            updateResult(internals.diagnoses.rfc5322LocalTooLong);
                        }
                            // http://tools.ietf.org/html/rfc5322#section-3.4.1 comments and folding white space SHOULD NOT be used around "@" in the
                            //    addr-spec
                            //
                            // http://tools.ietf.org/html/rfc2119
                            // 4. SHOULD NOT this phrase, or the phrase "NOT RECOMMENDED" mean that there may exist valid reasons in particular
                            //    circumstances when the particular behavior is acceptable or even useful, but the full implications should be understood
                            //    and the case carefully weighed before implementing any behavior described with this label.
                        else if (context.prev === internals.components.contextComment || context.prev === internals.components.contextFWS) {
                            updateResult(internals.diagnoses.deprecatedCFWSNearAt);
                        }

                        // Clear everything down for the domain parsing
                        context.now = internals.components.domain;
                        context.stack[0] = internals.components.domain;
                        elementCount = 0;
                        elementLength = 0;
                        assertEnd = false; // CFWS can only appear at the end of the element
                        break;

                        // ATEXT
                    default:
                        // http://tools.ietf.org/html/rfc5322#section-3.2.3
                        //    atext = ALPHA / DIGIT / ; Printable US-ASCII
                        //            "!" / "#" /     ;  characters not including
                        //            "$" / "%" /     ;  specials.  Used for atoms.
                        //            "&" / "'" /
                        //            "*" / "+" /
                        //            "-" / "/" /
                        //            "=" / "?" /
                        //            "^" / "_" /
                        //            "`" / "{" /
                        //            "|" / "}" /
                        //            "~"
                        if (assertEnd) {
                            // We have encountered atext where it is no longer valid
                            switch (context.prev) {
                                case internals.components.contextComment:
                                case internals.components.contextFWS:
                                    updateResult(internals.diagnoses.errATEXTAfterCFWS);
                                    break;

                                case internals.components.contextQuotedString:
                                    updateResult(internals.diagnoses.errATEXTAfterQS);
                                    break;

                                    // $lab:coverage:off$
                                default:
                                    throw new Error('more atext found where none is allowed, but unrecognized prev context: ' + context.prev);
                                    // $lab:coverage:on$
                            }
                        }
                        else {
                            context.prev = context.now;
                            charCode = token.charCodeAt(0);

                            // Especially if charCode == 10
                            if (charCode < 33 || charCode > 126 || internals.specials(charCode)) {

                                // Fatal error
                                updateResult(internals.diagnoses.errExpectingATEXT);
                            }

                            parseData.local += token;
                            atomData.locals[elementCount] += token;
                            ++elementLength;
                        }
                }

                break;

            case internals.components.domain:
                // http://tools.ietf.org/html/rfc5322#section-3.4.1
                //   domain          =   dot-atom / domain-literal / obs-domain
                //
                //   dot-atom        =   [CFWS] dot-atom-text [CFWS]
                //
                //   dot-atom-text   =   1*atext *("." 1*atext)
                //
                //   domain-literal  =   [CFWS] "[" *([FWS] dtext) [FWS] "]" [CFWS]
                //
                //   dtext           =   %d33-90 /          ; Printable US-ASCII
                //                       %d94-126 /         ;  characters not including
                //                       obs-dtext          ;  "[", "]", or "\"
                //
                //   obs-domain      =   atom *("." atom)
                //
                //   atom            =   [CFWS] 1*atext [CFWS]

                // http://tools.ietf.org/html/rfc5321#section-4.1.2
                //   Mailbox        = Local-part "@" ( Domain / address-literal )
                //
                //   Domain         = sub-domain *("." sub-domain)
                //
                //   address-literal  = "[" ( IPv4-address-literal /
                //                    IPv6-address-literal /
                //                    General-address-literal ) "]"
                //                    ; See Section 4.1.3

                // http://tools.ietf.org/html/rfc5322#section-3.4.1
                //      Note: A liberal syntax for the domain portion of addr-spec is
                //      given here.  However, the domain portion contains addressing
                //      information specified by and used in other protocols (e.g.,
                //      [RFC1034], [RFC1035], [RFC1123], [RFC5321]).  It is therefore
                //      incumbent upon implementations to conform to the syntax of
                //      addresses for the context in which they are used.
                //
                // is_email() author's note: it's not clear how to interpret this in
                // he context of a general email address validator. The conclusion I
                // have reached is this: "addressing information" must comply with
                // RFC 5321 (and in turn RFC 1035), anything that is "semantically
                // invisible" must comply only with RFC 5322.
                switch (token) {
                    // Comment
                    case '(':
                        if (elementLength === 0) {
                            // Comments at the start of the domain are deprecated in the text, comments at the start of a subdomain are obs-domain
                            // http://tools.ietf.org/html/rfc5322#section-3.4.1
                            updateResult(elementCount === 0 ? internals.diagnoses.deprecatedCFWSNearAt : internals.diagnoses.deprecatedComment);
                        }
                        else {
                            // We can't start a comment mid-element, better be at the end
                            assertEnd = true;
                            updateResult(internals.diagnoses.cfwsComment);
                        }

                        context.stack.push(context.now);
                        context.now = internals.components.contextComment;
                        break;

                        // Next dot-atom element
                    case '.':
                        if (elementLength === 0) {
                            // Another dot, already? Fatal error.
                            updateResult(elementCount === 0 ? internals.diagnoses.errDotStart : internals.diagnoses.errConsecutiveDots);
                        }
                        else if (hyphenFlag) {
                            // Previous subdomain ended in a hyphen. Fatal error.
                            updateResult(internals.diagnoses.errDomainHyphenEnd);
                        }
                        else if (elementLength > 63) {
                            // Nowhere in RFC 5321 does it say explicitly that the domain part of a Mailbox must be a valid domain according to the
                            // DNS standards set out in RFC 1035, but this *is* implied in several places. For instance, wherever the idea of host
                            // routing is discussed the RFC says that the domain must be looked up in the DNS. This would be nonsense unless the
                            // domain was designed to be a valid DNS domain. Hence we must conclude that the RFC 1035 restriction on label length
                            // also applies to RFC 5321 domains.
                            //
                            // http://tools.ietf.org/html/rfc1035#section-2.3.4
                            // labels          63 octets or less

                            updateResult(internals.diagnoses.rfc5322LabelTooLong);
                        }

                        // CFWS is OK again now we're at the beginning of an element (although
                        // it may be obsolete CFWS)
                        assertEnd = false;
                        elementLength = 0;
                        ++elementCount;
                        atomData.domains[elementCount] = '';
                        parseData.domain += token;

                        break;

                        // Domain literal
                    case '[':
                        if (parseData.domain.length === 0) {
                            // Domain literal must be the only component
                            assertEnd = true;
                            ++elementLength;
                            context.stack.push(context.now);
                            context.now = internals.components.literal;
                            parseData.domain += token;
                            atomData.domains[elementCount] += token;
                            parseData.literal = '';
                        }
                        else {
                            // Fatal error
                            updateResult(internals.diagnoses.errExpectingATEXT);
                        }

                        break;

                        // Folding white space
                    case '\r':
                        if (emailLength === ++i || email[i] !== '\n') {
                            // Fatal error
                            updateResult(internals.diagnoses.errCRNoLF);
                            break;
                        }

                        // Fallthrough

                    case ' ':
                    case '\t':
                        if (elementLength === 0) {
                            updateResult(elementCount === 0 ? internals.diagnoses.deprecatedCFWSNearAt : internals.diagnoses.deprecatedFWS);
                        }
                        else {
                            // We can't start FWS in the middle of an element, so this better be the end
                            updateResult(internals.diagnoses.cfwsFWS);
                            assertEnd = true;
                        }

                        context.stack.push(context.now);
                        context.now = internals.components.contextFWS;
                        prevToken = token;
                        break;

                        // This must be ATEXT
                    default:
                        // RFC 5322 allows any atext...
                        // http://tools.ietf.org/html/rfc5322#section-3.2.3
                        //    atext = ALPHA / DIGIT / ; Printable US-ASCII
                        //            "!" / "#" /     ;  characters not including
                        //            "$" / "%" /     ;  specials.  Used for atoms.
                        //            "&" / "'" /
                        //            "*" / "+" /
                        //            "-" / "/" /
                        //            "=" / "?" /
                        //            "^" / "_" /
                        //            "`" / "{" /
                        //            "|" / "}" /
                        //            "~"

                        // But RFC 5321 only allows letter-digit-hyphen to comply with DNS rules
                        //   (RFCs 1034 & 1123)
                        // http://tools.ietf.org/html/rfc5321#section-4.1.2
                        //   sub-domain     = Let-dig [Ldh-str]
                        //
                        //   Let-dig        = ALPHA / DIGIT
                        //
                        //   Ldh-str        = *( ALPHA / DIGIT / "-" ) Let-dig
                        //
                        if (assertEnd) {
                            // We have encountered ATEXT where it is no longer valid
                            switch (context.prev) {
                                case internals.components.contextComment:
                                case internals.components.contextFWS:
                                    updateResult(internals.diagnoses.errATEXTAfterCFWS);
                                    break;

                                case internals.components.literal:
                                    updateResult(internals.diagnoses.errATEXTAfterDomainLiteral);
                                    break;

                                    // $lab:coverage:off$
                                default:
                                    throw new Error('more atext found where none is allowed, but unrecognized prev context: ' + context.prev);
                                    // $lab:coverage:on$
                            }
                        }

                        charCode = token.charCodeAt(0);
                        // Assume this token isn't a hyphen unless we discover it is
                        hyphenFlag = false;

                        if (charCode < 33 || charCode > 126 || internals.specials(charCode)) {
                            // Fatal error
                            updateResult(internals.diagnoses.errExpectingATEXT);
                        }
                        else if (token === '-') {
                            if (elementLength === 0) {
                                // Hyphens cannot be at the beginning of a subdomain, fatal error
                                updateResult(internals.diagnoses.errDomainHyphenStart);
                            }

                            hyphenFlag = true;
                        }
                            // Check if it's a neither a number nor a latin letter
                        else if (charCode < 48 || charCode > 122 || (charCode > 57 && charCode < 65) || (charCode > 90 && charCode < 97)) {
                            // This is not an RFC 5321 subdomain, but still OK by RFC 5322
                            updateResult(internals.diagnoses.rfc5322Domain);
                        }

                        parseData.domain += token;
                        atomData.domains[elementCount] += token;
                        ++elementLength;
                }

                break;

                // Domain literal
            case internals.components.literal:
                // http://tools.ietf.org/html/rfc5322#section-3.4.1
                //   domain-literal  =   [CFWS] "[" *([FWS] dtext) [FWS] "]" [CFWS]
                //
                //   dtext           =   %d33-90 /          ; Printable US-ASCII
                //                       %d94-126 /         ;  characters not including
                //                       obs-dtext          ;  "[", "]", or "\"
                //
                //   obs-dtext       =   obs-NO-WS-CTL / quoted-pair
                switch (token) {
                    // End of domain literal
                    case ']':
                        if (maxResult < internals.categories.deprecated) {
                            // Could be a valid RFC 5321 address literal, so let's check

                            // http://tools.ietf.org/html/rfc5321#section-4.1.2
                            //   address-literal  = "[" ( IPv4-address-literal /
                            //                    IPv6-address-literal /
                            //                    General-address-literal ) "]"
                            //                    ; See Section 4.1.3
                            //
                            // http://tools.ietf.org/html/rfc5321#section-4.1.3
                            //   IPv4-address-literal  = Snum 3("."  Snum)
                            //
                            //   IPv6-address-literal  = "IPv6:" IPv6-addr
                            //
                            //   General-address-literal  = Standardized-tag ":" 1*dcontent
                            //
                            //   Standardized-tag  = Ldh-str
                            //                     ; Standardized-tag MUST be specified in a
                            //                     ; Standards-Track RFC and registered with IANA
                            //
                            //   dcontent      = %d33-90 / ; Printable US-ASCII
                            //                 %d94-126 ; excl. "[", "\", "]"
                            //
                            //   Snum          = 1*3DIGIT
                            //                 ; representing a decimal integer
                            //                 ; value in the range 0 through 255
                            //
                            //   IPv6-addr     = IPv6-full / IPv6-comp / IPv6v4-full / IPv6v4-comp
                            //
                            //   IPv6-hex      = 1*4HEXDIG
                            //
                            //   IPv6-full     = IPv6-hex 7(":" IPv6-hex)
                            //
                            //   IPv6-comp     = [IPv6-hex *5(":" IPv6-hex)] "::"
                            //                 [IPv6-hex *5(":" IPv6-hex)]
                            //                 ; The "::" represents at least 2 16-bit groups of
                            //                 ; zeros.  No more than 6 groups in addition to the
                            //                 ; "::" may be present.
                            //
                            //   IPv6v4-full   = IPv6-hex 5(":" IPv6-hex) ":" IPv4-address-literal
                            //
                            //   IPv6v4-comp   = [IPv6-hex *3(":" IPv6-hex)] "::"
                            //                 [IPv6-hex *3(":" IPv6-hex) ":"]
                            //                 IPv4-address-literal
                            //                 ; The "::" represents at least 2 16-bit groups of
                            //                 ; zeros.  No more than 4 groups in addition to the
                            //                 ; "::" and IPv4-address-literal may be present.

                            let index = -1;
                            let addressLiteral = parseData.literal;
                            const matchesIP = internals.regex.ipV4.exec(addressLiteral);

                            // Maybe extract IPv4 part from the end of the address-literal
                            if (matchesIP) {
                                index = matchesIP.index;
                                if (index !== 0) {
                                    // Convert IPv4 part to IPv6 format for futher testing
                                    addressLiteral = addressLiteral.slice(0, index) + '0:0';
                                }
                            }

                            if (index === 0) {
                                // Nothing there except a valid IPv4 address, so...
                                updateResult(internals.diagnoses.rfc5321AddressLiteral);
                            }
                            else if (addressLiteral.slice(0, 5).toLowerCase() !== 'ipv6:') {
                                updateResult(internals.diagnoses.rfc5322DomainLiteral);
                            }
                            else {
                                const match = addressLiteral.slice(5);
                                let maxGroups = internals.maxIPv6Groups;
                                const groups = match.split(':');
                                index = match.indexOf('::');

                                if (!~index) {
                                    // Need exactly the right number of groups
                                    if (groups.length !== maxGroups) {
                                        updateResult(internals.diagnoses.rfc5322IPv6GroupCount);
                                    }
                                }
                                else if (index !== match.lastIndexOf('::')) {
                                    updateResult(internals.diagnoses.rfc5322IPv62x2xColon);
                                }
                                else {
                                    if (index === 0 || index === match.length - 2) {
                                        // RFC 4291 allows :: at the start or end of an address with 7 other groups in addition
                                        ++maxGroups;
                                    }

                                    if (groups.length > maxGroups) {
                                        updateResult(internals.diagnoses.rfc5322IPv6MaxGroups);
                                    }
                                    else if (groups.length === maxGroups) {
                                        // Eliding a single "::"
                                        updateResult(internals.diagnoses.deprecatedIPv6);
                                    }
                                }

                                // IPv6 testing strategy
                                if (match[0] === ':' && match[1] !== ':') {
                                    updateResult(internals.diagnoses.rfc5322IPv6ColonStart);
                                }
                                else if (match[match.length - 1] === ':' && match[match.length - 2] !== ':') {
                                    updateResult(internals.diagnoses.rfc5322IPv6ColonEnd);
                                }
                                else if (internals.checkIpV6(groups)) {
                                    updateResult(internals.diagnoses.rfc5321AddressLiteral);
                                }
                                else {
                                    updateResult(internals.diagnoses.rfc5322IPv6BadCharacter);
                                }
                            }
                        }
                        else {
                            updateResult(internals.diagnoses.rfc5322DomainLiteral);
                        }

                        parseData.domain += token;
                        atomData.domains[elementCount] += token;
                        ++elementLength;
                        context.prev = context.now;
                        context.now = context.stack.pop();
                        break;

                    case '\\':
                        updateResult(internals.diagnoses.rfc5322DomainLiteralOBSDText);
                        context.stack.push(context.now);
                        context.now = internals.components.contextQuotedPair;
                        break;

                        // Folding white space
                    case '\r':
                        if (emailLength === ++i || email[i] !== '\n') {
                            updateResult(internals.diagnoses.errCRNoLF);
                            break;
                        }

                        // Fallthrough

                    case ' ':
                    case '\t':
                        updateResult(internals.diagnoses.cfwsFWS);

                        context.stack.push(context.now);
                        context.now = internals.components.contextFWS;
                        prevToken = token;
                        break;

                        // DTEXT
                    default:
                        // http://tools.ietf.org/html/rfc5322#section-3.4.1
                        //   dtext         =   %d33-90 /  ; Printable US-ASCII
                        //                     %d94-126 / ;  characters not including
                        //                     obs-dtext  ;  "[", "]", or "\"
                        //
                        //   obs-dtext     =   obs-NO-WS-CTL / quoted-pair
                        //
                        //   obs-NO-WS-CTL =   %d1-8 /    ; US-ASCII control
                        //                     %d11 /     ;  characters that do not
                        //                     %d12 /     ;  include the carriage
                        //                     %d14-31 /  ;  return, line feed, and
                        //                     %d127      ;  white space characters
                        charCode = token.charCodeAt(0);

                        // '\r', '\n', ' ', and '\t' have already been parsed above
                        if (charCode > 127 || charCode === 0 || token === '[') {
                            // Fatal error
                            updateResult(internals.diagnoses.errExpectingDTEXT);
                            break;
                        }
                        else if (charCode < 33 || charCode === 127) {
                            updateResult(internals.diagnoses.rfc5322DomainLiteralOBSDText);
                        }

                        parseData.literal += token;
                        parseData.domain += token;
                        atomData.domains[elementCount] += token;
                        ++elementLength;
                }

                break;

                // Quoted string
            case internals.components.contextQuotedString:
                // http://tools.ietf.org/html/rfc5322#section-3.2.4
                //   quoted-string = [CFWS]
                //                   DQUOTE *([FWS] qcontent) [FWS] DQUOTE
                //                   [CFWS]
                //
                //   qcontent      = qtext / quoted-pair
                switch (token) {
                    // Quoted pair
                    case '\\':
                        context.stack.push(context.now);
                        context.now = internals.components.contextQuotedPair;
                        break;

                        // Folding white space. Spaces are allowed as regular characters inside a quoted string - it's only FWS if we include '\t' or '\r\n'
                    case '\r':
                        if (emailLength === ++i || email[i] !== '\n') {
                            // Fatal error
                            updateResult(internals.diagnoses.errCRNoLF);
                            break;
                        }

                        // Fallthrough

                    case '\t':
                        // http://tools.ietf.org/html/rfc5322#section-3.2.2
                        //   Runs of FWS, comment, or CFWS that occur between lexical tokens in
                        //   a structured header field are semantically interpreted as a single
                        //   space character.

                        // http://tools.ietf.org/html/rfc5322#section-3.2.4
                        //   the CRLF in any FWS/CFWS that appears within the quoted-string [is]
                        //   semantically "invisible" and therefore not part of the
                        //   quoted-string

                        parseData.local += ' ';
                        atomData.locals[elementCount] += ' ';
                        ++elementLength;

                        updateResult(internals.diagnoses.cfwsFWS);
                        context.stack.push(context.now);
                        context.now = internals.components.contextFWS;
                        prevToken = token;
                        break;

                        // End of quoted string
                    case '"':
                        parseData.local += token;
                        atomData.locals[elementCount] += token;
                        ++elementLength;
                        context.prev = context.now;
                        context.now = context.stack.pop();
                        break;

                        // QTEXT
                    default:
                        // http://tools.ietf.org/html/rfc5322#section-3.2.4
                        //   qtext          =   %d33 /             ; Printable US-ASCII
                        //                      %d35-91 /          ;  characters not including
                        //                      %d93-126 /         ;  "\" or the quote character
                        //                      obs-qtext
                        //
                        //   obs-qtext      =   obs-NO-WS-CTL
                        //
                        //   obs-NO-WS-CTL  =   %d1-8 /            ; US-ASCII control
                        //                      %d11 /             ;  characters that do not
                        //                      %d12 /             ;  include the carriage
                        //                      %d14-31 /          ;  return, line feed, and
                        //                      %d127              ;  white space characters
                        charCode = token.charCodeAt(0);

                        if (charCode > 127 || charCode === 0 || charCode === 10) {
                            updateResult(internals.diagnoses.errExpectingQTEXT);
                        }
                        else if (charCode < 32 || charCode === 127) {
                            updateResult(internals.diagnoses.deprecatedQTEXT);
                        }

                        parseData.local += token;
                        atomData.locals[elementCount] += token;
                        ++elementLength;
                }

                // http://tools.ietf.org/html/rfc5322#section-3.4.1
                //   If the string can be represented as a dot-atom (that is, it contains
                //   no characters other than atext characters or "." surrounded by atext
                //   characters), then the dot-atom form SHOULD be used and the quoted-
                //   string form SHOULD NOT be used.

                break;
                // Quoted pair
            case internals.components.contextQuotedPair:
                // http://tools.ietf.org/html/rfc5322#section-3.2.1
                //   quoted-pair     =   ("\" (VCHAR / WSP)) / obs-qp
                //
                //   VCHAR           =  %d33-126   ; visible (printing) characters
                //   WSP             =  SP / HTAB  ; white space
                //
                //   obs-qp          =   "\" (%d0 / obs-NO-WS-CTL / LF / CR)
                //
                //   obs-NO-WS-CTL   =   %d1-8 /   ; US-ASCII control
                //                       %d11 /    ;  characters that do not
                //                       %d12 /    ;  include the carriage
                //                       %d14-31 / ;  return, line feed, and
                //                       %d127     ;  white space characters
                //
                // i.e. obs-qp       =  "\" (%d0-8, %d10-31 / %d127)
                charCode = token.charCodeAt(0);

                if (charCode > 127) {
                    // Fatal error
                    updateResult(internals.diagnoses.errExpectingQPair);
                }
                else if ((charCode < 31 && charCode !== 9) || charCode === 127) {
                    // ' ' and '\t' are allowed
                    updateResult(internals.diagnoses.deprecatedQP);
                }

                // At this point we know where this qpair occurred so we could check to see if the character actually needed to be quoted at all.
                // http://tools.ietf.org/html/rfc5321#section-4.1.2
                //   the sending system SHOULD transmit the form that uses the minimum quoting possible.

                context.prev = context.now;
                // End of qpair
                context.now = context.stack.pop();
                token = '\\' + token;

                switch (context.now) {
                    case internals.components.contextComment:
                        break;

                    case internals.components.contextQuotedString:
                        parseData.local += token;
                        atomData.locals[elementCount] += token;

                        // The maximum sizes specified by RFC 5321 are octet counts, so we must include the backslash
                        elementLength += 2;
                        break;

                    case internals.components.literal:
                        parseData.domain += token;
                        atomData.domains[elementCount] += token;

                        // The maximum sizes specified by RFC 5321 are octet counts, so we must include the backslash
                        elementLength += 2;
                        break;

                        // $lab:coverage:off$
                    default:
                        throw new Error('quoted pair logic invoked in an invalid context: ' + context.now);
                        // $lab:coverage:on$
                }
                break;

                // Comment
            case internals.components.contextComment:
                // http://tools.ietf.org/html/rfc5322#section-3.2.2
                //   comment  = "(" *([FWS] ccontent) [FWS] ")"
                //
                //   ccontent = ctext / quoted-pair / comment
                switch (token) {
                    // Nested comment
                    case '(':
                        // Nested comments are ok
                        context.stack.push(context.now);
                        context.now = internals.components.contextComment;
                        break;

                        // End of comment
                    case ')':
                        context.prev = context.now;
                        context.now = context.stack.pop();
                        break;

                        // Quoted pair
                    case '\\':
                        context.stack.push(context.now);
                        context.now = internals.components.contextQuotedPair;
                        break;

                        // Folding white space
                    case '\r':
                        if (emailLength === ++i || email[i] !== '\n') {
                            // Fatal error
                            updateResult(internals.diagnoses.errCRNoLF);
                            break;
                        }

                        // Fallthrough

                    case ' ':
                    case '\t':
                        updateResult(internals.diagnoses.cfwsFWS);

                        context.stack.push(context.now);
                        context.now = internals.components.contextFWS;
                        prevToken = token;
                        break;

                        // CTEXT
                    default:
                        // http://tools.ietf.org/html/rfc5322#section-3.2.3
                        //   ctext         = %d33-39 /  ; Printable US-ASCII
                        //                   %d42-91 /  ;  characters not including
                        //                   %d93-126 / ;  "(", ")", or "\"
                        //                   obs-ctext
                        //
                        //   obs-ctext     = obs-NO-WS-CTL
                        //
                        //   obs-NO-WS-CTL = %d1-8 /    ; US-ASCII control
                        //                   %d11 /     ;  characters that do not
                        //                   %d12 /     ;  include the carriage
                        //                   %d14-31 /  ;  return, line feed, and
                        //                   %d127      ;  white space characters
                        charCode = token.charCodeAt(0);

                        if (charCode > 127 || charCode === 0 || charCode === 10) {
                            // Fatal error
                            updateResult(internals.diagnoses.errExpectingCTEXT);
                            break;
                        }
                        else if (charCode < 32 || charCode === 127) {
                            updateResult(internals.diagnoses.deprecatedCTEXT);
                        }
                }

                break;

                // Folding white space
            case internals.components.contextFWS:
                // http://tools.ietf.org/html/rfc5322#section-3.2.2
                //   FWS     =   ([*WSP CRLF] 1*WSP) /  obs-FWS
                //                                   ; Folding white space

                // But note the erratum:
                // http://www.rfc-editor.org/errata_search.php?rfc=5322&eid=1908:
                //   In the obsolete syntax, any amount of folding white space MAY be
                //   inserted where the obs-FWS rule is allowed.  This creates the
                //   possibility of having two consecutive "folds" in a line, and
                //   therefore the possibility that a line which makes up a folded header
                //   field could be composed entirely of white space.
                //
                //   obs-FWS =   1*([CRLF] WSP)

                if (prevToken === '\r') {
                    if (token === '\r') {
                        // Fatal error
                        updateResult(internals.diagnoses.errFWSCRLFx2);
                        break;
                    }

                    if (++crlfCount > 1) {
                        // Multiple folds => obsolete FWS
                        updateResult(internals.diagnoses.deprecatedFWS);
                    }
                    else {
                        crlfCount = 1;
                    }
                }

                switch (token) {
                    case '\r':
                        if (emailLength === ++i || email[i] !== '\n') {
                            // Fatal error
                            updateResult(internals.diagnoses.errCRNoLF);
                        }

                        break;

                    case ' ':
                    case '\t':
                        break;

                    default:
                        if (prevToken === '\r') {
                            // Fatal error
                            updateResult(internals.diagnoses.errFWSCRLFEnd);
                        }

                        crlfCount = 0;

                        // End of FWS
                        context.prev = context.now;
                        context.now = context.stack.pop();

                        // Look at this token again in the parent context
                        --i;
                }

                prevToken = token;
                break;

                // Unexpected context
                // $lab:coverage:off$
            default:
                throw new Error('unknown context: ' + context.now);
                // $lab:coverage:on$
        } // Primary state machine

        if (maxResult > internals.categories.rfc5322) {
            // Fatal error, no point continuing
            break;
        }
    } // Token loop

    // Check for errors
    if (maxResult < internals.categories.rfc5322) {
        // Fatal errors
        if (context.now === internals.components.contextQuotedString) {
            updateResult(internals.diagnoses.errUnclosedQuotedString);
        }
        else if (context.now === internals.components.contextQuotedPair) {
            updateResult(internals.diagnoses.errBackslashEnd);
        }
        else if (context.now === internals.components.contextComment) {
            updateResult(internals.diagnoses.errUnclosedComment);
        }
        else if (context.now === internals.components.literal) {
            updateResult(internals.diagnoses.errUnclosedDomainLiteral);
        }
        else if (token === '\r') {
            updateResult(internals.diagnoses.errFWSCRLFEnd);
        }
        else if (parseData.domain.length === 0) {
            updateResult(internals.diagnoses.errNoDomain);
        }
        else if (elementLength === 0) {
            updateResult(internals.diagnoses.errDotEnd);
        }
        else if (hyphenFlag) {
            updateResult(internals.diagnoses.errDomainHyphenEnd);
        }

            // Other errors
        else if (parseData.domain.length > 255) {
            // http://tools.ietf.org/html/rfc5321#section-4.5.3.1.2
            //   The maximum total length of a domain name or number is 255 octets.
            updateResult(internals.diagnoses.rfc5322DomainTooLong);
        }
        else if (parseData.local.length + parseData.domain.length + /* '@' */ 1 > 254) {
            // http://tools.ietf.org/html/rfc5321#section-4.1.2
            //   Forward-path   = Path
            //
            //   Path           = "<" [ A-d-l ":" ] Mailbox ">"
            //
            // http://tools.ietf.org/html/rfc5321#section-4.5.3.1.3
            //   The maximum total length of a reverse-path or forward-path is 256 octets (including the punctuation and element separators).
            //
            // Thus, even without (obsolete) routing information, the Mailbox can only be 254 characters long. This is confirmed by this verified
            // erratum to RFC 3696:
            //
            // http://www.rfc-editor.org/errata_search.php?rfc=3696&eid=1690
            //   However, there is a restriction in RFC 2821 on the length of an address in MAIL and RCPT commands of 254 characters.  Since
            //   addresses that do not fit in those fields are not normally useful, the upper limit on address lengths should normally be considered
            //   to be 254.
            updateResult(internals.diagnoses.rfc5322TooLong);
        }
        else if (elementLength > 63) {
            // http://tools.ietf.org/html/rfc1035#section-2.3.4
            // labels   63 octets or less
            updateResult(internals.diagnoses.rfc5322LabelTooLong);
        }
        else if (options.minDomainAtoms && atomData.domains.length < options.minDomainAtoms) {
            updateResult(internals.diagnoses.errDomainTooShort);
        }
        else if (options.tldWhitelist || options.tldBlacklist) {
            const tldAtom = atomData.domains[elementCount];

            if (!internals.validDomain(tldAtom, options)) {
                updateResult(internals.diagnoses.errUnknownTLD);
            }
        }
    } // Check for errors

    let dnsPositive = false;
    let finishImmediately = false;

    const finish = () => {

        if (!dnsPositive && maxResult < internals.categories.dnsWarn) {
            // Per RFC 5321, domain atoms are limited to letter-digit-hyphen, so we only need to check code <= 57 to check for a digit
            const code = atomData.domains[elementCount].charCodeAt(0);
            if (code <= 57) {
                updateResult(internals.diagnoses.rfc5321TLDNumeric);
            }
            else if (elementCount === 0) {
                updateResult(internals.diagnoses.rfc5321TLD);
            }
        }

        if (maxResult < threshold) {
            maxResult = internals.diagnoses.valid;
        }

        const finishResult = diagnose ? maxResult : maxResult < internals.defaultThreshold;

        if (callback) {
            if (finishImmediately) {
                callback(finishResult);
            }
            else {
                internals.defer(callback.bind(null, finishResult));
            }
        }

        return finishResult;
    }; // Finish

    if (options.checkDNS && maxResult < internals.categories.dnsWarn) {
        // http://tools.ietf.org/html/rfc5321#section-2.3.5
        //   Names that can be resolved to MX RRs or address (i.e., A or AAAA) RRs (as discussed in Section 5) are permitted, as are CNAME RRs whose
        //   targets can be resolved, in turn, to MX or address RRs.
        //
        // http://tools.ietf.org/html/rfc5321#section-5.1
        //   The lookup first attempts to locate an MX record associated with the name.  If a CNAME record is found, the resulting name is processed
        //   as if it were the initial name. ... If an empty list of MXs is returned, the address is treated as if it was associated with an implicit
        //   MX RR, with a preference of 0, pointing to that host.
        //
        // isEmail() author's note: We will regard the existence of a CNAME to be sufficient evidence of the domain's existence. For performance
        // reasons we will not repeat the DNS lookup for the CNAME's target, but we will raise a warning because we didn't immediately find an MX
        // record.
        if (elementCount === 0) {
            // Checking TLD DNS only works if you explicitly check from the root
            parseData.domain += '.';
        }

        const dnsDomain = parseData.domain;
        Dns.resolveMx(dnsDomain, (err, mxRecords) => {

            // If we have a fatal error, then we must assume that there are no records
            if (err && err.code !== Dns.NODATA) {
                updateResult(internals.diagnoses.dnsWarnNoRecord);
                return finish();
            }

            if (mxRecords && mxRecords.length) {
                dnsPositive = true;
                return finish();
            }

            let count = 3;
            let done = false;
            updateResult(internals.diagnoses.dnsWarnNoMXRecord);

            const handleRecords = (ignoreError, records) => {

                if (done) {
                    return;
                }

                --count;

                if (records && records.length) {
                    done = true;
                    return finish();
                }

                if (count === 0) {
                    // No usable records for the domain can be found
                    updateResult(internals.diagnoses.dnsWarnNoRecord);
                    done = true;
                    finish();
                }
            };

            Dns.resolveCname(dnsDomain, handleRecords);
            Dns.resolve4(dnsDomain, handleRecords);
            Dns.resolve6(dnsDomain, handleRecords);
        });

        finishImmediately = true;
    }
    else {
        const result = finish();
        finishImmediately = true;
        return result;
    } // CheckDNS
};


exports.diagnoses = internals.validate.diagnoses = (function () {

    const diag = {};
    const keys = Object.keys(internals.diagnoses);
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        diag[key] = internals.diagnoses[key];
    }

    return diag;
})();


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(1);


// Declare internals

const internals = {};


exports = module.exports = internals.Topo = function () {

    this._items = [];
    this.nodes = [];
};


internals.Topo.prototype.add = function (nodes, options) {

    options = options || {};

    // Validate rules

    const before = [].concat(options.before || []);
    const after = [].concat(options.after || []);
    const group = options.group || '?';
    const sort = options.sort || 0;                   // Used for merging only

    Hoek.assert(before.indexOf(group) === -1, 'Item cannot come before itself:', group);
    Hoek.assert(before.indexOf('?') === -1, 'Item cannot come before unassociated items');
    Hoek.assert(after.indexOf(group) === -1, 'Item cannot come after itself:', group);
    Hoek.assert(after.indexOf('?') === -1, 'Item cannot come after unassociated items');

    ([].concat(nodes)).forEach((node, i) => {

        const item = {
            seq: this._items.length,
            sort: sort,
            before: before,
            after: after,
            group: group,
            node: node
        };

        this._items.push(item);
    });

    // Insert event

    const error = this._sort();
    Hoek.assert(!error, 'item', (group !== '?' ? 'added into group ' + group : ''), 'created a dependencies error');

    return this.nodes;
};


internals.Topo.prototype.merge = function (others) {

    others = [].concat(others);
    for (let i = 0; i < others.length; ++i) {
        const other = others[i];
        if (other) {
            for (let j = 0; j < other._items.length; ++j) {
                const item = Hoek.shallow(other._items[j]);
                this._items.push(item);
            }
        }
    }

    // Sort items

    this._items.sort(internals.mergeSort);
    for (let i = 0; i < this._items.length; ++i) {
        this._items[i].seq = i;
    }

    const error = this._sort();
    Hoek.assert(!error, 'merge created a dependencies error');

    return this.nodes;
};


internals.mergeSort = function (a, b) {

    return a.sort === b.sort ? 0 : (a.sort < b.sort ? -1 : 1);
};


internals.Topo.prototype._sort = function () {

    // Construct graph

    const graph = {};
    const graphAfters = Object.create(null); // A prototype can bungle lookups w/ false positives
    const groups = Object.create(null);

    for (let i = 0; i < this._items.length; ++i) {
        const item = this._items[i];
        const seq = item.seq;                         // Unique across all items
        const group = item.group;

        // Determine Groups

        groups[group] = groups[group] || [];
        groups[group].push(seq);

        // Build intermediary graph using 'before'

        graph[seq] = item.before;

        // Build second intermediary graph with 'after'

        const after = item.after;
        for (let j = 0; j < after.length; ++j) {
            graphAfters[after[j]] = (graphAfters[after[j]] || []).concat(seq);
        }
    }

    // Expand intermediary graph

    let graphNodes = Object.keys(graph);
    for (let i = 0; i < graphNodes.length; ++i) {
        const node = graphNodes[i];
        const expandedGroups = [];

        const graphNodeItems = Object.keys(graph[node]);
        for (let j = 0; j < graphNodeItems.length; ++j) {
            const group = graph[node][graphNodeItems[j]];
            groups[group] = groups[group] || [];

            for (let k = 0; k < groups[group].length; ++k) {
                expandedGroups.push(groups[group][k]);
            }
        }
        graph[node] = expandedGroups;
    }

    // Merge intermediary graph using graphAfters into final graph

    const afterNodes = Object.keys(graphAfters);
    for (let i = 0; i < afterNodes.length; ++i) {
        const group = afterNodes[i];

        if (groups[group]) {
            for (let j = 0; j < groups[group].length; ++j) {
                const node = groups[group][j];
                graph[node] = graph[node].concat(graphAfters[group]);
            }
        }
    }

    // Compile ancestors

    let children;
    const ancestors = {};
    graphNodes = Object.keys(graph);
    for (let i = 0; i < graphNodes.length; ++i) {
        const node = graphNodes[i];
        children = graph[node];

        for (let j = 0; j < children.length; ++j) {
            ancestors[children[j]] = (ancestors[children[j]] || []).concat(node);
        }
    }

    // Topo sort

    const visited = {};
    const sorted = [];

    for (let i = 0; i < this._items.length; ++i) {
        let next = i;

        if (ancestors[i]) {
            next = null;
            for (let j = 0; j < this._items.length; ++j) {
                if (visited[j] === true) {
                    continue;
                }

                if (!ancestors[j]) {
                    ancestors[j] = [];
                }

                const shouldSeeCount = ancestors[j].length;
                let seenCount = 0;
                for (let k = 0; k < shouldSeeCount; ++k) {
                    if (sorted.indexOf(ancestors[j][k]) >= 0) {
                        ++seenCount;
                    }
                }

                if (seenCount === shouldSeeCount) {
                    next = j;
                    break;
                }
            }
        }

        if (next !== null) {
            next = next.toString();         // Normalize to string TODO: replace with seq
            visited[next] = true;
            sorted.push(next);
        }
    }

    if (sorted.length !== this._items.length) {
        return new Error('Invalid dependencies');
    }

    const seqIndex = {};
    for (let i = 0; i < this._items.length; ++i) {
        const item = this._items[i];
        seqIndex[item.seq] = item;
    }

    const sortedNodes = [];
    this._items = sorted.map((value) => {

        const sortedItem = seqIndex[value];
        sortedNodes.push(sortedItem.node);
        return sortedItem;
    });

    this.nodes = sortedNodes;
};


/***/ }),
/* 80 */
/***/ (function(module, exports) {

module.exports = {
	"name": "joi",
	"description": "Object schema validation",
	"version": "10.2.2",
	"homepage": "https://github.com/hapijs/joi",
	"repository": {
		"type": "git",
		"url": "git://github.com/hapijs/joi.git"
	},
	"main": "lib/index.js",
	"keywords": [
		"hapi",
		"schema",
		"validation"
	],
	"engines": {
		"node": ">=4.0.0"
	},
	"dependencies": {
		"hoek": "4.x.x",
		"isemail": "2.x.x",
		"items": "2.x.x",
		"topo": "2.x.x"
	},
	"devDependencies": {
		"code": "4.x.x",
		"lab": "11.x.x",
		"markdown-toc": "0.13.x"
	},
	"scripts": {
		"test": "lab -t 100 -a code -L",
		"test-debug": "node $NODE_DEBUG_OPTION ./node_modules/.bin/lab -a code",
		"test-cov-html": "lab -r html -o coverage.html -a code",
		"toc": "node generate-readme-toc.js",
		"version": "npm run toc && git add API.md README.md"
	},
	"license": "BSD-3-Clause",
	"gitHead": "ef2cb827d346b036e9b16630177f47cce05812e9",
	"bugs": {
		"url": "https://github.com/hapijs/joi/issues"
	},
	"_id": "joi@10.2.2",
	"_shasum": "dc5a792b7b4c6fffa562242a95b55d9d3f077e24",
	"_from": "joi@>=10.2.1 <11.0.0",
	"_npmVersion": "3.10.10",
	"_nodeVersion": "6.9.5",
	"_npmUser": {
		"name": "marsup",
		"email": "nicolas@morel.io"
	},
	"dist": {
		"shasum": "dc5a792b7b4c6fffa562242a95b55d9d3f077e24",
		"tarball": "https://registry.npmjs.org/joi/-/joi-10.2.2.tgz"
	},
	"maintainers": [
		{
			"name": "hueniverse",
			"email": "eran@hueniverse.com"
		},
		{
			"name": "marsup",
			"email": "marsup@gmail.com"
		}
	],
	"_npmOperationalInternal": {
		"host": "packages-12-west.internal.npmjs.com",
		"tmp": "tmp/joi-10.2.2.tgz_1486673707533_0.3707918550353497"
	},
	"directories": {},
	"_resolved": "https://registry.npmjs.org/joi/-/joi-10.2.2.tgz",
	"readme": "ERROR: No README data found!"
};

/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = {
	"AttributeDefinitions": [
		{
			"AttributeName": "aggregate",
			"AttributeType": "S"
		},
		{
			"AttributeName": "seq",
			"AttributeType": "N"
		},
		{
			"AttributeName": "timestamp",
			"AttributeType": "S"
		}
	],
	"KeySchema": [
		{
			"AttributeName": "aggregate",
			"KeyType": "HASH"
		},
		{
			"AttributeName": "seq",
			"KeyType": "RANGE"
		}
	],
	"LocalSecondaryIndexes": [
		{
			"IndexName": "eventsByTimestamp",
			"Projection": {
				"ProjectionType": "ALL"
			},
			"KeySchema": [
				{
					"AttributeName": "aggregate",
					"KeyType": "HASH"
				},
				{
					"AttributeName": "timestamp",
					"KeyType": "RANGE"
				}
			]
		}
	],
	"ProvisionedThroughput": {
		"ReadCapacityUnits": 1,
		"WriteCapacityUnits": 1
	},
	"StreamSpecification": {
		"StreamEnabled": true,
		"StreamViewType": "NEW_IMAGE"
	}
};

/***/ }),
/* 82 */
/***/ (function(module, exports) {

module.exports = {
	"AttributeDefinitions": [
		{
			"AttributeName": "aggregate",
			"AttributeType": "S"
		},
		{
			"AttributeName": "reducerName",
			"AttributeType": "S"
		}
	],
	"KeySchema": [
		{
			"AttributeName": "aggregate",
			"KeyType": "HASH"
		},
		{
			"AttributeName": "reducerName",
			"KeyType": "RANGE"
		}
	],
	"ProvisionedThroughput": {
		"ReadCapacityUnits": 1,
		"WriteCapacityUnits": 1
	}
};

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const
	Command = __webpack_require__(8),
	Types = __webpack_require__(5);

const
	ST = Types.ST,
	NewEvent = Types.NewEvent,
	TableName = Types.TableName;

const
	storeEvent = (ctx, event) => new Promise((resolve, reject) => {
		event.timestamp = new Date().toISOString();

		new ctx.AWS.DynamoDB.DocumentClient().put(
			{
				TableName: TableName.fromEvent(ctx.namespace, event).toString(),
				Item: event.toPrimitive(),
				ConditionExpression: 'attribute_not_exists(#s)',
				ExpressionAttributeNames: { '#s': 'seq' }
			},
			(err, data) => err ? reject(err) : resolve(event)
		);
	}),
	createAndWaitForTable = (aws, tableParam) => {
		const ddb = new aws.DynamoDB();

		return new Promise((resolve, reject) => ddb.createTable(
			tableParam,
			(err, data) => err
				? /* istanbul ignore next */ reject(err) : resolve(data)
		)).then(() => new Promise((resolve, reject) => ddb.waitFor(
			'tableExists', { TableName: tableParam.TableName },
			(err, data) => err
				? /* istanbul ignore next */ reject(err) : resolve(data)
		)));
	},
	createTableForEvent = (ctx, event) => createAndWaitForTable(
		ctx.AWS,
		Object.assign(
			{ TableName: TableName.fromEvent(ctx.namespace, event).toString() },
			__webpack_require__(81)
		)
	),
	createShadowTableForEvent = (ctx, event) => createAndWaitForTable(
		ctx.AWS,
		Object.assign(
			{ TableName: TableName.fromEvent(ctx.namespace, event).trackingName },
			__webpack_require__(82)
		)
	);

module.exports = class EmitEvent extends Command {

	static get schema() {
		return ST.joi.st(NewEvent).required().label('event');
	}

	run(ctx) {
		return storeEvent(ctx, this).catch((err) => {
			if (err.code === 'ResourceNotFoundException') {
				return createTableForEvent(ctx, this)
					.then(() => createShadowTableForEvent(ctx, this))
					.then(() => storeEvent(ctx, this));
			} else {
				throw err;
			}
		});
	}

};


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const
	bluebird = __webpack_require__(18),

	Command = __webpack_require__(8),
	Types = __webpack_require__(5),

	FetchEvents = __webpack_require__(28),
	FetchLastReduction = __webpack_require__(29),
	TrackReduction = __webpack_require__(31);

const
	ST = Types.ST,
	StoredEvent = Types.StoredEvent,
	ReducerObj = Types.ReducerObj,

	returnp = __webpack_require__(16).returnPromise;

const
	ERROR_NO_OP = new Error('no events to be reduced'),
	ERROR_NOT_IN_SAME_AGG_GROUP = new Error(
		'Events must have the same aggregate and group'
	),
	ERROR_DUPLICATED_SEQ_VALUE = new Error('Events must have unique seq value');

module.exports = class ReduceEvents extends Command {

	static get ERROR_NO_OP() {
		return ERROR_NO_OP;
	}

	static get ERROR_NOT_IN_SAME_AGG_GROUP() {
		return ERROR_NOT_IN_SAME_AGG_GROUP;
	}

	static get ERROR_DUPLICATED_SEQ_VALUE() {
		return ERROR_DUPLICATED_SEQ_VALUE;
	}

	static get schema() {
		return ST.joi.object().keys({
			reducer: ST.joi.st(ReducerObj).required(),
			events: ST.joi.array().items(ST.joi.st(StoredEvent)).required()
		}).required().label('parameter');
	}

	constructor(param) {
		super(param);

		if (!this.events.length) {
			throw ReduceEvents.ERROR_NO_OP;
		}

		if (
			Object.keys(
				this.events.reduce((a, e) => (a[e.aggregate] = true, a), {})
			).length > 1 || Object.keys(
				this.events.reduce((a, e) => (a[e.group] = true, a), {})
			).length > 1
		) {
			throw ReduceEvents.ERROR_NOT_IN_SAME_AGG_GROUP;
		}

		if (
			Object.keys(
				this.events.reduce((a, e) => (a[e.seq] = true, a), {})
			).length !== this.events.length
		) {
			throw ReduceEvents.ERROR_DUPLICATED_SEQ_VALUE;
		}

		for (let i = 1; i < this.events.length; i += 1) {
			if (this.events[i].seq - this.events[i - 1].seq > 1) {
				this.log('Warning: Events seq numbers are sparse');
				continue;
			}
		}

		this.group = this.events[0].group,
		this.aggregate = this.events[0].aggregate;
	}

	_loadInitState() {
		return returnp(this.reducer.state(this.aggregate))
			.then(state => this.initState = state);
	}

	_loadLastReduction(ctx) {
		return new FetchLastReduction({
			group: this.group,
			reducerName: this.reducer.name,
			aggregate: this.aggregate
		}).run(ctx).then(e => this.lastReducedEvent = e);
	}

	_normalizeEvents(ctx) {
		let lastReducedSeq
				= this.lastReducedEvent && this.lastReducedEvent.seq || -1;

		this.log(
			'last reduced seq: %s. oldest event seq: %s',
			lastReducedSeq, this.events[0].seq
		);

		if (lastReducedSeq + 1 < this.events[0].seq) {
			this.log('gap in events to be reduced. fetch more events.');

			return new FetchEvents({
				group: this.group,
				aggregate: this.aggregate,
				fromSeq: lastReducedSeq + 1,
				toSeq: this.events[0].seq - 1
			})
				.run(ctx)
				.then(events => this.events = events.concat(this.events));
		} else if (lastReducedSeq >= this.events[0].seq) {
			this.log('stale events to be reduced. trimming.');

			let i = 0;

			while (
				i < this.events.length && lastReducedSeq >= this.events[i].seq
			) { i += 1; }

			this.events.splice(0, i);

			if (!this.events.length) { throw ReduceEvents.ERROR_NO_OP; }
		}
	}

	/*
	 * The fundamental difficulty here is to protect the integrity of
	 * reducer.state(). It is not always possible to recover the last event
	 * reduced from the value of reducer.state().
	 */
	run(ctx) {
		this.log(
			'starting reducer [%s] for aggregate [%s] group [%s] events[%s - %s]',
			this.reducer.name, this.aggregate, this.group,
			this.events[0].seq, this.events[this.events.length - 1].seq
		);

		return bluebird
			.all([
				this._loadInitState(),
				this._loadLastReduction(ctx)
			])
			.then(() => this._normalizeEvents(ctx))
			.then(() => bluebird.reduce(
				this.events,
				(s, e) => returnp(this.reducer.reduce(s, e)),
				this.initState === undefined ? null : this.initState
			))
			.then(state => this.reducer.persist(this.group, this.aggregate, state))
			.then(
				res => new TrackReduction({
					group: this.group,
					reducerName: this.reducer.name,
					event: this.events[this.events.length - 1],
					previousSeq: this.lastReducedEvent
						? this.lastReducedEvent.seq
						: undefined
				}).run(ctx).then(() => res)
			);
	}

};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Types = __webpack_require__(5);

const
	ST = Types.ST,
	Namespace = Types.Namespace,
	ReducerObj = Types.ReducerObj;

class Context extends ST {
	static get schema() {
		return ST.joi.object().keys({
			namespace: ST.joi.st(Namespace).required(),
			reducer: ST.joi.st(ReducerObj).required(),
			AWS: ST.joi.object().required()
		}).required().label('parameter');
	}
}

module.exports = function(reducer) {
	var AWS, namespace;

	if (reducer && (typeof reducer.aws === 'function')) {
		AWS = reducer.aws();
	} else {
		AWS = __webpack_require__(27);
	}

	if (
		(typeof process.env.RBETA_NAMESPACE === 'string')
			&& process.env.RBETA_NAMESPACE.trim()
	) {
		namespace = process.env.RBETA_NAMESPACE;
	}

	return new Context({
		namespace: namespace,
		reducer: reducer,
		AWS: AWS
	});
};


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const bluebird = __webpack_require__(18);

const
	Types = __webpack_require__(5),
	Commands = __webpack_require__(30),
	groupEvents = __webpack_require__(32);

const
	ST = Types.ST,
	ReducerObj = Types.ReducerObj,

	ReduceEvents = Commands.ReduceEvents;

class StreamProcessor extends ST {
	static get schema() {
		return ST.joi.object().keys({
			reducer: ST.joi.st(ReducerObj).required()
		}).required().label('parameter');
	}

	process(ctx, lambdaEvent, callback) {
		bluebird
			.all(
				groupEvents(ctx, lambdaEvent).map(events => {
					const result = {
						aggregate: events[0].aggregate,
						group: events[0].group
					};

					return new ReduceEvents({
						reducer: this.reducer,
						events: events
					})
						.run(ctx)
						.then(s => (result.state = s, result))
						.catch(e => (result.error = e, result));
				})
			)
			.then(
				res => res.reduce((hasErr, r) => hasErr || !!r.error, false)
					? callback(res)
					: callback(null, res)
			)
			.catch(callback);
	}
};

module.exports = function(ctx, reducer) {
	const processor = new StreamProcessor({ reducer: reducer });

	return function(event, context, callback) {
		return processor.process(ctx, event, callback);
	};
};


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	ddb: {
		createStreamProcessor: __webpack_require__(86),
		groupEvents: __webpack_require__(32),
		unmarshalItem: __webpack_require__(33)
	},
	createContext: __webpack_require__(85)
};


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const
	ST = __webpack_require__(3),
	AggregateName = __webpack_require__(14),
	GroupName = __webpack_require__(10),
	SequenceNumber = __webpack_require__(15);

module.exports = class NewEvent extends ST {

	static get schema() {
		return ST.joi.object().label('event').keys({
			group: ST.joi.st(GroupName).required(),
			aggregate: ST.joi.st(AggregateName).required(),
			seq: ST.joi.st(SequenceNumber).required(),
			type: ST.joi.string().label('type').trim().min(1).required(),
			data: ST.joi.object().label('data').default({}).unknown(true)
		}).required();
	}

};


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const
	ST = __webpack_require__(3),
	ReducerName = __webpack_require__(35);

module.exports = class ReducerObj extends ST {

	static get schema() {
		return ST.joi.object().keys({
			name: ST.joi.st(ReducerName).required(),
			aws: ST.joi.func().optional(),
			persist: ST.joi.func().required(),
			state: ST.joi.func().required(),
			reduce: ST.joi.func().required()
		}).label('reducer').unknown(true);
	}

};


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const
	ST = __webpack_require__(3),
	AggregateName = __webpack_require__(14),
	GroupName = __webpack_require__(10),
	SequenceNumber = __webpack_require__(15);

module.exports = class StoredEvent extends ST {

	static get schema() {
		return ST.joi.object().label('event').keys({
			group: ST.joi.st(GroupName).required(),
			aggregate: ST.joi.st(AggregateName).required(),
			seq: ST.joi.st(SequenceNumber).required(),
			type: ST.joi.string().label('type').trim().min(1).required(),
			data: ST.joi.object().label('data').default({}).unknown(true),
			timestamp: ST.joi.string().label('timestamp').trim().min(1).required()
		}).required();
	}

};


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const
	ST = __webpack_require__(3),
	Namespace = __webpack_require__(34),
	GroupName = __webpack_require__(10);

module.exports = class TableName extends ST {

	static fromEvent(namespace, event) {
		return new TableName({
			namespace: namespace,
			group: event.group
		});
	}

	static get schema() {
		return ST.joi.object().keys({
			namespace: ST.joi.st(Namespace).required(),
			group: ST.joi.st(GroupName).required()
		}).required().label('parameter');
	}

	get trackingName() {
		return this + '_tracking';
	}

	toString() {
		return ['rbeta', this.namespace, 'ddb', this.group].join('_');
	}

};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var
	util = __webpack_require__(37),

	log = util.debuglog('rbeta');

exports.makeForClass = function(constructorFn) {
	return exports.make(constructorFn.name);
};

exports.make = function(namespace) {
	/* istanbul ignore next */
	return function() {
		log(
			'%s, %s: %s',
			new Date().toISOString(), namespace,
			util.format.apply(util, arguments)
		);
	};
};


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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


/***/ }),
/* 94 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 95 */
/***/ (function(module, exports) {

module.exports = require("dns");

/***/ }),
/* 96 */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),
/* 97 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const
	reducer = __webpack_require__(38),
	rbeta = __webpack_require__(17);

const
	executionContext = rbeta.lib.createContext(reducer),
	processStream = rbeta.lib.ddb.createStreamProcessor(
		executionContext, reducer
	);

exports.reducer = reducer;
exports.handler = processStream;


/***/ })
/******/ ])));