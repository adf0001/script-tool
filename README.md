# script-tool
script tool

# Install
```
npm install script-tool
```

# Usage & Api
```javascript

var st = require("script-tool");

//.getPropertyDescriptor(obj, prop)		//search property descriptor of an object, or of its prototype.
var b = { a: 11 };
var c = Object.create(b);

assert(!Object.getOwnPropertyDescriptor(c, "a"));
assert(!!st.getPropertyDescriptor(c, "a"));

//.enclosePropertyDescriptor(obj, prop, newSetter, newGetter, options)		//enclose property descriptor
var v1 = 0, v2 = 0, v3 = 0;

var b = { get a() { return v1; }, set a(v) { v1 = v; } };
b.a = 1;
assert(v1 === 1 && b.a === 1 && v2 === 0 && v3 === 0);

//new getter is not used
st.enclosePropertyDescriptor(b, "a", function (v) { v2 = v; }, function () { return v3; });
b.a = 2;
assert(v1 === 2 && b.a === 2 && v2 === 2 && v3 === 0);

//old getter is replaced
st.enclosePropertyDescriptor(b, "a", function (v) { v2 = v; }, function () { return v3; }, true);
b.a = 3;
assert(v1 === 3 && b.a === 0 && v2 === 3 && v3 === 0);

//.mapValue(mapper, value)		//try to transfer value by value mapper; if unfound, return original value.
var vm = { a: 11, b: 22 };
assert(st.mapValue(vm, "a") === 11 && st.mapValue(vm, "c") === "c");

var vm = function (v) { if (v == "a") return 11; return 33; }
assert(st.mapValue(vm, "a") === 11 && st.mapValue(vm, "c") === 33);

//.findWithFilter(filter, v /* , v2, ... */)		//find the value that the `filter` will return true; if unfound, return `undefined`

var filter = null;		//default filter exclude null, include only !!v, 0, "" and false.

assert(st.findWithFilter(filter, null, "a", "b") === "a");
assert(st.findWithFilter(filter, null, undefined, 0, "b") === 0);

filter = function (v) { return v == "b" || v === null; };	//only user-defined-value
assert(st.findWithFilter(filter, 0, "a", null, "b") === null);
assert(st.findWithFilter(filter, 0, "a", "b", null) === "b");

assert(typeof st.findWithFilter(filter, 0, "", "a") === "undefined");		//unfound

//.derive(proto, properties /*, properties2, ...*/)		//derive object
var a = {
	f1: function () { return 1; },
	f2: function () { return 2; },
};
var b = {
	f3: function () { return 3; },
	f4: function () { return 4; },
};
var c = st.derive(a, b, {
	f2: function () { return 22; },
	f3: function () { return 33; },
});

assert(
	c.f1() === 1 && c.f2() === 22 && c.f3() === 33 && c.f4() === 4 &&
	('f1' in c) && !c.hasOwnProperty('f1') && c.hasOwnProperty('f4') &&
	a.isPrototypeOf(c) && !b.isPrototypeOf(c)
);

```
