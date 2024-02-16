"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.builtins = void 0;
var object_1 = require("../object/object");
var evaluator_1 = require("./evaluator");
exports.builtins = {
    "len": new object_1.BuiltIn(function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length !== 1) {
            return (0, evaluator_1.newError)("wrong number of arguments. got=".concat(args.length, ", want=1"));
        }
        var arg = args[0];
        switch (true) {
            case (arg instanceof object_1.StringVal):
                return new object_1.IntegerVal((arg.inspect()).length);
            case (arg instanceof object_1.ArrayVal):
                return new object_1.IntegerVal((arg.elements).length);
            default:
                return (0, evaluator_1.newError)("argument to 'len' not supported, got ".concat((_a = args[0]) === null || _a === void 0 ? void 0 : _a.type()));
        }
    }),
    "push": new object_1.BuiltIn(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length !== 2) {
            return (0, evaluator_1.newError)("wrong number of arguments. got=".concat(args.length, " want=2"));
        }
        if (args[0] && args[0].type() !== "ARRAY" /* Objects.Array_Obj */) {
            return (0, evaluator_1.newError)("argument to 'push' must be ARRAY, got ".concat(args[0].type()));
        }
        var arr = args[0];
        var newElements = __spreadArray(__spreadArray([], arr.elements, true), [args[1]], false);
        return new object_1.ArrayVal(newElements);
    }),
};
