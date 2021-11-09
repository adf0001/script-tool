
// global, for html page
st = require("../script-tool.js");
assert = require("assert");

module.exports = {

	".getPropertyDescriptor()": function (done) {
		var b = { a: 11 };
		var c = Object.create(b);

		assert(!Object.getOwnPropertyDescriptor(c, "a"));
		assert(!!st.getPropertyDescriptor(c, "a"));

		done(false);
	},

	".enclosePropertyDescriptor()": function (done) {
		var v1 = 0, v2 = 0, v3 = 0;

		var b = { get a() { return v1; }, set a(v) { v1 = v; } };
		b.a = 1;
		assert(v1 === 1 && b.a === 1 && v2 === 0 && v3 === 0);

		st.enclosePropertyDescriptor(b, "a", function (v) { v2 = v; }, function () { return v3; });		//new getter is not used
		b.a = 2;
		assert(v1 === 2 && b.a === 2 && v2 === 2 && v3 === 0);

		st.enclosePropertyDescriptor(b, "a", function (v) { v2 = v; }, function () { return v3; }, true);		//old getter is replaced
		b.a = 3;
		assert(v1 === 3 && b.a === 0 && v2 === 3 && v3 === 0);

		done(false);
	},

	".mapValue()": function (done) {
		var vm = { a: 11, b: 22 };
		assert(st.mapValue(vm, "a") === 11 && st.mapValue(vm, "c") === "c");

		var vm = function (v) { if (v == "a") return 11; return 33; }
		assert(st.mapValue(vm, "a") === 11 && st.mapValue(vm, "c") === 33);

		done(false);
	},

	".findWithFilter()": function (done) {

		var filter = null;		//default filter exclude null, include only !!v, 0, "" and false.

		assert(st.findWithFilter(filter, null, "a", "b") === "a");
		assert(st.findWithFilter(filter, null, undefined, 0, "b") === 0);

		filter = function (v) { return v == "b" || v === null; };	//only user-defined-value
		assert(st.findWithFilter(filter, 0, "a", null, "b") === null);
		assert(st.findWithFilter(filter, 0, "a", "b", null) === "b");

		assert(typeof st.findWithFilter(filter, 0, "", "a") === "undefined");		//unfound

		done(false);
	},

};

// for html page
//if (typeof setHtmlPage === "function") setHtmlPage("title", "10em", 1);	//page setting
if (typeof showResult !== "function") showResult = function (text) { console.log(text); }

//for mocha
if (typeof describe === "function") describe('mocha-test', function () { for (var i in module.exports) { it(i, module.exports[i]); } });
