"use strict";
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
            default:
                return (0, evaluator_1.newError)("argument to 'len' not supported, got ".concat((_a = args[0]) === null || _a === void 0 ? void 0 : _a.type()));
        }
    }),
};
