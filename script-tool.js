
// script-tool @ npm, script tool.

//search property descriptor of an object, or of its prototype.
var getPropertyDescriptor = function (obj, prop /*, _depth*/) {
	var _depth = (arguments[2] || 0), pd;
	if (!(_depth >= 0 && _depth < 32)) return null;	//max depth 32, to prevent loop

	if (pd = Object.getOwnPropertyDescriptor(obj, prop)) return pd;		//found

	var proto = Object.getPrototypeOf(obj)
	if (!proto || obj === proto) return null;	//prototype list end

	return getPropertyDescriptor(proto, prop, _depth + 1);	//searh in prototype list
}

//enclose property descriptor
//options: { replaceGetter: true/false }, or just replaceGetter
var enclosePropertyDescriptor = function (obj, prop, newSetter, newGetter, options) {
	//arguments
	if (typeof options === "boolean") options = { replaceGetter: options };
	var replaceGetter = options && options.replaceGetter;
	options = null;

	//enclose
	var oldDesc = getPropertyDescriptor(obj, prop) || {};
	var newDesc = { configurable: true, enumerable: true };

	//setter
	var oldSetter = oldDesc.set;
	if (!oldSetter) { if (newSetter) { newDesc.set = newSetter; } }
	else if (!newSetter) { newDesc.set = oldSetter; }
	else {
		newDesc.set = function (v) {
			oldSetter.call(this, v);
			newSetter.call(this, v);
		}
	}

	//getter
	if (oldDesc.get && !(newGetter && replaceGetter)) { newDesc.get = oldDesc.get; newGetter = null; }
	else if (newGetter) { newDesc.get = newGetter; }

	//remove old and define new
	if (obj.hasOwnProperty(prop)) delete obj[prop];
	Object.defineProperty(obj, prop, newDesc);
}

//try to transfer value by value mapper; if unfound, return original value.
var mapValue = function (mapper, value) {
	if (!mapper) return value;
	var newV = (typeof mapper === "function") ? mapper(value) : mapper[value];
	return (typeof newV === "undefined") ? value : newV;
}

var defaultValueFilter = function (v) { return v || v === 0 || v === "" || v === false; };

//find the value that the `filter` will return true; if unfound, return `undefined`
var findWithFilter = function (filter, v /* , v2, ... */) {
	if (!filter) filter = defaultValueFilter;

	if (filter(v)) return v;

	var i, imax = arguments.length;
	for (i = 2; i < imax; i++) {
		v = arguments[i];
		if (filter(v)) return v;
	}
}

// polyfill Object.assign()
if (!Object.assign) {
	Object.assign = function (target, varArgs) {
		if (target === null || target === undefined) {
			throw new TypeError('Cannot convert undefined or null to object');
		}

		var to = Object(target);
		for (var index = 1; index < arguments.length; index++) {
			var nextSource = arguments[index];
			if (nextSource !== null && nextSource !== undefined) {
				for (var nextKey in nextSource) {
					// Avoid bugs when hasOwnProperty is shadowed
					if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
						to[nextKey] = nextSource[nextKey];
					}
				}
			}
		}
		return to;
	}
}

//derive object
var _derive = function (proto, properties /*, properties2, ...*/) {
	return Object.assign.apply(Object, [Object.create(proto)].concat(Array.prototype.slice.call(arguments, 1)));
}

// module

module.exports = {

	"derive": _derive,

	getPropertyDescriptor: getPropertyDescriptor,
	enclosePropertyDescriptor: enclosePropertyDescriptor,

	findWithFilter: findWithFilter,
	//defaultValueFilter: defaultValueFilter,

	mapValue: mapValue,

};
